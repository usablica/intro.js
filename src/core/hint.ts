import addClass from "../util/addClass";
import removeClass from "../util/removeClass";
import isFixed from "../util/isFixed";
import getOffset from "../util/getOffset";
import cloneObject from "../util/cloneObject";
import DOMEvent from "./DOMEvent";
import setAnchorAsButton from "../util/setAnchorAsButton";
import setHelperLayerPosition from "./setHelperLayerPosition";
import placeTooltip from "./placeTooltip";
import createElement from "../util/createElement";
import debounce from "../util/debounce";
import { HintPosition, HintStep, TooltipPosition } from "./steps";
import { IntroJs } from "../intro";
import isFunction from "../util/isFunction";

/**
 * Get a queryselector within the hint wrapper
 */
export function hintQuerySelectorAll(selector: string): HTMLElement[] {
  const hintsWrapper = document.querySelector(".introjs-hints");
  return hintsWrapper
    ? Array.from(hintsWrapper.querySelectorAll(selector))
    : [];
}

/**
 * Hide a hint
 *
 * @api private
 */
export async function hideHint(intro: IntroJs, stepId: number) {
  const hint = hintQuerySelectorAll(`.introjs-hint[data-step="${stepId}"]`)[0];

  removeHintTooltip();

  if (hint) {
    addClass(hint, "introjs-hidehint");
  }

  // call the callback function (if any)
  if (isFunction(intro._hintCloseCallback)) {
    await intro._hintCloseCallback.call(intro, stepId);
  }
}

/**
 * Hide all hints
 *
 * @api private
 */
export async function hideHints(intro: IntroJs) {
  const hints = hintQuerySelectorAll(".introjs-hint");

  for (const hint of hints) {
    const step = hint.getAttribute("data-step");
    if (!step) continue;

    await hideHint(intro, parseInt(step, 10));
  }
}

/**
 * Show all hints
 *
 * @api private
 */
export async function showHints(intro: IntroJs) {
  const hints = hintQuerySelectorAll(".introjs-hint");

  if (hints && hints.length) {
    for (const hint of hints) {
      const step = hint.getAttribute("data-step");
      if (!step) continue;

      showHint(parseInt(step, 10));
    }
  } else {
    await populateHints(intro, intro._targetElement);
  }
}

/**
 * Show a hint
 *
 * @api private
 */
export function showHint(stepId: number) {
  const hint = hintQuerySelectorAll(`.introjs-hint[data-step="${stepId}"]`)[0];

  if (hint) {
    removeClass(hint, /introjs-hidehint/g);
  }
}

/**
 * Removes all hint elements on the page
 * Useful when you want to destroy the elements and add them again (e.g. a modal or popup)
 *
 * @api private
 */
export function removeHints(intro: IntroJs) {
  const hints = hintQuerySelectorAll(".introjs-hint");

  for (const hint of hints) {
    const step = hint.getAttribute("data-step");
    if (!step) continue;

    removeHint(parseInt(step, 10));
  }

  DOMEvent.off(document, "click", removeHintTooltip, intro, false);
  DOMEvent.off(window, "resize", reAlignHints, intro, true);

  if (intro._hintsAutoRefreshFunction) {
    DOMEvent.off(
      window,
      "scroll",
      intro._hintsAutoRefreshFunction,
      intro,
      true
    );
  }
}

/**
 * Remove one single hint element from the page
 * Useful when you want to destroy the element and add them again (e.g. a modal or popup)
 * Use removeHints if you want to remove all elements.
 *
 * @api private
 */
export function removeHint(stepId: number) {
  const hint = hintQuerySelectorAll(`.introjs-hint[data-step="${stepId}"]`)[0];

  if (hint && hint.parentNode) {
    hint.parentNode.removeChild(hint);
  }
}

/**
 * Add all available hints to the page
 *
 * @api private
 */
export async function addHints(intro: IntroJs) {
  let hintsWrapper = document.querySelector(".introjs-hints");

  if (hintsWrapper === null) {
    hintsWrapper = createElement("div", {
      className: "introjs-hints",
    });
  }

  /**
   * Returns an event handler unique to the hint iteration
   */
  const getHintClick = (i: number) => (e: Event) => {
    const evt = e ? e : window.event;

    if (evt && evt.stopPropagation) {
      evt.stopPropagation();
    }

    if (evt && evt.cancelBubble !== null) {
      evt.cancelBubble = true;
    }

    showHintDialog(intro, i);
  };

  for (let i = 0; i < intro._hintItems.length; i++) {
    const item = intro._hintItems[i];

    // avoid append a hint twice
    if (document.querySelector(`.introjs-hint[data-step="${i}"]`)) {
      return;
    }

    const hint = createElement("a", {
      className: "introjs-hint",
    });
    setAnchorAsButton(hint);

    hint.onclick = getHintClick(i);

    if (!item.hintAnimation) {
      addClass(hint, "introjs-hint-no-anim");
    }

    // hint's position should be fixed if the target element's position is fixed
    if (isFixed(item.element as HTMLElement)) {
      addClass(hint, "introjs-fixedhint");
    }

    const hintDot = createElement("div", {
      className: "introjs-hint-dot",
    });

    const hintPulse = createElement("div", {
      className: "introjs-hint-pulse",
    });

    hint.appendChild(hintDot);
    hint.appendChild(hintPulse);
    hint.setAttribute("data-step", i.toString());

    // we swap the hint element with target element
    // because _setHelperLayerPosition uses `element` property
    item.hintTargetElement = item.element as HTMLElement;
    item.element = hint;

    // align the hint position
    alignHintPosition(
      item.hintPosition,
      hint,
      item.hintTargetElement as HTMLElement
    );

    hintsWrapper.appendChild(hint);
  }

  // adding the hints wrapper
  document.body.appendChild(hintsWrapper);

  // call the callback function (if any)
  if (isFunction(intro._hintsAddedCallback)) {
    await intro._hintsAddedCallback.call(intro);
  }

  if (intro._options.hintAutoRefreshInterval >= 0) {
    intro._hintsAutoRefreshFunction = debounce(
      () => reAlignHints(intro),
      intro._options.hintAutoRefreshInterval
    );
    DOMEvent.on(window, "scroll", intro._hintsAutoRefreshFunction, intro, true);
  }
}

/**
 * Aligns hint position
 *
 * @api private
 */
export function alignHintPosition(
  position: HintPosition,
  hintElement: HTMLElement,
  targetElement?: HTMLElement
) {
  if (typeof targetElement === "undefined") {
    return;
  }

  // get/calculate offset of target element
  const offset = getOffset(targetElement);
  const iconWidth = 20;
  const iconHeight = 20;

  // align the hint element
  switch (position) {
    default:
    case "top-left":
      hintElement.style.left = `${offset.left}px`;
      hintElement.style.top = `${offset.top}px`;
      break;
    case "top-right":
      hintElement.style.left = `${offset.left + offset.width - iconWidth}px`;
      hintElement.style.top = `${offset.top}px`;
      break;
    case "bottom-left":
      hintElement.style.left = `${offset.left}px`;
      hintElement.style.top = `${offset.top + offset.height - iconHeight}px`;
      break;
    case "bottom-right":
      hintElement.style.left = `${offset.left + offset.width - iconWidth}px`;
      hintElement.style.top = `${offset.top + offset.height - iconHeight}px`;
      break;
    case "middle-left":
      hintElement.style.left = `${offset.left}px`;
      hintElement.style.top = `${
        offset.top + (offset.height - iconHeight) / 2
      }px`;
      break;
    case "middle-right":
      hintElement.style.left = `${offset.left + offset.width - iconWidth}px`;
      hintElement.style.top = `${
        offset.top + (offset.height - iconHeight) / 2
      }px`;
      break;
    case "middle-middle":
      hintElement.style.left = `${
        offset.left + (offset.width - iconWidth) / 2
      }px`;
      hintElement.style.top = `${
        offset.top + (offset.height - iconHeight) / 2
      }px`;
      break;
    case "bottom-middle":
      hintElement.style.left = `${
        offset.left + (offset.width - iconWidth) / 2
      }px`;
      hintElement.style.top = `${offset.top + offset.height - iconHeight}px`;
      break;
    case "top-middle":
      hintElement.style.left = `${
        offset.left + (offset.width - iconWidth) / 2
      }px`;
      hintElement.style.top = `${offset.top}px`;
      break;
  }
}

/**
 * Triggers when user clicks on the hint element
 *
 * @api private
 */
export async function showHintDialog(intro: IntroJs, stepId: number) {
  const hintElement = document.querySelector<HTMLElement>(
    `.introjs-hint[data-step="${stepId}"]`
  ) as HTMLElement;
  const item = intro._hintItems[stepId];

  // call the callback function (if any)
  if (isFunction(intro._hintClickCallback)) {
    await intro._hintClickCallback.call(intro, hintElement, item, stepId);
  }

  // remove all open tooltips
  const removedStep = removeHintTooltip();

  // to toggle the tooltip
  if (removedStep !== undefined && parseInt(removedStep, 10) === stepId) {
    return;
  }

  const tooltipLayer = createElement("div", {
    className: "introjs-tooltip",
  });
  const tooltipTextLayer = createElement("div");
  const arrowLayer = createElement("div");
  const referenceLayer = createElement("div");

  tooltipLayer.onclick = (e: Event) => {
    //IE9 & Other Browsers
    if (e.stopPropagation) {
      e.stopPropagation();
    }
    //IE8 and Lower
    else {
      e.cancelBubble = true;
    }
  };

  tooltipTextLayer.className = "introjs-tooltiptext";

  const tooltipWrapper = createElement("p");
  tooltipWrapper.innerHTML = item.hint || "";
  tooltipTextLayer.appendChild(tooltipWrapper);

  if (intro._options.hintShowButton) {
    const closeButton = createElement("a");
    closeButton.className = intro._options.buttonClass;
    closeButton.setAttribute("role", "button");
    closeButton.innerHTML = intro._options.hintButtonLabel;
    closeButton.onclick = () => hideHint(intro, stepId);
    tooltipTextLayer.appendChild(closeButton);
  }

  arrowLayer.className = "introjs-arrow";
  tooltipLayer.appendChild(arrowLayer);

  tooltipLayer.appendChild(tooltipTextLayer);

  const step = hintElement.getAttribute("data-step") || "";

  // set current step for _placeTooltip function
  intro._currentStep = parseInt(step, 10);
  const currentStep = intro._hintItems[intro._currentStep];

  // align reference layer position
  referenceLayer.className =
    "introjs-tooltipReferenceLayer introjs-hintReference";
  referenceLayer.setAttribute("data-step", step);
  setHelperLayerPosition(intro, currentStep, referenceLayer);

  referenceLayer.appendChild(tooltipLayer);
  document.body.appendChild(referenceLayer);

  // set proper position
  placeTooltip(intro, currentStep, tooltipLayer, arrowLayer, true);
}

/**
 * Removes open hint (tooltip hint)
 *
 * @api private
 */
export function removeHintTooltip(): string | undefined {
  const tooltip = document.querySelector(".introjs-hintReference");

  if (tooltip && tooltip.parentNode) {
    const step = tooltip.getAttribute("data-step");
    if (!step) return undefined;

    tooltip.parentNode.removeChild(tooltip);

    return step;
  }

  return undefined;
}

/**
 * Start parsing hint items
 *
 * @api private
 */
export async function populateHints(
  intro: IntroJs,
  targetElm: HTMLElement
): Promise<boolean> {
  intro._hintItems = [];

  if (intro._options.hints && intro._options.hints.length > 0) {
    for (const hint of intro._options.hints) {
      const currentItem = cloneObject(hint);

      if (typeof currentItem.element === "string") {
        //grab the element with given selector from the page
        currentItem.element = document.querySelector<HTMLElement>(
          currentItem.element
        ) as HTMLElement;
      }

      currentItem.hintPosition =
        currentItem.hintPosition || intro._options.hintPosition;
      currentItem.hintAnimation =
        currentItem.hintAnimation || intro._options.hintAnimation;

      if (currentItem.element !== null) {
        intro._hintItems.push(currentItem as HintStep);
      }
    }
  } else {
    const hints = Array.from(
      targetElm.querySelectorAll<HTMLElement>("*[data-hint]")
    );

    if (!hints || !hints.length) {
      return false;
    }

    //first add intro items with data-step
    for (const currentElement of hints) {
      // hint animation
      let hintAnimationAttr = currentElement.getAttribute(
        "data-hint-animation"
      );

      let hintAnimation: boolean = intro._options.hintAnimation;
      if (hintAnimationAttr) {
        hintAnimation = hintAnimationAttr === "true";
      }

      intro._hintItems.push({
        element: currentElement,
        hint: currentElement.getAttribute("data-hint") || "",
        hintPosition: (currentElement.getAttribute("data-hint-position") ||
          intro._options.hintPosition) as HintPosition,
        hintAnimation,
        tooltipClass:
          currentElement.getAttribute("data-tooltip-class") || undefined,
        position: (currentElement.getAttribute("data-position") ||
          intro._options.tooltipPosition) as TooltipPosition,
      });
    }
  }

  await addHints(intro);

  DOMEvent.on(document, "click", removeHintTooltip, intro, false);
  DOMEvent.on(window, "resize", reAlignHints, intro, true);

  return true;
}

/**
 * Re-aligns all hint elements
 *
 * @api private
 */
export function reAlignHints(intro: IntroJs) {
  for (const { hintTargetElement, hintPosition, element } of intro._hintItems) {
    alignHintPosition(hintPosition, element as HTMLElement, hintTargetElement);
  }
}
