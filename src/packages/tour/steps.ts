import { TooltipPosition } from "../../core/placeTooltip";
import exitIntro from "./exitIntro";
import showElement from "./showElement";
import { queryElement, queryElements } from "src/util/queryElement";
import cloneObject from "../../util/cloneObject";
import createElement from "../../util/createElement";
import { Tour } from "./tour";
import { floatingElementClassName } from "./classNames";
import {
  dataDisableInteraction,
  dataHighlightClass,
  dataIntroAttribute,
  dataIntroGroupAttribute,
  dataPosition,
  dataScrollTo,
  dataStepAttribute,
  dataTitleAttribute,
  dataTooltipClass,
} from "./dataAttributes";

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

/**
 * Finds all Intro steps from the data-* attributes and the options.steps array
 *
 * @api private
 */
export const fetchSteps = (tour: Tour) => {
  let steps: TourStep[] = [];

  if (tour.getOption("steps")?.length) {
    //use steps passed programmatically
    for (const _step of tour.getOption("steps")) {
      const step = cloneObject(_step);

      //set the step
      step.step = steps.length + 1;

      step.title = step.title || "";

      //use querySelector function only when developer used CSS selector
      if (typeof step.element === "string") {
        //grab the element with given selector from the page
        step.element = queryElement(step.element) || undefined;
      }

      // tour without element
      if (!step.element) {
        let floatingElementQuery = queryElement(floatingElementClassName);

        if (!floatingElementQuery) {
          floatingElementQuery = createElement("div", {
            className: floatingElementClassName,
          });

          document.body.appendChild(floatingElementQuery);
        }

        step.element = floatingElementQuery;
        step.position = "floating";
      }

      step.position = step.position || tour.getOption("tooltipPosition");
      step.scrollTo = step.scrollTo || tour.getOption("scrollTo");

      if (typeof step.disableInteraction === "undefined") {
        step.disableInteraction = tour.getOption("disableInteraction");
      }

      if (step.element !== null) {
        steps.push(step as TourStep);
      }
    }
  } else {
    const elements = Array.from(queryElements(`*[${dataIntroAttribute}]`));

    // if there's no element to intro
    if (elements.length < 1) {
      return [];
    }

    const itemsWithoutStep: TourStep[] = [];

    for (const element of elements) {
      // start intro for groups of elements
      if (
        tour.getOption("group") &&
        element.getAttribute(dataIntroGroupAttribute) !==
          tour.getOption("group")
      ) {
        continue;
      }

      // skip hidden elements
      if (element.style.display === "none") {
        continue;
      }

      // get the step for the current element or set as 0 if is not present
      const stepIndex = parseInt(
        element.getAttribute(dataStepAttribute) || "0",
        10
      );

      let disableInteraction = tour.getOption("disableInteraction");
      if (element.hasAttribute(dataDisableInteraction)) {
        disableInteraction = !!element.getAttribute(dataDisableInteraction);
      }

      const newIntroStep: TourStep = {
        step: stepIndex,
        element,
        title: element.getAttribute(dataTitleAttribute) || "",
        intro: element.getAttribute(dataIntroAttribute) || "",
        tooltipClass: element.getAttribute(dataTooltipClass) || undefined,
        highlightClass: element.getAttribute(dataHighlightClass) || undefined,
        position: (element.getAttribute(dataPosition) ||
          tour.getOption("tooltipPosition")) as TooltipPosition,
        scrollTo:
          (element.getAttribute(dataScrollTo) as ScrollTo) ||
          tour.getOption("scrollTo"),
        disableInteraction,
      };

      if (stepIndex > 0) {
        steps[stepIndex - 1] = newIntroStep;
      } else {
        itemsWithoutStep.push(newIntroStep);
      }
    }

    // fill items without step in blanks and update their step
    for (let i = 0; itemsWithoutStep.length > 0; i++) {
      if (typeof steps[i] === "undefined") {
        const newStep = itemsWithoutStep.shift();
        if (!newStep) break;

        newStep.step = i + 1;
        steps[i] = newStep;
      }
    }
  }

  // removing undefined/null elements
  steps = steps.filter((n) => n);

  // Sort all items with given steps
  steps.sort((a, b) => a.step - b.step);

  return steps;
};
