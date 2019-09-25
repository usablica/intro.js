var introJs = (function () {
  'use strict';

  /**
   * Overwrites obj1's values with obj2's and adds obj2's if non existent in obj1
   * via: http://stackoverflow.com/questions/171251/how-can-i-merge-properties-of-two-javascript-objects-dynamically
   *
   * @param obj1
   * @param obj2
   * @returns obj3 a new object based on obj1 and obj2
   */
  function mergeOptions(obj1, obj2) {
    const obj3 = {};
    let attrname;

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
  const stamp = (() => {
    const keys = {};
    return function stamp(obj, key = 'introjs-stamp') {
      // each group increments from 0
      keys[key] = keys[key] || 0; // stamp only once per object

      if (obj[key] === undefined) {
        // increment key for each new object
        obj[key] = keys[key]++;
      }

      return obj[key];
    };
  })();

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
      for (let i = 0, len = arr.length; i < len; i++) {
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
      const pre = element.getAttribute('class') || '';
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

  const DOMEvent = (() => {
    function DOMEvent() {
      const events_key = 'introjs_event';
      /**
       * Gets a unique ID for an event listener
       *
       * @param Object obj
       * @param String type        event type
       * @param Function listener
       * @param Object context
       * @return String
       */

      this._id = (obj, type, listener, context) => type + stamp(listener) + (context ? `_${stamp(context)}` : '');
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
        const id = this._id.apply(this, arguments);

        const handler = e => listener.call(context || obj, e || window.event);

        if ('addEventListener' in obj) {
          obj.addEventListener(type, handler, useCapture);
        } else if ('attachEvent' in obj) {
          obj.attachEvent(`on${type}`, handler);
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
        const id = this._id.apply(this, arguments);

        const handler = obj[events_key] && obj[events_key][id];

        if (!handler) {
          return;
        }

        if ('removeEventListener' in obj) {
          obj.removeEventListener(type, handler, useCapture);
        } else if ('detachEvent' in obj) {
          obj.detachEvent(`on${type}`, handler);
        }

        obj[events_key][id] = null;
      };
    }

    return new DOMEvent();
  })();

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
      const pre = element.getAttribute('class') || '';
      element.setAttribute('class', `${pre} ${className}`);
    } else {
      if (element.classList !== undefined) {
        // check for modern classList property
        const classes = className.split(' ');
        forEach(classes, cls => {
          element.classList.add(cls);
        });
      } else if (!element.className.match(className)) {
        // check if element doesn't already have className
        element.className += ` ${className}`;
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
    let propValue = '';

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

  function setShowElement({
    element
  }) {
    let parentElm; // we need to add this show element class to the parent of SVG elements
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
    const currentElementPosition = getPropValue(element, 'position');

    if (currentElementPosition !== 'absolute' && currentElementPosition !== 'relative' && currentElementPosition !== 'fixed') {
      //change to new intro item
      addClass(element, 'introjs-relativePosition');
    }

    parentElm = element.parentNode;

    while (parentElm !== null) {
      if (!parentElm.tagName || parentElm.tagName.toLowerCase() === 'body') break; //fix The Stacking Context problem.
      //More detail: https://developer.mozilla.org/en-US/docs/Web/Guide/CSS/Understanding_z_index/The_stacking_context

      const zIndex = getPropValue(parentElm, 'z-index');
      const opacity = parseFloat(getPropValue(parentElm, 'opacity'));
      const transform = getPropValue(parentElm, 'transform') || getPropValue(parentElm, '-webkit-transform') || getPropValue(parentElm, '-moz-transform') || getPropValue(parentElm, '-ms-transform') || getPropValue(parentElm, '-o-transform');

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
  function scrollParentToElement(parent, {
    offsetTop
  }) {
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
    let style = window.getComputedStyle(element);
    const excludeStaticParent = style.position === "absolute";
    const overflowRegex = /(auto|scroll)/;
    if (style.position === "fixed") return document.body;

    for (let parent = element; parent = parent.parentElement;) {
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
      const D = document.documentElement;
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
    const rect = el.getBoundingClientRect();
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

  function scrollTo(scrollTo, {
    element
  }, tooltipLayer) {
    if (scrollTo === 'off') return;
    let rect;
    if (!this._options.scrollToElement) return;

    if (scrollTo === 'tooltip') {
      rect = tooltipLayer.getBoundingClientRect();
    } else {
      rect = element.getBoundingClientRect();
    }

    if (!elementInViewport(element)) {
      const winHeight = getWinSize().height;
      const top = rect.bottom - (rect.bottom - rect.top); // TODO (afshinm): do we need scroll padding now?
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
    const body = document.body;
    const docEl = document.documentElement;
    const scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
    const scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;
    const x = element.getBoundingClientRect();
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
    const p = element.parentNode;

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
      const currentElement = this._introItems[this._currentStep];
      const elementPosition = getOffset(currentElement.element);
      let widthHeightPadding = this._options.helperElementPadding; // If the target element is fixed, the tooltip should be fixed as well.
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


      helperLayer.style.cssText = `width: ${elementPosition.width + widthHeightPadding}px; height:${elementPosition.height + widthHeightPadding}px; top:${elementPosition.top - widthHeightPadding / 2}px;left: ${elementPosition.left - widthHeightPadding / 2}px;`;
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
  function checkLeft(targetOffset, tooltipLayerStyleRight, tooltipOffset, tooltipLayer) {
    if (targetOffset.left + targetOffset.width - tooltipLayerStyleRight - tooltipOffset.width < 0) {
      // off the left side of the window
      tooltipLayer.style.left = `${-targetOffset.left}px`;
      return false;
    }

    tooltipLayer.style.right = `${tooltipLayerStyleRight}px`;
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

  function _determineAutoAlignment(offsetLeft, tooltipWidth, {
    width
  }, desiredAlignment) {
    const halfTooltipWidth = tooltipWidth / 2;
    const winWidth = Math.min(width, window.screen.width);
    const possibleAlignments = ['-left-aligned', '-middle-aligned', '-right-aligned'];
    let calculatedAlignment = ''; // valid left must be at least a tooltipWidth
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
    const possiblePositions = this._options.positionPrecedence.slice();

    const windowSize = getWinSize();
    const tooltipHeight = getOffset(tooltipLayer).height + 10;
    const tooltipWidth = getOffset(tooltipLayer).width + 20;
    const targetElementRect = targetElement.getBoundingClientRect(); // If we check all the possible areas, and there are no valid places for the tooltip, the element
    // must take up most of the screen real estate. Show the tooltip floating in the middle of the screen.

    let calculatedPosition = "floating";
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


    const desiredAlignment = (pos => {
      const hyphenIndex = pos.indexOf('-');

      if (hyphenIndex !== -1) {
        // has alignment
        return pos.substr(hyphenIndex);
      }

      return '';
    })(desiredTooltipPosition || ''); // strip alignment from position


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
    let tooltipCssClass = '';
    let currentStepObj;
    let tooltipOffset;
    let targetOffset;
    let windowSize;
    let currentTooltipPosition;
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

    tooltipLayer.className = `introjs-tooltip ${tooltipCssClass}`.replace(/^\s+|\s+$/g, '');
    tooltipLayer.setAttribute('role', 'dialog');
    currentTooltipPosition = this._introItems[this._currentStep].position; // Floating is always valid, no point in calculating

    if (currentTooltipPosition !== "floating") {
      currentTooltipPosition = _determineAutoPosition.call(this, targetElement, tooltipLayer, currentTooltipPosition);
    }

    let tooltipLayerStyleLeft;
    targetOffset = getOffset(targetElement);
    tooltipOffset = getOffset(tooltipLayer);
    windowSize = getWinSize();
    addClass(tooltipLayer, `introjs-${currentTooltipPosition}`);

    switch (currentTooltipPosition) {
      case 'top-right-aligned':
        arrowLayer.className = 'introjs-arrow bottom-right';
        let tooltipLayerStyleRight = 0;
        checkLeft(targetOffset, tooltipLayerStyleRight, tooltipOffset, tooltipLayer);
        tooltipLayer.style.bottom = `${targetOffset.height + 20}px`;
        break;

      case 'top-middle-aligned':
        arrowLayer.className = 'introjs-arrow bottom-middle';
        let tooltipLayerStyleLeftRight = targetOffset.width / 2 - tooltipOffset.width / 2; // a fix for middle aligned hints

        if (hintMode) {
          tooltipLayerStyleLeftRight += 5;
        }

        if (checkLeft(targetOffset, tooltipLayerStyleLeftRight, tooltipOffset, tooltipLayer)) {
          tooltipLayer.style.right = null;
          checkRight(targetOffset, tooltipLayerStyleLeftRight, tooltipOffset, windowSize, tooltipLayer);
        }

        tooltipLayer.style.bottom = `${targetOffset.height + 20}px`;
        break;

      case 'top-left-aligned': // top-left-aligned is the same as the default top

      case 'top':
        arrowLayer.className = 'introjs-arrow bottom';
        tooltipLayerStyleLeft = hintMode ? 0 : 15;
        checkRight(targetOffset, tooltipLayerStyleLeft, tooltipOffset, windowSize, tooltipLayer);
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
        arrowLayer.style.display = 'none'; //we have to adjust the top and left of layer manually for intro items without element

        tooltipLayer.style.left = '50%';
        tooltipLayer.style.top = '50%';
        tooltipLayer.style.marginLeft = `-${tooltipOffset.width / 2}px`;
        tooltipLayer.style.marginTop = `-${tooltipOffset.height / 2}px`;

        if (typeof helperNumberLayer !== 'undefined' && helperNumberLayer !== null) {
          helperNumberLayer.style.left = `-${tooltipOffset.width / 2 + 18}px`;
          helperNumberLayer.style.top = `-${tooltipOffset.height / 2 + 18}px`;
        }

        break;

      case 'bottom-right-aligned':
        arrowLayer.className = 'introjs-arrow top-right';
        tooltipLayerStyleRight = 0;
        checkLeft(targetOffset, tooltipLayerStyleRight, tooltipOffset, tooltipLayer);
        tooltipLayer.style.top = `${targetOffset.height + 20}px`;
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

        tooltipLayer.style.top = `${targetOffset.height + 20}px`;
        break;
      // case 'bottom-left-aligned':
      // Bottom-left-aligned is the same as the default bottom
      // case 'bottom':
      // Bottom going to follow the default behavior

      default:
        arrowLayer.className = 'introjs-arrow top';
        tooltipLayerStyleLeft = 0;
        checkRight(targetOffset, tooltipLayerStyleLeft, tooltipOffset, windowSize, tooltipLayer);
        tooltipLayer.style.top = `${targetOffset.height + 20}px`;
    }
  }

  /**
   * To remove all show element(s)
   *
   * @api private
   * @method _removeShowElement
   */

  function removeShowElement() {
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
    const currentStep = parseInt(this._currentStep + 1, 10);
    return currentStep / this._introItems.length * 100;
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

    const self = this;
    const oldHelperLayer = document.querySelector('.introjs-helperLayer');
    const oldReferenceLayer = document.querySelector('.introjs-tooltipReferenceLayer');
    let highlightClass = 'introjs-helperLayer';
    let nextTooltipButton;
    let prevTooltipButton;
    let skipTooltipButton;
    let scrollParent; //check for a current step highlight class

    if (typeof targetElement.highlightClass === 'string') {
      highlightClass += ` ${targetElement.highlightClass}`;
    } //check for options highlight class


    if (typeof this._options.highlightClass === 'string') {
      highlightClass += ` ${this._options.highlightClass}`;
    }

    if (oldHelperLayer !== null) {
      const oldHelperNumberLayer = oldReferenceLayer.querySelector('.introjs-helperNumberLayer');
      const oldtooltipLayer = oldReferenceLayer.querySelector('.introjs-tooltiptext');
      const oldArrowLayer = oldReferenceLayer.querySelector('.introjs-arrow');
      const oldtooltipContainer = oldReferenceLayer.querySelector('.introjs-tooltip');
      skipTooltipButton = oldReferenceLayer.querySelector('.introjs-skipbutton');
      prevTooltipButton = oldReferenceLayer.querySelector('.introjs-prevbutton');
      nextTooltipButton = oldReferenceLayer.querySelector('.introjs-nextbutton'); //update or reset the helper highlight class

      oldHelperLayer.className = highlightClass; //hide the tooltip

      oldtooltipContainer.style.opacity = 0;
      oldtooltipContainer.style.display = "none";

      if (oldHelperNumberLayer !== null) {
        const lastIntroItem = this._introItems[targetElement.step - 2 >= 0 ? targetElement.step - 2 : 0];

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

      const fixParents = document.querySelectorAll('.introjs-fixParent');
      forEach(fixParents, parent => {
        removeClass(parent, /introjs-fixParent/g);
      }); //remove old classes if the element still exist

      removeShowElement(); //we should wait until the CSS3 transition is competed (it's 0.3 sec) to prevent incorrect `height` and `width` calculation

      if (self._lastShowElementTimer) {
        window.clearTimeout(self._lastShowElementTimer);
      }

      self._lastShowElementTimer = window.setTimeout(() => {
        //set current step to the label
        if (oldHelperNumberLayer !== null) {
          oldHelperNumberLayer.innerHTML = targetElement.step;
        } //set current tooltip text


        oldtooltipLayer.innerHTML = targetElement.intro; //set the tooltip position

        oldtooltipContainer.style.display = "block";
        placeTooltip.call(self, targetElement.element, oldtooltipContainer, oldArrowLayer, oldHelperNumberLayer); //change active bullet

        if (self._options.showBullets) {
          oldReferenceLayer.querySelector('.introjs-bullets li > a.active').className = '';
          oldReferenceLayer.querySelector(`.introjs-bullets li > a[data-stepnumber="${targetElement.step}"]`).className = 'active';
        }

        oldReferenceLayer.querySelector('.introjs-progress .introjs-progressbar').style.cssText = `width:${_getProgress.call(self)}%;`;
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
      const helperLayer = document.createElement('div');
      const referenceLayer = document.createElement('div');
      const arrowLayer = document.createElement('div');
      const tooltipLayer = document.createElement('div');
      const tooltipTextLayer = document.createElement('div');
      const bulletsLayer = document.createElement('div');
      const progressLayer = document.createElement('div');
      const buttonsLayer = document.createElement('div');
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

      const ulContainer = document.createElement('ul');
      ulContainer.setAttribute('role', 'tablist');

      const anchorClick = function () {
        self.goToStep(this.getAttribute('data-stepnumber'));
      };

      forEach(this._introItems, ({
        step
      }, i) => {
        const innerLi = document.createElement('li');
        const anchorLink = document.createElement('a');
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
      tooltipLayer.appendChild(progressLayer); //add helper layer number

      const helperNumberLayer = document.createElement('span');

      if (this._options.showStepNumbers === true) {
        helperNumberLayer.className = 'introjs-helperNumberLayer';
        helperNumberLayer.innerHTML = targetElement.step;
        referenceLayer.appendChild(helperNumberLayer);
      }

      tooltipLayer.appendChild(arrowLayer);
      referenceLayer.appendChild(tooltipLayer); //next button

      nextTooltipButton = document.createElement('a');

      nextTooltipButton.onclick = () => {
        if (self._introItems.length - 1 !== self._currentStep) {
          nextStep.call(self);
        }
      };

      setAnchorAsButton(nextTooltipButton);
      nextTooltipButton.innerHTML = this._options.nextLabel; //previous button

      prevTooltipButton = document.createElement('a');

      prevTooltipButton.onclick = () => {
        if (self._currentStep !== 0) {
          previousStep.call(self);
        }
      };

      setAnchorAsButton(prevTooltipButton);
      prevTooltipButton.innerHTML = this._options.prevLabel; //skip button

      skipTooltipButton = document.createElement('a');
      skipTooltipButton.className = `${this._options.buttonClass} introjs-skipbutton `;
      setAnchorAsButton(skipTooltipButton);
      skipTooltipButton.innerHTML = this._options.skipLabel;

      skipTooltipButton.onclick = () => {
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


    const disableInteractionLayer = self._targetElement.querySelector('.introjs-disableInteraction');

    if (disableInteractionLayer) {
      disableInteractionLayer.parentNode.removeChild(disableInteractionLayer);
    } //disable interaction


    if (targetElement.disableInteraction) {
      _disableInteraction.call(self);
    } // when it's the first step of tour


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
        skipTooltipButton.innerHTML = this._options.doneLabel; // adding donebutton class in addition to skipbutton

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
    this._direction = 'forward';

    if (typeof this._currentStepNumber !== 'undefined') {
      forEach(this._introItems, ({
        step
      }, i) => {
        if (step === this._currentStepNumber) {
          this._currentStep = i - 1;
          this._currentStepNumber = undefined;
        }
      });
    }

    if (typeof this._currentStep === 'undefined') {
      this._currentStep = 0;
    } else {
      ++this._currentStep;
    }

    const nextStep = this._introItems[this._currentStep];
    let continueStep = true;

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
    const nextStep = this._introItems[this._currentStep];
    let continueStep = true;

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
    let code = e.code === null ? e.which : e.code; // if code/e.which is null

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
      const target = e.target || e.srcElement;

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
    if (object === null || typeof object !== 'object' || typeof object.nodeType !== 'undefined') {
      return object;
    }

    const temp = {};

    for (const key in object) {
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
    const hintsWrapper = document.querySelector('.introjs-hints');
    return hintsWrapper ? hintsWrapper.querySelectorAll(selector) : [];
  }
  /**
   * Hide a hint
   *
   * @api private
   * @method hideHint
   */

  function hideHint(stepId) {
    const hint = hintQuerySelectorAll(`.introjs-hint[data-step="${stepId}"]`)[0];
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
    const hints = hintQuerySelectorAll('.introjs-hint');
    forEach(hints, hint => {
      hideHint.call(this, hint.getAttribute('data-step'));
    });
  }
  /**
   * Show all hints
   *
   * @api private
   * @method _showHints
   */

  function showHints() {
    const hints = hintQuerySelectorAll('.introjs-hint');

    if (hints && hints.length) {
      forEach(hints, hint => {
        showHint.call(this, hint.getAttribute('data-step'));
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
    const hint = hintQuerySelectorAll(`.introjs-hint[data-step="${stepId}"]`)[0];

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
    const hints = hintQuerySelectorAll('.introjs-hint');
    forEach(hints, hint => {
      removeHint.call(this, hint.getAttribute('data-step'));
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
    const hint = hintQuerySelectorAll(`.introjs-hint[data-step="${stepId}"]`)[0];

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
    const self = this;
    let hintsWrapper = document.querySelector('.introjs-hints');

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


    const getHintClick = i => e => {
      const evt = e ? e : window.event;

      if (evt.stopPropagation) {
        evt.stopPropagation();
      }

      if (evt.cancelBubble !== null) {
        evt.cancelBubble = true;
      }

      showHintDialog.call(self, i);
    };

    forEach(this._introItems, (item, i) => {
      // avoid append a hint twice
      if (document.querySelector(`.introjs-hint[data-step="${i}"]`)) {
        return;
      }

      const hint = document.createElement('a');
      setAnchorAsButton(hint);
      hint.onclick = getHintClick(i);
      hint.className = 'introjs-hint';

      if (!item.hintAnimation) {
        addClass(hint, 'introjs-hint-no-anim');
      } // hint's position should be fixed if the target element's position is fixed


      if (isFixed(item.element)) {
        addClass(hint, 'introjs-fixedhint');
      }

      const hintDot = document.createElement('div');
      hintDot.className = 'introjs-hint-dot';
      const hintPulse = document.createElement('div');
      hintPulse.className = 'introjs-hint-pulse';
      hint.appendChild(hintDot);
      hint.appendChild(hintPulse);
      hint.setAttribute('data-step', i); // we swap the hint element with target element
      // because _setHelperLayerPosition uses `element` property

      item.targetElement = item.element;
      item.element = hint; // align the hint position

      alignHintPosition.call(this, item.hintPosition, hint, item.targetElement);
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

  function alignHintPosition(position, {
    style
  }, element) {
    // get/calculate offset of target element
    const offset = getOffset.call(this, element);
    const iconWidth = 20;
    const iconHeight = 20; // align the hint element

    switch (position) {
      default:
      case 'top-left':
        style.left = `${offset.left}px`;
        style.top = `${offset.top}px`;
        break;

      case 'top-right':
        style.left = `${offset.left + offset.width - iconWidth}px`;
        style.top = `${offset.top}px`;
        break;

      case 'bottom-left':
        style.left = `${offset.left}px`;
        style.top = `${offset.top + offset.height - iconHeight}px`;
        break;

      case 'bottom-right':
        style.left = `${offset.left + offset.width - iconWidth}px`;
        style.top = `${offset.top + offset.height - iconHeight}px`;
        break;

      case 'middle-left':
        style.left = `${offset.left}px`;
        style.top = `${offset.top + (offset.height - iconHeight) / 2}px`;
        break;

      case 'middle-right':
        style.left = `${offset.left + offset.width - iconWidth}px`;
        style.top = `${offset.top + (offset.height - iconHeight) / 2}px`;
        break;

      case 'middle-middle':
        style.left = `${offset.left + (offset.width - iconWidth) / 2}px`;
        style.top = `${offset.top + (offset.height - iconHeight) / 2}px`;
        break;

      case 'bottom-middle':
        style.left = `${offset.left + (offset.width - iconWidth) / 2}px`;
        style.top = `${offset.top + offset.height - iconHeight}px`;
        break;

      case 'top-middle':
        style.left = `${offset.left + (offset.width - iconWidth) / 2}px`;
        style.top = `${offset.top}px`;
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
    const hintElement = document.querySelector(`.introjs-hint[data-step="${stepId}"]`);
    const item = this._introItems[stepId]; // call the callback function (if any)

    if (typeof this._hintClickCallback !== 'undefined') {
      this._hintClickCallback.call(this, hintElement, item, stepId);
    } // remove all open tooltips


    const removedStep = removeHintTooltip.call(this); // to toggle the tooltip

    if (parseInt(removedStep, 10) === stepId) {
      return;
    }

    const tooltipLayer = document.createElement('div');
    const tooltipTextLayer = document.createElement('div');
    const arrowLayer = document.createElement('div');
    const referenceLayer = document.createElement('div');
    tooltipLayer.className = 'introjs-tooltip';

    tooltipLayer.onclick = e => {
      //IE9 & Other Browsers
      if (e.stopPropagation) {
        e.stopPropagation();
      } //IE8 and Lower
      else {
          e.cancelBubble = true;
        }
    };

    tooltipTextLayer.className = 'introjs-tooltiptext';
    const tooltipWrapper = document.createElement('p');
    tooltipWrapper.innerHTML = item.hint;
    const closeButton = document.createElement('a');
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
    const tooltip = document.querySelector('.introjs-hintReference');

    if (tooltip) {
      const step = tooltip.getAttribute('data-step');
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
    this._introItems = [];

    if (this._options.hints) {
      forEach(this._options.hints, hint => {
        const currentItem = cloneObject(hint);

        if (typeof currentItem.element === 'string') {
          //grab the element with given selector from the page
          currentItem.element = document.querySelector(currentItem.element);
        }

        currentItem.hintPosition = currentItem.hintPosition || this._options.hintPosition;
        currentItem.hintAnimation = currentItem.hintAnimation || this._options.hintAnimation;

        if (currentItem.element !== null) {
          this._introItems.push(currentItem);
        }
      });
    } else {
      const hints = targetElm.querySelectorAll('*[data-hint]');

      if (!hints || !hints.length) {
        return false;
      } //first add intro items with data-step


      forEach(hints, currentElement => {
        // hint animation
        let hintAnimation = currentElement.getAttribute('data-hintanimation');

        if (hintAnimation) {
          hintAnimation = hintAnimation === 'true';
        } else {
          hintAnimation = this._options.hintAnimation;
        }

        this._introItems.push({
          element: currentElement,
          hint: currentElement.getAttribute('data-hint'),
          hintPosition: currentElement.getAttribute('data-hintposition') || this._options.hintPosition,
          hintAnimation,
          tooltipClass: currentElement.getAttribute('data-tooltipclass'),
          position: currentElement.getAttribute('data-position') || this._options.tooltipPosition
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
    forEach(this._introItems, ({
      targetElement,
      hintPosition,
      element
    }) => {
      if (typeof targetElement === 'undefined') {
        return;
      }

      alignHintPosition.call(this, hintPosition, element, targetElement);
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
      const oldHelperNumberLayer = document.querySelector('.introjs-helperNumberLayer');
      const oldArrowLayer = document.querySelector('.introjs-arrow');
      const oldtooltipContainer = document.querySelector('.introjs-tooltip');
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
    let continueExit = true; // calling onbeforeexit callback
    //
    // If this callback return `false`, it would halt the process

    if (this._introBeforeExitCallback !== undefined) {
      continueExit = this._introBeforeExitCallback.call(this);
    } // skip this check if `force` parameter is `true`
    // otherwise, if `onbeforeexit` returned `false`, don't exit the intro


    if (!force && continueExit === false) return; //remove overlay layers from the page

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
    } //remove all helper layers


    const helperLayer = targetElement.querySelector('.introjs-helperLayer');

    if (helperLayer) {
      helperLayer.parentNode.removeChild(helperLayer);
    }

    const referenceLayer = targetElement.querySelector('.introjs-tooltipReferenceLayer');

    if (referenceLayer) {
      referenceLayer.parentNode.removeChild(referenceLayer);
    } //remove disableInteractionLayer


    const disableInteractionLayer = targetElement.querySelector('.introjs-disableInteraction');

    if (disableInteractionLayer) {
      disableInteractionLayer.parentNode.removeChild(disableInteractionLayer);
    } //remove intro floating element


    const floatingElement = document.querySelector('.introjsFloatingElement');

    if (floatingElement) {
      floatingElement.parentNode.removeChild(floatingElement);
    }

    removeShowElement(); //remove `introjs-fixParent` class from the elements

    const fixParents = document.querySelectorAll('.introjs-fixParent');
    forEach(fixParents, parent => {
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
    const overlayLayer = document.createElement('div');
    let styleText = '';
    const self = this; //set css class name

    overlayLayer.className = 'introjs-overlay'; //check if the target element is body, we should calculate the size of overlay layer in a better way

    if (!targetElm.tagName || targetElm.tagName.toLowerCase() === 'body') {
      styleText += 'top: 0;bottom: 0; left: 0;right: 0;position: fixed;';
      overlayLayer.style.cssText = styleText;
    } else {
      //set overlay layer position
      const elementPosition = getOffset(targetElm);

      if (elementPosition) {
        styleText += `width: ${elementPosition.width}px; height:${elementPosition.height}px; top:${elementPosition.top}px;left: ${elementPosition.left}px;`;
        overlayLayer.style.cssText = styleText;
      }
    }

    targetElm.appendChild(overlayLayer);

    overlayLayer.onclick = () => {
      if (self._options.exitOnOverlayClick === true) {
        exitIntro.call(self, targetElm);
      }
    };

    window.setTimeout(() => {
      styleText += `opacity: ${self._options.overlayOpacity.toString()};`;
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
    const allIntroSteps = targetElm.querySelectorAll("*[data-intro]");
    let introItems = [];

    if (this._options.steps) {
      //use steps passed programmatically
      forEach(this._options.steps, step => {
        const currentItem = cloneObject(step); //set the step

        currentItem.step = introItems.length + 1; //use querySelector function only when developer used CSS selector

        if (typeof currentItem.element === 'string') {
          //grab the element with given selector from the page
          currentItem.element = document.querySelector(currentItem.element);
        } //intro without element


        if (typeof currentItem.element === 'undefined' || currentItem.element === null) {
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

        if (typeof currentItem.disableInteraction === 'undefined') {
          currentItem.disableInteraction = this._options.disableInteraction;
        }

        if (currentItem.element !== null) {
          introItems.push(currentItem);
        }
      });
    } else {
      //use steps from data-* annotations
      const elmsLength = allIntroSteps.length;
      let disableInteraction; //if there's no element to intro

      if (elmsLength < 1) {
        return false;
      }

      forEach(allIntroSteps, currentElement => {
        // PR #80
        // start intro for groups of elements
        if (group && currentElement.getAttribute("data-intro-group") !== group) {
          return;
        } // skip hidden elements


        if (currentElement.style.display === 'none') {
          return;
        }

        const step = parseInt(currentElement.getAttribute('data-step'), 10);

        if (typeof currentElement.getAttribute('data-disable-interaction') !== 'undefined') {
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
      }); //next add intro items without data-step
      //todo: we need a cleanup here, two loops are redundant

      let nextStep = 0;
      forEach(allIntroSteps, currentElement => {
        // PR #80
        // start intro for groups of elements
        if (group && currentElement.getAttribute("data-intro-group") !== group) {
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

          if (typeof currentElement.getAttribute('data-disable-interaction') !== 'undefined') {
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
    } //removing undefined/null elements


    const tempIntroItems = [];

    for (let z = 0; z < introItems.length; z++) {
      if (introItems[z]) {
        // copy non-falsy values to the end of the array
        tempIntroItems.push(introItems[z]);
      }
    }

    introItems = tempIntroItems; //Ok, sort all items with given steps

    introItems.sort((a, b) => a.step - b.step); //set it to the introJs object

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

  const introJs = targetElm => {
    let instance;

    if (typeof targetElm === 'object') {
      //Ok, create a new instance
      instance = new IntroJs(targetElm);
    } else if (typeof targetElm === 'string') {
      //select the target element with query selector
      const targetElement = document.querySelector(targetElm);

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


  introJs.version = VERSION;
  /**
   * key-val object helper for introJs instances
   *
   * @property instances
   * @type Object
   */

  introJs.instances = {}; //Prototype

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
      introForElement.call(this, this._targetElement, group);
      return this;
    },

    goToStep(step) {
      goToStep.call(this, step);
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
      goToStepNumber.call(this, step);
      return this;
    },

    nextStep() {
      nextStep.call(this);
      return this;
    },

    previousStep() {
      previousStep.call(this);
      return this;
    },

    exit(force) {
      exitIntro.call(this, this._targetElement, force);
      return this;
    },

    refresh() {
      refresh.call(this);
      return this;
    },

    onbeforechange(providedCallback) {
      if (typeof providedCallback === 'function') {
        this._introBeforeChangeCallback = providedCallback;
      } else {
        throw new Error('Provided callback for onbeforechange was not a function');
      }

      return this;
    },

    onchange(providedCallback) {
      if (typeof providedCallback === 'function') {
        this._introChangeCallback = providedCallback;
      } else {
        throw new Error('Provided callback for onchange was not a function.');
      }

      return this;
    },

    onafterchange(providedCallback) {
      if (typeof providedCallback === 'function') {
        this._introAfterChangeCallback = providedCallback;
      } else {
        throw new Error('Provided callback for onafterchange was not a function');
      }

      return this;
    },

    oncomplete(providedCallback) {
      if (typeof providedCallback === 'function') {
        this._introCompleteCallback = providedCallback;
      } else {
        throw new Error('Provided callback for oncomplete was not a function.');
      }

      return this;
    },

    onhintsadded(providedCallback) {
      if (typeof providedCallback === 'function') {
        this._hintsAddedCallback = providedCallback;
      } else {
        throw new Error('Provided callback for onhintsadded was not a function.');
      }

      return this;
    },

    onhintclick(providedCallback) {
      if (typeof providedCallback === 'function') {
        this._hintClickCallback = providedCallback;
      } else {
        throw new Error('Provided callback for onhintclick was not a function.');
      }

      return this;
    },

    onhintclose(providedCallback) {
      if (typeof providedCallback === 'function') {
        this._hintCloseCallback = providedCallback;
      } else {
        throw new Error('Provided callback for onhintclose was not a function.');
      }

      return this;
    },

    onexit(providedCallback) {
      if (typeof providedCallback === 'function') {
        this._introExitCallback = providedCallback;
      } else {
        throw new Error('Provided callback for onexit was not a function.');
      }

      return this;
    },

    onskip(providedCallback) {
      if (typeof providedCallback === 'function') {
        this._introSkipCallback = providedCallback;
      } else {
        throw new Error('Provided callback for onskip was not a function.');
      }

      return this;
    },

    onbeforeexit(providedCallback) {
      if (typeof providedCallback === 'function') {
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

  return introJs;

}());
