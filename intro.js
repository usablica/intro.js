/**
 * Intro.js v0.1.0
 * https://github.com/usablica/intro.js
 * MIT licensed
 *
 * Copyright (C) 2013 usabli.ca - A weekend project by Afshin Mehrabani (@afshinmeh)
 */

(function () {

  //Default config/variables
  var VERSION = "0.1.0";

  /**
   * IntroJs main class
   *
   * @class IntroJs
   */
  function IntroJs(obj) {
    this._targetElement = obj;
  }

  /**
   * Initiate a new introduction/guide from an element in the page
   *
   * @api private
   * @method _introForElement
   * @param {Object} targetElm
   * @returns {Boolean} Success or not?
   */
  function _introForElement(targetElm) {
    var allIntroSteps = targetElm.querySelectorAll("*[data-intro]"),
        introItems = [],
        self = this;

    //if there's no element to intro
    if(allIntroSteps.length < 1) {
      return false;
    }

    for (var i = 0, elmsLength = allIntroSteps.length; i < elmsLength; i++) {
      var currentElement = allIntroSteps[i];
      introItems.push({
        element: currentElement,
        intro: currentElement.getAttribute("data-intro"),
        step: parseInt(currentElement.getAttribute("data-step"), 10),
        position: currentElement.getAttribute("data-position") || 'bottom'
      });
    }

    //Ok, sort all items with given steps
    introItems.sort(function (a, b) {
      return a.step - b.step;
    });

    //set it to the introJs object
    self._introItems = introItems;

    //add overlay layer to the page
    if(_addOverlayLayer.call(self, targetElm)) {
      //then, start the show
      _nextStep.call(self);

      var skipButton = targetElm.querySelector(".introjs-skipbutton"),
          nextStepButton = targetElm.querySelector(".introjs-nextbutton");

      window.onkeydown = function(e) {
        if (e.keyCode == 27) {
          //escape key pressed, exit the intro
          _exitIntro.call(self, targetElm);
        } else if(e.keyCode == 37) {
          //left arrow
          _previousStep.call(self);
        } else if (e.keyCode == 39 || e.keyCode == 13) {
          //right arrow or enter
          _nextStep.call(self);
        }
      };
    }
    return false;
  }

  /**
   * Go to next step on intro
   *
   * @api private
   * @method _nextStep
   */
  function _nextStep() {
    if (typeof(this._currentStep) === 'undefined') {
      this._currentStep = 0;
    } else {
      ++this._currentStep;
    }

    if((this._introItems.length) <= this._currentStep) {
      //end of the intro
      //check if any callback is defined
      if (this._introCompleteCallback != undefined) {
        this._introCompleteCallback.call(this);
      }
      _exitIntro.call(this, this._targetElement);
      return;
    }

    _showElement.call(this, this._introItems[this._currentStep].element);
  }

  /**
   * Go to previous step on intro
   *
   * @api private
   * @method _nextStep
   */
  function _previousStep() {
    if (this._currentStep == 0) {
      return false;
    }

    _showElement.call(this, this._introItems[--this._currentStep].element);
  }

  /**
   * Exit from intro
   *
   * @api private
   * @method _exitIntro
   * @param {Object} targetElement
   */
  function _exitIntro(targetElement) {
    //remove overlay layer from the page
    var overlayLayer = targetElement.querySelector(".introjs-overlay");
    //for fade-out animation
    overlayLayer.style.opacity = 0;
    setTimeout(function () {
      if (overlayLayer.parentNode) {
        overlayLayer.parentNode.removeChild(overlayLayer);
      }
    }, 500);
    //remove all helper layers
    var helperLayer = targetElement.querySelector(".introjs-helperLayer");
    if (helperLayer) {
      helperLayer.parentNode.removeChild(helperLayer);
    }
    //remove `introjs-showElement` class from the element
    var showElement = document.querySelector(".introjs-showElement");
    if (showElement) {
      showElement.className = showElement.className.replace(/introjs-showElement/,'').trim();
    }
    //clean listeners
    targetElement.onkeydown = null;
    //check if any callback is defined
    if (this._introExitCallback != undefined) {
      this._introExitCallback.call(this);
    }
  }

  /**
   * Render tooltip box in the page
   *
   * @api private
   * @method _placeTooltip
   * @param {Object} targetElement
   * @param {Object} tooltipLayer
   * @param {Object} arrowLayer
   */
  function _placeTooltip(targetElement, tooltipLayer, arrowLayer) {
    var tooltipLayerPosition = _getOffset(tooltipLayer);
    //reset the old style
    tooltipLayer.style.top = null;
    tooltipLayer.style.right = null;
    tooltipLayer.style.bottom = null;
    tooltipLayer.style.left = null;
    switch (targetElement.getAttribute('data-position')) {
      case 'top':
        tooltipLayer.style.left = "15px";
        tooltipLayer.style.top = "-" + (tooltipLayerPosition.height + 10) + "px";
        arrowLayer.className = 'introjs-arrow bottom';
        break;
      case 'right':
        console.log(tooltipLayerPosition);
        tooltipLayer.style.right = "-" + (tooltipLayerPosition.width + 10) + "px";
        arrowLayer.className = 'introjs-arrow left';
        break;
      case 'left':
        tooltipLayer.style.top = "15px";
        tooltipLayer.style.left = "-" + (tooltipLayerPosition.width + 10) + "px";
        arrowLayer.className = 'introjs-arrow right';
        break;
      case 'bottom':
      default:
        tooltipLayer.style.bottom = "-" + (tooltipLayerPosition.height + 10) + "px";
        arrowLayer.className = 'introjs-arrow top';
        break;
    }
  }

  /**
   * Show an element on the page
   *
   * @api private
   * @method _showElement
   * @param {Object} targetElement
   */
  function _showElement(targetElement) {

    var self = this,
        oldHelperLayer = document.querySelector(".introjs-helperLayer"),
        elementPosition = _getOffset(targetElement);

    if(oldHelperLayer != null) {
      var oldHelperNumberLayer = oldHelperLayer.querySelector(".introjs-helperNumberLayer"),
          oldtooltipLayer = oldHelperLayer.querySelector(".introjs-tooltiptext"),
          oldArrowLayer = oldHelperLayer.querySelector(".introjs-arrow"),
          oldtooltipContainer = oldHelperLayer.querySelector(".introjs-tooltip")

      //set new position to helper layer
      oldHelperLayer.setAttribute("style", "width: " + (elementPosition.width + 10)  + "px; " +
                                           "height:" + (elementPosition.height + 10) + "px; " +
                                           "top:"    + (elementPosition.top - 5)     + "px;" +
                                           "left: "  + (elementPosition.left - 5)    + "px;");
      //set current step to the label
      oldHelperNumberLayer.innerHTML = targetElement.getAttribute("data-step");
      //set current tooltip text
      oldtooltipLayer.innerHTML = targetElement.getAttribute("data-intro");
      var oldShowElement = document.querySelector(".introjs-showElement");
      oldShowElement.className = oldShowElement.className.replace(/introjs-showElement/,'').trim();
      //change to new intro item
      targetElement.className += " introjs-showElement";
      _placeTooltip(targetElement, oldtooltipContainer, oldArrowLayer);
    } else {
      targetElement.className += " introjs-showElement";

      var helperLayer = document.createElement("div"),
          helperNumberLayer = document.createElement("span"),
          arrowLayer = document.createElement("div"),
          tooltipLayer = document.createElement("div");

      helperLayer.className = "introjs-helperLayer";
      helperLayer.setAttribute("style", "width: " + (elementPosition.width + 10)  + "px; " +
                                        "height:" + (elementPosition.height + 10) + "px; " +
                                        "top:"    + (elementPosition.top - 5)     + "px;" +
                                        "left: "  + (elementPosition.left - 5)    + "px;");

      //add helper layer to target element
      this._targetElement.appendChild(helperLayer);

      helperNumberLayer.className = "introjs-helperNumberLayer";
      arrowLayer.className = 'introjs-arrow';
      tooltipLayer.className = "introjs-tooltip";

      helperNumberLayer.innerHTML = targetElement.getAttribute("data-step");
      tooltipLayer.innerHTML = "<div class='introjs-tooltiptext'>" + targetElement.getAttribute("data-intro") + "</div><div class='introjs-tooltipbuttons'></div>";
      helperLayer.appendChild(helperNumberLayer);
      tooltipLayer.appendChild(arrowLayer);
      helperLayer.appendChild(tooltipLayer);

      var skipTooltipButton = document.createElement("a");
      skipTooltipButton.className = "introjs-skipbutton";
      skipTooltipButton.href = "javascript:void(0);";
      skipTooltipButton.innerHTML = "Skip";

      var nextTooltipButton = document.createElement("a");

      nextTooltipButton.onclick = function() {
        _nextStep.call(self);
      };

      nextTooltipButton.className = "introjs-nextbutton";
      nextTooltipButton.href = "javascript:void(0);";
      nextTooltipButton.innerHTML = "Next \u2192";

      skipTooltipButton.onclick = function() {
      _exitIntro.call(self, self._targetElement);
      };

      var tooltipButtonsLayer = tooltipLayer.querySelector('.introjs-tooltipbuttons');
      tooltipButtonsLayer.appendChild(skipTooltipButton);
      tooltipButtonsLayer.appendChild(nextTooltipButton);

      //set proper position
      _placeTooltip(targetElement, tooltipLayer, arrowLayer);
    }

    //scroll the page to the element position
    if (typeof(targetElement.scrollIntoViewIfNeeded) === "function") {
      //awesome method guys: https://bugzilla.mozilla.org/show_bug.cgi?id=403510
      //but I think this method has some problems with IE < 7.0, I should find a proper failover way
      targetElement.scrollIntoViewIfNeeded();
    }
  }

  /**
   * Add overlay layer to the page
   *
   * @api private
   * @method _addOverlayLayer
   * @param {Object} targetElm
   */
  function _addOverlayLayer(targetElm) {
    var overlayLayer = document.createElement("div"),
        styleText = "",
        self = this;

    //set css class name
    overlayLayer.className = "introjs-overlay";

    //check if the target element is body, we should calculate the size of overlay layer in a better way
    if (targetElm.tagName.toLowerCase() == "body") {
      styleText += "top: 0;bottom: 0; left: 0;right: 0;position: fixed;";
      overlayLayer.setAttribute("style", styleText);
    } else {
      //set overlay layer position
      var elementPosition = _getOffset(targetElm);
      if(elementPosition) {
        styleText += "width: " + elementPosition.width + "px; height:" + elementPosition.height + "px; top:" + elementPosition.top + "px;left: " + elementPosition.left + "px;";
        overlayLayer.setAttribute("style", styleText);
      }
    }

    targetElm.appendChild(overlayLayer);

    overlayLayer.onclick = function() {
      _exitIntro.call(self, targetElm);
    };

    setTimeout(function() {
      styleText += "opacity: .5;";
      overlayLayer.setAttribute("style", styleText);
    }, 10);
    return true;
  }

  /**
   * Get an element position on the page
   * Thanks to `meouw`: http://stackoverflow.com/a/442474/375966
   *
   * @api private
   * @method _getOffset
   * @param {Object} element
   * @returns Element's position info
   */
  function _getOffset(element) {
    var elementPosition = {};

    //set width
    elementPosition.width = element.offsetWidth;

    //set height
    elementPosition.height = element.offsetHeight;

    //calculate element top and left
    var _x = 0;
    var _y = 0;
    while(element && !isNaN(element.offsetLeft) && !isNaN(element.offsetTop)) {
      _x += element.offsetLeft;
      _y += element.offsetTop;
      element = element.offsetParent;
    }
    //set top
    elementPosition.top = _y;
    //set left
    elementPosition.left = _x;

    return elementPosition;
  }

  var introJs = function (targetElm) {
    if (typeof (targetElm) === "object") {
      //Ok, create a new instance
      return new IntroJs(targetElm);

    } else if (typeof (targetElm) === "string") {
      //select the target element with query selector
      var targetElement = document.querySelector(targetElm);

      if(targetElement) {
        return new IntroJs(targetElement);
      } else {
        throw new Error("There's no element with given selector.");
      }
    } else {
      return new IntroJs(document.body);
    }
  };

  /**
   * Current IntroJs version
   *
   * @property version
   * @type String
   */
  introJs.version = VERSION;

  //Prototype
  introJs.fn = IntroJs.prototype = {
    clone: function () {
      return new IntroJs(this);
    },
    start: function () {
      _introForElement.call(this, this._targetElement);
      return this;
    },
    oncomplete: function(providedCallback) {
      if (typeof (providedCallback) === "function") {
        this._introCompleteCallback = providedCallback;
      } else {
        throw new Error("Provided callback for oncomplete was not a function.");
      }
      return this;
    },
    onexit: function(providedCallback) {
      if (typeof (providedCallback) === "function") {
        this._introExitCallback = providedCallback;
      } else {
        throw new Error("Provided callback for onexit was not a function.");
      }
      return this;
    }
  };

  window['introJs'] = introJs;
})();
