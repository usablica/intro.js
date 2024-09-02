import scrollParentToElement from "../../util/scrollParentToElement";
import scrollTo from "../../util/scrollTo";
import { addClass, setClass } from "../../util/className";
import setAnchorAsButton from "../../util/setAnchorAsButton";
import { TourStep, nextStep, previousStep } from "./steps";
import { placeTooltip } from "../../packages/tooltip";
import removeShowElement from "./removeShowElement";
import createElement from "../../util/createElement";
import setStyle from "../../util/setStyle";
import appendChild from "../../util/appendChild";
import {
  activeClassName,
  arrowClassName,
  bulletsClassName,
  disabledButtonClassName,
  disableInteractionClassName,
  doneButtonClassName,
  dontShowAgainClassName,
  fullButtonClassName,
  helperLayerClassName,
  helperNumberLayerClassName,
  hiddenButtonClassName,
  nextButtonClassName,
  previousButtonClassName,
  progressBarClassName,
  progressClassName,
  skipButtonClassName,
  tooltipButtonsClassName,
  tooltipClassName,
  tooltipHeaderClassName,
  tooltipReferenceLayerClassName,
  tooltipTextClassName,
  tooltipTitleClassName,
} from "./classNames";
import { Tour } from "./tour";
import { dataStepNumberAttribute } from "./dataAttributes";
import {
  getElementByClassName,
  queryElement,
  queryElementByClassName,
} from "../../util/queryElement";
import { setPositionRelativeToStep } from "./position";
import getPropValue from "../../util/getPropValue";
import { TourTooltip } from "./tourTooltip";
import getOffset from "../..//util/getOffset";
import van from "../dom/van";

/**
 * Gets the current progress percentage
 *
 * @api private
 * @returns current progress percentage
 */
export const _getProgress = (currentStep: number, introItemsLength: number) => {
  // Steps are 0 indexed
  return ((currentStep + 1) / introItemsLength) * 100;
};

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
 * Creates the bullets layer
 * @private
 */
function _createBullets(tour: Tour, step: TourStep): HTMLElement {
  const bulletsLayer = createElement("div", {
    className: bulletsClassName,
  });

  if (tour.getOption("showBullets") === false) {
    bulletsLayer.style.display = "none";
  }

  const ulContainer = createElement("ul");
  ulContainer.setAttribute("role", "tablist");

  const anchorClick = function (this: HTMLElement) {
    const stepNumber = this.getAttribute(dataStepNumberAttribute);
    if (stepNumber == null) return;

    tour.goToStep(parseInt(stepNumber, 10));
  };

  const steps = tour.getSteps();
  for (let i = 0; i < steps.length; i++) {
    const { step: stepNumber } = steps[i];

    const innerLi = createElement("li");
    const anchorLink = createElement("a");

    innerLi.setAttribute("role", "presentation");
    anchorLink.setAttribute("role", "tab");

    anchorLink.onclick = anchorClick;

    if (i === step.step - 1) {
      setClass(anchorLink, activeClassName);
    }

    setAnchorAsButton(anchorLink);
    anchorLink.innerHTML = "&nbsp;";
    anchorLink.setAttribute(dataStepNumberAttribute, stepNumber.toString());

    innerLi.appendChild(anchorLink);
    ulContainer.appendChild(innerLi);
  }

  bulletsLayer.appendChild(ulContainer);

  return bulletsLayer;
}

/**
 * Deletes and recreates the bullets layer
 * @private
 */
export function _recreateBullets(tour: Tour, step: TourStep) {
  if (tour.getOption("showBullets")) {
    const existing = queryElementByClassName(bulletsClassName);

    if (existing && existing.parentNode) {
      existing.parentNode.replaceChild(_createBullets(tour, step), existing);
    }
  }
}

/**
 * Updates the bullets
 */
function _updateBullets(
  showBullets: boolean,
  oldReferenceLayer: HTMLElement,
  step: TourStep
) {
  if (showBullets) {
    const oldRefActiveBullet = queryElement(
      `.${bulletsClassName} li > a.${activeClassName}`,
      oldReferenceLayer
    );

    const oldRefBulletStepNumber = queryElement(
      `.${bulletsClassName} li > a[${dataStepNumberAttribute}="${step.step}"]`,
      oldReferenceLayer
    );

    if (oldRefActiveBullet && oldRefBulletStepNumber) {
      oldRefActiveBullet.className = "";
      setClass(oldRefBulletStepNumber, activeClassName);
    }
  }
}

/**
 * Creates the progress-bar layer and elements
 * @private
 */
function _createProgressBar(tour: Tour) {
  const progressLayer = createElement("div");

  setClass(progressLayer, progressClassName);

  if (tour.getOption("showProgress") === false) {
    progressLayer.style.display = "none";
  }

  const progressBar = createElement("div", {
    className: progressBarClassName,
  });

  if (tour.getOption("progressBarAdditionalClass")) {
    addClass(progressBar, tour.getOption("progressBarAdditionalClass"));
  }

  const progress = _getProgress(tour.getCurrentStep(), tour.getSteps().length);
  progressBar.setAttribute("role", "progress");
  progressBar.setAttribute("aria-valuemin", "0");
  progressBar.setAttribute("aria-valuemax", "100");
  progressBar.setAttribute("aria-valuenow", progress.toString());
  progressBar.style.cssText = `width:${progress}%;`;

  progressLayer.appendChild(progressBar);

  return progressLayer;
}

/**
 * Updates an existing progress bar variables
 * @private
 */
export function _updateProgressBar(
  oldReferenceLayer: HTMLElement,
  currentStep: number,
  introItemsLength: number
) {
  const progressBar = queryElement(
    `.${progressClassName} .${progressBarClassName}`,
    oldReferenceLayer
  );

  if (!progressBar) return;

  const progress = _getProgress(currentStep, introItemsLength);

  progressBar.style.cssText = `width:${progress}%;`;
  progressBar.setAttribute("aria-valuenow", progress.toString());
}

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
    const helperLayer = createElement("div", {
      className: highlightClass,
    });
    const referenceLayer = createElement("div", {
      className: tooltipReferenceLayerClassName,
    });

    setStyle(helperLayer, {
      // the inner box shadow is the border for the highlighted element
      // the outer box shadow is the overlay effect
      "box-shadow": `0 0 1px 2px rgba(33, 33, 33, 0.8), rgba(33, 33, 33, ${tour
        .getOption("overlayOpacity")
        .toString()}) 0 0 0 5000px`,
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
    appendChild(tour.getTargetElement(), helperLayer, true);
    appendChild(tour.getTargetElement(), referenceLayer);

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

    referenceLayer.appendChild(tooltip);

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

  //disable interaction
  if (step.disableInteraction) {
    _disableInteraction(tour, step);
  }

  setShowElement(step.element as HTMLElement);

  await tour.callback("afterChange")?.call(tour, step.element);
}
