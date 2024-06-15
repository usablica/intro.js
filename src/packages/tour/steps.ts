import { TooltipPosition } from "../../core/placeTooltip";
import exitIntro from "./exitIntro";
import showElement from "./showElement";
import { Tour } from "./tour";

export type ScrollTo = "off" | "element" | "tooltip";

export type TourStep = {
  step: number;
  title: string;
  intro: string;
  tooltipClass?: string;
  highlightClass?: string;
  element?: HTMLElement | string | null;
  position: TooltipPosition;
  scrollTo: ScrollTo;
  disableInteraction?: boolean;
};

/**
 * Go to next step on intro
 *
 * @api private
 */
export async function nextStep(tour: Tour) {
  tour.incrementCurrentStep();

  const nextStep = tour.getStep(tour.getCurrentStep());
  let continueStep: boolean | undefined = true;

  continueStep = await tour
    .callback("beforeChange")
    ?.call(
      tour,
      nextStep && (nextStep.element as HTMLElement),
      tour.getCurrentStep(),
      tour.getDirection()
    );

  // if `onbeforechange` returned `false`, stop displaying the element
  if (continueStep === false) {
    tour.decrementCurrentStep();
    return false;
  }

  if (tour.isEnd()) {
    // check if any callback is defined
    await tour.callback("complete")?.call(tour, tour.getCurrentStep(), "end");
    await exitIntro(tour);

    return false;
  }

  await showElement(tour, nextStep);

  return true;
}

/**
 * Go to previous step on intro
 *
 * @api private
 */
export async function previousStep(tour: Tour) {
  if (tour.getCurrentStep() <= 0) {
    return false;
  }

  tour.decrementCurrentStep();

  const nextStep = tour.getStep(tour.getCurrentStep());
  let continueStep: boolean | undefined = true;

  continueStep = await tour
    .callback("beforeChange")
    ?.call(
      tour,
      nextStep && (nextStep.element as HTMLElement),
      tour.getCurrentStep(),
      tour.getDirection()
    );

  // if `onbeforechange` returned `false`, stop displaying the element
  if (continueStep === false) {
    tour.incrementCurrentStep();
    return false;
  }

  await showElement(tour, nextStep);

  return true;
}
