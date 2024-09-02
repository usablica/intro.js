import { placeTooltip } from "../../packages/tooltip";
import { Tour } from "./tour";
import {
  getElementByClassName,
  queryElementByClassName,
} from "../../util/queryElement";
import {
  disableInteractionClassName,
  helperLayerClassName,
  tooltipReferenceLayerClassName,
} from "./classNames";
import { setPositionRelativeToStep } from "./position";
import { fetchSteps } from "./steps";

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
  const disableInteractionLayer = queryElementByClassName(
    disableInteractionClassName
  );

  // re-align intros
  const targetElement = tour.getTargetElement();
  const helperLayerPadding = tour.getOption("helperElementPadding");
  setPositionRelativeToStep(
    targetElement,
    helperLayer,
    step,
    helperLayerPadding
  );
  setPositionRelativeToStep(
    targetElement,
    referenceLayer,
    step,
    helperLayerPadding
  );

  // not all steps have a disableInteractionLayer
  if (disableInteractionLayer) {
    setPositionRelativeToStep(
      targetElement,
      disableInteractionLayer,
      step,
      helperLayerPadding
    );
  }

  if (refreshSteps) {
    tour.setSteps(fetchSteps(tour));
    // TODO: how to refresh the tooltip here? do we need to convert the steps into a state?
  }

  // re-align tooltip
  const oldArrowLayer = document.querySelector<HTMLElement>(".introjs-arrow");
  const oldTooltipContainer =
    document.querySelector<HTMLElement>(".introjs-tooltip");

  if (oldTooltipContainer && oldArrowLayer) {
    placeTooltip(
      oldTooltipContainer,
      oldArrowLayer,
      step.element as HTMLElement,
      step.position,
      tour.getOption("positionPrecedence"),
      tour.getOption("showStepNumbers"),
      tour.getOption("autoPosition"),
      step.tooltipClass ?? tour.getOption("tooltipClass")
    );
  }

  return tour;
}
