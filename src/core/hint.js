import addClass from "../util/addClass";
import removeClass from "../util/removeClass";
import isFixed from "../util/isFixed";
import getOffset from "../util/getOffset";
import cloneObject from "../util/cloneObject";
import forEach from "../util/forEach";
import DOMEvent from "./DOMEvent";
import setAnchorAsButton from "../util/setAnchorAsButton";
import setHelperLayerPosition from "./setHelperLayerPosition";
import placeTooltip from "./placeTooltip";
import createElement from "../util/createElement";

/**
 * Get a queryselector within the hint wrapper
 *
 * @param {String} selector
 * @return {NodeList|Array}
 */
export function hintQuerySelectorAll(selector) {
  const hintsWrapper = document.querySelector(".introjs-hints");
  return hintsWrapper ? hintsWrapper.querySelectorAll(selector) : [];
}

/**
 * Hide a hint
 *
 * @api private
 * @method hideHint
 */
export function hideHint(stepId) {
  const hint = hintQuerySelectorAll(`.introjs-hint[data-step="${stepId}"]`)[0];

  removeHintTooltip.call(this);

  if (hint) {
    addClass(hint, "introjs-hidehint");
  }

  // call the callback function (if any)
  if (typeof this._hintCloseCallback !== "undefined") {
    this._hintCloseCallback.call(this, stepId);
  }
}

/**
 * Hide all hints
 *
 * @api private
 * @method hideHints
 */
export function hideHints() {
  const hints = hintQuerySelectorAll(".introjs-hint");

  forEach(hints, (hint) => {
    hideHint.call(this, hint.getAttribute("data-step"));
  });
}

/**
 * Show all hints
 *
 * @api private
 * @method _showHints
 */
export function showHints() {
  const hints = hintQuerySelectorAll(".introjs-hint");

  if (hints && hints.length) {
    forEach(hints, (hint) => {
      showHint.call(this, hint.getAttribute("data-step"));
    });
  } else {
    populateHints.call(this, this._targetElement);
  }
}

/**
 * Show a hint
 *
 * @api private
 * @method showHint
 */
export function showHint(stepId) {
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
 * @method removeHints
 */
export function removeHints() {
  const hints = hintQuerySelectorAll(".introjs-hint");

  forEach(hints, (hint) => {
    removeHint.call(this, hint.getAttribute("data-step"));
  });
}

/**
 * Remove one single hint element from the page
 * Useful when you want to destroy the element and add them again (e.g. a modal or popup)
 * Use removeHints if you want to remove all elements.
 *
 * @api private
 * @method removeHint
 */
export function removeHint(stepId) {
  const hint = hintQuerySelectorAll(`.introjs-hint[data-step="${stepId}"]`)[0];

  if (hint) {
    hint.parentNode.removeChild(hint);
  }
}

/**
 * Add all available hints to the page
 *
 * @api private
 * @method addHints
 */
export function addHints() {
  const self = this;

  let hintsWrapper = document.querySelector(".introjs-hints");

  if (hintsWrapper === null) {
    hintsWrapper = createElement("div", {
      className: "introjs-hints",
    });
  }

  /**
   * Returns an event handler unique to the hint iteration
   *
   * @param {Integer} i
   * @return {Function}
   */
  const getHintClick = (i) => (e) => {
    const evt = e ? e : window.event;

    if (evt.stopPropagation) {
      evt.stopPropagation();
    }

    if (evt.cancelBubble !== null) {
      evt.cancelBubble = true;
    }

    showHintDialog.call(self, i);
  };

  forEach(this._introItems, (item, i) => {
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
    if (isFixed(item.element)) {
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
    hint.setAttribute("data-step", i);

    // we swap the hint element with target element
    // because _setHelperLayerPosition uses `element` property
    item.targetElement = item.element;
    item.element = hint;

    // align the hint position
    alignHintPosition.call(this, item.hintPosition, hint, item.targetElement);

    hintsWrapper.appendChild(hint);
  });

  // adding the hints wrapper
  document.body.appendChild(hintsWrapper);

  // call the callback function (if any)
  if (typeof this._hintsAddedCallback !== "undefined") {
    this._hintsAddedCallback.call(this);
  }
}

/**
 * Aligns hint position
 *
 * @api private
 * @method alignHintPosition
 * @param {String} position
 * @param {Object} hint
 * @param {Object} element
 */
export function alignHintPosition(position, { style }, element) {
  // get/calculate offset of target element
  const offset = getOffset.call(this, element);
  const iconWidth = 20;
  const iconHeight = 20;

  // align the hint element
  switch (position) {
    default:
    case "top-left":
      style.left = `${offset.left}px`;
      style.top = `${offset.top}px`;
      break;
    case "top-right":
      style.left = `${offset.left + offset.width - iconWidth}px`;
      style.top = `${offset.top}px`;
      break;
    case "bottom-left":
      style.left = `${offset.left}px`;
      style.top = `${offset.top + offset.height - iconHeight}px`;
      break;
    case "bottom-right":
      style.left = `${offset.left + offset.width - iconWidth}px`;
      style.top = `${offset.top + offset.height - iconHeight}px`;
      break;
    case "middle-left":
      style.left = `${offset.left}px`;
      style.top = `${offset.top + (offset.height - iconHeight) / 2}px`;
      break;
    case "middle-right":
      style.left = `${offset.left + offset.width - iconWidth}px`;
      style.top = `${offset.top + (offset.height - iconHeight) / 2}px`;
      break;
    case "middle-middle":
      style.left = `${offset.left + (offset.width - iconWidth) / 2}px`;
      style.top = `${offset.top + (offset.height - iconHeight) / 2}px`;
      break;
    case "bottom-middle":
      style.left = `${offset.left + (offset.width - iconWidth) / 2}px`;
      style.top = `${offset.top + offset.height - iconHeight}px`;
      break;
    case "top-middle":
      style.left = `${offset.left + (offset.width - iconWidth) / 2}px`;
      style.top = `${offset.top}px`;
      break;
  }
}

/**
 * Triggers when user clicks on the hint element
 *
 * @api private
 * @method _showHintDialog
 * @param {Number} stepId
 */
export function showHintDialog(stepId) {
  const hintElement = document.querySelector(
    `.introjs-hint[data-step="${stepId}"]`
  );
  const item = this._introItems[stepId];

  // call the callback function (if any)
  if (typeof this._hintClickCallback !== "undefined") {
    this._hintClickCallback.call(this, hintElement, item, stepId);
  }

  // remove all open tooltips
  const removedStep = removeHintTooltip.call(this);

  // to toggle the tooltip
  if (parseInt(removedStep, 10) === stepId) {
    return;
  }

  const tooltipLayer = createElement("div", {
    className: "introjs-tooltip",
  });
  const tooltipTextLayer = createElement("div");
  const arrowLayer = createElement("div");
  const referenceLayer = createElement("div");

  tooltipLayer.onclick = (e) => {
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
  tooltipWrapper.innerHTML = item.hint;

  const closeButton = createElement("a");
  closeButton.className = this._options.buttonClass;
  closeButton.setAttribute("role", "button");
  closeButton.innerHTML = this._options.hintButtonLabel;
  closeButton.onclick = hideHint.bind(this, stepId);

  tooltipTextLayer.appendChild(tooltipWrapper);
  tooltipTextLayer.appendChild(closeButton);

  arrowLayer.className = "introjs-arrow";
  tooltipLayer.appendChild(arrowLayer);

  tooltipLayer.appendChild(tooltipTextLayer);

  // set current step for _placeTooltip function
  this._currentStep = hintElement.getAttribute("data-step");

  // align reference layer position
  referenceLayer.className =
    "introjs-tooltipReferenceLayer introjs-hintReference";
  referenceLayer.setAttribute(
    "data-step",
    hintElement.getAttribute("data-step")
  );
  setHelperLayerPosition.call(this, referenceLayer);

  referenceLayer.appendChild(tooltipLayer);
  document.body.appendChild(referenceLayer);

  //set proper position
  placeTooltip.call(this, hintElement, tooltipLayer, arrowLayer, true);
}

/**
 * Removes open hint (tooltip hint)
 *
 * @api private
 * @method _removeHintTooltip
 */
export function removeHintTooltip() {
  const tooltip = document.querySelector(".introjs-hintReference");

  if (tooltip) {
    const step = tooltip.getAttribute("data-step");
    tooltip.parentNode.removeChild(tooltip);
    return step;
  }
}

/**
 * Start parsing hint items
 *
 * @api private
 * @param {Object} targetElm
 * @method _startHint
 */
export function populateHints(targetElm) {
  this._introItems = [];

  if (this._options.hints) {
    forEach(this._options.hints, (hint) => {
      const currentItem = cloneObject(hint);

      if (typeof currentItem.element === "string") {
        //grab the element with given selector from the page
        currentItem.element = document.querySelector(currentItem.element);
      }

      currentItem.hintPosition =
        currentItem.hintPosition || this._options.hintPosition;
      currentItem.hintAnimation =
        currentItem.hintAnimation || this._options.hintAnimation;

      if (currentItem.element !== null) {
        this._introItems.push(currentItem);
      }
    });
  } else {
    const hints = targetElm.querySelectorAll("*[data-hint]");

    if (!hints || !hints.length) {
      return false;
    }

    //first add intro items with data-step
    forEach(hints, (currentElement) => {
      // hint animation
      let hintAnimation = currentElement.getAttribute("data-hintanimation");

      if (hintAnimation) {
        hintAnimation = hintAnimation === "true";
      } else {
        hintAnimation = this._options.hintAnimation;
      }

      this._introItems.push({
        element: currentElement,
        hint: currentElement.getAttribute("data-hint"),
        hintPosition:
          currentElement.getAttribute("data-hintposition") ||
          this._options.hintPosition,
        hintAnimation,
        tooltipClass: currentElement.getAttribute("data-tooltipclass"),
        position:
          currentElement.getAttribute("data-position") ||
          this._options.tooltipPosition,
      });
    });
  }

  addHints.call(this);

  /*
  todo:
  these events should be removed at some point
  */
  DOMEvent.on(document, "click", removeHintTooltip, this, false);
  DOMEvent.on(window, "resize", reAlignHints, this, true);
}

/**
 * Re-aligns all hint elements
 *
 * @api private
 * @method _reAlignHints
 */
export function reAlignHints() {
  forEach(this._introItems, ({ targetElement, hintPosition, element }) => {
    if (typeof targetElement === "undefined") {
      return;
    }

    alignHintPosition.call(this, hintPosition, element, targetElement);
  });
}
