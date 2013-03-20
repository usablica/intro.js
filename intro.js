/**
 * Intro.js v0.2.1
 * https://github.com/usablica/intro.js
 * MIT licensed
 *
 * Copyright (C) 2013 usabli.ca - A weekend project by Afshin Mehrabani (@afshinmeh)
 */

(function () {

  //Default config/variables
  var VERSION = "0.2.1";

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
    //clean listeners
    window.onkeydown = null;
    //set the step to zero
    this._currentStep = undefined;
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
      var oldHelperContentLayer = oldHelperLayer.querySelector(".introjs-helperContentLayer"),
          oldHelperNumberLayer = oldHelperLayer.querySelector(".introjs-helperNumberLayer"),
          oldtooltipLayer = oldHelperLayer.querySelector(".introjs-tooltiptext"),
          oldArrowLayer = oldHelperLayer.querySelector(".introjs-arrow"),
          oldtooltipContainer = oldHelperLayer.querySelector(".introjs-tooltip");

      //set new position to helper layer
      oldHelperLayer.setAttribute("style", "width: " + (elementPosition.width + 10)  + "px; " +
                                           "height:" + (elementPosition.height + 10) + "px; " +
                                           "top:"    + (elementPosition.top - 5)     + "px;" +
                                           "left: "  + (elementPosition.left - 5)    + "px;");

      // Copy targetElement content into new layer and display it when the highlight has finished moving
      oldHelperContentLayer.innerHTML = '';
      setTimeout(function(){
        oldHelperContentLayer.innerHTML = _cloneWithStyles(targetElement).outerHTML;
      }, 300);
      
      //set current step to the label
      oldHelperNumberLayer.innerHTML = targetElement.getAttribute("data-step");
      //set current tooltip text
      oldtooltipLayer.innerHTML = targetElement.getAttribute("data-intro");
      _placeTooltip(targetElement, oldtooltipContainer, oldArrowLayer);
    } else {
      var helperLayer = document.createElement("div"),
          helperContentLayer = document.createElement("div"),
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

      helperContentLayer.className = "introjs-helperContentLayer";
      helperNumberLayer.className = "introjs-helperNumberLayer";
      arrowLayer.className = 'introjs-arrow';
      tooltipLayer.className = "introjs-tooltip";

      // Copy targetElement content into new layer 
      helperContentLayer.innerHTML = _cloneWithStyles(targetElement).outerHTML;

      helperNumberLayer.innerHTML = targetElement.getAttribute("data-step");
      tooltipLayer.innerHTML = "<div class='introjs-tooltiptext'>" + targetElement.getAttribute("data-intro") + "</div><div class='introjs-tooltipbuttons'></div>";
      helperLayer.appendChild(helperContentLayer);
      helperLayer.appendChild(helperNumberLayer);
      tooltipLayer.appendChild(arrowLayer);
      helperLayer.appendChild(tooltipLayer);

      //next button
      var nextTooltipButton = document.createElement("a");

      nextTooltipButton.onclick = function() {
        _nextStep.call(self);
      };

      nextTooltipButton.className = "introjs-button introjs-nextbutton";
      nextTooltipButton.href = "javascript:void(0);";
      nextTooltipButton.innerHTML = "Next &rarr;";

      //previous button
      var prevTooltipButton = document.createElement("a");

      prevTooltipButton.onclick = function() {
        _previousStep.call(self);
      };

      prevTooltipButton.className = "introjs-button introjs-prevbutton";
      prevTooltipButton.href = "javascript:void(0);";
      prevTooltipButton.innerHTML = "&larr; Back";

      //skip button
      var skipTooltipButton = document.createElement("a");
      skipTooltipButton.className = "introjs-button introjs-skipbutton";
      skipTooltipButton.href = "javascript:void(0);";
      skipTooltipButton.innerHTML = "Skip";

      skipTooltipButton.onclick = function() {
        _exitIntro.call(self, self._targetElement);
      };

      var tooltipButtonsLayer = tooltipLayer.querySelector('.introjs-tooltipbuttons');
      tooltipButtonsLayer.appendChild(skipTooltipButton);
      tooltipButtonsLayer.appendChild(prevTooltipButton);
      tooltipButtonsLayer.appendChild(nextTooltipButton);

      //set proper position
      _placeTooltip(targetElement, tooltipLayer, arrowLayer);
    }

    //Thanks to JavaScript Kit: http://www.javascriptkit.com/dhtmltutors/dhtmlcascade4.shtml
    var currentElementPosition = "";
    if (targetElement.currentStyle) { //IE
      currentElementPosition = targetElement.currentStyle["position"];
    } else if (document.defaultView && document.defaultView.getComputedStyle) { //Firefox
      currentElementPosition = document.defaultView.getComputedStyle(targetElement, null).getPropertyValue("position");
    }

    //I don't know is this necessary or not, but I clear the position for better comparing
    currentElementPosition = currentElementPosition.toLowerCase();
    if (currentElementPosition != "absolute" && currentElementPosition != "relative") {
      //change to new intro item
      targetElement.className += " introjs-relativePosition";
    }

    if (!_elementInViewport(targetElement)) {
      var rect = targetElement.getBoundingClientRect()
          top = rect.bottom - rect.height,
          bottom = rect.bottom - window.innerHeight;

      // Scroll up
      if (top < 0) {
        window.scrollBy(0, top - 30); // 30px padding from edge to look nice

      // Scroll down
      } else {
        window.scrollBy(0, bottom + 100); // 70px + 30px padding from edge to look nice
      }
    }
  }

  /**
   * Add overlay layer to the page
   * http://stackoverflow.com/questions/123999/how-to-tell-if-a-dom-element-is-visible-in-the-current-viewport
   *
   * @api private
   * @method _elementInViewport
   * @param {Object} el
   */
  function _elementInViewport(el) {
    var rect = el.getBoundingClientRect();

    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      (rect.bottom+80) <= window.innerHeight && // add 80 to get the text right
      rect.right <= window.innerWidth 
    );
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

  /**
   * Clones an element and its children, including computed styles
   *
   * @api private
   * @method _cloneWithStyles
   * @param {Object} element
   * @param {Number} depth
   * @returns A copy of the element and its children
   */
  function _cloneWithStyles(element, depth){
    if (typeof(depth) == 'undefined'){
      depth = 0;
    }
    var newNode = element.cloneNode(false);
    _copyComputedStyle(element, newNode);

    for(var i = 0; i < element.childNodes.length; i++){
      newNode.appendChild(_cloneWithStyles(element.childNodes[i], depth + 1));
    }
    newNode.className = '';

    if (depth === 0){
      // Need to adjust for padding/margin/border of the helperLayer
      var sourcePadding = element.style.padding.match(/\d+/);
      var sourceMargin = element.style.margin.match(/\d+/);
      newNode.style.padding = Math.max(-1, parseInt(sourcePadding ? sourcePadding[0] : 0) - 11) + 'px';
      newNode.style.margin = Math.max(-1, parseInt(sourceMargin ? sourceMargin[0] : 0) - 11) + 'px';
      newNode.style.position = 'static';
    }

    return newNode;
  }

  /**
   * Retrieves the computed style of the passed element
   * via: http://stackoverflow.com/q/1848445/
   *
   * @api private
   * @method _getComputedStyle
   * @param {Object} el
   * @param {String} style
   * @returns Style value or array of all styles
   */

  function _getComputedStyle(el, style) {
    var computedStyle;
    if ( typeof el.currentStyle != 'undefined' ) {
      computedStyle = el.currentStyle;
    } else {
      computedStyle = document.defaultView.getComputedStyle(el, null);
    }
    if(computedStyle === null || typeof computedStyle == 'undefined'){
      return '';
    } else {
      return style ? computedStyle[style] : computedStyle;
    }
  }

  /**
   * Copies the styles from a src element to a dest element
   * Only looks at styles in the list below in order to avoid copying default browser styles
   *
   * @api private
   * @method _copyComputedStyle
   * @param {Object} src
   * @param {Object} dest
   * @returns null
   */

  function _copyComputedStyle(src, dest) {
    var copyableStyles = ['font-family','font-size','font-weight','font-style','color',
        'text-transform','text-decoration','letter-spacing','word-spacing',
        'line-height','text-align','vertical-align','direction','background-color',
        'background-image','background-repeat','background-position',
        'background-attachment','opacity','width','height','top','right','bottom',
        'left','margin-top','margin-right','margin-bottom','margin-left',
        'padding-top','padding-right','padding-bottom','padding-left',
        'border-top-width','border-right-width','border-bottom-width',
        'border-left-width','border-top-color','border-right-color',
        'border-bottom-color','border-left-color','border-top-style',
        'border-right-style','border-bottom-style','border-left-style','position',
        'display','visibility','z-index','overflow-x','overflow-y','white-space',
        'clip','float','clear','cursor','list-style-image','list-style-position',
        'list-style-type','marker-offset'];
    for ( var i = 0; i < copyableStyles.length; i++) {
      var style = copyableStyles[i];    
      var s = _getComputedStyle(src, style);
      try {
        dest.style[style] = typeof(s) == 'undefined' ? '' : s;
      } catch(e){}
    }
  }


  var introJs = function (targetElm) {
    if (typeof (targetElm) === "object") {
      //Ok, create a new instance
      return new IntroJs(targetElm);

    } else if (typeof (targetElm) === "string") {
      //select the target element with query selector
      var targetElement = document.querySelector(targetElm);

      if (targetElement) {
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
