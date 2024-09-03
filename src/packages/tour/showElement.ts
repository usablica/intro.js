import scrollParentToElement from "../../util/scrollParentToElement";
import scrollTo from "../../util/scrollTo";
import { addClass, setClass } from "../../util/className";
import { TourStep, nextStep, previousStep } from "./steps";
import removeShowElement from "./removeShowElement";
import createElement from "../../util/createElement";
import setStyle, { style } from "../../util/style";
import appendChild from "../../util/appendChild";
import {
  disableInteractionClassName,
  doneButtonClassName,
  helperLayerClassName,
  tooltipReferenceLayerClassName,
  tooltipTextClassName,
} from "./classNames";
import { Tour } from "./tour";
import {
  getElementByClassName,
  queryElementByClassName,
} from "../../util/queryElement";
import { setPositionRelativeToStep } from "./position";
import getPropValue from "../../util/getPropValue";
import { TourTooltip } from "./tourTooltip";
import van from "../dom/van";

const { div } = van.tags;

/**
 * Add disableinteraction layer and adjust the size and position of the layer
 *
 * @api private
 */
export const _disableInteraction = (tour: Tour, step: TourStep) => {
    let disableInteractionLayer = queryElementByClassName(
      disableInteractionClassName
    );

    if (disableInteractionLayer === null) {
      disableInteractionLayer = createElement("div", {
        className: disableInteractionClassName,
      });

      tour.getTargetElement().appendChild(disableInteractionLayer);
    }

    setPositionRelativeToStep(
      tour.getTargetElement(),
      disableInteractionLayer,
      step,
      tour.getOption("helperElementPadding")
    );
  };

/**
 * To set the show element
 * This function set a relative (in most cases) position and changes the z-index
 *
 * @api private
 */
function setShowElement(targetElement: HTMLElement) {
  addClass(targetElement, "introjs-showElement");

  const currentElementPosition = getPropValue(targetElement, "position");
  if (
    currentElementPosition !== "absolute" &&
    currentElementPosition !== "relative" &&
    currentElementPosition !== "sticky" &&
    currentElementPosition !== "fixed"
  ) {
    //change to new intro item
    addClass(targetElement, "introjs-relativePosition");
  }
}

let _lastShowElementTimer: number;

/**
 * Show an element on the page
 *
 * @api private
 */
export default async function _showElement(tour: Tour, step: TourStep) {
  tour.callback("change")?.call(tour, step.element);

  const oldHelperLayer = queryElementByClassName(helperLayerClassName);
  const oldReferenceLayer = queryElementByClassName(
    tooltipReferenceLayerClassName
  );

  let highlightClass = helperLayerClassName;

  //check for a current step highlight class
  if (typeof step.highlightClass === "string") {
    highlightClass += ` ${step.highlightClass}`;
  }

  //check for options highlight class
  if (typeof tour.getOption("highlightClass") === "string") {
    highlightClass += ` ${tour.getOption("highlightClass")}`;
  }

  if (oldHelperLayer !== null && oldReferenceLayer !== null) {
    const oldTooltipLayer = getElementByClassName(
      tooltipTextClassName,
      oldReferenceLayer
    );

    //update or reset the helper highlight class
    setClass(oldHelperLayer, highlightClass);

    // if the target element is within a scrollable element
    scrollParentToElement(
      tour.getOption("scrollToElement"),
      step.element as HTMLElement
    );

    // set new position to helper layer
    const helperLayerPadding = tour.getOption("helperElementPadding");
    setPositionRelativeToStep(
      tour.getTargetElement(),
      oldHelperLayer,
      step,
      helperLayerPadding
    );
    setPositionRelativeToStep(
      tour.getTargetElement(),
      oldReferenceLayer,
      step,
      helperLayerPadding
    );

    //remove old classes if the element still exist
    removeShowElement();

    //we should wait until the CSS3 transition is competed (it's 0.3 sec) to prevent incorrect `height` and `width` calculation
    if (_lastShowElementTimer) {
      window.clearTimeout(_lastShowElementTimer);
    }

    _lastShowElementTimer = window.setTimeout(() => {
      // change the scroll of the window, if needed
      scrollTo(
        tour.getOption("scrollToElement"),
        step.scrollTo,
        tour.getOption("scrollPadding"),
        step.element as HTMLElement,
        oldTooltipLayer
      );
    }, 350);

    // end of old element if-else condition
  } else {
    const helperLayer = div({
      className: highlightClass,
      style: style({
        // the inner box shadow is the border for the highlighted element
        // the outer box shadow is the overlay effect
        "box-shadow": `0 0 1px 2px rgba(33, 33, 33, 0.8), rgba(33, 33, 33, ${tour
          .getOption("overlayOpacity")
          .toString()}) 0 0 0 5000px`,
      }),
    });
    const referenceLayer = div({
      className: tooltipReferenceLayerClassName,
    });

    // target is within a scrollable element
    scrollParentToElement(
      tour.getOption("scrollToElement"),
      step.element as HTMLElement
    );

    //set new position to helper layer
    const helperLayerPadding = tour.getOption("helperElementPadding");
    setPositionRelativeToStep(
      tour.getTargetElement(),
      helperLayer,
      step,
      helperLayerPadding
    );
    setPositionRelativeToStep(
      tour.getTargetElement(),
      referenceLayer,
      step,
      helperLayerPadding
    );

    //add helper layer to target element
    tour.appendToRoot(helperLayer, true);
    tour.appendToRoot(referenceLayer);

    const tooltip = TourTooltip({
      positionPrecedence: tour.getOption("positionPrecedence"),
      autoPosition: tour.getOption("autoPosition"),
      showStepNumbers: tour.getOption("showStepNumbers"),

      steps: tour.getSteps(),
      currentStep: tour.currentStepSignal,

      onBulletClick: (stepNumber: number) => {
        tour.goToStep(stepNumber);
      },

      bullets: tour.getOption("showBullets"),

      buttons: tour.getOption("showButtons"),
      nextLabel: "Next",
      onNextClick: async (e: any) => {
        if (!tour.isLastStep()) {
          await nextStep(tour);
        } else if (
          new RegExp(doneButtonClassName, "gi").test(
            (e.target as HTMLElement).className
          )
        ) {
          await tour
            .callback("complete")
            ?.call(tour, tour.getCurrentStep(), "done");

          await tour.exit();
        }
      },
      prevLabel: tour.getOption("prevLabel"),
      onPrevClick: async () => {
        if (tour.getCurrentStep() > 0) {
          await previousStep(tour);
        }
      },
      skipLabel: tour.getOption("skipLabel"),
      onSkipClick: async () => {
        if (tour.isLastStep()) {
          await tour
            .callback("complete")
            ?.call(tour, tour.getCurrentStep(), "skip");
        }

        await tour.callback("skip")?.call(tour, tour.getCurrentStep());

        await tour.exit();
      },
      buttonClass: tour.getOption("buttonClass"),
      nextToDone: tour.getOption("nextToDone"),
      doneLabel: tour.getOption("doneLabel"),
      hideNext: tour.getOption("hideNext"),
      hidePrev: tour.getOption("hidePrev"),

      progress: tour.getOption("showProgress"),
      progressBarAdditionalClass: tour.getOption("progressBarAdditionalClass"),

      stepNumbers: tour.getOption("showStepNumbers"),
      stepNumbersOfLabel: tour.getOption("stepNumbersOfLabel"),

      dontShowAgain: tour.getOption("dontShowAgain"),
      onDontShowAgainChange: (e: any) => {
        tour.setDontShowAgain((<HTMLInputElement>e.target).checked);
      },
      dontShowAgainLabel: tour.getOption("dontShowAgainLabel"),
    });

    van.add(referenceLayer, tooltip);
    //referenceLayer.appendChild(tooltip);

    // change the scroll of the window, if needed
    scrollTo(
      tour.getOption("scrollToElement"),
      step.scrollTo,
      tour.getOption("scrollPadding"),
      step.element as HTMLElement,
      tooltip
    );

    //end of new element if-else condition
  }

  // removing previous disable interaction layer
  const disableInteractionLayer = queryElementByClassName(
    disableInteractionClassName,
    tour.getTargetElement()
  );
  if (disableInteractionLayer && disableInteractionLayer.parentNode) {
    disableInteractionLayer.parentNode.removeChild(disableInteractionLayer);
  }

  setShowElement(step.element as HTMLElement);

  //disable interaction
  if (step.disableInteraction) {
    _disableInteraction(tour, step);
  }

  await tour.callback("afterChange")?.call(tour, step.element);
}
