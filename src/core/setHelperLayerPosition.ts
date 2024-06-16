import getOffset from "../util/getOffset";
import isFixed from "../util/isFixed";
import { addClass } from "../util/className";
import removeClass from "../util/removeClass";
import setStyle from "../util/setStyle";
import { TooltipPosition } from "./placeTooltip";

/**
 * Update the position of the helper layer on the screen
 *
 * @api private
 */
export default function setHelperLayerPosition(
  targetElement: HTMLElement,
  helperLayer: HTMLElement,
  stepElement: HTMLElement,
  stepPosition: TooltipPosition,
  helperElementPadding: number
) {
  if (!helperLayer || !targetElement || !stepElement) {
    return;
  }

  const elementPosition = getOffset(stepElement as HTMLElement, targetElement);

  // If the target element is fixed, the tooltip should be fixed as well.
  // Otherwise, remove a fixed class that may be left over from the previous
  // step.
  if (stepElement instanceof Element && isFixed(stepElement)) {
    addClass(helperLayer, "introjs-fixedTooltip");
  } else {
    removeClass(helperLayer, "introjs-fixedTooltip");
  }

  if (stepPosition === "floating") {
    helperElementPadding = 0;
  }

  //set new position to helper layer
  setStyle(helperLayer, {
    width: `${elementPosition.width + helperElementPadding}px`,
    height: `${elementPosition.height + helperElementPadding}px`,
    top: `${elementPosition.top - helperElementPadding / 2}px`,
    left: `${elementPosition.left - helperElementPadding / 2}px`,
  });
}
