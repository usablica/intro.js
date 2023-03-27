import stamp from "./util/stamp";
import exitIntro from "./core/exitIntro";
import refresh from "./core/refresh";
import introForElement from "./core/introForElement";
import { getDontShowAgain, setDontShowAgain } from "./core/dontShowAgain";
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
  Step,
  currentStep,
  goToStep,
  goToStepNumber,
  nextStep,
  previousStep,
} from "./core/steps";
import { Options, getDefaultOptions, setOption, setOptions } from "./option";

class IntroJs {
  public _targetElement: HTMLElement;
  public _introItems: Step[] = [];
  public _options: Options;
  public _introBeforeChangeCallback: Function;
  public _introChangeCallback: Function;
  public _introAfterChangeCallback: Function;
  public _introCompleteCallback: Function;
  public _hintsAddedCallback: Function;
  public _hintClickCallback: Function;
  public _hintCloseCallback: Function;
  public _introStartCallback: Function;
  public _introExitCallback: Function;
  public _introSkipCallback: Function;
  public _introBeforeExitCallback: Function;

  public constructor(targetElement: HTMLElement) {
    this._targetElement = targetElement;
    this._options = getDefaultOptions();
  }

  isActive() {
    if (this._options.dontShowAgain && getDontShowAgain.call(this)) {
      return false;
    }

    return this._options.isActive;
  }

  clone() {
    return new IntroJs(this._targetElement);
  }

  setOption<K extends keyof Options>(key: K, value: Options[K]) {
    this._options = setOption(this._options, key, value);
    return this;
  }

  setOptions(partialOptions: Partial<Options>) {
    this._options = setOptions(this._options, partialOptions);
    return this;
  }

  async start() {
    await introForElement.call(this, this._targetElement);
    return this;
  }

  async goToStep(step: number) {
    await goToStep.call(this, step);
    return this;
  }

  addStep(step: Step) {
    if (!this._options.steps) {
      this._options.steps = [];
    }

    this._options.steps.push(step);

    return this;
  }

  addSteps(steps: Step[]) {
    if (!steps.length) return this;

    for (let index = 0; index < steps.length; index++) {
      this.addStep(steps[index]);
    }

    return this;
  }

  async goToStepNumber(step: number) {
    await goToStepNumber.call(this, step);
    return this;
  }

  async nextStep() {
    await nextStep.call(this);
    return this;
  }

  async previousStep() {
    await previousStep.call(this);
    return this;
  }

  currentStep() {
    return currentStep.call(this);
  }

  async exit(force: boolean) {
    await exitIntro.call(this, this._targetElement, force);
    return this;
  }

  refresh(refreshSteps?: boolean) {
    refresh.call(this, refreshSteps);
    return this;
  }

  setDontShowAgain(dontShowAgain: boolean) {
    setDontShowAgain.call(this, dontShowAgain);
    return this;
  }

  onbeforechange(providedCallback: Function) {
    if (typeof providedCallback === "function") {
      this._introBeforeChangeCallback = providedCallback;
    } else {
      throw new Error(
        "Provided callback for onbeforechange was not a function"
      );
    }
    return this;
  }

  onchange(providedCallback: Function) {
    if (typeof providedCallback === "function") {
      this._introChangeCallback = providedCallback;
    } else {
      throw new Error("Provided callback for onchange was not a function.");
    }
    return this;
  }

  onafterchange(providedCallback: Function) {
    if (typeof providedCallback === "function") {
      this._introAfterChangeCallback = providedCallback;
    } else {
      throw new Error("Provided callback for onafterchange was not a function");
    }
    return this;
  }

  oncomplete(providedCallback: Function) {
    if (typeof providedCallback === "function") {
      this._introCompleteCallback = providedCallback;
    } else {
      throw new Error("Provided callback for oncomplete was not a function.");
    }
    return this;
  }

  onhintsadded(providedCallback: Function) {
    if (typeof providedCallback === "function") {
      this._hintsAddedCallback = providedCallback;
    } else {
      throw new Error("Provided callback for onhintsadded was not a function.");
    }
    return this;
  }

  onhintclick(providedCallback: Function) {
    if (typeof providedCallback === "function") {
      this._hintClickCallback = providedCallback;
    } else {
      throw new Error("Provided callback for onhintclick was not a function.");
    }
    return this;
  }

  onhintclose(providedCallback: Function) {
    if (typeof providedCallback === "function") {
      this._hintCloseCallback = providedCallback;
    } else {
      throw new Error("Provided callback for onhintclose was not a function.");
    }
    return this;
  }

  onstart(providedCallback: Function) {
    if (typeof providedCallback === "function") {
      this._introStartCallback = providedCallback;
    } else {
      throw new Error("Provided callback for onstart was not a function.");
    }
    return this;
  }

  onexit(providedCallback: Function) {
    if (typeof providedCallback === "function") {
      this._introExitCallback = providedCallback;
    } else {
      throw new Error("Provided callback for onexit was not a function.");
    }
    return this;
  }

  onskip(providedCallback: Function) {
    if (typeof providedCallback === "function") {
      this._introSkipCallback = providedCallback;
    } else {
      throw new Error("Provided callback for onskip was not a function.");
    }
    return this;
  }

  onbeforeexit(providedCallback: Function) {
    if (typeof providedCallback === "function") {
      this._introBeforeExitCallback = providedCallback;
    } else {
      throw new Error("Provided callback for onbeforeexit was not a function.");
    }
    return this;
  }

  async addHints() {
    await populateHints.call(this, this._targetElement);
    return this;
  }

  async hideHint(stepId: number) {
    await hideHint.call(this, stepId);
    return this;
  }

  async hideHints() {
    await hideHints.call(this);
    return this;
  }

  showHint(stepId: number) {
    showHint.call(this, stepId);
    return this;
  }

  async showHints() {
    await showHints.call(this);
    return this;
  }

  removeHints() {
    removeHints.call(this);
    return this;
  }

  removeHint(stepId: number) {
    removeHint.call(this, stepId);
    return this;
  }

  async showHintDialog(stepId: number) {
    await showHintDialog.call(this, stepId);
    return this;
  }
}

const introJs = (targetElm?: string | HTMLElement) => {
  let instance: IntroJs;

  if (typeof targetElm === "object") {
    instance = new IntroJs(targetElm);
  } else if (typeof targetElm === "string") {
    //select the target element with query selector
    const targetElement = document.querySelector<HTMLElement>(targetElm);

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

export default introJs;
