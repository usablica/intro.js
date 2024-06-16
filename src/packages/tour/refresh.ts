import { reAlignHints } from "../../core/hint";
import setHelperLayerPosition from "../../core/setHelperLayerPosition";
import placeTooltip from "../../core/placeTooltip";
import fetchIntroSteps from "./fetchSteps";
import { _recreateBullets, _updateProgressBar } from "./showElement";
import { Tour } from "./tour";
import { getElementByClassName } from "src/util/queryElement";
import { disableInteractionClassName, helperLayerClassName, tooltipReferenceLayerClassName } from "./classNames";

/**
 * Update placement of the intro objects on the screen
 * @api private
 */
export default function refresh(tour: Tour, refreshSteps?: boolean) {
  const currentStep = tour.getCurrentStep();

  if (currentStep === undefined || currentStep === null || currentStep == -1) {
    return;
  }

  const step = tour.getStep(currentStep);

  const referenceLayer = getElementByClassName(tooltipReferenceLayerClassName);
  const helperLayer = getElementByClassName(helperLayerClassName);
  const disableInteractionLayer = getElementByClassName(
    disableInteractionClassName
  );

  // re-align intros
  const targetElement = tour.getTargetElement();
  const helperLayerPadding = tour.getOption('helperElementPadding');
  setHelperLayerPosition(
    targetElement,
    helperLayer,
    step.element as HTMLElement,
    step.position,
    helperLayerPadding
  );
  setHelperLayerPosition(
    targetElement,
    referenceLayer,
    step.element as HTMLElement,
    step.position,
    helperLayerPadding
  );
  setHelperLayerPosition(
    targetElement,
    disableInteractionLayer,
    step.element as HTMLElement,
    step.position,
    helperLayerPadding
  );

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
