import { reAlignHints } from "./hint";
import setHelperLayerPosition from "./setHelperLayerPosition";
import placeTooltip from "./placeTooltip";
import fetchIntroSteps from "./fetchIntroSteps";
import { _recreateBullets, _updateProgressBar } from "./showElement";
import { IntroJs } from "../intro";

/**
 * Update placement of the intro objects on the screen
 * @api private
 */
export default function refresh(intro: IntroJs, refreshSteps?: boolean) {
  const currentStep = intro._currentStep;

  if (currentStep === undefined || currentStep === null || currentStep == -1)
    return;

  const step = intro._introItems[currentStep];

  const referenceLayer = document.querySelector<HTMLElement>(
    ".introjs-tooltipReferenceLayer"
  ) as HTMLElement;
  const helperLayer = document.querySelector<HTMLElement>(
    ".introjs-helperLayer"
  ) as HTMLElement;
  const disableInteractionLayer = document.querySelector<HTMLElement>(
    ".introjs-disableInteraction"
  ) as HTMLElement;

  // re-align intros
  setHelperLayerPosition(intro, step, helperLayer);
  setHelperLayerPosition(intro, step, referenceLayer);
  setHelperLayerPosition(intro, step, disableInteractionLayer);

  if (refreshSteps) {
    intro._introItems = fetchIntroSteps(intro, intro._targetElement);
    _recreateBullets(intro, step);
    _updateProgressBar(referenceLayer, currentStep, intro._introItems.length);
  }

  // re-align tooltip
  const oldArrowLayer = document.querySelector<HTMLElement>(".introjs-arrow");
  const oldTooltipContainer =
    document.querySelector<HTMLElement>(".introjs-tooltip");

  if (oldTooltipContainer && oldArrowLayer) {
    placeTooltip(
      intro,
      intro._introItems[currentStep],
      oldTooltipContainer,
      oldArrowLayer
    );
  }

  //re-align hints
  reAlignHints(intro);

  return intro;
}
