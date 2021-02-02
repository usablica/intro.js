import mergeOptions from "./util/mergeOptions";
import stamp from "./util/stamp";
import exitIntro from "./core/exitIntro";
import refresh from "./core/refresh";
import introForElement from "./core/introForElement";
import { version } from "../package.json";
import {
  populateHints,
  hideHint,
  hideHints,
  showHint,
  showHints,
  removeHint,
  removeHints,
  showHintDialog,
} from "./core/hint";
import {
  currentStep,
  goToStep,
  goToStepNumber,
  nextStep,
  previousStep,
} from "./core/steps";

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
    nextLabel: "Next",
    /* Previous button label in tooltip box */
    prevLabel: "Back",
    /* Skip button label in tooltip box */
    skipLabel: "×",
    /* Done button label in tooltip box */
    doneLabel: "Done",
    /* Hide previous button in the first step? Otherwise, it will be disabled button. */
    hidePrev: false,
    /* Hide next button in the last step? Otherwise, it will be disabled button (note: this will also hide the "Done" button) */
    hideNext: false,
    /* Change the Next button to Done in the last step of the intro? otherwise, it will render a disabled button */
    nextToDone: true,
    /* Default tooltip box position */
    tooltipPosition: "bottom",
    /* Next CSS class for tooltip boxes */
    tooltipClass: "",
    /* CSS class that is added to the helperLayer */
    highlightClass: "",
    /* Close introduction when pressing Escape button? */
    exitOnEsc: true,
    /* Close introduction when clicking on overlay layer? */
    exitOnOverlayClick: true,
    /* Show step numbers in introduction? */
    showStepNumbers: false,
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
    scrollTo: "element",
    /* Padding to add after scrolling when element is not in the viewport (in pixels) */
    scrollPadding: 30,
    /* Set the overlay opacity */
    overlayOpacity: 0.5,
    /* To determine the tooltip position automatically based on the window.width/height */
    autoPosition: true,
    /* Precedence of positions, when auto is enabled */
    positionPrecedence: ["bottom", "top", "right", "left"],
    /* Disable an interaction with element? */
    disableInteraction: false,
    /* Set how much padding to be used around helper element */
    helperElementPadding: 10,
    /* Default hint position */
    hintPosition: "top-middle",
    /* Hint button label */
    hintButtonLabel: "Got it",
    /* Adding animation to hints? */
    hintAnimation: true,
    /* additional classes to put on the buttons */
    buttonClass: "introjs-button",
    /* additional classes to put on progress bar */
    progressBarAdditionalClass: false,
  };
}

const introJs = (targetElm) => {
  let instance;

  if (typeof targetElm === "object") {
    //Ok, create a new instance
    instance = new IntroJs(targetElm);
  } else if (typeof targetElm === "string") {
    //select the target element with query selector
    const targetElement = document.querySelector(targetElm);

    if (targetElement) {
      instance = new IntroJs(targetElement);
    } else {
      throw new Error("There is no element with given selector.");
    }
  } else {
    instance = new IntroJs(document.body);
  }
  // add instance to list of _instances
  // passing group to stamp to increment
  // from 0 onward somewhat reliably
  introJs.instances[stamp(instance, "introjs-instance")] = instance;

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
  currentStep() {
    return currentStep.call(this);
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
    if (typeof providedCallback === "function") {
      this._introBeforeChangeCallback = providedCallback;
    } else {
      throw new Error(
        "Provided callback for onbeforechange was not a function"
      );
    }
    return this;
  },
  onchange(providedCallback) {
    if (typeof providedCallback === "function") {
      this._introChangeCallback = providedCallback;
    } else {
      throw new Error("Provided callback for onchange was not a function.");
    }
    return this;
  },
  onafterchange(providedCallback) {
    if (typeof providedCallback === "function") {
      this._introAfterChangeCallback = providedCallback;
    } else {
      throw new Error("Provided callback for onafterchange was not a function");
    }
    return this;
  },
  oncomplete(providedCallback) {
    if (typeof providedCallback === "function") {
      this._introCompleteCallback = providedCallback;
    } else {
      throw new Error("Provided callback for oncomplete was not a function.");
    }
    return this;
  },
  onhintsadded(providedCallback) {
    if (typeof providedCallback === "function") {
      this._hintsAddedCallback = providedCallback;
    } else {
      throw new Error("Provided callback for onhintsadded was not a function.");
    }
    return this;
  },
  onhintclick(providedCallback) {
    if (typeof providedCallback === "function") {
      this._hintClickCallback = providedCallback;
    } else {
      throw new Error("Provided callback for onhintclick was not a function.");
    }
    return this;
  },
  onhintclose(providedCallback) {
    if (typeof providedCallback === "function") {
      this._hintCloseCallback = providedCallback;
    } else {
      throw new Error("Provided callback for onhintclose was not a function.");
    }
    return this;
  },
  onexit(providedCallback) {
    if (typeof providedCallback === "function") {
      this._introExitCallback = providedCallback;
    } else {
      throw new Error("Provided callback for onexit was not a function.");
    }
    return this;
  },
  onskip(providedCallback) {
    if (typeof providedCallback === "function") {
      this._introSkipCallback = providedCallback;
    } else {
      throw new Error("Provided callback for onskip was not a function.");
    }
    return this;
  },
  onbeforeexit(providedCallback) {
    if (typeof providedCallback === "function") {
      this._introBeforeExitCallback = providedCallback;
    } else {
      throw new Error("Provided callback for onbeforeexit was not a function.");
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
  },
};

export default introJs;
