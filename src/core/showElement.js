import setShowElement from "../util/setShowElement";
import scrollParentToElement from "../util/scrollParentToElement";
import addClass from "../util/addClass";
import scrollTo from "../util/scrollTo";
import exitIntro from "./exitIntro";
import forEach from "../util/forEach";
import setAnchorAsButton from "../util/setAnchorAsButton";
import { nextStep, previousStep } from "./steps";
import setHelperLayerPosition from "./setHelperLayerPosition";
import placeTooltip from "./placeTooltip";
import removeShowElement from "./removeShowElement";
import createElement from "../util/createElement";
import setStyle from "../util/setStyle";
import appendChild from "../util/appendChild";

/**
 * Gets the current progress percentage
 *
 * @api private
 * @method _getProgress
 * @returns current progress percentage
 */
function _getProgress() {
  // Steps are 0 indexed
  const currentStep = parseInt(this._currentStep + 1, 10);
  return (currentStep / this._introItems.length) * 100;
}

/**
 * Add disableinteraction layer and adjust the size and position of the layer
 *
 * @api private
 * @method _disableInteraction
 */
function _disableInteraction() {
  let disableInteractionLayer = document.querySelector(
    ".introjs-disableInteraction"
  );

  if (disableInteractionLayer === null) {
    disableInteractionLayer = createElement("div", {
      className: "introjs-disableInteraction",
    });

    this._targetElement.appendChild(disableInteractionLayer);
  }

  setHelperLayerPosition.call(this, disableInteractionLayer);
}

/**
 * Creates the bullets layer
 * @returns HTMLElement
 * @private
 */
function _createBullets(targetElement) {
  const self = this;

  const bulletsLayer = createElement("div", {
    className: "introjs-bullets",
  });

  if (this._options.showBullets === false) {
    bulletsLayer.style.display = "none";
  }

  const ulContainer = createElement("ul");
  ulContainer.setAttribute("role", "tablist");

  const anchorClick = function () {
    self.goToStep(this.getAttribute("data-step-number"));
  };

  forEach(this._introItems, ({ step }, i) => {
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
    anchorLink.setAttribute("data-step-number", step);

    innerLi.appendChild(anchorLink);
    ulContainer.appendChild(innerLi);
  });

  bulletsLayer.appendChild(ulContainer);

  return bulletsLayer;
}

/**
 * Deletes and recreates the bullets layer
 * @param oldReferenceLayer
 * @param targetElement
 * @private
 */
export function _recreateBullets(oldReferenceLayer, targetElement) {
  if (this._options.showBullets) {
    const existing = document.querySelector(".introjs-bullets");

    if (existing) {
      existing.parentNode.replaceChild(
        _createBullets.call(this, targetElement),
        existing
      );
    }
  }
}

/**
 * Updates the bullets
 *
 * @param oldReferenceLayer
 * @param targetElement
 */
function _updateBullets(oldReferenceLayer, targetElement) {
  if (this._options.showBullets) {
    oldReferenceLayer.querySelector(
      ".introjs-bullets li > a.active"
    ).className = "";
    oldReferenceLayer.querySelector(
      `.introjs-bullets li > a[data-step-number="${targetElement.step}"]`
    ).className = "active";
  }
}

/**
 * Creates the progress-bar layer and elements
 * @returns {*}
 * @private
 */
function _createProgressBar() {
  const progressLayer = createElement("div");

  progressLayer.className = "introjs-progress";

  if (this._options.showProgress === false) {
    progressLayer.style.display = "none";
  }

  const progressBar = createElement("div", {
    className: "introjs-progressbar",
  });

  if (this._options.progressBarAdditionalClass) {
    progressBar.className += " " + this._options.progressBarAdditionalClass;
  }

  progressBar.setAttribute("role", "progress");
  progressBar.setAttribute("aria-valuemin", 0);
  progressBar.setAttribute("aria-valuemax", 100);
  progressBar.setAttribute("aria-valuenow", _getProgress.call(this));
  progressBar.style.cssText = `width:${_getProgress.call(this)}%;`;

  progressLayer.appendChild(progressBar);

  return progressLayer;
}

/**
 * Updates an existing progress bar variables
 * @param oldReferenceLayer
 * @private
 */
export function _updateProgressBar(oldReferenceLayer) {
  oldReferenceLayer.querySelector(
    ".introjs-progress .introjs-progressbar"
  ).style.cssText = `width:${_getProgress.call(this)}%;`;
  oldReferenceLayer
    .querySelector(".introjs-progress .introjs-progressbar")
    .setAttribute("aria-valuenow", _getProgress.call(this));
}

/**
 * Show an element on the page
 *
 * @api private
 * @method _showElement
 * @param {Object} targetElement
 */
export default async function _showElement(targetElement) {
  if (typeof this._introChangeCallback !== "undefined") {
    await this._introChangeCallback.call(this, targetElement.element);
  }

  const self = this;
  const oldHelperLayer = document.querySelector(".introjs-helperLayer");
  const oldReferenceLayer = document.querySelector(
    ".introjs-tooltipReferenceLayer"
  );
  let highlightClass = "introjs-helperLayer";
  let nextTooltipButton;
  let prevTooltipButton;
  let skipTooltipButton;

  //check for a current step highlight class
  if (typeof targetElement.highlightClass === "string") {
    highlightClass += ` ${targetElement.highlightClass}`;
  }
  //check for options highlight class
  if (typeof this._options.highlightClass === "string") {
    highlightClass += ` ${this._options.highlightClass}`;
  }

  if (oldHelperLayer !== null && oldReferenceLayer !== null) {
    const oldHelperNumberLayer = oldReferenceLayer.querySelector(
      ".introjs-helperNumberLayer"
    );
    const oldtooltipLayer = oldReferenceLayer.querySelector(
      ".introjs-tooltiptext"
    );
    const oldTooltipTitleLayer = oldReferenceLayer.querySelector(
      ".introjs-tooltip-title"
    );
    const oldArrowLayer = oldReferenceLayer.querySelector(".introjs-arrow");
    const oldtooltipContainer =
      oldReferenceLayer.querySelector(".introjs-tooltip");

    skipTooltipButton = oldReferenceLayer.querySelector(".introjs-skipbutton");
    prevTooltipButton = oldReferenceLayer.querySelector(".introjs-prevbutton");
    nextTooltipButton = oldReferenceLayer.querySelector(".introjs-nextbutton");

    //update or reset the helper highlight class
    oldHelperLayer.className = highlightClass;
    //hide the tooltip
    oldtooltipContainer.style.opacity = 0;
    oldtooltipContainer.style.display = "none";

    // if the target element is within a scrollable element
    scrollParentToElement.call(self, targetElement);

    // set new position to helper layer
    setHelperLayerPosition.call(self, oldHelperLayer);
    setHelperLayerPosition.call(self, oldReferenceLayer);

    //remove old classes if the element still exist
    removeShowElement();

    //we should wait until the CSS3 transition is competed (it's 0.3 sec) to prevent incorrect `height` and `width` calculation
    if (self._lastShowElementTimer) {
      window.clearTimeout(self._lastShowElementTimer);
    }

    self._lastShowElementTimer = window.setTimeout(() => {
      // set current step to the label
      if (oldHelperNumberLayer !== null) {
        oldHelperNumberLayer.innerHTML = `${targetElement.step} ${this._options.stepNumbersOfLabel} ${this._introItems.length}`;
      }

      // set current tooltip text
      oldtooltipLayer.innerHTML = targetElement.intro;

      // set current tooltip title
      oldTooltipTitleLayer.innerHTML = targetElement.title;

      //set the tooltip position
      oldtooltipContainer.style.display = "block";
      placeTooltip.call(
        self,
        targetElement.element,
        oldtooltipContainer,
        oldArrowLayer
      );

      //change active bullet
      _updateBullets.call(self, oldReferenceLayer, targetElement);

      _updateProgressBar.call(self, oldReferenceLayer);

      //show the tooltip
      oldtooltipContainer.style.opacity = 1;

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
      scrollTo.call(
        self,
        targetElement.scrollTo,
        targetElement,
        oldtooltipLayer
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
      "box-shadow": `0 0 1px 2px rgba(33, 33, 33, 0.8), rgba(33, 33, 33, ${self._options.overlayOpacity.toString()}) 0 0 0 5000px`,
    });

    // target is within a scrollable element
    scrollParentToElement.call(self, targetElement);

    //set new position to helper layer
    setHelperLayerPosition.call(self, helperLayer);
    setHelperLayerPosition.call(self, referenceLayer);

    //add helper layer to target element
    appendChild(this._targetElement, helperLayer, true);
    appendChild(this._targetElement, referenceLayer);

    tooltipTextLayer.innerHTML = targetElement.intro;
    tooltipTitleLayer.innerHTML = targetElement.title;

    buttonsLayer.className = "introjs-tooltipbuttons";
    if (this._options.showButtons === false) {
      buttonsLayer.style.display = "none";
    }

    tooltipHeaderLayer.appendChild(tooltipTitleLayer);
    tooltipLayer.appendChild(tooltipHeaderLayer);
    tooltipLayer.appendChild(tooltipTextLayer);

    // "Do not show again" checkbox
    if (this._options.dontShowAgain) {
      const dontShowAgainWrapper = createElement("div", {
        className: "introjs-dontShowAgain",
      });
      const dontShowAgainCheckbox = createElement("input", {
        type: "checkbox",
        id: "introjs-dontShowAgain",
        name: "introjs-dontShowAgain",
      });
      dontShowAgainCheckbox.onchange = (e) => {
        this.setDontShowAgain(e.target.checked);
      };
      const dontShowAgainCheckboxLabel = createElement("label", {
        htmlFor: "introjs-dontShowAgain",
      });
      dontShowAgainCheckboxLabel.innerText = this._options.dontShowAgainLabel;
      dontShowAgainWrapper.appendChild(dontShowAgainCheckbox);
      dontShowAgainWrapper.appendChild(dontShowAgainCheckboxLabel);

      tooltipLayer.appendChild(dontShowAgainWrapper);
    }

    tooltipLayer.appendChild(_createBullets.call(this, targetElement));
    tooltipLayer.appendChild(_createProgressBar.call(this));

    // add helper layer number
    const helperNumberLayer = createElement("div");

    if (this._options.showStepNumbers === true) {
      helperNumberLayer.className = "introjs-helperNumberLayer";
      helperNumberLayer.innerHTML = `${targetElement.step} ${this._options.stepNumbersOfLabel} ${this._introItems.length}`;
      tooltipLayer.appendChild(helperNumberLayer);
    }

    tooltipLayer.appendChild(arrowLayer);
    referenceLayer.appendChild(tooltipLayer);

    //next button
    nextTooltipButton = createElement("a");

    nextTooltipButton.onclick = async () => {
      if (self._introItems.length - 1 !== self._currentStep) {
        await nextStep.call(self);
      } else if (/introjs-donebutton/gi.test(nextTooltipButton.className)) {
        if (typeof self._introCompleteCallback === "function") {
          await self._introCompleteCallback.call(
            self,
            self._currentStep,
            "done"
          );
        }

        await exitIntro.call(self, self._targetElement);
      }
    };

    setAnchorAsButton(nextTooltipButton);
    nextTooltipButton.innerHTML = this._options.nextLabel;

    //previous button
    prevTooltipButton = createElement("a");

    prevTooltipButton.onclick = async () => {
      if (self._currentStep !== 0) {
        await previousStep.call(self);
      }
    };

    setAnchorAsButton(prevTooltipButton);
    prevTooltipButton.innerHTML = this._options.prevLabel;

    //skip button
    skipTooltipButton = createElement("a", {
      className: "introjs-skipbutton",
    });

    setAnchorAsButton(skipTooltipButton);
    skipTooltipButton.innerHTML = this._options.skipLabel;

    skipTooltipButton.onclick = async () => {
      if (
        self._introItems.length - 1 === self._currentStep &&
        typeof self._introCompleteCallback === "function"
      ) {
        await self._introCompleteCallback.call(self, self._currentStep, "skip");
      }

      if (typeof self._introSkipCallback === "function") {
        await self._introSkipCallback.call(self);
      }

      await exitIntro.call(self, self._targetElement);
    };

    tooltipHeaderLayer.appendChild(skipTooltipButton);

    //in order to prevent displaying previous button always
    if (this._introItems.length > 1) {
      buttonsLayer.appendChild(prevTooltipButton);
    }

    // we always need the next button because this
    // button changes to "Done" in the last step of the tour
    buttonsLayer.appendChild(nextTooltipButton);
    tooltipLayer.appendChild(buttonsLayer);

    //set proper position
    placeTooltip.call(self, targetElement.element, tooltipLayer, arrowLayer);

    // change the scroll of the window, if needed
    scrollTo.call(this, targetElement.scrollTo, targetElement, tooltipLayer);

    //end of new element if-else condition
  }

  // removing previous disable interaction layer
  const disableInteractionLayer = self._targetElement.querySelector(
    ".introjs-disableInteraction"
  );
  if (disableInteractionLayer) {
    disableInteractionLayer.parentNode.removeChild(disableInteractionLayer);
  }

  //disable interaction
  if (targetElement.disableInteraction) {
    _disableInteraction.call(self);
  }

  // when it's the first step of tour
  if (this._currentStep === 0 && this._introItems.length > 1) {
    if (
      typeof nextTooltipButton !== "undefined" &&
      nextTooltipButton !== null
    ) {
      nextTooltipButton.className = `${this._options.buttonClass} introjs-nextbutton`;
      nextTooltipButton.innerHTML = this._options.nextLabel;
    }

    if (this._options.hidePrev === true) {
      if (
        typeof prevTooltipButton !== "undefined" &&
        prevTooltipButton !== null
      ) {
        prevTooltipButton.className = `${this._options.buttonClass} introjs-prevbutton introjs-hidden`;
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
        prevTooltipButton.className = `${this._options.buttonClass} introjs-prevbutton introjs-disabled`;
      }
    }
  } else if (
    this._introItems.length - 1 === this._currentStep ||
    this._introItems.length === 1
  ) {
    // last step of tour
    if (
      typeof prevTooltipButton !== "undefined" &&
      prevTooltipButton !== null
    ) {
      prevTooltipButton.className = `${this._options.buttonClass} introjs-prevbutton`;
    }

    if (this._options.hideNext === true) {
      if (
        typeof nextTooltipButton !== "undefined" &&
        nextTooltipButton !== null
      ) {
        nextTooltipButton.className = `${this._options.buttonClass} introjs-nextbutton introjs-hidden`;
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
        if (this._options.nextToDone === true) {
          nextTooltipButton.innerHTML = this._options.doneLabel;
          addClass(
            nextTooltipButton,
            `${this._options.buttonClass} introjs-nextbutton introjs-donebutton`
          );
        } else {
          nextTooltipButton.className = `${this._options.buttonClass} introjs-nextbutton introjs-disabled`;
        }
      }
    }
  } else {
    // steps between start and end
    if (
      typeof prevTooltipButton !== "undefined" &&
      prevTooltipButton !== null
    ) {
      prevTooltipButton.className = `${this._options.buttonClass} introjs-prevbutton`;
    }
    if (
      typeof nextTooltipButton !== "undefined" &&
      nextTooltipButton !== null
    ) {
      nextTooltipButton.className = `${this._options.buttonClass} introjs-nextbutton`;
      nextTooltipButton.innerHTML = this._options.nextLabel;
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

  setShowElement(targetElement);

  if (typeof this._introAfterChangeCallback !== "undefined") {
    await this._introAfterChangeCallback.call(this, targetElement.element);
  }
}
