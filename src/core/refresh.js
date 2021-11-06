import { reAlignHints } from "./hint";
import setHelperLayerPosition from "./setHelperLayerPosition";
import placeTooltip from "./placeTooltip";
import fetchIntroSteps from "./fetchIntroSteps";
import { _recreateBullets, _updateProgressBar } from "./showElement";

/**
 * Update placement of the intro objects on the screen
 * @api private
 * @param {boolean} refreshSteps to refresh the intro steps as well
 */
export default function refresh(refreshSteps) {
  const referenceLayer = document.querySelector(
    ".introjs-tooltipReferenceLayer"
  );
  const helperLayer = document.querySelector(".introjs-helperLayer");
  const disableInteractionLayer = document.querySelector(
    ".introjs-disableInteraction"
  );

  // re-align intros
  setHelperLayerPosition.call(this, helperLayer);
  setHelperLayerPosition.call(this, referenceLayer);
  setHelperLayerPosition.call(this, disableInteractionLayer);

  if (refreshSteps) {
    this._introItems = fetchIntroSteps.call(this, this._targetElement);
    _recreateBullets.call(
      this,
      referenceLayer,
      this._introItems[this._currentStep]
    );
    _updateProgressBar.call(this, referenceLayer);
  }

  // re-align tooltip
  if (this._currentStep !== undefined && this._currentStep !== null) {
    const oldArrowLayer = document.querySelector(".introjs-arrow");
    const oldtooltipContainer = document.querySelector(".introjs-tooltip");

    if (oldtooltipContainer && oldArrowLayer) {
      placeTooltip.call(
        this,
        this._introItems[this._currentStep].element,
        oldtooltipContainer,
        oldArrowLayer
      );
    }
  }

  //re-align hints
  reAlignHints.call(this);
  return this;
}
