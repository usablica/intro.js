import setShowElement from "../../util/setShowElement";
import scrollParentToElement from "../../util/scrollParentToElement";
import scrollTo from "../../util/scrollTo";
import exitIntro from "./exitIntro";
import { addClass, setClass } from "../../util/className";
import setAnchorAsButton from "../../util/setAnchorAsButton";
import { TourStep, nextStep, previousStep } from "./steps";
import setHelperLayerPosition from "./setHelperLayerPosition";
import placeTooltip from "../../core/placeTooltip";
import removeShowElement from "../../core/removeShowElement";
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

  setHelperLayerPosition(tour, step, disableInteractionLayer);
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
  let nextTooltipButton: HTMLElement;
  let prevTooltipButton: HTMLElement;
  let skipTooltipButton: HTMLElement;

  //check for a current step highlight class
  if (typeof step.highlightClass === "string") {
    highlightClass += ` ${step.highlightClass}`;
  }

  //check for options highlight class
  if (typeof tour.getOption("highlightClass") === "string") {
    highlightClass += ` ${tour.getOption("highlightClass")}`;
  }

  if (oldHelperLayer !== null && oldReferenceLayer !== null) {
    const oldHelperNumberLayer = getElementByClassName(
      helperNumberLayerClassName,
      oldReferenceLayer
    );

    const oldTooltipLayer = getElementByClassName(
      tooltipTextClassName,
      oldReferenceLayer
    );
    const oldTooltipTitleLayer = getElementByClassName(
      tooltipTitleClassName,
      oldReferenceLayer
    );
    const oldArrowLayer = getElementByClassName(
      arrowClassName,
      oldReferenceLayer
    );
    const oldTooltipContainer = getElementByClassName(
      tooltipClassName,
      oldReferenceLayer
    );

    skipTooltipButton = getElementByClassName(
      skipButtonClassName,
      oldReferenceLayer
    );

    prevTooltipButton = getElementByClassName(
      previousButtonClassName,
      oldReferenceLayer
    );

    nextTooltipButton = getElementByClassName(
      nextButtonClassName,
      oldReferenceLayer
    );

    //update or reset the helper highlight class
    setClass(oldHelperLayer, highlightClass);

    //hide the tooltip
    oldTooltipContainer.style.opacity = "0";
    oldTooltipContainer.style.display = "none";

    // if the target element is within a scrollable element
    scrollParentToElement(
      tour.getOption("scrollToElement"),
      step.element as HTMLElement
    );

    // set new position to helper layer
    setHelperLayerPosition(tour, step, oldHelperLayer);
    setHelperLayerPosition(tour, step, oldReferenceLayer);

    //remove old classes if the element still exist
    removeShowElement();

    //we should wait until the CSS3 transition is competed (it's 0.3 sec) to prevent incorrect `height` and `width` calculation
    if (_lastShowElementTimer) {
      window.clearTimeout(_lastShowElementTimer);
    }

    _lastShowElementTimer = window.setTimeout(() => {
      // set current step to the label
      if (oldHelperNumberLayer !== null) {
        oldHelperNumberLayer.innerHTML = `${step.step} ${tour.getOption(
          "stepNumbersOfLabel"
        )} ${tour.getSteps().length}`;
      }

      // set current tooltip text
      oldTooltipLayer.innerHTML = step.intro || "";

      // set current tooltip title
      oldTooltipTitleLayer.innerHTML = step.title || "";

      //set the tooltip position
      oldTooltipContainer.style.display = "block";
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

      //change active bullet
      _updateBullets(tour.getOption("showBullets"), oldReferenceLayer, step);

      _updateProgressBar(
        oldReferenceLayer,
        tour.getCurrentStep(),
        tour.getSteps().length
      );

      //show the tooltip
      oldTooltipContainer.style.opacity = "1";

      //reset button focus
      if (
        nextTooltipButton &&
        new RegExp(doneButtonClassName, "gi").test(nextTooltipButton.className)
      ) {
        // skip button is now "done" button
        nextTooltipButton.focus();
      } else if (nextTooltipButton) {
        //still in the tour, focus on next
        nextTooltipButton.focus();
      }

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
    const arrowLayer = createElement("div", {
      className: arrowClassName,
    });
    const tooltipLayer = createElement("div", {
      className: tooltipClassName,
    });
    const tooltipTextLayer = createElement("div", {
      className: tooltipTextClassName,
    });
    const tooltipHeaderLayer = createElement("div", {
      className: tooltipHeaderClassName,
    });
    const tooltipTitleLayer = createElement("h1", {
      className: tooltipTitleClassName,
    });

    const buttonsLayer = createElement("div");

    setStyle(helperLayer, {
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
    setHelperLayerPosition(tour, step, helperLayer);
    setHelperLayerPosition(tour, step, referenceLayer);

    //add helper layer to target element
    appendChild(tour.getTargetElement(), helperLayer, true);
    appendChild(tour.getTargetElement(), referenceLayer);

    tooltipTextLayer.innerHTML = step.intro;
    tooltipTitleLayer.innerHTML = step.title;

    setClass(buttonsLayer, tooltipButtonsClassName);

    if (tour.getOption("showButtons") === false) {
      buttonsLayer.style.display = "none";
    }

    tooltipHeaderLayer.appendChild(tooltipTitleLayer);
    tooltipLayer.appendChild(tooltipHeaderLayer);
    tooltipLayer.appendChild(tooltipTextLayer);

    // "Do not show again" checkbox
    if (tour.getOption("dontShowAgain")) {
      const dontShowAgainWrapper = createElement("div", {
        className: dontShowAgainClassName,
      });
      const dontShowAgainCheckbox = createElement("input", {
        type: "checkbox",
        id: dontShowAgainClassName,
        name: dontShowAgainClassName,
      });
      dontShowAgainCheckbox.onchange = (e) => {
        tour.setDontShowAgain((<HTMLInputElement>e.target).checked);
      };
      const dontShowAgainCheckboxLabel = createElement("label", {
        htmlFor: dontShowAgainClassName,
      });
      dontShowAgainCheckboxLabel.innerText =
        tour.getOption("dontShowAgainLabel");
      dontShowAgainWrapper.appendChild(dontShowAgainCheckbox);
      dontShowAgainWrapper.appendChild(dontShowAgainCheckboxLabel);

      tooltipLayer.appendChild(dontShowAgainWrapper);
    }

    tooltipLayer.appendChild(_createBullets(tour, step));
    tooltipLayer.appendChild(_createProgressBar(tour));

    // add helper layer number
    const helperNumberLayer = createElement("div");

    if (tour.getOption("showStepNumbers") === true) {
      setClass(helperNumberLayer, helperNumberLayerClassName);

      helperNumberLayer.innerHTML = `${step.step} ${tour.getOption(
        "stepNumbersOfLabel"
      )} ${tour.getSteps().length}`;
      tooltipLayer.appendChild(helperNumberLayer);
    }

    tooltipLayer.appendChild(arrowLayer);
    referenceLayer.appendChild(tooltipLayer);

    //next button
    nextTooltipButton = createElement("a");

    nextTooltipButton.onclick = async () => {
      if (!tour.isEnd()) {
        await nextStep(tour);
      } else if (
        new RegExp(doneButtonClassName, "gi").test(nextTooltipButton.className)
      ) {
        await tour
          .callback("complete")
          ?.call(tour, tour.getCurrentStep(), "done");

        await exitIntro(tour);
      }
    };

    setAnchorAsButton(nextTooltipButton);
    nextTooltipButton.innerHTML = tour.getOption("nextLabel");

    //previous button
    prevTooltipButton = createElement("a");

    prevTooltipButton.onclick = async () => {
      if (tour.getCurrentStep() > 0) {
        await previousStep(tour);
      }
    };

    setAnchorAsButton(prevTooltipButton);
    prevTooltipButton.innerHTML = tour.getOption("prevLabel");

    //skip button
    skipTooltipButton = createElement("a", {
      className: skipButtonClassName,
    });

    setAnchorAsButton(skipTooltipButton);
    skipTooltipButton.innerHTML = tour.getOption("skipLabel");

    skipTooltipButton.onclick = async () => {
      if (tour.isEnd()) {
        await tour
          .callback("complete")
          ?.call(tour, tour.getCurrentStep(), "skip");
      }

      await tour.callback("skip")?.call(tour, tour.getCurrentStep());

      await exitIntro(tour);
    };

    tooltipHeaderLayer.appendChild(skipTooltipButton);

    // in order to prevent displaying previous button always
    if (tour.getSteps().length > 1) {
      buttonsLayer.appendChild(prevTooltipButton);
    }

    // we always need the next button because this
    // button changes to "Done" in the last step of the tour
    buttonsLayer.appendChild(nextTooltipButton);
    tooltipLayer.appendChild(buttonsLayer);

    // set proper position
    placeTooltip(
      tooltipLayer,
      arrowLayer,
      step.element as HTMLElement,
      step.position,
      tour.getOption("positionPrecedence"),
      tour.getOption("showStepNumbers"),
      tour.getOption("autoPosition"),
      step.tooltipClass ?? tour.getOption("tooltipClass")
    );

    // change the scroll of the window, if needed
    scrollTo(
      tour.getOption("scrollToElement"),
      step.scrollTo,
      tour.getOption("scrollPadding"),
      step.element as HTMLElement,
      tooltipLayer
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

  // when it's the first step of tour
  if (tour.getCurrentStep() === 0 && tour.getSteps().length > 1) {
    if (nextTooltipButton) {
      setClass(
        nextTooltipButton,
        tour.getOption("buttonClass"),
        nextButtonClassName
      );
      nextTooltipButton.innerHTML = tour.getOption("nextLabel");
    }

    if (tour.getOption("hidePrev") === true) {
      if (prevTooltipButton) {
        setClass(
          prevTooltipButton,
          tour.getOption("buttonClass"),
          previousButtonClassName,
          hiddenButtonClassName
        );
      }
      if (nextTooltipButton) {
        addClass(nextTooltipButton, fullButtonClassName);
      }
    } else {
      if (prevTooltipButton) {
        setClass(
          prevTooltipButton,
          tour.getOption("buttonClass"),
          previousButtonClassName,
          disableInteractionClassName
        );
      }
    }
  } else if (tour.isEnd() || tour.getSteps().length === 1) {
    // last step of tour
    if (prevTooltipButton) {
      setClass(
        prevTooltipButton,
        tour.getOption("buttonClass"),
        previousButtonClassName
      );
    }

    if (tour.getOption("hideNext") === true) {
      if (nextTooltipButton) {
        setClass(
          nextTooltipButton,
          tour.getOption("buttonClass"),
          nextButtonClassName,
          hiddenButtonClassName
        );
      }
      if (prevTooltipButton) {
        addClass(prevTooltipButton, fullButtonClassName);
      }
    } else {
      if (nextTooltipButton) {
        if (tour.getOption("nextToDone") === true) {
          nextTooltipButton.innerHTML = tour.getOption("doneLabel");
          addClass(
            nextTooltipButton,
            tour.getOption("buttonClass"),
            nextButtonClassName,
            doneButtonClassName
          );
        } else {
          setClass(
            nextTooltipButton,
            tour.getOption("buttonClass"),
            nextButtonClassName,
            disabledButtonClassName
          );
        }
      }
    }
  } else {
    // steps between start and end
    if (prevTooltipButton) {
      setClass(
        prevTooltipButton,
        tour.getOption("buttonClass"),
        previousButtonClassName
      );
    }
    if (nextTooltipButton) {
      setClass(
        nextTooltipButton,
        tour.getOption("buttonClass"),
        nextButtonClassName
      );
      nextTooltipButton.innerHTML = tour.getOption("nextLabel");
    }
  }

  if (prevTooltipButton) {
    prevTooltipButton.setAttribute("role", "button");
  }
  if (nextTooltipButton) {
    nextTooltipButton.setAttribute("role", "button");
  }
  if (skipTooltipButton) {
    skipTooltipButton.setAttribute("role", "button");
  }

  //Set focus on "next" button, so that hitting Enter always moves you onto the next step
  if (nextTooltipButton) {
    nextTooltipButton.focus();
  }

  setShowElement(step.element as HTMLElement);

  await tour.callback("afterChange")?.call(tour, step.element);
}
