/**
 * Intro.js v0.1.0
 * https://github.com/usablica/intro.js
 * MIT licensed
 *
 * Copyright (C) 2013 usabli.ca - A weekend project by Afshin Mehrabani (@afshinmeh)
 */ 

(function (doc) {

      //main variables
  var overlay,
      helper,
      helperNumber,
      tooltip,
      tooltipButtons,
      tooltipText,
      introItems,
      currentElement,
      currentStep,
      //some helper variables:
      compliantEventListeners = !!doc.addEventListener,
      keydown = "keydown",
      cssPrefix = "introjs-",
      showElement = cssPrefix + "showElement";

  /**
   * Initiate a new introduction/guide from an element in the page
   */
  function introJs() {
    var allIntroSteps = doc.querySelectorAll("*[data-intro]"),
        i, elementPosition;

    introItems = [];

    //if there's no element to intro
    if(allIntroSteps.length < 1) {
      return;
    }

    for (i = 0; i < allIntroSteps.length; i++) {
      currentElement = allIntroSteps[i];
      introItems.push({ 
        element: currentElement,
        intro: currentElement.getAttribute("data-intro"),
        step: parseInt(currentElement.getAttribute("data-step"))
      });
    }
    //Ok, sort all items with given steps
    introItems.sort(function (a, b) {
      return a.step - b.step;
    });

    //add overlay layer to the page
    overlay = _createElement("div", "overlay", doc.body, _exitIntro);
    //set overlay layer size
    elementPosition = _getOffset(doc.body);
    overlay.setAttribute("style", "width:"  + elementPosition.width  + "px;" +
                                  "height:" + elementPosition.height + "px;" );
    overlay.style.opacity = 0.5;

    //add helper layer to the page
    helper         = _createElement("div",  "helper",         doc.body);
    helperNumber   = _createElement("span", "helperNumber",   helper);
    tooltip        = _createElement("div",  "tooltip",        helper);
    tooltipButtons = _createElement("div",  "tooltipbuttons", tooltip);
    tooltipText    = _createElement("div",  "tooltiptext",    tooltip);
                     _createElement("a",    "skipbutton",     tooltipButtons, _exitIntro, "Skip");
                     _createElement("a",    "nextbutton",     tooltipButtons, _nextStep,  "Next →");
    //set proper tooltip position
    tooltip.style.bottom = "-" + (_getOffset(tooltip).height + 10) + "px";

    //start the show
    currentStep = 0;
    _showElement();

    //add key navigation
    if (compliantEventListeners) {
      doc.addEventListener(keydown, _keynav, false);
    } else {
      doc.attachEvent("on" + keydown, _keynav);
    }
  }

  function _keynav(e) {
    if (e.keyCode == 27) {
      //escape key pressed, exit the intro
      _exitIntro();
    }
    if (e.keyCode == 37) {
      //left arrow
      _previousStep();
    }
    if (e.keyCode == 39) {
      //right arrow
      _nextStep();
    }
  } 

  /**
   * Go to next step on intro
   *
   * @api private
   * @method _nextStep
   */
  function _nextStep() {
    currentStep++;
    if ( (introItems.length) <= currentStep ) {
      //end of the intro
      _exitIntro();
      return;
    }
    _showElement();
  }

  /**
   * Go to previous step on intro
   *
   * @api private
   * @method _previousStep
   */
  function _previousStep() {
    if (currentStep == 0) {
      return;
    }
    currentStep--;
    _showElement();
  }

  /**
   * Exit from intro
   *
   * @api private
   * @method _exitIntro
   */
  function _exitIntro() {
    //for fade-out animation
    overlay.style.opacity = 0;
    setTimeout(function () {
      _removeElement(overlay)
    }, 500);
    //remove helper layer
    _removeElement(helper)
    //remove `introjs-showElement` class from the element
    _removeClassFromCurrent();
    //clean listeners
    if (compliantEventListeners) {
      doc.removeEventListener(keydown, _keynav, false);
    } else {
      doc.detachEvent("on" + keydown, _keynav);
    }
  }

  /**
   * Show an element on the page
   *
   * @api private
   * @method _showElement
   */
  function _showElement() {
    _removeClassFromCurrent();
    currentElement = introItems[currentStep].element;
    //change to new intro item
    currentElement.className += " " + showElement;
    //set new position to helper layer
    var elementPosition = _getOffset(currentElement);
    helper.setAttribute("style", "width:"  + (elementPosition.width + 10)  + "px;" +
                                 "height:" + (elementPosition.height + 10) + "px;" +
                                 "top:"    + (elementPosition.top - 5)     + "px;" +
                                 "left: "  + (elementPosition.left - 5)    + "px;");
    //set current step to the label
    helperNumber.innerHTML = introItems[currentStep].step;
    //set current tooltip text
    tooltipText.innerHTML = introItems[currentStep].intro;
    //wait until the animation is completed
    setTimeout(function() {
      tooltip.style.bottom = "-" + (_getOffset(tooltip).height + 10) + "px";
      //scroll the page to the element and tooltip position
      currentElement.scrollIntoView(false);
      tooltip.scrollIntoView(false);
    }, 300);
  }
  
  /**
   * Remove the introjs-showElement class from the current element
   *
   * @api private
   * @method _createElement
   */
  function _removeClassFromCurrent() {
    currentElement.className = currentElement.className.replace(new RegExp(showElement),'');
  }

  /**
   * Add an HTML Element with a given class as a child to the given parent.
   * Set onclick function and innerHTML if available
   *
   * @api private
   * @method _createElement
   * @param {Object} type 
   * @param {Object} className
   * @param {Object} parent
   * @param {Object} clickfunction
   * @param {Object} text
   * @returns The created element
   */
  function _createElement(type, className, parent, clickfunction, text) {
    var element = doc.createElement(type);
    element.className = cssPrefix + className;
    parent.appendChild(element);
    if (clickfunction) element.onclick = clickfunction;
    if (text) element.innerHTML = text;
    return element;
  }

  /**
   * Remove an HTML Element from the page
   *
   * @api private
   * @method _removeElement
   * @param {Object} element
   */
  function _removeElement(element) {
    element.parentNode.removeChild(element);
  }

  /**
   * Get an element position on the page
   * Thanks to `meouw`: http://stackoverflow.com/a/442474/375966
   *
   * @api private
   * @method _getOffset
   * @param {Object} element
   * @returns Elements position info
   */
  function _getOffset(element) {
    var elementPosition = {
          width:  element.offsetWidth,
          height: element.offsetHeight
        },
        _x = 0,
        _y = 0;

    //calculate element top and left
    while (element && !isNaN(element.offsetLeft) && !isNaN(element.offsetTop)) {
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

  window['introJs'] = introJs;
})(document);
