import mergeOptions from "./util/mergeOptions";
import stamp from "./util/stamp";
import IntroJs from "./core/IntroJs";
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
import { events } from "./core/events";

/**
 * @param {Element|string} targetElm
 * @returns IntroJs
 */
const introJs = (targetElm) => {
  /** @type IntroJs */
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

// Prototype
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

// extends introjs to accept .on/.off event methods
Object.assign(IntroJs.prototype, events);

export default introJs;
