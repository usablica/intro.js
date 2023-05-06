import { reAlignHints } from "./hint";
import setHelperLayerPosition from "./setHelperLayerPosition";
import placeTooltip from "./placeTooltip";
import fetchIntroSteps from "./fetchIntroSteps";
import { _recreateBullets, _updateProgressBar } from "./showElement";
import { IntroJs } from "src/intro";

/**
 * Update placement of the intro objects on the screen
 * @api private
 */
export default function refresh(intro: IntroJs, refreshSteps?: boolean) {
  const referenceLayer = document.querySelector<HTMLElement>(
    ".introjs-tooltipReferenceLayer"
  );
  const helperLayer = document.querySelector<HTMLElement>(
    ".introjs-helperLayer"
  );
  const disableInteractionLayer = document.querySelector<HTMLElement>(
    ".introjs-disableInteraction"
  );

  // re-align intros
  setHelperLayerPosition(intro, helperLayer);
  setHelperLayerPosition(intro, referenceLayer);
  setHelperLayerPosition(intro, disableInteractionLayer);

  if (refreshSteps) {
    intro._introItems = fetchIntroSteps(intro, intro._targetElement);
    _recreateBullets(intro, intro._introItems[intro._currentStep]);
    _updateProgressBar(
      referenceLayer,
      intro._currentStep,
      intro._introItems.length
    );
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
