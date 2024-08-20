import { queryElement, queryElementByClassName } from "../../util/queryElement";
import {
  hintClassName,
  hintReferenceClassName,
  tooltipReferenceLayerClassName,
} from "./className";
import { dataStepAttribute } from "./dataAttributes";
import { Hint } from "./hint";
import createElement from "../../util/createElement";
import { setClass } from "../../util/className";
import { hideHint } from "./hide";
import { setPositionRelativeTo } from "../../util/setPositionRelativeTo";
import DOMEvent from "../../util/DOMEvent";
import { Tooltip } from "../tooltip/tooltip";
import getOffset from "../../util/getOffset";

// The hint close function used when the user clicks outside the hint
let _hintCloseFunction: () => void | undefined;

/**
 * Removes open hint (tooltip hint)
 *
 * @api private
 */
export function removeHintTooltip(): string | undefined {
  const tooltip = queryElementByClassName(hintReferenceClassName);

  if (tooltip && tooltip.parentNode) {
    const step = tooltip.getAttribute(dataStepAttribute);
    if (!step) return undefined;

    tooltip.parentNode.removeChild(tooltip);

    return step;
  }

  return undefined;
}

/**
 * Triggers when user clicks on the hint element
 *
 * @api private
 */
export async function showHintDialog(hint: Hint, stepId: number) {
  const hintElement = queryElement(
    `.${hintClassName}[${dataStepAttribute}="${stepId}"]`
  );

  const item = hint.getHint(stepId);

  if (!hintElement || !item) return;

  // call the callback function (if any)
  await hint.callback("hintClick")?.call(hint, hintElement, item, stepId);

  // remove all open tooltips
  const removedStep = removeHintTooltip();

  // to toggle the tooltip
  if (removedStep !== undefined && parseInt(removedStep, 10) === stepId) {
    return;
  }

  //setClass(tooltipTextLayer, tooltipTextClassName);

  //const tooltipWrapper = createElement("p");
  //tooltipWrapper.innerHTML = item.hint || "";
  //tooltipTextLayer.appendChild(tooltipWrapper);

  //if (hint.getOption("hintShowButton")) {
  //  const closeButton = createElement("a");
  //  closeButton.className = hint.getOption("buttonClass");
  //  closeButton.setAttribute("role", "button");
  //  closeButton.innerHTML = hint.getOption("hintButtonLabel");
  //  closeButton.onclick = () => hideHint(hint, stepId);
  //  tooltipTextLayer.appendChild(closeButton);
  //}

  //setClass(arrowLayer, arrowClassName);
  //tooltipLayer.appendChild(arrowLayer);

  //tooltipLayer.appendChild(tooltipTextLayer);

  const step = hintElement.getAttribute(dataStepAttribute) || "";

  // set current step for _placeTooltip function
  const hintItem = hint.getHint(parseInt(step, 10));

  if (!hintItem) return;

  const tooltipLayer = Tooltip({
    position: hintItem.position,
    text: item.hint || "",
    targetOffset: getOffset(hintItem.element as HTMLElement),
    // hints don't have step numbers
    showStepNumbers: false,
    hintMode: true,

    autoPosition: hint.getOption("autoPosition"),
    positionPrecedence: hint.getOption("positionPrecedence"),

    closeButtonEnabled: hint.getOption("hintShowButton"),
    closeButtonLabel: hint.getOption("hintButtonLabel"),
    closeButtonClassName: hint.getOption("buttonClass"),
    closeButtonOnClick: () => hideHint(hint, stepId),
  });

  //const tooltipTextLayer = createElement("div");
  //const arrowLayer = createElement("div");
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

  // align reference layer position
  setClass(
    referenceLayer,
    tooltipReferenceLayerClassName,
    hintReferenceClassName
  );
  referenceLayer.setAttribute(dataStepAttribute, step);

  const helperLayerPadding = hint.getOption("helperElementPadding");
  setPositionRelativeTo(
    hint.getTargetElement(),
    referenceLayer,
    hintItem.element as HTMLElement,
    helperLayerPadding
  );

  referenceLayer.appendChild(tooltipLayer);
  document.body.appendChild(referenceLayer);

  // set proper position
  //placeTooltip(
  //  tooltipLayer,
  //  arrowLayer,
  //  hintItem.element as HTMLElement,
  //  hintItem.position,
  //  hint.getOption("positionPrecedence"),
  //  // hints don't have step numbers
  //  false,
  //  hint.getOption("autoPosition"),
  //  hintItem.tooltipClass ?? hint.getOption("tooltipClass")
  //);

  _hintCloseFunction = () => {
    removeHintTooltip();
    DOMEvent.off(document, "click", _hintCloseFunction, false);
  };

  DOMEvent.on(document, "click", _hintCloseFunction, false);
}
