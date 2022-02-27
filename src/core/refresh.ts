import { reAlignHints } from "./hint";
import setHelperLayerPosition from "./setHelperLayerPosition";
import placeTooltip from "./placeTooltip";
import { IntroJs } from "../IntroJs";
import fetchIntroSteps from "./fetchIntroSteps";
import { _recreateBullets, _updateProgressBar } from "./showElement";

/**
 * Update placement of the intro objects on the screen
 * @api private
 * @param {boolean} refreshSteps to refresh the intro steps as well
 */
export default function refresh(this: IntroJs, refreshSteps: boolean = false) {
  const referenceLayer = document.querySelector(
    ".introjs-tooltipReferenceLayer"
  ) as HTMLElement;
  const helperLayer = document.querySelector(
    ".introjs-helperLayer"
  ) as HTMLElement;
  const disableInteractionLayer = document.querySelector(
    ".introjs-disableInteraction"
  ) as HTMLElement;

  // re-align intros
  setHelperLayerPosition.call(this, helperLayer);
  setHelperLayerPosition.call(this, referenceLayer);
  setHelperLayerPosition.call(this, disableInteractionLayer);

  if (refreshSteps) {
    this._introItems = fetchIntroSteps.call(this, this._targetElement);
    _recreateBullets.call(
      this,
      referenceLayer,
      this._introItems[this._currentStep!]
    );
    _updateProgressBar.call(this, referenceLayer);
  }

  // re-align tooltip
  if (this._currentStep !== undefined && this._currentStep !== null) {
    const oldArrowLayer = document.querySelector(
      ".introjs-arrow"
    ) as HTMLElement;
    const oldtooltipContainer = document.querySelector(
      ".introjs-tooltip"
    ) as HTMLElement;

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
