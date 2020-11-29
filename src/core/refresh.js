import { reAlignHints } from "./hint";
import setHelperLayerPosition from "./setHelperLayerPosition";
import placeTooltip from "./placeTooltip";

/**
 * Update placement of the intro objects on the screen
 * @api private
 */
export default function refresh() {
  // re-align intros
  setHelperLayerPosition.call(
    this,
    document.querySelector(".introjs-helperLayer")
  );
  setHelperLayerPosition.call(
    this,
    document.querySelector(".introjs-tooltipReferenceLayer")
  );
  setHelperLayerPosition.call(
    this,
    document.querySelector(".introjs-disableInteraction")
  );

  // re-align tooltip
  if (this._currentStep !== undefined && this._currentStep !== null) {
    const oldArrowLayer = document.querySelector(".introjs-arrow");
    const oldtooltipContainer = document.querySelector(".introjs-tooltip");

    placeTooltip.call(
      this,
      this._introItems[this._currentStep].element,
      oldtooltipContainer,
      oldArrowLayer
    );
  }

  //re-align hints
  reAlignHints.call(this);
  return this;
}
