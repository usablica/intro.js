import getOffset from "../util/getOffset";
import isFixed from "../util/isFixed";
import addClass from "../util/addClass";
import removeClass from "../util/removeClass";
import setStyle from "../util/setStyle";
import { IntroJs } from "../IntroJs";

/**
 * Update the position of the helper layer on the screen
 *
 * @api private
 * @method _setHelperLayerPosition
 * @param {Object} helperLayer
 */
export default function setHelperLayerPosition(
  this: IntroJs,
  helperLayer: HTMLElement
) {
  if (helperLayer && typeof this._currentStep !== "undefined") {
    //prevent error when `this._currentStep` in undefined
    if (!this._introItems[this._currentStep]) return;

    const currentElement = this._introItems[this._currentStep];
    if (currentElement) {
      const elementPosition = getOffset(
        currentElement.element as HTMLElement,
        this._targetElement
      );
      let widthHeightPadding = this._options.helperElementPadding!;

      // If the target element is fixed, the tooltip should be fixed as well.
      // Otherwise, remove a fixed class that may be left over from the previous
      // step.
      if (isFixed(currentElement.element as HTMLElement)) {
        addClass(helperLayer, "introjs-fixedTooltip");
      } else {
        removeClass(helperLayer, "introjs-fixedTooltip");
      }

      if (currentElement.position === "floating") {
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
  }
}
