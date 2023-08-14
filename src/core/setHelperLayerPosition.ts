import getOffset from "../util/getOffset";
import isFixed from "../util/isFixed";
import addClass from "../util/addClass";
import removeClass from "../util/removeClass";
import setStyle from "../util/setStyle";
import { IntroJs } from "../intro";
import { HintStep, IntroStep } from "./steps";

/**
 * Update the position of the helper layer on the screen
 *
 * @api private
 */
export default function setHelperLayerPosition(
  intro: IntroJs,
  step: IntroStep | HintStep,
  helperLayer: HTMLElement
) {
  if (!helperLayer || !step) return;

  const elementPosition = getOffset(
    step.element as HTMLElement,
    intro._targetElement
  );
  let widthHeightPadding = intro._options.helperElementPadding;

  // If the target element is fixed, the tooltip should be fixed as well.
  // Otherwise, remove a fixed class that may be left over from the previous
  // step.
  if (step.element instanceof Element && isFixed(step.element)) {
    addClass(helperLayer, "introjs-fixedTooltip");
  } else {
    removeClass(helperLayer, "introjs-fixedTooltip");
  }

  if (step.position === "floating") {
    widthHeightPadding = 0;
  }

  //set new position to helper layer
  setStyle(helperLayer, {
    width: `${elementPosition.width + widthHeightPadding}px`,
    height: `${elementPosition.height + widthHeightPadding}px`,
    top: `${elementPosition.top - widthHeightPadding / 2}px`,
    left: `${elementPosition.left - widthHeightPadding / 2}px`,
  });
}
