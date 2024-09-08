import { queryElement, queryElementByClassName } from "../../util/queryElement";
import { Hint } from "./hint";
import { HintPosition } from "./hintItem";
import {
  fixedHintClassName,
  hintClassName,
  hintDotClassName,
  hintNoAnimationClassName,
  hintPulseClassName,
  hintsClassName,
} from "./className";
import createElement from "../../util/createElement";
import { dataStepAttribute } from "./dataAttributes";
import setAnchorAsButton from "../../util/setAnchorAsButton";
import { addClass } from "../../util/className";
import isFixed from "../../util/isFixed";
import { alignHintPosition } from "./position";
import { HintsRoot } from "./components/HintsRoot";

/**
 * Add all available hints to the page
 *
 * @api private
 */
export async function renderHints(hint: Hint) {
  let hintsWrapper = queryElementByClassName(hintsClassName);

  if (hintsWrapper === null) {
    hintsWrapper = createElement("div", {
      className: hintsClassName,
    });
  }

  //const hints = hint.getHints();
  //for (let i = 0; i < hints.length; i++) {
  //  const hintItem = hints[i];

  //  // avoid append a hint twice
  //  if (queryElement(`.${hintClassName}[${dataStepAttribute}="${i}"]`)) {
  //    return;
  //  }

  //  const hintElement = createElement("a", {
  //    className: hintClassName,
  //  });
  //  setAnchorAsButton(hintElement);

  //  hintElement.onclick = getHintClick(hint, i);

  //  if (!hintItem.hintAnimation) {
  //    addClass(hintElement, hintNoAnimationClassName);
  //  }

  //  // hint's position should be fixed if the target element's position is fixed
  //  if (isFixed(hintItem.element as HTMLElement)) {
  //    addClass(hintElement, fixedHintClassName);
  //  }

  //  const hintDot = createElement("div", {
  //    className: hintDotClassName,
  //  });

  //  const hintPulse = createElement("div", {
  //    className: hintPulseClassName,
  //  });

  //  hintElement.appendChild(hintDot);
  //  hintElement.appendChild(hintPulse);
  //  hintElement.setAttribute(dataStepAttribute, i.toString());

  //  // we swap the hint element with target element
  //  // because _setHelperLayerPosition uses `element` property
  //  hintItem.hintTargetElement = hintItem.element as HTMLElement;
  //  hintItem.element = hintElement;

  //  // align the hint position
  //  alignHintPosition(
  //    hintItem.hintPosition as HintPosition,
  //    hintElement,
  //    hintItem.hintTargetElement as HTMLElement
  //  );

  //  hintsWrapper.appendChild(hintElement);
  //}

  //HintsRoot({ hint });

  // adding the hints wrapper
  //document.body.appendChild(HintsRoot({ hint }));

  // call the callback function (if any)
  hint.callback("hintsAdded")?.call(hint);

  hint.enableHintAutoRefresh();
}
