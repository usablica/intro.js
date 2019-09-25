import addClass from './util/addClass';
import addOverlayLayer from './util/addOverlayLayer';
import cloneObject from './util/cloneObject';
import forEach from './util/forEach';
import getOffset from './util/getOffset';
import getScrollParent from './util/getScrollParent';
import getWindowSize from './util/getWindowSize';
import isFixed from './util/isFixed';
import mergeOptions from './util/mergeOptions';
import removeClass from './util/removeClass';
import setShowElement from './util/setShowElement';
import scrollParentToElement from './util/scrollParentToElement';
import scrollTo from './util/scrollTo';
import stamp from './util/stamp';
import DOMEvent from './DOMEvent';
import {
  populateHints,
  hideHint,
  hideHints,
  showHint,
  showHints,
  removeHint,
  removeHints,
  showHintDialog,
  reAlignHints
} from './util/hint';

/**
 * Intro.js v2.9.3
 * https://github.com/usablica/intro.js
 *
 * Copyright (C) 2017 Afshin Mehrabani (@afshinmeh)
 */

  //Default config/variables
const VERSION = '2.9.3';

/**
 * IntroJs main class
 *
 * @class IntroJs
 */
function IntroJs(obj) {
  this._targetElement = obj;
  this._introItems = [];

  this._options = {
    /* Next button label in tooltip box */
    nextLabel: 'Next &rarr;',
    /* Previous button label in tooltip box */
    prevLabel: '&larr; Back',
    /* Skip button label in tooltip box */
    skipLabel: 'Skip',
    /* Done button label in tooltip box */
    doneLabel: 'Done',
    /* Hide previous button in the first step? Otherwise, it will be disabled button. */
    hidePrev: false,
    /* Hide next button in the last step? Otherwise, it will be disabled button. */
    hideNext: false,
    /* Default tooltip box position */
    tooltipPosition: 'bottom',
    /* Next CSS class for tooltip boxes */
    tooltipClass: '',
    /* CSS class that is added to the helperLayer */
    highlightClass: '',
    /* Close introduction when pressing Escape button? */
    exitOnEsc: true,
    /* Close introduction when clicking on overlay layer? */
    exitOnOverlayClick: true,
    /* Show step numbers in introduction? */
    showStepNumbers: true,
    /* Let user use keyboard to navigate the tour? */
    keyboardNavigation: true,
    /* Show tour control buttons? */
    showButtons: true,
    /* Show tour bullets? */
    showBullets: true,
    /* Show tour progress? */
    showProgress: false,
    /* Scroll to highlighted element? */
    scrollToElement: true,
    /*
     * Should we scroll the tooltip or target element?
     *
     * Options are: 'element' or 'tooltip'
     */
    scrollTo: 'element',
    /* Padding to add after scrolling when element is not in the viewport (in pixels) */
    scrollPadding: 30,
    /* Set the overlay opacity */
    overlayOpacity: 0.8,
    /* Precedence of positions, when auto is enabled */
    positionPrecedence: ["bottom", "top", "right", "left"],
    /* Disable an interaction with element? */
    disableInteraction: false,
    /* Set how much padding to be used around helper element */
    helperElementPadding: 10,
    /* Default hint position */
    hintPosition: 'top-middle',
    /* Hint button label */
    hintButtonLabel: 'Got it',
    /* Adding animation to hints? */
    hintAnimation: true,
    /* additional classes to put on the buttons */
    buttonClass: "introjs-button"
  };
}

/**
 * Initiate a new introduction/guide from an element in the page
 *
 * @api private
 * @method _introForElement
 * @param {Object} targetElm
 * @param {String} group
 * @returns {Boolean} Success or not?
 */
function _introForElement(targetElm, group) {
  const allIntroSteps = targetElm.querySelectorAll("*[data-intro]");
  let introItems = [];

  if (this._options.steps) {
    //use steps passed programmatically
    forEach(this._options.steps, step => {
      const currentItem = cloneObject(step);

      //set the step
      currentItem.step = introItems.length + 1;

      //use querySelector function only when developer used CSS selector
      if (typeof (currentItem.element) === 'string') {
        //grab the element with given selector from the page
        currentItem.element = document.querySelector(currentItem.element);
      }

      //intro without element
      if (typeof (currentItem.element) === 'undefined' || currentItem.element === null) {
        let floatingElementQuery = document.querySelector(".introjsFloatingElement");

        if (floatingElementQuery === null) {
          floatingElementQuery = document.createElement('div');
          floatingElementQuery.className = 'introjsFloatingElement';

          document.body.appendChild(floatingElementQuery);
        }

        currentItem.element = floatingElementQuery;
        currentItem.position = 'floating';
      }

      currentItem.scrollTo = currentItem.scrollTo || this._options.scrollTo;

      if (typeof (currentItem.disableInteraction) === 'undefined') {
        currentItem.disableInteraction = this._options.disableInteraction;
      }

      if (currentItem.element !== null) {
        introItems.push(currentItem);
      }
    });

  } else {
    //use steps from data-* annotations
    const elmsLength = allIntroSteps.length;
    let disableInteraction;

    //if there's no element to intro
    if (elmsLength < 1) {
      return false;
    }

    forEach(allIntroSteps, currentElement => {

      // PR #80
      // start intro for groups of elements
      if (group && (currentElement.getAttribute("data-intro-group") !== group)) {
        return;
      }

      // skip hidden elements
      if (currentElement.style.display === 'none') {
        return;
      }

      const step = parseInt(currentElement.getAttribute('data-step'), 10);

      if (typeof (currentElement.getAttribute('data-disable-interaction')) !== 'undefined') {
        disableInteraction = !!currentElement.getAttribute('data-disable-interaction');
      } else {
        disableInteraction = this._options.disableInteraction;
      }

      if (step > 0) {
        introItems[step - 1] = {
          element: currentElement,
          intro: currentElement.getAttribute('data-intro'),
          step: parseInt(currentElement.getAttribute('data-step'), 10),
          tooltipClass: currentElement.getAttribute('data-tooltipclass'),
          highlightClass: currentElement.getAttribute('data-highlightclass'),
          position: currentElement.getAttribute('data-position') || this._options.tooltipPosition,
          scrollTo: currentElement.getAttribute('data-scrollto') || this._options.scrollTo,
          disableInteraction
        };
      }
    });

    //next add intro items without data-step
    //todo: we need a cleanup here, two loops are redundant
    let nextStep = 0;

    forEach(allIntroSteps, currentElement => {

      // PR #80
      // start intro for groups of elements
      if (group && (currentElement.getAttribute("data-intro-group") !== group)) {
        return;
      }

      if (currentElement.getAttribute('data-step') === null) {

        while (true) {
          if (typeof introItems[nextStep] === 'undefined') {
            break;
          } else {
            nextStep++;
          }
        }

        if (typeof (currentElement.getAttribute('data-disable-interaction')) !== 'undefined') {
          disableInteraction = !!currentElement.getAttribute('data-disable-interaction');
        } else {
          disableInteraction = this._options.disableInteraction;
        }

        introItems[nextStep] = {
          element: currentElement,
          intro: currentElement.getAttribute('data-intro'),
          step: nextStep + 1,
          tooltipClass: currentElement.getAttribute('data-tooltipclass'),
          highlightClass: currentElement.getAttribute('data-highlightclass'),
          position: currentElement.getAttribute('data-position') || this._options.tooltipPosition,
          scrollTo: currentElement.getAttribute('data-scrollto') || this._options.scrollTo,
          disableInteraction
        };
      }
    });
  }

  //removing undefined/null elements
  const tempIntroItems = [];
  for (let z = 0; z < introItems.length; z++) {
    if (introItems[z]) {
      // copy non-falsy values to the end of the array
      tempIntroItems.push(introItems[z]);
    }
  }

  introItems = tempIntroItems;

  //Ok, sort all items with given steps
  introItems.sort((a, b) => a.step - b.step);

  //set it to the introJs object
  this._introItems = introItems;

  //add overlay layer to the page
  if (addOverlayLayer.call(this, targetElm)) {
    //then, start the show
    _nextStep.call(this);

    if (this._options.keyboardNavigation) {
      DOMEvent.on(window, 'keydown', _onKeyDown, this, true);
    }
    //for window resize
    DOMEvent.on(window, 'resize', _onResize, this, true);
  }
  return false;
}

function _onResize() {
  this.refresh.call(this);
}

/**
 * on keyCode:
 * https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/keyCode
 * This feature has been removed from the Web standards.
 * Though some browsers may still support it, it is in
 * the process of being dropped.
 * Instead, you should use KeyboardEvent.code,
 * if it's implemented.
 *
 * jQuery's approach is to test for
 *   (1) e.which, then
 *   (2) e.charCode, then
 *   (3) e.keyCode
 * https://github.com/jquery/jquery/blob/a6b0705294d336ae2f63f7276de0da1195495363/src/event.js#L638
 *
 * @param type var
 * @return type
 */
function _onKeyDown(e) {
  let code = (e.code === null) ? e.which : e.code;

  // if code/e.which is null
  if (code === null) {
    code = (e.charCode === null) ? e.keyCode : e.charCode;
  }

  if ((code === 'Escape' || code === 27) && this._options.exitOnEsc === true) {
    //escape key pressed, exit the intro
    //check if exit callback is defined
    _exitIntro.call(this, this._targetElement);
  } else if (code === 'ArrowLeft' || code === 37) {
    //left arrow
    _previousStep.call(this);
  } else if (code === 'ArrowRight' || code === 39) {
    //right arrow
    _nextStep.call(this);
  } else if (code === 'Enter' || code === 13) {
    //srcElement === ie
    const target = e.target || e.srcElement;
    if (target && target.className.match('introjs-prevbutton')) {
      //user hit enter while focusing on previous button
      _previousStep.call(this);
    } else if (target && target.className.match('introjs-skipbutton')) {
      //user hit enter while focusing on skip button
      if (this._introItems.length - 1 === this._currentStep && typeof (this._introCompleteCallback) === 'function') {
        this._introCompleteCallback.call(this);
      }

      _exitIntro.call(this, this._targetElement);
    } else if (target && target.getAttribute('data-stepnumber')) {
      // user hit enter while focusing on step bullet
      target.click();
    } else {
      //default behavior for responding to enter
      _nextStep.call(this);
    }

    //prevent default behaviour on hitting Enter, to prevent steps being skipped in some browsers
    if (e.preventDefault) {
      e.preventDefault();
    } else {
      e.returnValue = false;
    }
  }
}

/**
 * Go to specific step of introduction
 *
 * @api private
 * @method _goToStep
 */
function _goToStep(step) {
  //because steps starts with zero
  this._currentStep = step - 2;
  if (typeof (this._introItems) !== 'undefined') {
    _nextStep.call(this);
  }
}

/**
 * Go to the specific step of introduction with the explicit [data-step] number
 *
 * @api private
 * @method _goToStepNumber
 */
function _goToStepNumber(step) {
  this._currentStepNumber = step;
  if (typeof (this._introItems) !== 'undefined') {
    _nextStep.call(this);
  }
}

/**
 * Go to next step on intro
 *
 * @api private
 * @method _nextStep
 */
function _nextStep() {
  this._direction = 'forward';

  if (typeof (this._currentStepNumber) !== 'undefined') {
    forEach(this._introItems, ({step}, i) => {
      if (step === this._currentStepNumber) {
        this._currentStep = i - 1;
        this._currentStepNumber = undefined;
      }
    });
  }

  if (typeof (this._currentStep) === 'undefined') {
    this._currentStep = 0;
  } else {
    ++this._currentStep;
  }

  const nextStep = this._introItems[this._currentStep];
  let continueStep = true;

  if (typeof (this._introBeforeChangeCallback) !== 'undefined') {
    continueStep = this._introBeforeChangeCallback.call(this, nextStep.element);
  }

  // if `onbeforechange` returned `false`, stop displaying the element
  if (continueStep === false) {
    --this._currentStep;
    return false;
  }

  if ((this._introItems.length) <= this._currentStep) {
    //end of the intro
    //check if any callback is defined
    if (typeof (this._introCompleteCallback) === 'function') {
      this._introCompleteCallback.call(this);
    }
    _exitIntro.call(this, this._targetElement);
    return;
  }

  _showElement.call(this, nextStep);
}

/**
 * Go to previous step on intro
 *
 * @api private
 * @method _previousStep
 */
function _previousStep() {
  this._direction = 'backward';

  if (this._currentStep === 0) {
    return false;
  }

  --this._currentStep;

  const nextStep = this._introItems[this._currentStep];
  let continueStep = true;

  if (typeof (this._introBeforeChangeCallback) !== 'undefined') {
    continueStep = this._introBeforeChangeCallback.call(this, nextStep.element);
  }

  // if `onbeforechange` returned `false`, stop displaying the element
  if (continueStep === false) {
    ++this._currentStep;
    return false;
  }

  _showElement.call(this, nextStep);
}

/**
 * Update placement of the intro objects on the screen
 * @api private
 */
function _refresh() {
  // re-align intros
  _setHelperLayerPosition.call(this, document.querySelector('.introjs-helperLayer'));
  _setHelperLayerPosition.call(this, document.querySelector('.introjs-tooltipReferenceLayer'));
  _setHelperLayerPosition.call(this, document.querySelector('.introjs-disableInteraction'));

  // re-align tooltip
  if (this._currentStep !== undefined && this._currentStep !== null) {
    const oldHelperNumberLayer = document.querySelector('.introjs-helperNumberLayer');
    const oldArrowLayer = document.querySelector('.introjs-arrow');
    const oldtooltipContainer = document.querySelector('.introjs-tooltip');
    _placeTooltip.call(this, this._introItems[this._currentStep].element, oldtooltipContainer, oldArrowLayer, oldHelperNumberLayer);
  }

  //re-align hints
  reAlignHints.call(this);
  return this;
}

/**
 * Exit from intro
 *
 * @api private
 * @method _exitIntro
 * @param {Object} targetElement
 * @param {Boolean} force - Setting to `true` will skip the result of beforeExit callback
 */
function _exitIntro(targetElement, force) {
  let continueExit = true;

  // calling onbeforeexit callback
  //
  // If this callback return `false`, it would halt the process
  if (this._introBeforeExitCallback !== undefined) {
    continueExit = this._introBeforeExitCallback.call(this);
  }

  // skip this check if `force` parameter is `true`
  // otherwise, if `onbeforeexit` returned `false`, don't exit the intro
  if (!force && continueExit === false) return;

  //remove overlay layers from the page
  const overlayLayers = targetElement.querySelectorAll('.introjs-overlay');

  if (overlayLayers && overlayLayers.length) {
    forEach(overlayLayers, overlayLayer => {
      overlayLayer.style.opacity = 0;
      window.setTimeout(function () {
        if (this.parentNode) {
          this.parentNode.removeChild(this);
        }
      }.bind(overlayLayer), 500);
    });
  }

  //remove all helper layers
  const helperLayer = targetElement.querySelector('.introjs-helperLayer');
  if (helperLayer) {
    helperLayer.parentNode.removeChild(helperLayer);
  }

  const referenceLayer = targetElement.querySelector('.introjs-tooltipReferenceLayer');
  if (referenceLayer) {
    referenceLayer.parentNode.removeChild(referenceLayer);
  }

  //remove disableInteractionLayer
  const disableInteractionLayer = targetElement.querySelector('.introjs-disableInteraction');
  if (disableInteractionLayer) {
    disableInteractionLayer.parentNode.removeChild(disableInteractionLayer);
  }

  //remove intro floating element
  const floatingElement = document.querySelector('.introjsFloatingElement');
  if (floatingElement) {
    floatingElement.parentNode.removeChild(floatingElement);
  }

  _removeShowElement();

  //remove `introjs-fixParent` class from the elements
  const fixParents = document.querySelectorAll('.introjs-fixParent');
  forEach(fixParents, parent => {
    removeClass(parent, /introjs-fixParent/g);
  });

  //clean listeners
  DOMEvent.off(window, 'keydown', _onKeyDown, this, true);
  DOMEvent.off(window, 'resize', _onResize, this, true);

  //check if any callback is defined
  if (this._introExitCallback !== undefined) {
    this._introExitCallback.call(this);
  }

  //set the step to zero
  this._currentStep = undefined;
}

/**
 * Render tooltip box in the page
 *
 * @api private
 * @method _placeTooltip
 * @param {HTMLElement} targetElement
 * @param {HTMLElement} tooltipLayer
 * @param {HTMLElement} arrowLayer
 * @param {HTMLElement} helperNumberLayer
 * @param {Boolean} hintMode
 */
function _placeTooltip(targetElement, tooltipLayer, arrowLayer, helperNumberLayer, hintMode) {
  let tooltipCssClass = '';
  let currentStepObj;
  let tooltipOffset;
  let targetOffset;
  let windowSize;
  let currentTooltipPosition;

  hintMode = hintMode || false;

  //reset the old style
  tooltipLayer.style.top = null;
  tooltipLayer.style.right = null;
  tooltipLayer.style.bottom = null;
  tooltipLayer.style.left = null;
  tooltipLayer.style.marginLeft = null;
  tooltipLayer.style.marginTop = null;

  arrowLayer.style.display = 'inherit';

  if (typeof (helperNumberLayer) !== 'undefined' && helperNumberLayer !== null) {
    helperNumberLayer.style.top = null;
    helperNumberLayer.style.left = null;
  }

  //prevent error when `this._currentStep` is undefined
  if (!this._introItems[this._currentStep]) return;

  //if we have a custom css class for each step
  currentStepObj = this._introItems[this._currentStep];
  if (typeof (currentStepObj.tooltipClass) === 'string') {
    tooltipCssClass = currentStepObj.tooltipClass;
  } else {
    tooltipCssClass = this._options.tooltipClass;
  }

  tooltipLayer.className = (`introjs-tooltip ${tooltipCssClass}`).replace(/^\s+|\s+$/g, '');
  tooltipLayer.setAttribute('role', 'dialog');

  currentTooltipPosition = this._introItems[this._currentStep].position;

  // Floating is always valid, no point in calculating
  if (currentTooltipPosition !== "floating") {
    currentTooltipPosition = _determineAutoPosition.call(this, targetElement, tooltipLayer, currentTooltipPosition);
  }

  let tooltipLayerStyleLeft;
  targetOffset = getOffset(targetElement);
  tooltipOffset = getOffset(tooltipLayer);
  windowSize = getWindowSize();

  addClass(tooltipLayer, `introjs-${currentTooltipPosition}`);

  switch (currentTooltipPosition) {
    case 'top-right-aligned':
      arrowLayer.className = 'introjs-arrow bottom-right';

      let tooltipLayerStyleRight = 0;
      _checkLeft(targetOffset, tooltipLayerStyleRight, tooltipOffset, tooltipLayer);
      tooltipLayer.style.bottom = `${targetOffset.height + 20}px`;
      break;

    case 'top-middle-aligned':
      arrowLayer.className = 'introjs-arrow bottom-middle';

      let tooltipLayerStyleLeftRight = targetOffset.width / 2 - tooltipOffset.width / 2;

      // a fix for middle aligned hints
      if (hintMode) {
        tooltipLayerStyleLeftRight += 5;
      }

      if (_checkLeft(targetOffset, tooltipLayerStyleLeftRight, tooltipOffset, tooltipLayer)) {
        tooltipLayer.style.right = null;
        _checkRight(targetOffset, tooltipLayerStyleLeftRight, tooltipOffset, windowSize, tooltipLayer);
      }
      tooltipLayer.style.bottom = `${targetOffset.height + 20}px`;
      break;

    case 'top-left-aligned':
    // top-left-aligned is the same as the default top
    case 'top':
      arrowLayer.className = 'introjs-arrow bottom';

      tooltipLayerStyleLeft = (hintMode) ? 0 : 15;

      _checkRight(targetOffset, tooltipLayerStyleLeft, tooltipOffset, windowSize, tooltipLayer);
      tooltipLayer.style.bottom = `${targetOffset.height + 20}px`;
      break;
    case 'right':
      tooltipLayer.style.left = `${targetOffset.width + 20}px`;
      if (targetOffset.top + tooltipOffset.height > windowSize.height) {
        // In this case, right would have fallen below the bottom of the screen.
        // Modify so that the bottom of the tooltip connects with the target
        arrowLayer.className = "introjs-arrow left-bottom";
        tooltipLayer.style.top = `-${tooltipOffset.height - targetOffset.height - 20}px`;
      } else {
        arrowLayer.className = 'introjs-arrow left';
      }
      break;
    case 'left':
      if (!hintMode && this._options.showStepNumbers === true) {
        tooltipLayer.style.top = '15px';
      }

      if (targetOffset.top + tooltipOffset.height > windowSize.height) {
        // In this case, left would have fallen below the bottom of the screen.
        // Modify so that the bottom of the tooltip connects with the target
        tooltipLayer.style.top = `-${tooltipOffset.height - targetOffset.height - 20}px`;
        arrowLayer.className = 'introjs-arrow right-bottom';
      } else {
        arrowLayer.className = 'introjs-arrow right';
      }
      tooltipLayer.style.right = `${targetOffset.width + 20}px`;

      break;
    case 'floating':
      arrowLayer.style.display = 'none';

      //we have to adjust the top and left of layer manually for intro items without element
      tooltipLayer.style.left = '50%';
      tooltipLayer.style.top = '50%';
      tooltipLayer.style.marginLeft = `-${tooltipOffset.width / 2}px`;
      tooltipLayer.style.marginTop = `-${tooltipOffset.height / 2}px`;

      if (typeof (helperNumberLayer) !== 'undefined' && helperNumberLayer !== null) {
        helperNumberLayer.style.left = `-${(tooltipOffset.width / 2) + 18}px`;
        helperNumberLayer.style.top = `-${(tooltipOffset.height / 2) + 18}px`;
      }

      break;
    case 'bottom-right-aligned':
      arrowLayer.className = 'introjs-arrow top-right';

      tooltipLayerStyleRight = 0;
      _checkLeft(targetOffset, tooltipLayerStyleRight, tooltipOffset, tooltipLayer);
      tooltipLayer.style.top = `${targetOffset.height + 20}px`;
      break;

    case 'bottom-middle-aligned':
      arrowLayer.className = 'introjs-arrow top-middle';

      tooltipLayerStyleLeftRight = targetOffset.width / 2 - tooltipOffset.width / 2;

      // a fix for middle aligned hints
      if (hintMode) {
        tooltipLayerStyleLeftRight += 5;
      }

      if (_checkLeft(targetOffset, tooltipLayerStyleLeftRight, tooltipOffset, tooltipLayer)) {
        tooltipLayer.style.right = null;
        _checkRight(targetOffset, tooltipLayerStyleLeftRight, tooltipOffset, windowSize, tooltipLayer);
      }
      tooltipLayer.style.top = `${targetOffset.height + 20}px`;
      break;

    // case 'bottom-left-aligned':
    // Bottom-left-aligned is the same as the default bottom
    // case 'bottom':
    // Bottom going to follow the default behavior
    default:
      arrowLayer.className = 'introjs-arrow top';

      tooltipLayerStyleLeft = 0;
      _checkRight(targetOffset, tooltipLayerStyleLeft, tooltipOffset, windowSize, tooltipLayer);
      tooltipLayer.style.top = `${targetOffset.height + 20}px`;
  }
}

/**
 * Set tooltip left so it doesn't go off the right side of the window
 *
 * @return boolean true, if tooltipLayerStyleLeft is ok.  false, otherwise.
 */
function _checkRight(targetOffset, tooltipLayerStyleLeft, tooltipOffset, windowSize, tooltipLayer) {
  if (targetOffset.left + tooltipLayerStyleLeft + tooltipOffset.width > windowSize.width) {
    // off the right side of the window
    tooltipLayer.left = `${windowSize.width - tooltipOffset.width - targetOffset.left}px`;
    return false;
  }
  tooltipLayer.left = `${tooltipLayerStyleLeft}px`;
  return true;
}

/**
 * Set tooltip right so it doesn't go off the left side of the window
 *
 * @return boolean true, if tooltipLayerStyleRight is ok.  false, otherwise.
 */
function _checkLeft(targetOffset, tooltipLayerStyleRight, tooltipOffset, tooltipLayer) {
  if (targetOffset.left + targetOffset.width - tooltipLayerStyleRight - tooltipOffset.width < 0) {
    // off the left side of the window
    tooltipLayer.style.left = `${-targetOffset.left}px`;
    return false;
  }
  tooltipLayer.style.right = `${tooltipLayerStyleRight}px`;
  return true;
}

/**
 * Determines the position of the tooltip based on the position precedence and availability
 * of screen space.
 *
 * @param {Object}    targetElement
 * @param {Object}    tooltipLayer
 * @param {String}    desiredTooltipPosition
 * @return {String}   calculatedPosition
 */
function _determineAutoPosition(targetElement, tooltipLayer, desiredTooltipPosition) {

  // Take a clone of position precedence. These will be the available
  const possiblePositions = this._options.positionPrecedence.slice();

  const windowSize = getWindowSize();
  const tooltipHeight = getOffset(tooltipLayer).height + 10;
  const tooltipWidth = getOffset(tooltipLayer).width + 20;
  const targetElementRect = targetElement.getBoundingClientRect();

  // If we check all the possible areas, and there are no valid places for the tooltip, the element
  // must take up most of the screen real estate. Show the tooltip floating in the middle of the screen.
  let calculatedPosition = "floating";

  /*
  * auto determine position
  */

  // Check for space below
  if (targetElementRect.bottom + tooltipHeight > windowSize.height) {
    _removeEntry(possiblePositions, "bottom");
  }

  // Check for space above
  if (targetElementRect.top - tooltipHeight < 0) {
    _removeEntry(possiblePositions, "top");
  }

  // Check for space to the right
  if (targetElementRect.right + tooltipWidth > windowSize.width) {
    _removeEntry(possiblePositions, "right");
  }

  // Check for space to the left
  if (targetElementRect.left - tooltipWidth < 0) {
    _removeEntry(possiblePositions, "left");
  }

  // @var {String}  ex: 'right-aligned'
  const desiredAlignment = (pos => {
    const hyphenIndex = pos.indexOf('-');
    if (hyphenIndex !== -1) {
      // has alignment
      return pos.substr(hyphenIndex);
    }
    return '';
  })(desiredTooltipPosition || '');

  // strip alignment from position
  if (desiredTooltipPosition) {
    // ex: "bottom-right-aligned"
    // should return 'bottom'
    desiredTooltipPosition = desiredTooltipPosition.split('-')[0];
  }

  if (possiblePositions.length) {
    if (desiredTooltipPosition !== "auto" &&
      possiblePositions.includes(desiredTooltipPosition)) {
      // If the requested position is in the list, choose that
      calculatedPosition = desiredTooltipPosition;
    } else {
      // Pick the first valid position, in order
      calculatedPosition = possiblePositions[0];
    }
  }

  // only top and bottom positions have optional alignments
  if (['top', 'bottom'].includes(calculatedPosition)) {
    calculatedPosition += _determineAutoAlignment(targetElementRect.left, tooltipWidth, windowSize, desiredAlignment);
  }

  return calculatedPosition;
}

/**
 * auto-determine alignment
 * @param {Integer}  offsetLeft
 * @param {Integer}  tooltipWidth
 * @param {Object}   windowSize
 * @param {String}   desiredAlignment
 * @return {String}  calculatedAlignment
 */
function _determineAutoAlignment(offsetLeft, tooltipWidth, {width}, desiredAlignment) {
  const halfTooltipWidth = tooltipWidth / 2;
  const winWidth = Math.min(width, window.screen.width);
  const possibleAlignments = ['-left-aligned', '-middle-aligned', '-right-aligned'];
  let calculatedAlignment = '';

  // valid left must be at least a tooltipWidth
  // away from right side
  if (winWidth - offsetLeft < tooltipWidth) {
    _removeEntry(possibleAlignments, '-left-aligned');
  }

  // valid middle must be at least half
  // width away from both sides
  if (offsetLeft < halfTooltipWidth ||
    winWidth - offsetLeft < halfTooltipWidth) {
    _removeEntry(possibleAlignments, '-middle-aligned');
  }

  // valid right must be at least a tooltipWidth
  // width away from left side
  if (offsetLeft < tooltipWidth) {
    _removeEntry(possibleAlignments, '-right-aligned');
  }

  if (possibleAlignments.length) {
    if (possibleAlignments.includes(desiredAlignment)) {
      // the desired alignment is valid
      calculatedAlignment = desiredAlignment;
    } else {
      // pick the first valid position, in order
      calculatedAlignment = possibleAlignments[0];
    }
  } else {
    // if screen width is too small
    // for ANY alignment, middle is
    // probably the best for visibility
    calculatedAlignment = '-middle-aligned';
  }

  return calculatedAlignment;
}

/**
 * Remove an entry from a string array if it's there, does nothing if it isn't there.
 *
 * @param {Array} stringArray
 * @param {String} stringToRemove
 */
function _removeEntry(stringArray, stringToRemove) {
  if (stringArray.includes(stringToRemove)) {
    stringArray.splice(stringArray.indexOf(stringToRemove), 1);
  }
}

/**
 * Update the position of the helper layer on the screen
 *
 * @api private
 * @method _setHelperLayerPosition
 * @param {Object} helperLayer
 */
function _setHelperLayerPosition(helperLayer) {
  if (helperLayer) {
    //prevent error when `this._currentStep` in undefined
    if (!this._introItems[this._currentStep]) return;

    const currentElement = this._introItems[this._currentStep];
    const elementPosition = getOffset(currentElement.element);
    let widthHeightPadding = this._options.helperElementPadding;

    // If the target element is fixed, the tooltip should be fixed as well.
    // Otherwise, remove a fixed class that may be left over from the previous
    // step.
    if (isFixed(currentElement.element)) {
      addClass(helperLayer, 'introjs-fixedTooltip');
    } else {
      removeClass(helperLayer, 'introjs-fixedTooltip');
    }

    if (currentElement.position === 'floating') {
      widthHeightPadding = 0;
    }

    //set new position to helper layer
    helperLayer.style.cssText = `width: ${elementPosition.width + widthHeightPadding}px; height:${elementPosition.height + widthHeightPadding}px; top:${elementPosition.top - widthHeightPadding / 2}px;left: ${elementPosition.left - widthHeightPadding / 2}px;`;
  }
}

/**
 * Add disableinteraction layer and adjust the size and position of the layer
 *
 * @api private
 * @method _disableInteraction
 */
function _disableInteraction() {
  let disableInteractionLayer = document.querySelector('.introjs-disableInteraction');

  if (disableInteractionLayer === null) {
    disableInteractionLayer = document.createElement('div');
    disableInteractionLayer.className = 'introjs-disableInteraction';
    this._targetElement.appendChild(disableInteractionLayer);
  }

  _setHelperLayerPosition.call(this, disableInteractionLayer);
}

/**
 * Setting anchors to behave like buttons
 *
 * @api private
 * @method _setAnchorAsButton
 */
function _setAnchorAsButton(anchor) {
  anchor.setAttribute('role', 'button');
  anchor.tabIndex = 0;
}

/**
 * Show an element on the page
 *
 * @api private
 * @method _showElement
 * @param {Object} targetElement
 */
function _showElement(targetElement) {
  if (typeof (this._introChangeCallback) !== 'undefined') {
    this._introChangeCallback.call(this, targetElement.element);
  }

  const self = this;
  const oldHelperLayer = document.querySelector('.introjs-helperLayer');
  const oldReferenceLayer = document.querySelector('.introjs-tooltipReferenceLayer');
  let highlightClass = 'introjs-helperLayer';
  let nextTooltipButton;
  let prevTooltipButton;
  let skipTooltipButton;
  let scrollParent;

  //check for a current step highlight class
  if (typeof (targetElement.highlightClass) === 'string') {
    highlightClass += (` ${targetElement.highlightClass}`);
  }
  //check for options highlight class
  if (typeof (this._options.highlightClass) === 'string') {
    highlightClass += (` ${this._options.highlightClass}`);
  }

  if (oldHelperLayer !== null) {
    const oldHelperNumberLayer = oldReferenceLayer.querySelector('.introjs-helperNumberLayer');
    const oldtooltipLayer = oldReferenceLayer.querySelector('.introjs-tooltiptext');
    const oldArrowLayer = oldReferenceLayer.querySelector('.introjs-arrow');
    const oldtooltipContainer = oldReferenceLayer.querySelector('.introjs-tooltip');

    skipTooltipButton = oldReferenceLayer.querySelector('.introjs-skipbutton');
    prevTooltipButton = oldReferenceLayer.querySelector('.introjs-prevbutton');
    nextTooltipButton = oldReferenceLayer.querySelector('.introjs-nextbutton');

    //update or reset the helper highlight class
    oldHelperLayer.className = highlightClass;
    //hide the tooltip
    oldtooltipContainer.style.opacity = 0;
    oldtooltipContainer.style.display = "none";

    if (oldHelperNumberLayer !== null) {
      const lastIntroItem = this._introItems[(targetElement.step - 2 >= 0 ? targetElement.step - 2 : 0)];

      if (lastIntroItem !== null && (this._direction === 'forward' && lastIntroItem.position === 'floating') || (this._direction === 'backward' && targetElement.position === 'floating')) {
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
    _setHelperLayerPosition.call(self, oldHelperLayer);
    _setHelperLayerPosition.call(self, oldReferenceLayer);

    //remove `introjs-fixParent` class from the elements
    const fixParents = document.querySelectorAll('.introjs-fixParent');
    forEach(fixParents, parent => {
      removeClass(parent, /introjs-fixParent/g);
    });

    //remove old classes if the element still exist
    _removeShowElement();

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
      _placeTooltip.call(self, targetElement.element, oldtooltipContainer, oldArrowLayer, oldHelperNumberLayer);

      //change active bullet
      if (self._options.showBullets) {
        oldReferenceLayer.querySelector('.introjs-bullets li > a.active').className = '';
        oldReferenceLayer.querySelector(`.introjs-bullets li > a[data-stepnumber="${targetElement.step}"]`).className = 'active';
      }
      oldReferenceLayer.querySelector('.introjs-progress .introjs-progressbar').style.cssText = `width:${_getProgress.call(self)}%;`;
      oldReferenceLayer.querySelector('.introjs-progress .introjs-progressbar').setAttribute('aria-valuenow', _getProgress.call(self));

      //show the tooltip
      oldtooltipContainer.style.opacity = 1;
      if (oldHelperNumberLayer) oldHelperNumberLayer.style.opacity = 1;

      //reset button focus
      if (typeof skipTooltipButton !== "undefined" && skipTooltipButton !== null && /introjs-donebutton/gi.test(skipTooltipButton.className)) {
        // skip button is now "done" button
        skipTooltipButton.focus();
      } else if (typeof nextTooltipButton !== "undefined" && nextTooltipButton !== null) {
        //still in the tour, focus on next
        nextTooltipButton.focus();
      }

      // change the scroll of the window, if needed
      scrollTo.call(self, targetElement.scrollTo, targetElement, oldtooltipLayer);
    }, 350);

    // end of old element if-else condition
  } else {
    const helperLayer = document.createElement('div');
    const referenceLayer = document.createElement('div');
    const arrowLayer = document.createElement('div');
    const tooltipLayer = document.createElement('div');
    const tooltipTextLayer = document.createElement('div');
    const bulletsLayer = document.createElement('div');
    const progressLayer = document.createElement('div');
    const buttonsLayer = document.createElement('div');

    helperLayer.className = highlightClass;
    referenceLayer.className = 'introjs-tooltipReferenceLayer';

    // scroll to element
    scrollParent = getScrollParent(targetElement.element);

    if (scrollParent !== document.body) {
      // target is within a scrollable element
      scrollParentToElement(scrollParent, targetElement.element);
    }

    //set new position to helper layer
    _setHelperLayerPosition.call(self, helperLayer);
    _setHelperLayerPosition.call(self, referenceLayer);

    //add helper layer to target element
    this._targetElement.appendChild(helperLayer);
    this._targetElement.appendChild(referenceLayer);

    arrowLayer.className = 'introjs-arrow';

    tooltipTextLayer.className = 'introjs-tooltiptext';
    tooltipTextLayer.innerHTML = targetElement.intro;

    bulletsLayer.className = 'introjs-bullets';

    if (this._options.showBullets === false) {
      bulletsLayer.style.display = 'none';
    }

    const ulContainer = document.createElement('ul');
    ulContainer.setAttribute('role', 'tablist');

    const anchorClick = function () {
      self.goToStep(this.getAttribute('data-stepnumber'));
    };

    forEach(this._introItems, ({step}, i) => {
      const innerLi = document.createElement('li');
      const anchorLink = document.createElement('a');

      innerLi.setAttribute('role', 'presentation');
      anchorLink.setAttribute('role', 'tab');

      anchorLink.onclick = anchorClick;

      if (i === (targetElement.step - 1)) {
        anchorLink.className = 'active';
      }

      _setAnchorAsButton(anchorLink);
      anchorLink.innerHTML = "&nbsp;";
      anchorLink.setAttribute('data-stepnumber', step);

      innerLi.appendChild(anchorLink);
      ulContainer.appendChild(innerLi);
    });

    bulletsLayer.appendChild(ulContainer);

    progressLayer.className = 'introjs-progress';

    if (this._options.showProgress === false) {
      progressLayer.style.display = 'none';
    }
    const progressBar = document.createElement('div');
    progressBar.className = 'introjs-progressbar';
    progressBar.setAttribute('role', 'progress');
    progressBar.setAttribute('aria-valuemin', 0);
    progressBar.setAttribute('aria-valuemax', 100);
    progressBar.setAttribute('aria-valuenow', _getProgress.call(this));
    progressBar.style.cssText = `width:${_getProgress.call(this)}%;`;

    progressLayer.appendChild(progressBar);

    buttonsLayer.className = 'introjs-tooltipbuttons';
    if (this._options.showButtons === false) {
      buttonsLayer.style.display = 'none';
    }

    tooltipLayer.className = 'introjs-tooltip';
    tooltipLayer.appendChild(tooltipTextLayer);
    tooltipLayer.appendChild(bulletsLayer);
    tooltipLayer.appendChild(progressLayer);

    //add helper layer number
    const helperNumberLayer = document.createElement('span');
    if (this._options.showStepNumbers === true) {
      helperNumberLayer.className = 'introjs-helperNumberLayer';
      helperNumberLayer.innerHTML = targetElement.step;
      referenceLayer.appendChild(helperNumberLayer);
    }

    tooltipLayer.appendChild(arrowLayer);
    referenceLayer.appendChild(tooltipLayer);

    //next button
    nextTooltipButton = document.createElement('a');

    nextTooltipButton.onclick = () => {
      if (self._introItems.length - 1 !== self._currentStep) {
        _nextStep.call(self);
      }
    };

    _setAnchorAsButton(nextTooltipButton);
    nextTooltipButton.innerHTML = this._options.nextLabel;

    //previous button
    prevTooltipButton = document.createElement('a');

    prevTooltipButton.onclick = () => {
      if (self._currentStep !== 0) {
        _previousStep.call(self);
      }
    };

    _setAnchorAsButton(prevTooltipButton);
    prevTooltipButton.innerHTML = this._options.prevLabel;

    //skip button
    skipTooltipButton = document.createElement('a');
    skipTooltipButton.className = `${this._options.buttonClass} introjs-skipbutton `;
    _setAnchorAsButton(skipTooltipButton);
    skipTooltipButton.innerHTML = this._options.skipLabel;

    skipTooltipButton.onclick = () => {
      if (self._introItems.length - 1 === self._currentStep && typeof (self._introCompleteCallback) === 'function') {
        self._introCompleteCallback.call(self);
      }

      if (self._introItems.length - 1 !== self._currentStep && typeof (self._introExitCallback) === 'function') {
        self._introExitCallback.call(self);
      }

      if (typeof (self._introSkipCallback) === 'function') {
        self._introSkipCallback.call(self);
      }

      _exitIntro.call(self, self._targetElement);
    };

    buttonsLayer.appendChild(skipTooltipButton);

    //in order to prevent displaying next/previous button always
    if (this._introItems.length > 1) {
      buttonsLayer.appendChild(prevTooltipButton);
      buttonsLayer.appendChild(nextTooltipButton);
    }

    tooltipLayer.appendChild(buttonsLayer);

    //set proper position
    _placeTooltip.call(self, targetElement.element, tooltipLayer, arrowLayer, helperNumberLayer);

    // change the scroll of the window, if needed
    scrollTo.call(this, targetElement.scrollTo, targetElement, tooltipLayer);

    //end of new element if-else condition
  }

  // removing previous disable interaction layer
  const disableInteractionLayer = self._targetElement.querySelector('.introjs-disableInteraction');
  if (disableInteractionLayer) {
    disableInteractionLayer.parentNode.removeChild(disableInteractionLayer);
  }

  //disable interaction
  if (targetElement.disableInteraction) {
    _disableInteraction.call(self);
  }

  // when it's the first step of tour
  if (this._currentStep === 0 && this._introItems.length > 1) {
    if (typeof skipTooltipButton !== "undefined" && skipTooltipButton !== null) {
      skipTooltipButton.className = `${this._options.buttonClass} introjs-skipbutton`;
    }
    if (typeof nextTooltipButton !== "undefined" && nextTooltipButton !== null) {
      nextTooltipButton.className = `${this._options.buttonClass} introjs-nextbutton`;
    }

    if (this._options.hidePrev === true) {
      if (typeof prevTooltipButton !== "undefined" && prevTooltipButton !== null) {
        prevTooltipButton.className = `${this._options.buttonClass} introjs-prevbutton introjs-hidden`;
      }
      if (typeof nextTooltipButton !== "undefined" && nextTooltipButton !== null) {
        addClass(nextTooltipButton, 'introjs-fullbutton');
      }
    } else {
      if (typeof prevTooltipButton !== "undefined" && prevTooltipButton !== null) {
        prevTooltipButton.className = `${this._options.buttonClass} introjs-prevbutton introjs-disabled`;
      }
    }

    if (typeof skipTooltipButton !== "undefined" && skipTooltipButton !== null) {
      skipTooltipButton.innerHTML = this._options.skipLabel;
    }
  } else if (this._introItems.length - 1 === this._currentStep || this._introItems.length === 1) {
    // last step of tour
    if (typeof skipTooltipButton !== "undefined" && skipTooltipButton !== null) {
      skipTooltipButton.innerHTML = this._options.doneLabel;
      // adding donebutton class in addition to skipbutton
      addClass(skipTooltipButton, 'introjs-donebutton');
    }
    if (typeof prevTooltipButton !== "undefined" && prevTooltipButton !== null) {
      prevTooltipButton.className = `${this._options.buttonClass} introjs-prevbutton`;
    }

    if (this._options.hideNext === true) {
      if (typeof nextTooltipButton !== "undefined" && nextTooltipButton !== null) {
        nextTooltipButton.className = `${this._options.buttonClass} introjs-nextbutton introjs-hidden`;
      }
      if (typeof prevTooltipButton !== "undefined" && prevTooltipButton !== null) {
        addClass(prevTooltipButton, 'introjs-fullbutton');
      }
    } else {
      if (typeof nextTooltipButton !== "undefined" && nextTooltipButton !== null) {
        nextTooltipButton.className = `${this._options.buttonClass} introjs-nextbutton introjs-disabled`;
      }
    }
  } else {
    // steps between start and end
    if (typeof skipTooltipButton !== "undefined" && skipTooltipButton !== null) {
      skipTooltipButton.className = `${this._options.buttonClass} introjs-skipbutton`;
    }
    if (typeof prevTooltipButton !== "undefined" && prevTooltipButton !== null) {
      prevTooltipButton.className = `${this._options.buttonClass} introjs-prevbutton`;
    }
    if (typeof nextTooltipButton !== "undefined" && nextTooltipButton !== null) {
      nextTooltipButton.className = `${this._options.buttonClass} introjs-nextbutton`;
    }
    if (typeof skipTooltipButton !== "undefined" && skipTooltipButton !== null) {
      skipTooltipButton.innerHTML = this._options.skipLabel;
    }
  }

  prevTooltipButton.setAttribute('role', 'button');
  nextTooltipButton.setAttribute('role', 'button');
  skipTooltipButton.setAttribute('role', 'button');

  //Set focus on "next" button, so that hitting Enter always moves you onto the next step
  if (typeof nextTooltipButton !== "undefined" && nextTooltipButton !== null) {
    nextTooltipButton.focus();
  }

  setShowElement(targetElement);

  if (typeof (this._introAfterChangeCallback) !== 'undefined') {
    this._introAfterChangeCallback.call(this, targetElement.element);
  }
}

/**
 * To remove all show element(s)
 *
 * @api private
 * @method _removeShowElement
 */
function _removeShowElement() {
  const elms = document.querySelectorAll('.introjs-showElement');

  forEach(elms, elm => {
    removeClass(elm, /introjs-[a-zA-Z]+/g);
  });
}


/**
 * Gets the current progress percentage
 *
 * @api private
 * @method _getProgress
 * @returns current progress percentage
 */
function _getProgress() {
  // Steps are 0 indexed
  const currentStep = parseInt((this._currentStep + 1), 10);
  return ((currentStep / this._introItems.length) * 100);
}

const introJs = targetElm => {
  let instance;

  if (typeof (targetElm) === 'object') {
    //Ok, create a new instance
    instance = new IntroJs(targetElm);

  } else if (typeof (targetElm) === 'string') {
    //select the target element with query selector
    const targetElement = document.querySelector(targetElm);

    if (targetElement) {
      instance = new IntroJs(targetElement);
    } else {
      throw new Error('There is no element with given selector.');
    }
  } else {
    instance = new IntroJs(document.body);
  }
  // add instance to list of _instances
  // passing group to stamp to increment
  // from 0 onward somewhat reliably
  introJs.instances[stamp(instance, 'introjs-instance')] = instance;

  return instance;
};

/**
 * Current IntroJs version
 *
 * @property version
 * @type String
 */
introJs.version = VERSION;

/**
 * key-val object helper for introJs instances
 *
 * @property instances
 * @type Object
 */
introJs.instances = {};

//Prototype
introJs.fn = IntroJs.prototype = {
  clone() {
    return new IntroJs(this);
  },
  setOption(option, value) {
    this._options[option] = value;
    return this;
  },
  setOptions(options) {
    this._options = mergeOptions(this._options, options);
    return this;
  },
  start(group) {
    _introForElement.call(this, this._targetElement, group);
    return this;
  },
  goToStep(step) {
    _goToStep.call(this, step);
    return this;
  },
  addStep(options) {
    if (!this._options.steps) {
      this._options.steps = [];
    }

    this._options.steps.push(options);

    return this;
  },
  addSteps(steps) {
    if (!steps.length) return;

    for (let index = 0; index < steps.length; index++) {
      this.addStep(steps[index]);
    }

    return this;
  },
  goToStepNumber(step) {
    _goToStepNumber.call(this, step);

    return this;
  },
  nextStep() {
    _nextStep.call(this);
    return this;
  },
  previousStep() {
    _previousStep.call(this);
    return this;
  },
  exit(force) {
    _exitIntro.call(this, this._targetElement, force);
    return this;
  },
  refresh() {
    _refresh.call(this);
    return this;
  },
  onbeforechange(providedCallback) {
    if (typeof (providedCallback) === 'function') {
      this._introBeforeChangeCallback = providedCallback;
    } else {
      throw new Error('Provided callback for onbeforechange was not a function');
    }
    return this;
  },
  onchange(providedCallback) {
    if (typeof (providedCallback) === 'function') {
      this._introChangeCallback = providedCallback;
    } else {
      throw new Error('Provided callback for onchange was not a function.');
    }
    return this;
  },
  onafterchange(providedCallback) {
    if (typeof (providedCallback) === 'function') {
      this._introAfterChangeCallback = providedCallback;
    } else {
      throw new Error('Provided callback for onafterchange was not a function');
    }
    return this;
  },
  oncomplete(providedCallback) {
    if (typeof (providedCallback) === 'function') {
      this._introCompleteCallback = providedCallback;
    } else {
      throw new Error('Provided callback for oncomplete was not a function.');
    }
    return this;
  },
  onhintsadded(providedCallback) {
    if (typeof (providedCallback) === 'function') {
      this._hintsAddedCallback = providedCallback;
    } else {
      throw new Error('Provided callback for onhintsadded was not a function.');
    }
    return this;
  },
  onhintclick(providedCallback) {
    if (typeof (providedCallback) === 'function') {
      this._hintClickCallback = providedCallback;
    } else {
      throw new Error('Provided callback for onhintclick was not a function.');
    }
    return this;
  },
  onhintclose(providedCallback) {
    if (typeof (providedCallback) === 'function') {
      this._hintCloseCallback = providedCallback;
    } else {
      throw new Error('Provided callback for onhintclose was not a function.');
    }
    return this;
  },
  onexit(providedCallback) {
    if (typeof (providedCallback) === 'function') {
      this._introExitCallback = providedCallback;
    } else {
      throw new Error('Provided callback for onexit was not a function.');
    }
    return this;
  },
  onskip(providedCallback) {
    if (typeof (providedCallback) === 'function') {
      this._introSkipCallback = providedCallback;
    } else {
      throw new Error('Provided callback for onskip was not a function.');
    }
    return this;
  },
  onbeforeexit(providedCallback) {
    if (typeof (providedCallback) === 'function') {
      this._introBeforeExitCallback = providedCallback;
    } else {
      throw new Error('Provided callback for onbeforeexit was not a function.');
    }
    return this;
  },
  addHints() {
    populateHints.call(this, this._targetElement);
    return this;
  },
  hideHint(stepId) {
    hideHint.call(this, stepId);
    return this;
  },
  hideHints() {
    hideHints.call(this);
    return this;
  },
  showHint(stepId) {
    showHint.call(this, stepId);
    return this;
  },
  showHints() {
    showHints.call(this);
    return this;
  },
  removeHints() {
    removeHints.call(this);
    return this;
  },
  removeHint(stepId) {
    removeHint().call(this, stepId);
    return this;
  },
  showHintDialog(stepId) {
    showHintDialog.call(this, stepId);
    return this;
  }
};


export default introJs;
