import setShowElement from "../util/setShowElement";
import scrollParentToElement from "../util/scrollParentToElement";
import getScrollParent from "../util/getScrollParent";
import addClass from "../util/addClass";
import scrollTo from "../util/scrollTo";
import exitIntro from "./exitIntro";
import forEach from "../util/forEach";
import setAnchorAsButton from "../util/setAnchorAsButton";
import setHelperLayerPosition from "./setHelperLayerPosition";
import placeTooltip from "./placeTooltip";
import removeShowElement from "./removeShowElement";
import createElement from "../util/createElement";
import setStyle from "../util/setStyle";
import appendChild from "../util/appendChild";
import removeChild from "../util/removeChild";

/**
 * Gets the current progress percentage
 *
 * @api private
 * @this { import('./IntroJs').default }
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
 * @this { import('./IntroJs').default }
 * @method _disableInteraction
 */
function _disableInteraction() {
  let disableInteractionLayer = document.querySelector(
    ".introjs-disableInteraction"
  );

  if (disableInteractionLayer === null) {
    disableInteractionLayer = createElement("div", {
      className: "introjs-disableInteraction"
    });

    this._targetElement.appendChild(disableInteractionLayer);
  }

  setHelperLayerPosition.call(this, disableInteractionLayer);
}

/**
 * Show an element on the page
 *
 * @api private
 * @this { import('./IntroJs').default }
 * @method _showElement
 * @param {Object} targetElement
 */
export default function _showElement(targetElement) {
  if (typeof this._introChangeCallback !== "undefined") {
    this._introChangeCallback.call(this, targetElement.element);
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
  let scrollParent;

  //check for a current step highlight class
  if (typeof targetElement.highlightClass === "string") {
    highlightClass += ` ${targetElement.highlightClass}`;
  }
  //check for options highlight class
  if (typeof this._options.highlightClass === "string") {
    highlightClass += ` ${this._options.highlightClass}`;
  }

  if (oldHelperLayer !== null) {
    const oldHelperNumberLayer = oldReferenceLayer.querySelector(
      ".introjs-helperNumberLayer"
    );
    const oldtooltipLayer = oldReferenceLayer.querySelector(
      ".introjs-tooltiptext"
    );
    const oldArrowLayer = oldReferenceLayer.querySelector(".introjs-arrow");
    const oldtooltipContainer = oldReferenceLayer.querySelector(
      ".introjs-tooltip"
    );

    skipTooltipButton = oldReferenceLayer.querySelector(".introjs-skipbutton");
    prevTooltipButton = oldReferenceLayer.querySelector(".introjs-prevbutton");
    nextTooltipButton = oldReferenceLayer.querySelector(".introjs-nextbutton");

    //update or reset the helper highlight class
    oldHelperLayer.className = highlightClass;
    //hide the tooltip
    oldtooltipContainer.style.opacity = 0;
    oldtooltipContainer.style.display = "none";

    if (oldHelperNumberLayer !== null) {
      const lastIntroItem = this._introItems[
        targetElement.step - 2 >= 0 ? targetElement.step - 2 : 0
      ];

      if (
        (lastIntroItem !== null &&
          this._direction === "forward" &&
          lastIntroItem.position === "floating") ||
        (this._direction === "backward" &&
          targetElement.position === "floating")
      ) {
        oldHelperNumberLayer.style.opacity = 0;
      }
    }

    // scroll to element
    scrollParent = getScrollParent(targetElement.element);

    if (scrollParent !== document.body) {
      // target is within a scrollable element
      scrollParentToElement(scrollParent, targetElement.element);
    }

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
      //set current step to the label
      if (oldHelperNumberLayer !== null) {
        oldHelperNumberLayer.innerHTML = targetElement.step;
      }
      //set current tooltip text
      oldtooltipLayer.innerHTML = targetElement.intro;
      //set the tooltip position
      oldtooltipContainer.style.display = "block";
      placeTooltip.call(
        self,
        targetElement.element,
        oldtooltipContainer,
        oldArrowLayer,
        oldHelperNumberLayer
      );

      //change active bullet
      if (self._options.showBullets) {
        oldReferenceLayer.querySelector(
          ".introjs-bullets li > a.active"
        ).className = "";
        oldReferenceLayer.querySelector(
          `.introjs-bullets li > a[data-stepnumber="${targetElement.step}"]`
        ).className = "active";
      }
      oldReferenceLayer.querySelector(
        ".introjs-progress .introjs-progressbar"
      ).style.cssText = `width:${_getProgress.call(self)}%;`;
      oldReferenceLayer
        .querySelector(".introjs-progress .introjs-progressbar")
        .setAttribute("aria-valuenow", _getProgress.call(self));

      //show the tooltip
      oldtooltipContainer.style.opacity = 1;
      if (oldHelperNumberLayer) oldHelperNumberLayer.style.opacity = 1;

      //reset button focus
      if (
        typeof skipTooltipButton !== "undefined" &&
        skipTooltipButton !== null &&
        /introjs-donebutton/gi.test(skipTooltipButton.className)
      ) {
        // skip button is now "done" button
        skipTooltipButton.focus();
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
      className: highlightClass
    });
    const referenceLayer = createElement("div", {
      className: "introjs-tooltipReferenceLayer"
    });
    const arrowLayer = createElement("div", {
      className: "introjs-arrow"
    });
    const tooltipLayer = createElement("div", {
      className: "introjs-tooltip"
    });
    const tooltipTextLayer = createElement("div", {
      className: "introjs-tooltiptext"
    });
    const bulletsLayer = createElement("div", {
      className: "introjs-bullets"
    });
    const progressLayer = createElement("div", {
      className: "introjs-progress"
    });
    const buttonsLayer = createElement("div", {
      className: "introjs-tooltipbuttons"
    });

    // make sure these are cleaned up on exit
    this.once('exit', function () {
      removeChild(helperLayer, true);
      removeChild(referenceLayer)
    }, this)

    setStyle(helperLayer, {
      'box-shadow': `0 0 1px 2px rgba(33, 33, 33, 0.8), rgba(33, 33, 33, ${self._options.overlayOpacity.toString()}) 0 0 0 5000px`
    });

    // scroll to element
    scrollParent = getScrollParent(targetElement.element);

    if (scrollParent !== document.body) {
      // target is within a scrollable element
      scrollParentToElement(scrollParent, targetElement.element);
    }

    //set new position to helper layer
    setHelperLayerPosition.call(self, helperLayer);
    setHelperLayerPosition.call(self, referenceLayer);

    //add helper layer to target element
    appendChild(this._targetElement, helperLayer, true);
    appendChild(this._targetElement, referenceLayer);

    tooltipTextLayer.innerHTML = targetElement.intro;

    if (this._options.showBullets === false) {
      bulletsLayer.style.display = "none";
    }

    const ulContainer = createElement("ul");
    ulContainer.setAttribute("role", "tablist");

    const anchorClick = function () {
      self.goToStep(this.getAttribute("data-stepnumber"));
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
      anchorLink.setAttribute("data-stepnumber", step);

      innerLi.appendChild(anchorLink);
      ulContainer.appendChild(innerLi);
    });

    bulletsLayer.appendChild(ulContainer);

    if (this._options.showProgress === false) {
      progressLayer.style.display = "none";
    }

    const progressBar = createElement("div", {
      className: "introjs-progressbar"
    });

    if (this._options.progressBarAdditionalClass) {
      progressBar.className += ' ' + this._options.progressBarAdditionalClass;
    }
    progressBar.setAttribute("role", "progress");
    progressBar.setAttribute("aria-valuemin", 0);
    progressBar.setAttribute("aria-valuemax", 100);
    progressBar.setAttribute("aria-valuenow", _getProgress.call(this));
    progressBar.style.cssText = `width:${_getProgress.call(this)}%;`;

    progressLayer.appendChild(progressBar);

    if (this._options.showButtons === false) {
      buttonsLayer.style.display = "none";
    }

    tooltipLayer.appendChild(tooltipTextLayer);
    tooltipLayer.appendChild(bulletsLayer);
    tooltipLayer.appendChild(progressLayer);

    //add helper layer number
    const helperNumberLayer = createElement("span");

    if (this._options.showStepNumbers === true) {
      helperNumberLayer.className = "introjs-helperNumberLayer";
      helperNumberLayer.innerHTML = targetElement.step;
      referenceLayer.appendChild(helperNumberLayer);
    }

    tooltipLayer.appendChild(arrowLayer);
    referenceLayer.appendChild(tooltipLayer);

    //next button
    nextTooltipButton = createElement("a");

    nextTooltipButton.onclick = () => {
      if (this._introItems.length - 1 !== this._currentStep) {
        // defined and bound in index.js
        this.nextStep();
      }
    };

    setAnchorAsButton(nextTooltipButton);
    nextTooltipButton.innerHTML = this._options.nextLabel;

    //previous button
    prevTooltipButton = createElement("a");

    prevTooltipButton.onclick = () => {
      if (this._currentStep !== 0) {
        // defined and bound in index.js
        this.previousStep();
      }
    };

    setAnchorAsButton(prevTooltipButton);
    prevTooltipButton.innerHTML = this._options.prevLabel;

    //skip button
    skipTooltipButton = createElement("a", {
      className: `${this._options.buttonClass} introjs-skipbutton `
    });

    setAnchorAsButton(skipTooltipButton);
    skipTooltipButton.innerHTML = this._options.skipLabel;

    skipTooltipButton.onclick = () => {
      if (
        self._introItems.length - 1 === self._currentStep &&
        typeof self._introCompleteCallback === "function"
      ) {
        self._introCompleteCallback.call(self);
      }

      if (typeof self._introSkipCallback === "function") {
        self._introSkipCallback.call(self);
      }

      exitIntro.call(self, self._targetElement);
    };

    buttonsLayer.appendChild(skipTooltipButton);

    //in order to prevent displaying next/previous button always
    if (this._introItems.length > 1) {
      buttonsLayer.appendChild(prevTooltipButton);
      buttonsLayer.appendChild(nextTooltipButton);
    }

    tooltipLayer.appendChild(buttonsLayer);

    //set proper position
    placeTooltip.call(
      self,
      targetElement.element,
      tooltipLayer,
      arrowLayer,
      helperNumberLayer
    );

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
      typeof skipTooltipButton !== "undefined" &&
      skipTooltipButton !== null
    ) {
      skipTooltipButton.className = `${this._options.buttonClass} introjs-skipbutton`;
    }
    if (
      typeof nextTooltipButton !== "undefined" &&
      nextTooltipButton !== null
    ) {
      nextTooltipButton.className = `${this._options.buttonClass} introjs-nextbutton`;
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

    if (
      typeof skipTooltipButton !== "undefined" &&
      skipTooltipButton !== null
    ) {
      skipTooltipButton.innerHTML = this._options.skipLabel;
    }
  } else if (
    this._introItems.length - 1 === this._currentStep ||
    this._introItems.length === 1
  ) {
    // last step of tour
    if (
      typeof skipTooltipButton !== "undefined" &&
      skipTooltipButton !== null
    ) {
      skipTooltipButton.innerHTML = this._options.doneLabel;
      // adding donebutton class in addition to skipbutton
      addClass(skipTooltipButton, "introjs-donebutton");
    }
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
        nextTooltipButton.className = `${this._options.buttonClass} introjs-nextbutton introjs-disabled`;
      }
    }
  } else {
    // steps between start and end
    if (
      typeof skipTooltipButton !== "undefined" &&
      skipTooltipButton !== null
    ) {
      skipTooltipButton.className = `${this._options.buttonClass} introjs-skipbutton`;
    }
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
    }
    if (
      typeof skipTooltipButton !== "undefined" &&
      skipTooltipButton !== null
    ) {
      skipTooltipButton.innerHTML = this._options.skipLabel;
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
    this._introAfterChangeCallback.call(this, targetElement.element);
  }
}
