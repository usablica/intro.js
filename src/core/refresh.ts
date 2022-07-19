import { reAlignHints } from "./hint";
import setHelperLayerPosition from "./setHelperLayerPosition";
import placeTooltip from "./placeTooltip";
import { IntroJs } from "../IntroJs";
import fetchIntroSteps from "./fetchIntroSteps";
import { _recreateBullets, _updateProgressBar } from "./showElement";
import getElement from "../util/getElement";

/**
 * Update placement of the intro objects on the screen
 * @api private
 * @param {boolean} refreshSteps to refresh the intro steps as well
 */
export default function refresh(this: IntroJs, refreshSteps: boolean = false) {
  const referenceLayer = getElement(
    document,
    ".introjs-tooltipReferenceLayer"
  )!;
  const helperLayer = getElement(document, ".introjs-helperLayer")!;
  const disableInteractionLayer = getElement(
    document,
    ".introjs-disableInteraction"
  )!;

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
    const oldArrowLayer = getElement(document, ".introjs-arrow")!;
    const oldtooltipContainer = getElement(document, ".introjs-tooltip")!;

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
