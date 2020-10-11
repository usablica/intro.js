/*!
 * Intro.js v2.9.3
 * https://github.com/usablica/intro.js
 *
 * Copyright (C) 2017 Afshin Mehrabani (@afshinmeh).
 * https://raw.githubusercontent.com/usablica/intro.js/master/license.md
 *
 * Date: Sun, 11 Oct 2020 09:36:16 GMT
 */

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.introJs = factory());
}(this, (function () { 'use strict';

  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  /**
   * Overwrites obj1's values with obj2's and adds obj2's if non existent in obj1
   * via: http://stackoverflow.com/questions/171251/how-can-i-merge-properties-of-two-javascript-objects-dynamically
   *
   * @param obj1
   * @param obj2
   * @returns obj3 a new object based on obj1 and obj2
   */
  function mergeOptions(obj1, obj2) {
    var obj3 = {};
    var attrname;

    for (attrname in obj1) {
      obj3[attrname] = obj1[attrname];
    }

    for (attrname in obj2) {
      obj3[attrname] = obj2[attrname];
    }

    return obj3;
  }

  /**
   * Mark any object with an incrementing number
   * used for keeping track of objects
   *
   * @param Object obj   Any object or DOM Element
   * @param String key
   * @return Object
   */
  var stamp = function () {
    var keys = {};
    return function stamp(obj) {
      var key = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'introjs-stamp';
      // each group increments from 0
      keys[key] = keys[key] || 0; // stamp only once per object

      if (obj[key] === undefined) {
        // increment key for each new object
        obj[key] = keys[key]++;
      }

      return obj[key];
    };
  }();

  /**
   * Iterates arrays
   *
   * @param {Array} arr
   * @param {Function} forEachFnc
   * @param {Function} completeFnc
   * @return {Null}
   */
  function forEach(arr, forEachFnc, completeFnc) {
    // in case arr is an empty query selector node list
    if (arr) {
      for (var i = 0, len = arr.length; i < len; i++) {
        forEachFnc(arr[i], i);
      }
    }

    if (typeof completeFnc === 'function') {
      completeFnc();
    }
  }

  /**
   * Remove a class from an element
   *
   * @api private
   * @method _removeClass
   * @param {Object} element
   * @param {RegExp|String} classNameRegex can be regex or string
   * @returns null
   */
  function removeClass(element, classNameRegex) {
    if (element instanceof SVGElement) {
      var pre = element.getAttribute('class') || '';
      element.setAttribute('class', pre.replace(classNameRegex, '').replace(/^\s+|\s+$/g, ''));
    } else {
      element.className = element.className.replace(classNameRegex, '').replace(/^\s+|\s+$/g, '');
    }
  }

  /**
   * DOMEvent Handles all DOM events
   *
   * methods:
   *
   * on - add event handler
   * off - remove event
   */

  var DOMEvent = function () {
    function DOMEvent() {
      var events_key = 'introjs_event';
      /**
       * Gets a unique ID for an event listener
       *
       * @param Object obj
       * @param String type        event type
       * @param Function listener
       * @param Object context
       * @return String
       */

      this._id = function (obj, type, listener, context) {
        return type + stamp(listener) + (context ? "_".concat(stamp(context)) : '');
      };
      /**
       * Adds event listener
       *
       * @param Object obj
       * @param String type        event type
       * @param Function listener
       * @param Object context
       * @param Boolean useCapture
       * @return null
       */


      this.on = function (obj, type, listener, context, useCapture) {
        var id = this._id.apply(this, arguments);

        var handler = function handler(e) {
          return listener.call(context || obj, e || window.event);
        };

        if ('addEventListener' in obj) {
          obj.addEventListener(type, handler, useCapture);
        } else if ('attachEvent' in obj) {
          obj.attachEvent("on".concat(type), handler);
        }

        obj[events_key] = obj[events_key] || {};
        obj[events_key][id] = handler;
      };
      /**
       * Removes event listener
       *
       * @param Object obj
       * @param String type        event type
       * @param Function listener
       * @param Object context
       * @param Boolean useCapture
       * @return null
       */


      this.off = function (obj, type, listener, context, useCapture) {
        var id = this._id.apply(this, arguments);

        var handler = obj[events_key] && obj[events_key][id];

        if (!handler) {
          return;
        }

        if ('removeEventListener' in obj) {
          obj.removeEventListener(type, handler, useCapture);
        } else if ('detachEvent' in obj) {
          obj.detachEvent("on".concat(type), handler);
        }

        obj[events_key][id] = null;
      };
    }

    return new DOMEvent();
  }();

  /**
   * Append a class to an element
   *
   * @api private
   * @method _addClass
   * @param {Object} element
   * @param {String} className
   * @returns null
   */

  function addClass(element, className) {
    if (element instanceof SVGElement) {
      // svg
      var pre = element.getAttribute('class') || '';
      element.setAttribute('class', "".concat(pre, " ").concat(className));
    } else {
      if (element.classList !== undefined) {
        // check for modern classList property
        var classes = className.split(' ');
        forEach(classes, function (cls) {
          element.classList.add(cls);
        });
      } else if (!element.className.match(className)) {
        // check if element doesn't already have className
        element.className += " ".concat(className);
      }
    }
  }

  /**
   * Get an element CSS property on the page
   * Thanks to JavaScript Kit: http://www.javascriptkit.com/dhtmltutors/dhtmlcascade4.shtml
   *
   * @api private
   * @method _getPropValue
   * @param {Object} element
   * @param {String} propName
   * @returns string property value
   */
  function getPropValue(element, propName) {
    var propValue = '';

    if (element.currentStyle) {
      //IE
      propValue = element.currentStyle[propName];
    } else if (document.defaultView && document.defaultView.getComputedStyle) {
      //Others
      propValue = document.defaultView.getComputedStyle(element, null).getPropertyValue(propName);
    } //Prevent exception in IE


    if (propValue && propValue.toLowerCase) {
      return propValue.toLowerCase();
    } else {
      return propValue;
    }
  }

  /**
   * To set the show element
   * This function set a relative (in most cases) position and changes the z-index
   *
   * @api private
   * @method _setShowElement
   * @param {Object} targetElement
   */

  function setShowElement(_ref) {
    var element = _ref.element;
    var parentElm; // we need to add this show element class to the parent of SVG elements
    // because the SVG elements can't have independent z-index

    if (element instanceof SVGElement) {
      parentElm = element.parentNode;

      while (element.parentNode !== null) {
        if (!parentElm.tagName || parentElm.tagName.toLowerCase() === 'body') break;

        if (parentElm.tagName.toLowerCase() === 'svg') {
          addClass(parentElm, 'introjs-showElement introjs-relativePosition');
        }

        parentElm = parentElm.parentNode;
      }
    }

    addClass(element, 'introjs-showElement');
    var currentElementPosition = getPropValue(element, 'position');

    if (currentElementPosition !== 'absolute' && currentElementPosition !== 'relative' && currentElementPosition !== 'fixed') {
      //change to new intro item
      addClass(element, 'introjs-relativePosition');
    }

    parentElm = element.parentNode;

    while (parentElm !== null) {
      if (!parentElm.tagName || parentElm.tagName.toLowerCase() === 'body') break; //fix The Stacking Context problem.
      //More detail: https://developer.mozilla.org/en-US/docs/Web/Guide/CSS/Understanding_z_index/The_stacking_context

      var zIndex = getPropValue(parentElm, 'z-index');
      var opacity = parseFloat(getPropValue(parentElm, 'opacity'));
      var transform = getPropValue(parentElm, 'transform') || getPropValue(parentElm, '-webkit-transform') || getPropValue(parentElm, '-moz-transform') || getPropValue(parentElm, '-ms-transform') || getPropValue(parentElm, '-o-transform');

      if (/[0-9]+/.test(zIndex) || opacity < 1 || transform !== 'none' && transform !== undefined) {
        addClass(parentElm, 'introjs-fixParent');
      }

      parentElm = parentElm.parentNode;
    }
  }

  /**
   * scroll a scrollable element to a child element
   *
   * @param Element parent
   * @param Element element
   * @return Null
   */
  function scrollParentToElement(parent, _ref) {
    var offsetTop = _ref.offsetTop;
    parent.scrollTop = offsetTop - parent.offsetTop;
  }

  /**
   * Find the nearest scrollable parent
   * copied from https://stackoverflow.com/questions/35939886/find-first-scrollable-parent
   *
   * @param Element element
   * @return Element
   */
  function getScrollParent(element) {
    var style = window.getComputedStyle(element);
    var excludeStaticParent = style.position === "absolute";
    var overflowRegex = /(auto|scroll)/;
    if (style.position === "fixed") return document.body;

    for (var parent = element; parent = parent.parentElement;) {
      style = window.getComputedStyle(parent);

      if (excludeStaticParent && style.position === "static") {
        continue;
      }

      if (overflowRegex.test(style.overflow + style.overflowY + style.overflowX)) return parent;
    }

    return document.body;
  }

  /**
   * Provides a cross-browser way to get the screen dimensions
   * via: http://stackoverflow.com/questions/5864467/internet-explorer-innerheight
   *
   * @api private
   * @method _getWinSize
   * @returns {Object} width and height attributes
   */
  function getWinSize() {
    if (window.innerWidth !== undefined) {
      return {
        width: window.innerWidth,
        height: window.innerHeight
      };
    } else {
      var D = document.documentElement;
      return {
        width: D.clientWidth,
        height: D.clientHeight
      };
    }
  }

  /**
   * Check to see if the element is in the viewport or not
   * http://stackoverflow.com/questions/123999/how-to-tell-if-a-dom-element-is-visible-in-the-current-viewport
   *
   * @api private
   * @method _elementInViewport
   * @param {Object} el
   */
  function elementInViewport(el) {
    var rect = el.getBoundingClientRect();
    return rect.top >= 0 && rect.left >= 0 && rect.bottom + 80 <= window.innerHeight && // add 80 to get the text right
    rect.right <= window.innerWidth;
  }

  /**
   * To change the scroll of `window` after highlighting an element
   *
   * @api private
   * @method _scrollTo
   * @param {String} scrollTo
   * @param {Object} targetElement
   * @param {Object} tooltipLayer
   */

  function scrollTo(scrollTo, _ref, tooltipLayer) {
    var element = _ref.element;
    if (scrollTo === 'off') return;
    var rect;
    if (!this._options.scrollToElement) return;

    if (scrollTo === 'tooltip') {
      rect = tooltipLayer.getBoundingClientRect();
    } else {
      rect = element.getBoundingClientRect();
    }

    if (!elementInViewport(element)) {
      var winHeight = getWinSize().height;
      var top = rect.bottom - (rect.bottom - rect.top); // TODO (afshinm): do we need scroll padding now?
      // I have changed the scroll option and now it scrolls the window to
      // the center of the target element or tooltip.

      if (top < 0 || element.clientHeight > winHeight) {
        window.scrollBy(0, rect.top - (winHeight / 2 - rect.height / 2) - this._options.scrollPadding); // 30px padding from edge to look nice
        //Scroll down
      } else {
        window.scrollBy(0, rect.top - (winHeight / 2 - rect.height / 2) + this._options.scrollPadding); // 30px padding from edge to look nice
      }
    }
  }

  /**
   * Setting anchors to behave like buttons
   *
   * @api private
   * @method _setAnchorAsButton
   */
  function setAnchorAsButton(anchor) {
    anchor.setAttribute('role', 'button');
    anchor.tabIndex = 0;
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
  function getOffset(element) {
    var body = document.body;
    var docEl = document.documentElement;
    var scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
    var scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;
    var x = element.getBoundingClientRect();
    return {
      top: x.top + scrollTop,
      width: x.width,
      height: x.height,
      left: x.left + scrollLeft
    };
  }

  /**
   * Checks to see if target element (or parents) position is fixed or not
   *
   * @api private
   * @method _isFixed
   * @param {Object} element
   * @returns Boolean
   */

  function isFixed(element) {
    var p = element.parentNode;

    if (!p || p.nodeName === 'HTML') {
      return false;
    }

    if (getPropValue(element, 'position') === 'fixed') {
      return true;
    }

    return isFixed(p);
  }

  /**
   * Update the position of the helper layer on the screen
   *
   * @api private
   * @method _setHelperLayerPosition
   * @param {Object} helperLayer
   */

  function setHelperLayerPosition(helperLayer) {
    if (helperLayer) {
      //prevent error when `this._currentStep` in undefined
      if (!this._introItems[this._currentStep]) return;
      var currentElement = this._introItems[this._currentStep];
      var elementPosition = getOffset(currentElement.element);
      var widthHeightPadding = this._options.helperElementPadding; // If the target element is fixed, the tooltip should be fixed as well.
      // Otherwise, remove a fixed class that may be left over from the previous
      // step.

      if (isFixed(currentElement.element)) {
        addClass(helperLayer, 'introjs-fixedTooltip');
      } else {
        removeClass(helperLayer, 'introjs-fixedTooltip');
      }

      if (currentElement.position === 'floating') {
        widthHeightPadding = 0;
      } //set new position to helper layer


      helperLayer.style.cssText = "width: ".concat(elementPosition.width + widthHeightPadding, "px; height:").concat(elementPosition.height + widthHeightPadding, "px; top:").concat(elementPosition.top - widthHeightPadding / 2, "px;left: ").concat(elementPosition.left - widthHeightPadding / 2, "px;");
    }
  }

  /**
   * Set tooltip left so it doesn't go off the right side of the window
   *
   * @return boolean true, if tooltipLayerStyleLeft is ok.  false, otherwise.
   */
  function checkRight(targetOffset, tooltipLayerStyleLeft, tooltipOffset, windowSize, tooltipLayer) {
    if (targetOffset.left + tooltipLayerStyleLeft + tooltipOffset.width > windowSize.width) {
      // off the right side of the window
      tooltipLayer.left = "".concat(windowSize.width - tooltipOffset.width - targetOffset.left, "px");
      return false;
    }

    tooltipLayer.left = "".concat(tooltipLayerStyleLeft, "px");
    return true;
  }

  /**
   * Set tooltip right so it doesn't go off the left side of the window
   *
   * @return boolean true, if tooltipLayerStyleRight is ok.  false, otherwise.
   */
  function checkLeft(targetOffset, tooltipLayerStyleRight, tooltipOffset, tooltipLayer) {
    if (targetOffset.left + targetOffset.width - tooltipLayerStyleRight - tooltipOffset.width < 0) {
      // off the left side of the window
      tooltipLayer.style.left = "".concat(-targetOffset.left, "px");
      return false;
    }

    tooltipLayer.style.right = "".concat(tooltipLayerStyleRight, "px");
    return true;
  }

  /**
   * Remove an entry from a string array if it's there, does nothing if it isn't there.
   *
   * @param {Array} stringArray
   * @param {String} stringToRemove
   */
  function removeEntry(stringArray, stringToRemove) {
    if (stringArray.includes(stringToRemove)) {
      stringArray.splice(stringArray.indexOf(stringToRemove), 1);
    }
  }

  /**
   * auto-determine alignment
   * @param {Integer}  offsetLeft
   * @param {Integer}  tooltipWidth
   * @param {Object}   windowSize
   * @param {String}   desiredAlignment
   * @return {String}  calculatedAlignment
   */

  function _determineAutoAlignment(offsetLeft, tooltipWidth, _ref, desiredAlignment) {
    var width = _ref.width;
    var halfTooltipWidth = tooltipWidth / 2;
    var winWidth = Math.min(width, window.screen.width);
    var possibleAlignments = ['-left-aligned', '-middle-aligned', '-right-aligned'];
    var calculatedAlignment = ''; // valid left must be at least a tooltipWidth
    // away from right side

    if (winWidth - offsetLeft < tooltipWidth) {
      removeEntry(possibleAlignments, '-left-aligned');
    } // valid middle must be at least half
    // width away from both sides


    if (offsetLeft < halfTooltipWidth || winWidth - offsetLeft < halfTooltipWidth) {
      removeEntry(possibleAlignments, '-middle-aligned');
    } // valid right must be at least a tooltipWidth
    // width away from left side


    if (offsetLeft < tooltipWidth) {
      removeEntry(possibleAlignments, '-right-aligned');
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
    var possiblePositions = this._options.positionPrecedence.slice();

    var windowSize = getWinSize();
    var tooltipHeight = getOffset(tooltipLayer).height + 10;
    var tooltipWidth = getOffset(tooltipLayer).width + 20;
    var targetElementRect = targetElement.getBoundingClientRect(); // If we check all the possible areas, and there are no valid places for the tooltip, the element
    // must take up most of the screen real estate. Show the tooltip floating in the middle of the screen.

    var calculatedPosition = "floating";
    /*
    * auto determine position
    */
    // Check for space below

    if (targetElementRect.bottom + tooltipHeight > windowSize.height) {
      removeEntry(possiblePositions, "bottom");
    } // Check for space above


    if (targetElementRect.top - tooltipHeight < 0) {
      removeEntry(possiblePositions, "top");
    } // Check for space to the right


    if (targetElementRect.right + tooltipWidth > windowSize.width) {
      removeEntry(possiblePositions, "right");
    } // Check for space to the left


    if (targetElementRect.left - tooltipWidth < 0) {
      removeEntry(possiblePositions, "left");
    } // @var {String}  ex: 'right-aligned'


    var desiredAlignment = function (pos) {
      var hyphenIndex = pos.indexOf('-');

      if (hyphenIndex !== -1) {
        // has alignment
        return pos.substr(hyphenIndex);
      }

      return '';
    }(desiredTooltipPosition || ''); // strip alignment from position


    if (desiredTooltipPosition) {
      // ex: "bottom-right-aligned"
      // should return 'bottom'
      desiredTooltipPosition = desiredTooltipPosition.split('-')[0];
    }

    if (possiblePositions.length) {
      if (desiredTooltipPosition !== "auto" && possiblePositions.includes(desiredTooltipPosition)) {
        // If the requested position is in the list, choose that
        calculatedPosition = desiredTooltipPosition;
      } else {
        // Pick the first valid position, in order
        calculatedPosition = possiblePositions[0];
      }
    } // only top and bottom positions have optional alignments


    if (['top', 'bottom'].includes(calculatedPosition)) {
      calculatedPosition += _determineAutoAlignment(targetElementRect.left, tooltipWidth, windowSize, desiredAlignment);
    }

    return calculatedPosition;
  }
  /**
   * Render tooltip box in the page
   *
   * @api private
   * @method placeTooltip
   * @param {HTMLElement} targetElement
   * @param {HTMLElement} tooltipLayer
   * @param {HTMLElement} arrowLayer
   * @param {HTMLElement} helperNumberLayer
   * @param {Boolean} hintMode
   */


  function placeTooltip(targetElement, tooltipLayer, arrowLayer, helperNumberLayer, hintMode) {
    var tooltipCssClass = '';
    var currentStepObj;
    var tooltipOffset;
    var targetOffset;
    var windowSize;
    var currentTooltipPosition;
    hintMode = hintMode || false; //reset the old style

    tooltipLayer.style.top = null;
    tooltipLayer.style.right = null;
    tooltipLayer.style.bottom = null;
    tooltipLayer.style.left = null;
    tooltipLayer.style.marginLeft = null;
    tooltipLayer.style.marginTop = null;
    arrowLayer.style.display = 'inherit';

    if (typeof helperNumberLayer !== 'undefined' && helperNumberLayer !== null) {
      helperNumberLayer.style.top = null;
      helperNumberLayer.style.left = null;
    } //prevent error when `this._currentStep` is undefined


    if (!this._introItems[this._currentStep]) return; //if we have a custom css class for each step

    currentStepObj = this._introItems[this._currentStep];

    if (typeof currentStepObj.tooltipClass === 'string') {
      tooltipCssClass = currentStepObj.tooltipClass;
    } else {
      tooltipCssClass = this._options.tooltipClass;
    }

    tooltipLayer.className = "introjs-tooltip ".concat(tooltipCssClass).replace(/^\s+|\s+$/g, '');
    tooltipLayer.setAttribute('role', 'dialog');
    currentTooltipPosition = this._introItems[this._currentStep].position; // Floating is always valid, no point in calculating

    if (currentTooltipPosition !== "floating") {
      currentTooltipPosition = _determineAutoPosition.call(this, targetElement, tooltipLayer, currentTooltipPosition);
    }

    var tooltipLayerStyleLeft;
    targetOffset = getOffset(targetElement);
    tooltipOffset = getOffset(tooltipLayer);
    windowSize = getWinSize();
    addClass(tooltipLayer, "introjs-".concat(currentTooltipPosition));

    switch (currentTooltipPosition) {
      case 'top-right-aligned':
        arrowLayer.className = 'introjs-arrow bottom-right';
        var tooltipLayerStyleRight = 0;
        checkLeft(targetOffset, tooltipLayerStyleRight, tooltipOffset, tooltipLayer);
        tooltipLayer.style.bottom = "".concat(targetOffset.height + 20, "px");
        break;

      case 'top-middle-aligned':
        arrowLayer.className = 'introjs-arrow bottom-middle';
        var tooltipLayerStyleLeftRight = targetOffset.width / 2 - tooltipOffset.width / 2; // a fix for middle aligned hints

        if (hintMode) {
          tooltipLayerStyleLeftRight += 5;
        }

        if (checkLeft(targetOffset, tooltipLayerStyleLeftRight, tooltipOffset, tooltipLayer)) {
          tooltipLayer.style.right = null;
          checkRight(targetOffset, tooltipLayerStyleLeftRight, tooltipOffset, windowSize, tooltipLayer);
        }

        tooltipLayer.style.bottom = "".concat(targetOffset.height + 20, "px");
        break;

      case 'top-left-aligned': // top-left-aligned is the same as the default top

      case 'top':
        arrowLayer.className = 'introjs-arrow bottom';
        tooltipLayerStyleLeft = hintMode ? 0 : 15;
        checkRight(targetOffset, tooltipLayerStyleLeft, tooltipOffset, windowSize, tooltipLayer);
        tooltipLayer.style.bottom = "".concat(targetOffset.height + 20, "px");
        break;

      case 'right':
        tooltipLayer.style.left = "".concat(targetOffset.width + 20, "px");

        if (targetOffset.top + tooltipOffset.height > windowSize.height) {
          // In this case, right would have fallen below the bottom of the screen.
          // Modify so that the bottom of the tooltip connects with the target
          arrowLayer.className = "introjs-arrow left-bottom";
          tooltipLayer.style.top = "-".concat(tooltipOffset.height - targetOffset.height - 20, "px");
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
          tooltipLayer.style.top = "-".concat(tooltipOffset.height - targetOffset.height - 20, "px");
          arrowLayer.className = 'introjs-arrow right-bottom';
        } else {
          arrowLayer.className = 'introjs-arrow right';
        }

        tooltipLayer.style.right = "".concat(targetOffset.width + 20, "px");
        break;

      case 'floating':
        arrowLayer.style.display = 'none'; //we have to adjust the top and left of layer manually for intro items without element

        tooltipLayer.style.left = '50%';
        tooltipLayer.style.top = '50%';
        tooltipLayer.style.marginLeft = "-".concat(tooltipOffset.width / 2, "px");
        tooltipLayer.style.marginTop = "-".concat(tooltipOffset.height / 2, "px");

        if (typeof helperNumberLayer !== 'undefined' && helperNumberLayer !== null) {
          helperNumberLayer.style.left = "-".concat(tooltipOffset.width / 2 + 18, "px");
          helperNumberLayer.style.top = "-".concat(tooltipOffset.height / 2 + 18, "px");
        }

        break;

      case 'bottom-right-aligned':
        arrowLayer.className = 'introjs-arrow top-right';
        tooltipLayerStyleRight = 0;
        checkLeft(targetOffset, tooltipLayerStyleRight, tooltipOffset, tooltipLayer);
        tooltipLayer.style.top = "".concat(targetOffset.height + 20, "px");
        break;

      case 'bottom-middle-aligned':
        arrowLayer.className = 'introjs-arrow top-middle';
        tooltipLayerStyleLeftRight = targetOffset.width / 2 - tooltipOffset.width / 2; // a fix for middle aligned hints

        if (hintMode) {
          tooltipLayerStyleLeftRight += 5;
        }

        if (checkLeft(targetOffset, tooltipLayerStyleLeftRight, tooltipOffset, tooltipLayer)) {
          tooltipLayer.style.right = null;
          checkRight(targetOffset, tooltipLayerStyleLeftRight, tooltipOffset, windowSize, tooltipLayer);
        }

        tooltipLayer.style.top = "".concat(targetOffset.height + 20, "px");
        break;
      // case 'bottom-left-aligned':
      // Bottom-left-aligned is the same as the default bottom
      // case 'bottom':
      // Bottom going to follow the default behavior

      default:
        arrowLayer.className = 'introjs-arrow top';
        tooltipLayerStyleLeft = 0;
        checkRight(targetOffset, tooltipLayerStyleLeft, tooltipOffset, windowSize, tooltipLayer);
        tooltipLayer.style.top = "".concat(targetOffset.height + 20, "px");
    }
  }

  /**
   * To remove all show element(s)
   *
   * @api private
   * @method _removeShowElement
   */

  function removeShowElement() {
    var elms = document.querySelectorAll('.introjs-showElement');
    forEach(elms, function (elm) {
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
    var currentStep = parseInt(this._currentStep + 1, 10);
    return currentStep / this._introItems.length * 100;
  }
  /**
   * Add disableinteraction layer and adjust the size and position of the layer
   *
   * @api private
   * @method _disableInteraction
   */


  function _disableInteraction() {
    var disableInteractionLayer = document.querySelector('.introjs-disableInteraction');

    if (disableInteractionLayer === null) {
      disableInteractionLayer = document.createElement('div');
      disableInteractionLayer.className = 'introjs-disableInteraction';

      this._targetElement.appendChild(disableInteractionLayer);
    }

    setHelperLayerPosition.call(this, disableInteractionLayer);
  }
  /**
   * Show an element on the page
   *
   * @api private
   * @method _showElement
   * @param {Object} targetElement
   */


  function _showElement(targetElement) {
    if (typeof this._introChangeCallback !== 'undefined') {
      this._introChangeCallback.call(this, targetElement.element);
    }

    var self = this;
    var oldHelperLayer = document.querySelector('.introjs-helperLayer');
    var oldReferenceLayer = document.querySelector('.introjs-tooltipReferenceLayer');
    var highlightClass = 'introjs-helperLayer';
    var nextTooltipButton;
    var prevTooltipButton;
    var skipTooltipButton;
    var scrollParent; //check for a current step highlight class

    if (typeof targetElement.highlightClass === 'string') {
      highlightClass += " ".concat(targetElement.highlightClass);
    } //check for options highlight class


    if (typeof this._options.highlightClass === 'string') {
      highlightClass += " ".concat(this._options.highlightClass);
    }

    if (oldHelperLayer !== null) {
      var oldHelperNumberLayer = oldReferenceLayer.querySelector('.introjs-helperNumberLayer');
      var oldtooltipLayer = oldReferenceLayer.querySelector('.introjs-tooltiptext');
      var oldArrowLayer = oldReferenceLayer.querySelector('.introjs-arrow');
      var oldtooltipContainer = oldReferenceLayer.querySelector('.introjs-tooltip');
      skipTooltipButton = oldReferenceLayer.querySelector('.introjs-skipbutton');
      prevTooltipButton = oldReferenceLayer.querySelector('.introjs-prevbutton');
      nextTooltipButton = oldReferenceLayer.querySelector('.introjs-nextbutton'); //update or reset the helper highlight class

      oldHelperLayer.className = highlightClass; //hide the tooltip

      oldtooltipContainer.style.opacity = 0;
      oldtooltipContainer.style.display = "none";

      if (oldHelperNumberLayer !== null) {
        var lastIntroItem = this._introItems[targetElement.step - 2 >= 0 ? targetElement.step - 2 : 0];

        if (lastIntroItem !== null && this._direction === 'forward' && lastIntroItem.position === 'floating' || this._direction === 'backward' && targetElement.position === 'floating') {
          oldHelperNumberLayer.style.opacity = 0;
        }
      } // scroll to element


      scrollParent = getScrollParent(targetElement.element);

      if (scrollParent !== document.body) {
        // target is within a scrollable element
        scrollParentToElement(scrollParent, targetElement.element);
      } // set new position to helper layer


      setHelperLayerPosition.call(self, oldHelperLayer);
      setHelperLayerPosition.call(self, oldReferenceLayer); //remove `introjs-fixParent` class from the elements

      var fixParents = document.querySelectorAll('.introjs-fixParent');
      forEach(fixParents, function (parent) {
        removeClass(parent, /introjs-fixParent/g);
      }); //remove old classes if the element still exist

      removeShowElement(); //we should wait until the CSS3 transition is competed (it's 0.3 sec) to prevent incorrect `height` and `width` calculation

      if (self._lastShowElementTimer) {
        window.clearTimeout(self._lastShowElementTimer);
      }

      self._lastShowElementTimer = window.setTimeout(function () {
        //set current step to the label
        if (oldHelperNumberLayer !== null) {
          oldHelperNumberLayer.innerHTML = targetElement.step;
        } //set current tooltip text


        oldtooltipLayer.innerHTML = targetElement.intro; //set the tooltip position

        oldtooltipContainer.style.display = "block";
        placeTooltip.call(self, targetElement.element, oldtooltipContainer, oldArrowLayer, oldHelperNumberLayer); //change active bullet

        if (self._options.showBullets) {
          oldReferenceLayer.querySelector('.introjs-bullets li > a.active').className = '';
          oldReferenceLayer.querySelector(".introjs-bullets li > a[data-stepnumber=\"".concat(targetElement.step, "\"]")).className = 'active';
        }

        oldReferenceLayer.querySelector('.introjs-progress .introjs-progressbar').style.cssText = "width:".concat(_getProgress.call(self), "%;");
        oldReferenceLayer.querySelector('.introjs-progress .introjs-progressbar').setAttribute('aria-valuenow', _getProgress.call(self)); //show the tooltip

        oldtooltipContainer.style.opacity = 1;
        if (oldHelperNumberLayer) oldHelperNumberLayer.style.opacity = 1; //reset button focus

        if (typeof skipTooltipButton !== "undefined" && skipTooltipButton !== null && /introjs-donebutton/gi.test(skipTooltipButton.className)) {
          // skip button is now "done" button
          skipTooltipButton.focus();
        } else if (typeof nextTooltipButton !== "undefined" && nextTooltipButton !== null) {
          //still in the tour, focus on next
          nextTooltipButton.focus();
        } // change the scroll of the window, if needed


        scrollTo.call(self, targetElement.scrollTo, targetElement, oldtooltipLayer);
      }, 350); // end of old element if-else condition
    } else {
      var helperLayer = document.createElement('div');
      var referenceLayer = document.createElement('div');
      var arrowLayer = document.createElement('div');
      var tooltipLayer = document.createElement('div');
      var tooltipTextLayer = document.createElement('div');
      var bulletsLayer = document.createElement('div');
      var progressLayer = document.createElement('div');
      var buttonsLayer = document.createElement('div');
      helperLayer.className = highlightClass;
      referenceLayer.className = 'introjs-tooltipReferenceLayer'; // scroll to element

      scrollParent = getScrollParent(targetElement.element);

      if (scrollParent !== document.body) {
        // target is within a scrollable element
        scrollParentToElement(scrollParent, targetElement.element);
      } //set new position to helper layer


      setHelperLayerPosition.call(self, helperLayer);
      setHelperLayerPosition.call(self, referenceLayer); //add helper layer to target element

      this._targetElement.appendChild(helperLayer);

      this._targetElement.appendChild(referenceLayer);

      arrowLayer.className = 'introjs-arrow';
      tooltipTextLayer.className = 'introjs-tooltiptext';
      tooltipTextLayer.innerHTML = targetElement.intro;
      bulletsLayer.className = 'introjs-bullets';

      if (this._options.showBullets === false) {
        bulletsLayer.style.display = 'none';
      }

      var ulContainer = document.createElement('ul');
      ulContainer.setAttribute('role', 'tablist');

      var anchorClick = function anchorClick() {
        self.goToStep(this.getAttribute('data-stepnumber'));
      };

      forEach(this._introItems, function (_ref, i) {
        var step = _ref.step;
        var innerLi = document.createElement('li');
        var anchorLink = document.createElement('a');
        innerLi.setAttribute('role', 'presentation');
        anchorLink.setAttribute('role', 'tab');
        anchorLink.onclick = anchorClick;

        if (i === targetElement.step - 1) {
          anchorLink.className = 'active';
        }

        setAnchorAsButton(anchorLink);
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

      var progressBar = document.createElement('div');
      progressBar.className = 'introjs-progressbar';
      progressBar.setAttribute('role', 'progress');
      progressBar.setAttribute('aria-valuemin', 0);
      progressBar.setAttribute('aria-valuemax', 100);
      progressBar.setAttribute('aria-valuenow', _getProgress.call(this));
      progressBar.style.cssText = "width:".concat(_getProgress.call(this), "%;");
      progressLayer.appendChild(progressBar);
      buttonsLayer.className = 'introjs-tooltipbuttons';

      if (this._options.showButtons === false) {
        buttonsLayer.style.display = 'none';
      }

      tooltipLayer.className = 'introjs-tooltip';
      tooltipLayer.appendChild(tooltipTextLayer);
      tooltipLayer.appendChild(bulletsLayer);
      tooltipLayer.appendChild(progressLayer); //add helper layer number

      var helperNumberLayer = document.createElement('span');

      if (this._options.showStepNumbers === true) {
        helperNumberLayer.className = 'introjs-helperNumberLayer';
        helperNumberLayer.innerHTML = targetElement.step;
        referenceLayer.appendChild(helperNumberLayer);
      }

      tooltipLayer.appendChild(arrowLayer);
      referenceLayer.appendChild(tooltipLayer); //next button

      nextTooltipButton = document.createElement('a');

      nextTooltipButton.onclick = function () {
        if (self._introItems.length - 1 !== self._currentStep) {
          nextStep.call(self);
        }
      };

      setAnchorAsButton(nextTooltipButton);
      nextTooltipButton.innerHTML = this._options.nextLabel; //previous button

      prevTooltipButton = document.createElement('a');

      prevTooltipButton.onclick = function () {
        if (self._currentStep !== 0) {
          previousStep.call(self);
        }
      };

      setAnchorAsButton(prevTooltipButton);
      prevTooltipButton.innerHTML = this._options.prevLabel; //skip button

      skipTooltipButton = document.createElement('a');
      skipTooltipButton.className = "".concat(this._options.buttonClass, " introjs-skipbutton ");
      setAnchorAsButton(skipTooltipButton);
      skipTooltipButton.innerHTML = this._options.skipLabel;

      skipTooltipButton.onclick = function () {
        if (self._introItems.length - 1 === self._currentStep && typeof self._introCompleteCallback === 'function') {
          self._introCompleteCallback.call(self);
        }

        if (self._introItems.length - 1 !== self._currentStep && typeof self._introExitCallback === 'function') {
          self._introExitCallback.call(self);
        }

        if (typeof self._introSkipCallback === 'function') {
          self._introSkipCallback.call(self);
        }

        exitIntro.call(self, self._targetElement);
      };

      buttonsLayer.appendChild(skipTooltipButton); //in order to prevent displaying next/previous button always

      if (this._introItems.length > 1) {
        buttonsLayer.appendChild(prevTooltipButton);
        buttonsLayer.appendChild(nextTooltipButton);
      }

      tooltipLayer.appendChild(buttonsLayer); //set proper position

      placeTooltip.call(self, targetElement.element, tooltipLayer, arrowLayer, helperNumberLayer); // change the scroll of the window, if needed

      scrollTo.call(this, targetElement.scrollTo, targetElement, tooltipLayer); //end of new element if-else condition
    } // removing previous disable interaction layer


    var disableInteractionLayer = self._targetElement.querySelector('.introjs-disableInteraction');

    if (disableInteractionLayer) {
      disableInteractionLayer.parentNode.removeChild(disableInteractionLayer);
    } //disable interaction


    if (targetElement.disableInteraction) {
      _disableInteraction.call(self);
    } // when it's the first step of tour


    if (this._currentStep === 0 && this._introItems.length > 1) {
      if (typeof skipTooltipButton !== "undefined" && skipTooltipButton !== null) {
        skipTooltipButton.className = "".concat(this._options.buttonClass, " introjs-skipbutton");
      }

      if (typeof nextTooltipButton !== "undefined" && nextTooltipButton !== null) {
        nextTooltipButton.className = "".concat(this._options.buttonClass, " introjs-nextbutton");
      }

      if (this._options.hidePrev === true) {
        if (typeof prevTooltipButton !== "undefined" && prevTooltipButton !== null) {
          prevTooltipButton.className = "".concat(this._options.buttonClass, " introjs-prevbutton introjs-hidden");
        }

        if (typeof nextTooltipButton !== "undefined" && nextTooltipButton !== null) {
          addClass(nextTooltipButton, 'introjs-fullbutton');
        }
      } else {
        if (typeof prevTooltipButton !== "undefined" && prevTooltipButton !== null) {
          prevTooltipButton.className = "".concat(this._options.buttonClass, " introjs-prevbutton introjs-disabled");
        }
      }

      if (typeof skipTooltipButton !== "undefined" && skipTooltipButton !== null) {
        skipTooltipButton.innerHTML = this._options.skipLabel;
      }
    } else if (this._introItems.length - 1 === this._currentStep || this._introItems.length === 1) {
      // last step of tour
      if (typeof skipTooltipButton !== "undefined" && skipTooltipButton !== null) {
        skipTooltipButton.innerHTML = this._options.doneLabel; // adding donebutton class in addition to skipbutton

        addClass(skipTooltipButton, 'introjs-donebutton');
      }

      if (typeof prevTooltipButton !== "undefined" && prevTooltipButton !== null) {
        prevTooltipButton.className = "".concat(this._options.buttonClass, " introjs-prevbutton");
      }

      if (this._options.hideNext === true) {
        if (typeof nextTooltipButton !== "undefined" && nextTooltipButton !== null) {
          nextTooltipButton.className = "".concat(this._options.buttonClass, " introjs-nextbutton introjs-hidden");
        }

        if (typeof prevTooltipButton !== "undefined" && prevTooltipButton !== null) {
          addClass(prevTooltipButton, 'introjs-fullbutton');
        }
      } else {
        if (typeof nextTooltipButton !== "undefined" && nextTooltipButton !== null) {
          nextTooltipButton.className = "".concat(this._options.buttonClass, " introjs-nextbutton introjs-disabled");
        }
      }
    } else {
      // steps between start and end
      if (typeof skipTooltipButton !== "undefined" && skipTooltipButton !== null) {
        skipTooltipButton.className = "".concat(this._options.buttonClass, " introjs-skipbutton");
      }

      if (typeof prevTooltipButton !== "undefined" && prevTooltipButton !== null) {
        prevTooltipButton.className = "".concat(this._options.buttonClass, " introjs-prevbutton");
      }

      if (typeof nextTooltipButton !== "undefined" && nextTooltipButton !== null) {
        nextTooltipButton.className = "".concat(this._options.buttonClass, " introjs-nextbutton");
      }

      if (typeof skipTooltipButton !== "undefined" && skipTooltipButton !== null) {
        skipTooltipButton.innerHTML = this._options.skipLabel;
      }
    }

    prevTooltipButton.setAttribute('role', 'button');
    nextTooltipButton.setAttribute('role', 'button');
    skipTooltipButton.setAttribute('role', 'button'); //Set focus on "next" button, so that hitting Enter always moves you onto the next step

    if (typeof nextTooltipButton !== "undefined" && nextTooltipButton !== null) {
      nextTooltipButton.focus();
    }

    setShowElement(targetElement);

    if (typeof this._introAfterChangeCallback !== 'undefined') {
      this._introAfterChangeCallback.call(this, targetElement.element);
    }
  }

  /**
   * Go to specific step of introduction
   *
   * @api private
   * @method _goToStep
   */

  function goToStep(step) {
    //because steps starts with zero
    this._currentStep = step - 2;

    if (typeof this._introItems !== 'undefined') {
      nextStep.call(this);
    }
  }
  /**
   * Go to the specific step of introduction with the explicit [data-step] number
   *
   * @api private
   * @method _goToStepNumber
   */

  function goToStepNumber(step) {
    this._currentStepNumber = step;

    if (typeof this._introItems !== 'undefined') {
      nextStep.call(this);
    }
  }
  /**
   * Go to next step on intro
   *
   * @api private
   * @method _nextStep
   */

  function nextStep() {
    var _this = this;

    this._direction = 'forward';

    if (typeof this._currentStepNumber !== 'undefined') {
      forEach(this._introItems, function (_ref, i) {
        var step = _ref.step;

        if (step === _this._currentStepNumber) {
          _this._currentStep = i - 1;
          _this._currentStepNumber = undefined;
        }
      });
    }

    if (typeof this._currentStep === 'undefined') {
      this._currentStep = 0;
    } else {
      ++this._currentStep;
    }

    var nextStep = this._introItems[this._currentStep];
    var continueStep = true;

    if (typeof this._introBeforeChangeCallback !== 'undefined') {
      continueStep = this._introBeforeChangeCallback.call(this, nextStep.element);
    } // if `onbeforechange` returned `false`, stop displaying the element


    if (continueStep === false) {
      --this._currentStep;
      return false;
    }

    if (this._introItems.length <= this._currentStep) {
      //end of the intro
      //check if any callback is defined
      if (typeof this._introCompleteCallback === 'function') {
        this._introCompleteCallback.call(this);
      }

      exitIntro.call(this, this._targetElement);
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

  function previousStep() {
    this._direction = 'backward';

    if (this._currentStep === 0) {
      return false;
    }

    --this._currentStep;
    var nextStep = this._introItems[this._currentStep];
    var continueStep = true;

    if (typeof this._introBeforeChangeCallback !== 'undefined') {
      continueStep = this._introBeforeChangeCallback.call(this, nextStep.element);
    } // if `onbeforechange` returned `false`, stop displaying the element


    if (continueStep === false) {
      ++this._currentStep;
      return false;
    }

    _showElement.call(this, nextStep);
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

  function onKeyDown(e) {
    var code = e.code === null ? e.which : e.code; // if code/e.which is null

    if (code === null) {
      code = e.charCode === null ? e.keyCode : e.charCode;
    }

    if ((code === 'Escape' || code === 27) && this._options.exitOnEsc === true) {
      //escape key pressed, exit the intro
      //check if exit callback is defined
      exitIntro.call(this, this._targetElement);
    } else if (code === 'ArrowLeft' || code === 37) {
      //left arrow
      previousStep.call(this);
    } else if (code === 'ArrowRight' || code === 39) {
      //right arrow
      nextStep.call(this);
    } else if (code === 'Enter' || code === 13) {
      //srcElement === ie
      var target = e.target || e.srcElement;

      if (target && target.className.match('introjs-prevbutton')) {
        //user hit enter while focusing on previous button
        previousStep.call(this);
      } else if (target && target.className.match('introjs-skipbutton')) {
        //user hit enter while focusing on skip button
        if (this._introItems.length - 1 === this._currentStep && typeof this._introCompleteCallback === 'function') {
          this._introCompleteCallback.call(this);
        }

        exitIntro.call(this, this._targetElement);
      } else if (target && target.getAttribute('data-stepnumber')) {
        // user hit enter while focusing on step bullet
        target.click();
      } else {
        //default behavior for responding to enter
        nextStep.call(this);
      } //prevent default behaviour on hitting Enter, to prevent steps being skipped in some browsers


      if (e.preventDefault) {
        e.preventDefault();
      } else {
        e.returnValue = false;
      }
    }
  }

  /*
    * makes a copy of the object
    * @api private
    * @method _cloneObject
   */
  function cloneObject(object) {
    if (object === null || _typeof(object) !== 'object' || typeof object.nodeType !== 'undefined') {
      return object;
    }

    var temp = {};

    for (var key in object) {
      if (typeof window.jQuery !== 'undefined' && object[key] instanceof window.jQuery) {
        temp[key] = object[key];
      } else {
        temp[key] = cloneObject(object[key]);
      }
    }

    return temp;
  }

  /**
   * Get a queryselector within the hint wrapper
   *
   * @param {String} selector
   * @return {NodeList|Array}
   */

  function hintQuerySelectorAll(selector) {
    var hintsWrapper = document.querySelector('.introjs-hints');
    return hintsWrapper ? hintsWrapper.querySelectorAll(selector) : [];
  }
  /**
   * Hide a hint
   *
   * @api private
   * @method hideHint
   */

  function hideHint(stepId) {
    var hint = hintQuerySelectorAll(".introjs-hint[data-step=\"".concat(stepId, "\"]"))[0];
    removeHintTooltip.call(this);

    if (hint) {
      addClass(hint, 'introjs-hidehint');
    } // call the callback function (if any)


    if (typeof this._hintCloseCallback !== 'undefined') {
      this._hintCloseCallback.call(this, stepId);
    }
  }
  /**
   * Hide all hints
   *
   * @api private
   * @method hideHints
   */

  function hideHints() {
    var _this = this;

    var hints = hintQuerySelectorAll('.introjs-hint');
    forEach(hints, function (hint) {
      hideHint.call(_this, hint.getAttribute('data-step'));
    });
  }
  /**
   * Show all hints
   *
   * @api private
   * @method _showHints
   */

  function showHints() {
    var _this2 = this;

    var hints = hintQuerySelectorAll('.introjs-hint');

    if (hints && hints.length) {
      forEach(hints, function (hint) {
        showHint.call(_this2, hint.getAttribute('data-step'));
      });
    } else {
      populateHints.call(this, this._targetElement);
    }
  }
  /**
   * Show a hint
   *
   * @api private
   * @method showHint
   */

  function showHint(stepId) {
    var hint = hintQuerySelectorAll(".introjs-hint[data-step=\"".concat(stepId, "\"]"))[0];

    if (hint) {
      removeClass(hint, /introjs-hidehint/g);
    }
  }
  /**
   * Removes all hint elements on the page
   * Useful when you want to destroy the elements and add them again (e.g. a modal or popup)
   *
   * @api private
   * @method removeHints
   */

  function removeHints() {
    var _this3 = this;

    var hints = hintQuerySelectorAll('.introjs-hint');
    forEach(hints, function (hint) {
      removeHint.call(_this3, hint.getAttribute('data-step'));
    });
  }
  /**
   * Remove one single hint element from the page
   * Useful when you want to destroy the element and add them again (e.g. a modal or popup)
   * Use removeHints if you want to remove all elements.
   *
   * @api private
   * @method removeHint
   */

  function removeHint(stepId) {
    var hint = hintQuerySelectorAll(".introjs-hint[data-step=\"".concat(stepId, "\"]"))[0];

    if (hint) {
      hint.parentNode.removeChild(hint);
    }
  }
  /**
   * Add all available hints to the page
   *
   * @api private
   * @method addHints
   */

  function addHints() {
    var _this4 = this;

    var self = this;
    var hintsWrapper = document.querySelector('.introjs-hints');

    if (hintsWrapper === null) {
      hintsWrapper = document.createElement('div');
      hintsWrapper.className = 'introjs-hints';
    }
    /**
     * Returns an event handler unique to the hint iteration
     *
     * @param {Integer} i
     * @return {Function}
     */


    var getHintClick = function getHintClick(i) {
      return function (e) {
        var evt = e ? e : window.event;

        if (evt.stopPropagation) {
          evt.stopPropagation();
        }

        if (evt.cancelBubble !== null) {
          evt.cancelBubble = true;
        }

        showHintDialog.call(self, i);
      };
    };

    forEach(this._introItems, function (item, i) {
      // avoid append a hint twice
      if (document.querySelector(".introjs-hint[data-step=\"".concat(i, "\"]"))) {
        return;
      }

      var hint = document.createElement('a');
      setAnchorAsButton(hint);
      hint.onclick = getHintClick(i);
      hint.className = 'introjs-hint';

      if (!item.hintAnimation) {
        addClass(hint, 'introjs-hint-no-anim');
      } // hint's position should be fixed if the target element's position is fixed


      if (isFixed(item.element)) {
        addClass(hint, 'introjs-fixedhint');
      }

      var hintDot = document.createElement('div');
      hintDot.className = 'introjs-hint-dot';
      var hintPulse = document.createElement('div');
      hintPulse.className = 'introjs-hint-pulse';
      hint.appendChild(hintDot);
      hint.appendChild(hintPulse);
      hint.setAttribute('data-step', i); // we swap the hint element with target element
      // because _setHelperLayerPosition uses `element` property

      item.targetElement = item.element;
      item.element = hint; // align the hint position

      alignHintPosition.call(_this4, item.hintPosition, hint, item.targetElement);
      hintsWrapper.appendChild(hint);
    }); // adding the hints wrapper

    document.body.appendChild(hintsWrapper); // call the callback function (if any)

    if (typeof this._hintsAddedCallback !== 'undefined') {
      this._hintsAddedCallback.call(this);
    }
  }
  /**
   * Aligns hint position
   *
   * @api private
   * @method alignHintPosition
   * @param {String} position
   * @param {Object} hint
   * @param {Object} element
   */

  function alignHintPosition(position, _ref, element) {
    var style = _ref.style;
    // get/calculate offset of target element
    var offset = getOffset.call(this, element);
    var iconWidth = 20;
    var iconHeight = 20; // align the hint element

    switch (position) {
      default:
      case 'top-left':
        style.left = "".concat(offset.left, "px");
        style.top = "".concat(offset.top, "px");
        break;

      case 'top-right':
        style.left = "".concat(offset.left + offset.width - iconWidth, "px");
        style.top = "".concat(offset.top, "px");
        break;

      case 'bottom-left':
        style.left = "".concat(offset.left, "px");
        style.top = "".concat(offset.top + offset.height - iconHeight, "px");
        break;

      case 'bottom-right':
        style.left = "".concat(offset.left + offset.width - iconWidth, "px");
        style.top = "".concat(offset.top + offset.height - iconHeight, "px");
        break;

      case 'middle-left':
        style.left = "".concat(offset.left, "px");
        style.top = "".concat(offset.top + (offset.height - iconHeight) / 2, "px");
        break;

      case 'middle-right':
        style.left = "".concat(offset.left + offset.width - iconWidth, "px");
        style.top = "".concat(offset.top + (offset.height - iconHeight) / 2, "px");
        break;

      case 'middle-middle':
        style.left = "".concat(offset.left + (offset.width - iconWidth) / 2, "px");
        style.top = "".concat(offset.top + (offset.height - iconHeight) / 2, "px");
        break;

      case 'bottom-middle':
        style.left = "".concat(offset.left + (offset.width - iconWidth) / 2, "px");
        style.top = "".concat(offset.top + offset.height - iconHeight, "px");
        break;

      case 'top-middle':
        style.left = "".concat(offset.left + (offset.width - iconWidth) / 2, "px");
        style.top = "".concat(offset.top, "px");
        break;
    }
  }
  /**
   * Triggers when user clicks on the hint element
   *
   * @api private
   * @method _showHintDialog
   * @param {Number} stepId
   */

  function showHintDialog(stepId) {
    var hintElement = document.querySelector(".introjs-hint[data-step=\"".concat(stepId, "\"]"));
    var item = this._introItems[stepId]; // call the callback function (if any)

    if (typeof this._hintClickCallback !== 'undefined') {
      this._hintClickCallback.call(this, hintElement, item, stepId);
    } // remove all open tooltips


    var removedStep = removeHintTooltip.call(this); // to toggle the tooltip

    if (parseInt(removedStep, 10) === stepId) {
      return;
    }

    var tooltipLayer = document.createElement('div');
    var tooltipTextLayer = document.createElement('div');
    var arrowLayer = document.createElement('div');
    var referenceLayer = document.createElement('div');
    tooltipLayer.className = 'introjs-tooltip';

    tooltipLayer.onclick = function (e) {
      //IE9 & Other Browsers
      if (e.stopPropagation) {
        e.stopPropagation();
      } //IE8 and Lower
      else {
          e.cancelBubble = true;
        }
    };

    tooltipTextLayer.className = 'introjs-tooltiptext';
    var tooltipWrapper = document.createElement('p');
    tooltipWrapper.innerHTML = item.hint;
    var closeButton = document.createElement('a');
    closeButton.className = this._options.buttonClass;
    closeButton.setAttribute('role', 'button');
    closeButton.innerHTML = this._options.hintButtonLabel;
    closeButton.onclick = hideHint.bind(this, stepId);
    tooltipTextLayer.appendChild(tooltipWrapper);
    tooltipTextLayer.appendChild(closeButton);
    arrowLayer.className = 'introjs-arrow';
    tooltipLayer.appendChild(arrowLayer);
    tooltipLayer.appendChild(tooltipTextLayer); // set current step for _placeTooltip function

    this._currentStep = hintElement.getAttribute('data-step'); // align reference layer position

    referenceLayer.className = 'introjs-tooltipReferenceLayer introjs-hintReference';
    referenceLayer.setAttribute('data-step', hintElement.getAttribute('data-step'));
    setHelperLayerPosition.call(this, referenceLayer);
    referenceLayer.appendChild(tooltipLayer);
    document.body.appendChild(referenceLayer); //set proper position

    placeTooltip.call(this, hintElement, tooltipLayer, arrowLayer, null, true);
  }
  /**
   * Removes open hint (tooltip hint)
   *
   * @api private
   * @method _removeHintTooltip
   */

  function removeHintTooltip() {
    var tooltip = document.querySelector('.introjs-hintReference');

    if (tooltip) {
      var step = tooltip.getAttribute('data-step');
      tooltip.parentNode.removeChild(tooltip);
      return step;
    }
  }
  /**
   * Start parsing hint items
   *
   * @api private
   * @param {Object} targetElm
   * @method _startHint
   */

  function populateHints(targetElm) {
    var _this5 = this;

    this._introItems = [];

    if (this._options.hints) {
      forEach(this._options.hints, function (hint) {
        var currentItem = cloneObject(hint);

        if (typeof currentItem.element === 'string') {
          //grab the element with given selector from the page
          currentItem.element = document.querySelector(currentItem.element);
        }

        currentItem.hintPosition = currentItem.hintPosition || _this5._options.hintPosition;
        currentItem.hintAnimation = currentItem.hintAnimation || _this5._options.hintAnimation;

        if (currentItem.element !== null) {
          _this5._introItems.push(currentItem);
        }
      });
    } else {
      var hints = targetElm.querySelectorAll('*[data-hint]');

      if (!hints || !hints.length) {
        return false;
      } //first add intro items with data-step


      forEach(hints, function (currentElement) {
        // hint animation
        var hintAnimation = currentElement.getAttribute('data-hintanimation');

        if (hintAnimation) {
          hintAnimation = hintAnimation === 'true';
        } else {
          hintAnimation = _this5._options.hintAnimation;
        }

        _this5._introItems.push({
          element: currentElement,
          hint: currentElement.getAttribute('data-hint'),
          hintPosition: currentElement.getAttribute('data-hintposition') || _this5._options.hintPosition,
          hintAnimation: hintAnimation,
          tooltipClass: currentElement.getAttribute('data-tooltipclass'),
          position: currentElement.getAttribute('data-position') || _this5._options.tooltipPosition
        });
      });
    }

    addHints.call(this);
    /*
    todo:
    these events should be removed at some point
    */

    DOMEvent.on(document, 'click', removeHintTooltip, this, false);
    DOMEvent.on(window, 'resize', reAlignHints, this, true);
  }
  /**
   * Re-aligns all hint elements
   *
   * @api private
   * @method _reAlignHints
   */

  function reAlignHints() {
    var _this6 = this;

    forEach(this._introItems, function (_ref2) {
      var targetElement = _ref2.targetElement,
          hintPosition = _ref2.hintPosition,
          element = _ref2.element;

      if (typeof targetElement === 'undefined') {
        return;
      }

      alignHintPosition.call(_this6, hintPosition, element, targetElement);
    });
  }

  /**
   * Update placement of the intro objects on the screen
   * @api private
   */

  function refresh() {
    // re-align intros
    setHelperLayerPosition.call(this, document.querySelector('.introjs-helperLayer'));
    setHelperLayerPosition.call(this, document.querySelector('.introjs-tooltipReferenceLayer'));
    setHelperLayerPosition.call(this, document.querySelector('.introjs-disableInteraction')); // re-align tooltip

    if (this._currentStep !== undefined && this._currentStep !== null) {
      var oldHelperNumberLayer = document.querySelector('.introjs-helperNumberLayer');
      var oldArrowLayer = document.querySelector('.introjs-arrow');
      var oldtooltipContainer = document.querySelector('.introjs-tooltip');
      placeTooltip.call(this, this._introItems[this._currentStep].element, oldtooltipContainer, oldArrowLayer, oldHelperNumberLayer);
    } //re-align hints


    reAlignHints.call(this);
    return this;
  }

  function onResize() {
    refresh.call(this);
  }

  /**
   * Exit from intro
   *
   * @api private
   * @method _exitIntro
   * @param {Object} targetElement
   * @param {Boolean} force - Setting to `true` will skip the result of beforeExit callback
   */

  function exitIntro(targetElement, force) {
    var continueExit = true; // calling onbeforeexit callback
    //
    // If this callback return `false`, it would halt the process

    if (this._introBeforeExitCallback !== undefined) {
      continueExit = this._introBeforeExitCallback.call(this);
    } // skip this check if `force` parameter is `true`
    // otherwise, if `onbeforeexit` returned `false`, don't exit the intro


    if (!force && continueExit === false) return; //remove overlay layers from the page

    var overlayLayers = targetElement.querySelectorAll('.introjs-overlay');

    if (overlayLayers && overlayLayers.length) {
      forEach(overlayLayers, function (overlayLayer) {
        overlayLayer.style.opacity = 0;
        window.setTimeout(function () {
          if (this.parentNode) {
            this.parentNode.removeChild(this);
          }
        }.bind(overlayLayer), 500);
      });
    } //remove all helper layers


    var helperLayer = targetElement.querySelector('.introjs-helperLayer');

    if (helperLayer) {
      helperLayer.parentNode.removeChild(helperLayer);
    }

    var referenceLayer = targetElement.querySelector('.introjs-tooltipReferenceLayer');

    if (referenceLayer) {
      referenceLayer.parentNode.removeChild(referenceLayer);
    } //remove disableInteractionLayer


    var disableInteractionLayer = targetElement.querySelector('.introjs-disableInteraction');

    if (disableInteractionLayer) {
      disableInteractionLayer.parentNode.removeChild(disableInteractionLayer);
    } //remove intro floating element


    var floatingElement = document.querySelector('.introjsFloatingElement');

    if (floatingElement) {
      floatingElement.parentNode.removeChild(floatingElement);
    }

    removeShowElement(); //remove `introjs-fixParent` class from the elements

    var fixParents = document.querySelectorAll('.introjs-fixParent');
    forEach(fixParents, function (parent) {
      removeClass(parent, /introjs-fixParent/g);
    }); //clean listeners

    DOMEvent.off(window, 'keydown', onKeyDown, this, true);
    DOMEvent.off(window, 'resize', onResize, this, true); //check if any callback is defined

    if (this._introExitCallback !== undefined) {
      this._introExitCallback.call(this);
    } //set the step to zero


    this._currentStep = undefined;
  }

  /**
   * Add overlay layer to the page
   *
   * @api private
   * @method _addOverlayLayer
   * @param {Object} targetElm
   */

  function addOverlayLayer(targetElm) {
    var overlayLayer = document.createElement('div');
    var styleText = '';
    var self = this; //set css class name

    overlayLayer.className = 'introjs-overlay'; //check if the target element is body, we should calculate the size of overlay layer in a better way

    if (!targetElm.tagName || targetElm.tagName.toLowerCase() === 'body') {
      styleText += 'top: 0;bottom: 0; left: 0;right: 0;position: fixed;';
      overlayLayer.style.cssText = styleText;
    } else {
      //set overlay layer position
      var elementPosition = getOffset(targetElm);

      if (elementPosition) {
        styleText += "width: ".concat(elementPosition.width, "px; height:").concat(elementPosition.height, "px; top:").concat(elementPosition.top, "px;left: ").concat(elementPosition.left, "px;");
        overlayLayer.style.cssText = styleText;
      }
    }

    targetElm.appendChild(overlayLayer);

    overlayLayer.onclick = function () {
      if (self._options.exitOnOverlayClick === true) {
        exitIntro.call(self, targetElm);
      }
    };

    window.setTimeout(function () {
      styleText += "opacity: ".concat(self._options.overlayOpacity.toString(), ";");
      overlayLayer.style.cssText = styleText;
    }, 10);
    return true;
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

  function introForElement(targetElm, group) {
    var _this = this;

    var allIntroSteps = targetElm.querySelectorAll("*[data-intro]");
    var introItems = [];

    if (this._options.steps) {
      //use steps passed programmatically
      forEach(this._options.steps, function (step) {
        var currentItem = cloneObject(step); //set the step

        currentItem.step = introItems.length + 1; //use querySelector function only when developer used CSS selector

        if (typeof currentItem.element === 'string') {
          //grab the element with given selector from the page
          currentItem.element = document.querySelector(currentItem.element);
        } //intro without element


        if (typeof currentItem.element === 'undefined' || currentItem.element === null) {
          var floatingElementQuery = document.querySelector(".introjsFloatingElement");

          if (floatingElementQuery === null) {
            floatingElementQuery = document.createElement('div');
            floatingElementQuery.className = 'introjsFloatingElement';
            document.body.appendChild(floatingElementQuery);
          }

          currentItem.element = floatingElementQuery;
          currentItem.position = 'floating';
        }

        currentItem.scrollTo = currentItem.scrollTo || _this._options.scrollTo;

        if (typeof currentItem.disableInteraction === 'undefined') {
          currentItem.disableInteraction = _this._options.disableInteraction;
        }

        if (currentItem.element !== null) {
          introItems.push(currentItem);
        }
      });
    } else {
      //use steps from data-* annotations
      var elmsLength = allIntroSteps.length;
      var disableInteraction; //if there's no element to intro

      if (elmsLength < 1) {
        return false;
      }

      forEach(allIntroSteps, function (currentElement) {
        // PR #80
        // start intro for groups of elements
        if (group && currentElement.getAttribute("data-intro-group") !== group) {
          return;
        } // skip hidden elements


        if (currentElement.style.display === 'none') {
          return;
        }

        var step = parseInt(currentElement.getAttribute('data-step'), 10);

        if (typeof currentElement.getAttribute('data-disable-interaction') !== 'undefined') {
          disableInteraction = !!currentElement.getAttribute('data-disable-interaction');
        } else {
          disableInteraction = _this._options.disableInteraction;
        }

        if (step > 0) {
          introItems[step - 1] = {
            element: currentElement,
            intro: currentElement.getAttribute('data-intro'),
            step: parseInt(currentElement.getAttribute('data-step'), 10),
            tooltipClass: currentElement.getAttribute('data-tooltipclass'),
            highlightClass: currentElement.getAttribute('data-highlightclass'),
            position: currentElement.getAttribute('data-position') || _this._options.tooltipPosition,
            scrollTo: currentElement.getAttribute('data-scrollto') || _this._options.scrollTo,
            disableInteraction: disableInteraction
          };
        }
      }); //next add intro items without data-step
      //todo: we need a cleanup here, two loops are redundant

      var _nextStep = 0;
      forEach(allIntroSteps, function (currentElement) {
        // PR #80
        // start intro for groups of elements
        if (group && currentElement.getAttribute("data-intro-group") !== group) {
          return;
        }

        if (currentElement.getAttribute('data-step') === null) {
          while (true) {
            if (typeof introItems[_nextStep] === 'undefined') {
              break;
            } else {
              _nextStep++;
            }
          }

          if (typeof currentElement.getAttribute('data-disable-interaction') !== 'undefined') {
            disableInteraction = !!currentElement.getAttribute('data-disable-interaction');
          } else {
            disableInteraction = _this._options.disableInteraction;
          }

          introItems[_nextStep] = {
            element: currentElement,
            intro: currentElement.getAttribute('data-intro'),
            step: _nextStep + 1,
            tooltipClass: currentElement.getAttribute('data-tooltipclass'),
            highlightClass: currentElement.getAttribute('data-highlightclass'),
            position: currentElement.getAttribute('data-position') || _this._options.tooltipPosition,
            scrollTo: currentElement.getAttribute('data-scrollto') || _this._options.scrollTo,
            disableInteraction: disableInteraction
          };
        }
      });
    } //removing undefined/null elements


    var tempIntroItems = [];

    for (var z = 0; z < introItems.length; z++) {
      if (introItems[z]) {
        // copy non-falsy values to the end of the array
        tempIntroItems.push(introItems[z]);
      }
    }

    introItems = tempIntroItems; //Ok, sort all items with given steps

    introItems.sort(function (a, b) {
      return a.step - b.step;
    }); //set it to the introJs object

    this._introItems = introItems; //add overlay layer to the page

    if (addOverlayLayer.call(this, targetElm)) {
      //then, start the show
      nextStep.call(this);

      if (this._options.keyboardNavigation) {
        DOMEvent.on(window, 'keydown', onKeyDown, this, true);
      } //for window resize


      DOMEvent.on(window, 'resize', onResize, this, true);
    }

    return false;
  }

  var version = "2.9.3";

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

  var introJs = function introJs(targetElm) {
    var instance;

    if (_typeof(targetElm) === 'object') {
      //Ok, create a new instance
      instance = new IntroJs(targetElm);
    } else if (typeof targetElm === 'string') {
      //select the target element with query selector
      var targetElement = document.querySelector(targetElm);

      if (targetElement) {
        instance = new IntroJs(targetElement);
      } else {
        throw new Error('There is no element with given selector.');
      }
    } else {
      instance = new IntroJs(document.body);
    } // add instance to list of _instances
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


  introJs.version = version;
  /**
   * key-val object helper for introJs instances
   *
   * @property instances
   * @type Object
   */

  introJs.instances = {}; //Prototype

  introJs.fn = IntroJs.prototype = {
    clone: function clone() {
      return new IntroJs(this);
    },
    setOption: function setOption(option, value) {
      this._options[option] = value;
      return this;
    },
    setOptions: function setOptions(options) {
      this._options = mergeOptions(this._options, options);
      return this;
    },
    start: function start(group) {
      introForElement.call(this, this._targetElement, group);
      return this;
    },
    goToStep: function goToStep$1(step) {
      goToStep.call(this, step);

      return this;
    },
    addStep: function addStep(options) {
      if (!this._options.steps) {
        this._options.steps = [];
      }

      this._options.steps.push(options);

      return this;
    },
    addSteps: function addSteps(steps) {
      if (!steps.length) return;

      for (var index = 0; index < steps.length; index++) {
        this.addStep(steps[index]);
      }

      return this;
    },
    goToStepNumber: function goToStepNumber$1(step) {
      goToStepNumber.call(this, step);

      return this;
    },
    nextStep: function nextStep$1() {
      nextStep.call(this);

      return this;
    },
    previousStep: function previousStep$1() {
      previousStep.call(this);

      return this;
    },
    exit: function exit(force) {
      exitIntro.call(this, this._targetElement, force);
      return this;
    },
    refresh: function refresh$1() {
      refresh.call(this);

      return this;
    },
    onbeforechange: function onbeforechange(providedCallback) {
      if (typeof providedCallback === 'function') {
        this._introBeforeChangeCallback = providedCallback;
      } else {
        throw new Error('Provided callback for onbeforechange was not a function');
      }

      return this;
    },
    onchange: function onchange(providedCallback) {
      if (typeof providedCallback === 'function') {
        this._introChangeCallback = providedCallback;
      } else {
        throw new Error('Provided callback for onchange was not a function.');
      }

      return this;
    },
    onafterchange: function onafterchange(providedCallback) {
      if (typeof providedCallback === 'function') {
        this._introAfterChangeCallback = providedCallback;
      } else {
        throw new Error('Provided callback for onafterchange was not a function');
      }

      return this;
    },
    oncomplete: function oncomplete(providedCallback) {
      if (typeof providedCallback === 'function') {
        this._introCompleteCallback = providedCallback;
      } else {
        throw new Error('Provided callback for oncomplete was not a function.');
      }

      return this;
    },
    onhintsadded: function onhintsadded(providedCallback) {
      if (typeof providedCallback === 'function') {
        this._hintsAddedCallback = providedCallback;
      } else {
        throw new Error('Provided callback for onhintsadded was not a function.');
      }

      return this;
    },
    onhintclick: function onhintclick(providedCallback) {
      if (typeof providedCallback === 'function') {
        this._hintClickCallback = providedCallback;
      } else {
        throw new Error('Provided callback for onhintclick was not a function.');
      }

      return this;
    },
    onhintclose: function onhintclose(providedCallback) {
      if (typeof providedCallback === 'function') {
        this._hintCloseCallback = providedCallback;
      } else {
        throw new Error('Provided callback for onhintclose was not a function.');
      }

      return this;
    },
    onexit: function onexit(providedCallback) {
      if (typeof providedCallback === 'function') {
        this._introExitCallback = providedCallback;
      } else {
        throw new Error('Provided callback for onexit was not a function.');
      }

      return this;
    },
    onskip: function onskip(providedCallback) {
      if (typeof providedCallback === 'function') {
        this._introSkipCallback = providedCallback;
      } else {
        throw new Error('Provided callback for onskip was not a function.');
      }

      return this;
    },
    onbeforeexit: function onbeforeexit(providedCallback) {
      if (typeof providedCallback === 'function') {
        this._introBeforeExitCallback = providedCallback;
      } else {
        throw new Error('Provided callback for onbeforeexit was not a function.');
      }

      return this;
    },
    addHints: function addHints() {
      populateHints.call(this, this._targetElement);
      return this;
    },
    hideHint: function hideHint$1(stepId) {
      hideHint.call(this, stepId);

      return this;
    },
    hideHints: function hideHints$1() {
      hideHints.call(this);

      return this;
    },
    showHint: function showHint$1(stepId) {
      showHint.call(this, stepId);

      return this;
    },
    showHints: function showHints$1() {
      showHints.call(this);

      return this;
    },
    removeHints: function removeHints$1() {
      removeHints.call(this);

      return this;
    },
    removeHint: function removeHint$1(stepId) {
      removeHint().call(this, stepId);

      return this;
    },
    showHintDialog: function showHintDialog$1(stepId) {
      showHintDialog.call(this, stepId);

      return this;
    }
  };

  return introJs;

})));
