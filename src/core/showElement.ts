import setShowElement from "../util/setShowElement";
import scrollParentToElement from "../util/scrollParentToElement";
import addClass from "../util/addClass";
import scrollTo from "../util/scrollTo";
import exitIntro from "./exitIntro";
import setAnchorAsButton from "../util/setAnchorAsButton";
import { IntroStep, nextStep, previousStep } from "./steps";
import setHelperLayerPosition from "./setHelperLayerPosition";
import placeTooltip from "./placeTooltip";
import removeShowElement from "./removeShowElement";
import createElement from "../util/createElement";
import setStyle from "../util/setStyle";
import appendChild from "../util/appendChild";
import { IntroJs } from "../intro";
import isFunction from "../util/isFunction";

/**
 * Gets the current progress percentage
 *
 * @api private
 * @returns current progress percentage
 */
function _getProgress(currentStep: number, introItemsLength: number) {
  // Steps are 0 indexed
  return ((currentStep + 1) / introItemsLength) * 100;
}

/**
 * Add disableinteraction layer and adjust the size and position of the layer
 *
 * @api private
 */
function _disableInteraction(intro: IntroJs, step: IntroStep) {
  let disableInteractionLayer = document.querySelector<HTMLElement>(
    ".introjs-disableInteraction"
  );

  if (disableInteractionLayer === null) {
    disableInteractionLayer = createElement("div", {
      className: "introjs-disableInteraction",
    });

    intro._targetElement.appendChild(disableInteractionLayer);
  }

  setHelperLayerPosition(intro, step, disableInteractionLayer);
}

/**
 * Creates the bullets layer
 * @private
 */
function _createBullets(intro: IntroJs, targetElement: IntroStep): HTMLElement {
  const bulletsLayer = createElement("div", {
    className: "introjs-bullets",
  });

  if (intro._options.showBullets === false) {
    bulletsLayer.style.display = "none";
  }

  const ulContainer = createElement("ul");
  ulContainer.setAttribute("role", "tablist");

  const anchorClick = function (this: HTMLElement) {
    const stepNumber = this.getAttribute("data-step-number");
    if (stepNumber == null) return;

    intro.goToStep(parseInt(stepNumber, 10));
  };

  for (let i = 0; i < intro._introItems.length; i++) {
    const { step } = intro._introItems[i];

    const innerLi = createElement("li");
    const anchorLink = createElement("a");

    innerLi.setAttribute("role", "presentation");
    anchorLink.setAttribute("role", "tab");

    anchorLink.onclick = anchorClick;

    if (i === targetElement.step - 1) {
      anchorLink.className = "active";
    }

    setAnchorAsButton(anchorLink);
    anchorLink.innerHTML = "&nbsp;";
    anchorLink.setAttribute("data-step-number", step.toString());

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
export function _recreateBullets(intro: IntroJs, targetElement: IntroStep) {
  if (intro._options.showBullets) {
    const existing = document.querySelector(".introjs-bullets");

    if (existing && existing.parentNode) {
      existing.parentNode.replaceChild(
        _createBullets(intro, targetElement),
        existing
      );
    }
  }
}

/**
 * Updates the bullets
 */
function _updateBullets(
  showBullets: boolean,
  oldReferenceLayer: HTMLElement,
  targetElement: IntroStep
) {
  if (showBullets) {
    const oldRefActiveBullet = oldReferenceLayer.querySelector(
      ".introjs-bullets li > a.active"
    );

    const oldRefBulletStepNumber = oldReferenceLayer.querySelector(
      `.introjs-bullets li > a[data-step-number="${targetElement.step}"]`
    );

    if (oldRefActiveBullet && oldRefBulletStepNumber) {
      oldRefActiveBullet.className = "";
      oldRefBulletStepNumber.className = "active";
    }
  }
}

/**
 * Creates the progress-bar layer and elements
 * @private
 */
function _createProgressBar(intro: IntroJs) {
  const progressLayer = createElement("div");

  progressLayer.className = "introjs-progress";

  if (intro._options.showProgress === false) {
    progressLayer.style.display = "none";
  }

  const progressBar = createElement("div", {
    className: "introjs-progressbar",
  });

  if (intro._options.progressBarAdditionalClass) {
    progressBar.className += " " + intro._options.progressBarAdditionalClass;
  }

  const progress = _getProgress(intro._currentStep, intro._introItems.length);
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
  const progressBar = oldReferenceLayer.querySelector<HTMLElement>(
    ".introjs-progress .introjs-progressbar"
  );

  if (!progressBar) return;

  const progress = _getProgress(currentStep, introItemsLength);

  progressBar.style.cssText = `width:${progress}%;`;
  progressBar.setAttribute("aria-valuenow", progress.toString());
}

/**
 * Show an element on the page
 *
 * @api private
 */
export default async function _showElement(
  intro: IntroJs,
  targetElement: IntroStep
) {
  if (isFunction(intro._introChangeCallback)) {
    await intro._introChangeCallback.call(intro, targetElement.element);
  }

  const oldHelperLayer = document.querySelector<HTMLElement>(
    ".introjs-helperLayer"
  );
  const oldReferenceLayer = document.querySelector<HTMLElement>(
    ".introjs-tooltipReferenceLayer"
  );
  let highlightClass = "introjs-helperLayer";
  let nextTooltipButton: HTMLElement;
  let prevTooltipButton: HTMLElement;
  let skipTooltipButton: HTMLElement;

  //check for a current step highlight class
  if (typeof targetElement.highlightClass === "string") {
    highlightClass += ` ${targetElement.highlightClass}`;
  }
  //check for options highlight class
  if (typeof intro._options.highlightClass === "string") {
    highlightClass += ` ${intro._options.highlightClass}`;
  }

  if (oldHelperLayer !== null && oldReferenceLayer !== null) {
    const oldHelperNumberLayer = oldReferenceLayer.querySelector<HTMLElement>(
      ".introjs-helperNumberLayer"
    );
    const oldTooltipLayer = oldReferenceLayer.querySelector<HTMLElement>(
      ".introjs-tooltiptext"
    ) as HTMLElement;
    const oldTooltipTitleLayer = oldReferenceLayer.querySelector<HTMLElement>(
      ".introjs-tooltip-title"
    ) as HTMLElement;
    const oldArrowLayer = oldReferenceLayer.querySelector<HTMLElement>(
      ".introjs-arrow"
    ) as HTMLElement;
    const oldTooltipContainer = oldReferenceLayer.querySelector<HTMLElement>(
      ".introjs-tooltip"
    ) as HTMLElement;

    skipTooltipButton = oldReferenceLayer.querySelector<HTMLElement>(
      ".introjs-skipbutton"
    ) as HTMLElement;
    prevTooltipButton = oldReferenceLayer.querySelector<HTMLElement>(
      ".introjs-prevbutton"
    ) as HTMLElement;
    nextTooltipButton = oldReferenceLayer.querySelector<HTMLElement>(
      ".introjs-nextbutton"
    ) as HTMLElement;

    //update or reset the helper highlight class
    oldHelperLayer.className = highlightClass;
    //hide the tooltip
    oldTooltipContainer.style.opacity = "0";
    oldTooltipContainer.style.display = "none";

    // if the target element is within a scrollable element
    scrollParentToElement(
      intro._options.scrollToElement,
      targetElement.element as HTMLElement
    );

    // set new position to helper layer
    setHelperLayerPosition(intro, targetElement, oldHelperLayer);
    setHelperLayerPosition(intro, targetElement, oldReferenceLayer);

    //remove old classes if the element still exist
    removeShowElement();

    //we should wait until the CSS3 transition is competed (it's 0.3 sec) to prevent incorrect `height` and `width` calculation
    if (intro._lastShowElementTimer) {
      window.clearTimeout(intro._lastShowElementTimer);
    }

    intro._lastShowElementTimer = window.setTimeout(() => {
      // set current step to the label
      if (oldHelperNumberLayer !== null) {
        oldHelperNumberLayer.innerHTML = `${targetElement.step} ${intro._options.stepNumbersOfLabel} ${intro._introItems.length}`;
      }

      // set current tooltip text
      oldTooltipLayer.innerHTML = targetElement.intro || "";

      // set current tooltip title
      oldTooltipTitleLayer.innerHTML = targetElement.title || "";

      //set the tooltip position
      oldTooltipContainer.style.display = "block";
      placeTooltip(intro, targetElement, oldTooltipContainer, oldArrowLayer);

      //change active bullet
      _updateBullets(
        intro._options.showBullets,
        oldReferenceLayer,
        targetElement
      );

      _updateProgressBar(
        oldReferenceLayer,
        intro._currentStep,
        intro._introItems.length
      );

      //show the tooltip
      oldTooltipContainer.style.opacity = "1";

      //reset button focus
      if (
        typeof nextTooltipButton !== "undefined" &&
        nextTooltipButton !== null &&
        /introjs-donebutton/gi.test(nextTooltipButton.className)
      ) {
        // skip button is now "done" button
        nextTooltipButton.focus();
      } else if (
        typeof nextTooltipButton !== "undefined" &&
        nextTooltipButton !== null
      ) {
        //still in the tour, focus on next
        nextTooltipButton.focus();
      }

      // change the scroll of the window, if needed
      scrollTo(
        intro._options.scrollToElement,
        targetElement.scrollTo,
        intro._options.scrollPadding,
        targetElement.element as HTMLElement,
        oldTooltipLayer
      );
    }, 350);

    // end of old element if-else condition
  } else {
    const helperLayer = createElement("div", {
      className: highlightClass,
    });
    const referenceLayer = createElement("div", {
      className: "introjs-tooltipReferenceLayer",
    });
    const arrowLayer = createElement("div", {
      className: "introjs-arrow",
    });
    const tooltipLayer = createElement("div", {
      className: "introjs-tooltip",
    });
    const tooltipTextLayer = createElement("div", {
      className: "introjs-tooltiptext",
    });
    const tooltipHeaderLayer = createElement("div", {
      className: "introjs-tooltip-header",
    });
    const tooltipTitleLayer = createElement("h1", {
      className: "introjs-tooltip-title",
    });

    const buttonsLayer = createElement("div");

    setStyle(helperLayer, {
      "box-shadow": `0 0 1px 2px rgba(33, 33, 33, 0.8), rgba(33, 33, 33, ${intro._options.overlayOpacity.toString()}) 0 0 0 5000px`,
    });

    // target is within a scrollable element
    scrollParentToElement(
      intro._options.scrollToElement,
      targetElement.element as HTMLElement
    );

    //set new position to helper layer
    setHelperLayerPosition(intro, targetElement, helperLayer);
    setHelperLayerPosition(intro, targetElement, referenceLayer);

    //add helper layer to target element
    appendChild(intro._targetElement, helperLayer, true);
    appendChild(intro._targetElement, referenceLayer);

    tooltipTextLayer.innerHTML = targetElement.intro;
    tooltipTitleLayer.innerHTML = targetElement.title;

    buttonsLayer.className = "introjs-tooltipbuttons";
    if (intro._options.showButtons === false) {
      buttonsLayer.style.display = "none";
    }

    tooltipHeaderLayer.appendChild(tooltipTitleLayer);
    tooltipLayer.appendChild(tooltipHeaderLayer);
    tooltipLayer.appendChild(tooltipTextLayer);

    // "Do not show again" checkbox
    if (intro._options.dontShowAgain) {
      const dontShowAgainWrapper = createElement("div", {
        className: "introjs-dontShowAgain",
      });
      const dontShowAgainCheckbox = createElement("input", {
        type: "checkbox",
        id: "introjs-dontShowAgain",
        name: "introjs-dontShowAgain",
      });
      dontShowAgainCheckbox.onchange = (e) => {
        intro.setDontShowAgain((<HTMLInputElement>e.target).checked);
      };
      const dontShowAgainCheckboxLabel = createElement("label", {
        htmlFor: "introjs-dontShowAgain",
      });
      dontShowAgainCheckboxLabel.innerText = intro._options.dontShowAgainLabel;
      dontShowAgainWrapper.appendChild(dontShowAgainCheckbox);
      dontShowAgainWrapper.appendChild(dontShowAgainCheckboxLabel);

      tooltipLayer.appendChild(dontShowAgainWrapper);
    }

    tooltipLayer.appendChild(_createBullets(intro, targetElement));
    tooltipLayer.appendChild(_createProgressBar(intro));

    // add helper layer number
    const helperNumberLayer = createElement("div");

    if (intro._options.showStepNumbers === true) {
      helperNumberLayer.className = "introjs-helperNumberLayer";
      helperNumberLayer.innerHTML = `${targetElement.step} ${intro._options.stepNumbersOfLabel} ${intro._introItems.length}`;
      tooltipLayer.appendChild(helperNumberLayer);
    }

    tooltipLayer.appendChild(arrowLayer);
    referenceLayer.appendChild(tooltipLayer);

    //next button
    nextTooltipButton = createElement("a");

    nextTooltipButton.onclick = async () => {
      if (intro._introItems.length - 1 !== intro._currentStep) {
        await nextStep(intro);
      } else if (/introjs-donebutton/gi.test(nextTooltipButton.className)) {
        if (isFunction(intro._introCompleteCallback)) {
          await intro._introCompleteCallback.call(
            intro,
            intro._currentStep,
            "done"
          );
        }

        await exitIntro(intro, intro._targetElement);
      }
    };

    setAnchorAsButton(nextTooltipButton);
    nextTooltipButton.innerHTML = intro._options.nextLabel;

    //previous button
    prevTooltipButton = createElement("a");

    prevTooltipButton.onclick = async () => {
      if (intro._currentStep > 0) {
        await previousStep(intro);
      }
    };

    setAnchorAsButton(prevTooltipButton);
    prevTooltipButton.innerHTML = intro._options.prevLabel;

    //skip button
    skipTooltipButton = createElement("a", {
      className: "introjs-skipbutton",
    });

    setAnchorAsButton(skipTooltipButton);
    skipTooltipButton.innerHTML = intro._options.skipLabel;

    skipTooltipButton.onclick = async () => {
      if (
        intro._introItems.length - 1 === intro._currentStep &&
        isFunction(intro._introCompleteCallback)
      ) {
        await intro._introCompleteCallback.call(
          intro,
          intro._currentStep,
          "skip"
        );
      }

      if (isFunction(intro._introSkipCallback)) {
        await intro._introSkipCallback.call(intro, intro._currentStep);
      }

      await exitIntro(intro, intro._targetElement);
    };

    tooltipHeaderLayer.appendChild(skipTooltipButton);

    // in order to prevent displaying previous button always
    if (intro._introItems.length > 1) {
      buttonsLayer.appendChild(prevTooltipButton);
    }

    // we always need the next button because this
    // button changes to "Done" in the last step of the tour
    buttonsLayer.appendChild(nextTooltipButton);
    tooltipLayer.appendChild(buttonsLayer);

    // set proper position
    placeTooltip(intro, targetElement, tooltipLayer, arrowLayer);

    // change the scroll of the window, if needed
    scrollTo(
      intro._options.scrollToElement,
      targetElement.scrollTo,
      intro._options.scrollPadding,
      targetElement.element as HTMLElement,
      tooltipLayer
    );

    //end of new element if-else condition
  }

  // removing previous disable interaction layer
  const disableInteractionLayer = intro._targetElement.querySelector(
    ".introjs-disableInteraction"
  );
  if (disableInteractionLayer && disableInteractionLayer.parentNode) {
    disableInteractionLayer.parentNode.removeChild(disableInteractionLayer);
  }

  //disable interaction
  if (targetElement.disableInteraction) {
    _disableInteraction(intro, targetElement);
  }

  // when it's the first step of tour
  if (intro._currentStep === 0 && intro._introItems.length > 1) {
    if (
      typeof nextTooltipButton !== "undefined" &&
      nextTooltipButton !== null
    ) {
      nextTooltipButton.className = `${intro._options.buttonClass} introjs-nextbutton`;
      nextTooltipButton.innerHTML = intro._options.nextLabel;
    }

    if (intro._options.hidePrev === true) {
      if (
        typeof prevTooltipButton !== "undefined" &&
        prevTooltipButton !== null
      ) {
        prevTooltipButton.className = `${intro._options.buttonClass} introjs-prevbutton introjs-hidden`;
      }
      if (
        typeof nextTooltipButton !== "undefined" &&
        nextTooltipButton !== null
      ) {
        addClass(nextTooltipButton, "introjs-fullbutton");
      }
    } else {
      if (
        typeof prevTooltipButton !== "undefined" &&
        prevTooltipButton !== null
      ) {
        prevTooltipButton.className = `${intro._options.buttonClass} introjs-prevbutton introjs-disabled`;
      }
    }
  } else if (
    intro._introItems.length - 1 === intro._currentStep ||
    intro._introItems.length === 1
  ) {
    // last step of tour
    if (
      typeof prevTooltipButton !== "undefined" &&
      prevTooltipButton !== null
    ) {
      prevTooltipButton.className = `${intro._options.buttonClass} introjs-prevbutton`;
    }

    if (intro._options.hideNext === true) {
      if (
        typeof nextTooltipButton !== "undefined" &&
        nextTooltipButton !== null
      ) {
        nextTooltipButton.className = `${intro._options.buttonClass} introjs-nextbutton introjs-hidden`;
      }
      if (
        typeof prevTooltipButton !== "undefined" &&
        prevTooltipButton !== null
      ) {
        addClass(prevTooltipButton, "introjs-fullbutton");
      }
    } else {
      if (
        typeof nextTooltipButton !== "undefined" &&
        nextTooltipButton !== null
      ) {
        if (intro._options.nextToDone === true) {
          nextTooltipButton.innerHTML = intro._options.doneLabel;
          addClass(
            nextTooltipButton,
            `${intro._options.buttonClass} introjs-nextbutton introjs-donebutton`
          );
        } else {
          nextTooltipButton.className = `${intro._options.buttonClass} introjs-nextbutton introjs-disabled`;
        }
      }
    }
  } else {
    // steps between start and end
    if (
      typeof prevTooltipButton !== "undefined" &&
      prevTooltipButton !== null
    ) {
      prevTooltipButton.className = `${intro._options.buttonClass} introjs-prevbutton`;
    }
    if (
      typeof nextTooltipButton !== "undefined" &&
      nextTooltipButton !== null
    ) {
      nextTooltipButton.className = `${intro._options.buttonClass} introjs-nextbutton`;
      nextTooltipButton.innerHTML = intro._options.nextLabel;
    }
  }

  if (typeof prevTooltipButton !== "undefined" && prevTooltipButton !== null) {
    prevTooltipButton.setAttribute("role", "button");
  }
  if (typeof nextTooltipButton !== "undefined" && nextTooltipButton !== null) {
    nextTooltipButton.setAttribute("role", "button");
  }
  if (typeof skipTooltipButton !== "undefined" && skipTooltipButton !== null) {
    skipTooltipButton.setAttribute("role", "button");
  }

  //Set focus on "next" button, so that hitting Enter always moves you onto the next step
  if (typeof nextTooltipButton !== "undefined" && nextTooltipButton !== null) {
    nextTooltipButton.focus();
  }

  setShowElement(targetElement.element as HTMLElement);

  if (isFunction(intro._introAfterChangeCallback)) {
    await intro._introAfterChangeCallback.call(intro, targetElement.element);
  }
}
