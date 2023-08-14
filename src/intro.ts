import { getDontShowAgain, setDontShowAgain } from "./core/dontShowAgain";
import exitIntro from "./core/exitIntro";
import {
  hideHint,
  hideHints,
  populateHints,
  removeHint,
  removeHints,
  showHint,
  showHintDialog,
  showHints,
} from "./core/hint";
import introForElement from "./core/introForElement";
import refresh from "./core/refresh";
import {
  HintStep,
  IntroStep,
  goToStep,
  goToStepNumber,
  nextStep,
  previousStep,
} from "./core/steps";
import { Options, getDefaultOptions, setOption, setOptions } from "./option";
import isFunction from "./util/isFunction";

type introBeforeChangeCallback = (
  this: IntroJs,
  targetElement: HTMLElement,
  currentStep: number,
  direction: "backward" | "forward"
) => Promise<boolean> | boolean;
type introChangeCallback = (
  this: IntroJs,
  targetElement: HTMLElement
) => void | Promise<void>;
type introAfterChangeCallback = (
  this: IntroJs,
  targetElement: HTMLElement
) => void | Promise<void>;
type introCompleteCallback = (
  this: IntroJs,
  currentStep: number,
  reason: "skip" | "end" | "done"
) => void | Promise<void>;
type introStartCallback = (
  this: IntroJs,
  targetElement: HTMLElement
) => void | Promise<void>;
type introExitCallback = (this: IntroJs) => void | Promise<void>;
type introSkipCallback = (
  this: IntroJs,
  currentStep: number
) => void | Promise<void>;
type introBeforeExitCallback = (
  this: IntroJs,
  targetElement: HTMLElement
) => boolean | Promise<boolean>;
type hintsAddedCallback = (this: IntroJs) => void | Promise<void>;
type hintClickCallback = (
  this: IntroJs,
  hintElement: HTMLElement,
  item: HintStep,
  stepId: number
) => void | Promise<void>;
type hintCloseCallback = (
  this: IntroJs,
  stepId: number
) => void | Promise<void>;

export class IntroJs {
  public _currentStep: number = -1;
  public _currentStepNumber: number | undefined;
  public _direction: "forward" | "backward";
  public _targetElement: HTMLElement;
  public _introItems: IntroStep[] = [];
  public _hintItems: HintStep[] = [];
  public _options: Options;
  public _introBeforeChangeCallback?: introBeforeChangeCallback;
  public _introChangeCallback?: introChangeCallback;
  public _introAfterChangeCallback?: introAfterChangeCallback;
  public _introCompleteCallback?: introCompleteCallback;
  public _introStartCallback?: introStartCallback;
  public _introExitCallback?: introExitCallback;
  public _introSkipCallback?: introSkipCallback;
  public _introBeforeExitCallback?: introBeforeExitCallback;

  public _hintsAddedCallback?: hintsAddedCallback;
  public _hintClickCallback?: hintClickCallback;
  public _hintCloseCallback?: hintCloseCallback;

  public _lastShowElementTimer: number;
  public _hintsAutoRefreshFunction: (...args: any[]) => void;

  public constructor(targetElement: HTMLElement) {
    this._targetElement = targetElement;
    this._options = getDefaultOptions();
  }

  isActive() {
    if (this._options.dontShowAgain && getDontShowAgain(this)) {
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
    await introForElement(this, this._targetElement);
    return this;
  }

  async goToStep(step: number) {
    await goToStep(this, step);
    return this;
  }

  addStep(step: Partial<IntroStep>) {
    if (!this._options.steps) {
      this._options.steps = [];
    }

    this._options.steps.push(step);

    return this;
  }

  addSteps(steps: Partial<IntroStep>[]) {
    if (!steps.length) return this;

    for (let index = 0; index < steps.length; index++) {
      this.addStep(steps[index]);
    }

    return this;
  }

  async goToStepNumber(step: number) {
    await goToStepNumber(this, step);
    return this;
  }

  async nextStep() {
    await nextStep(this);
    return this;
  }

  async previousStep() {
    await previousStep(this);
    return this;
  }

  currentStep() {
    return this._currentStep;
  }

  async exit(force: boolean) {
    await exitIntro(this, this._targetElement, force);
    return this;
  }

  refresh(refreshSteps?: boolean) {
    refresh(this, refreshSteps);
    return this;
  }

  setDontShowAgain(dontShowAgain: boolean) {
    setDontShowAgain(this, dontShowAgain);
    return this;
  }

  onbeforechange(providedCallback: introBeforeChangeCallback) {
    if (isFunction(providedCallback)) {
      this._introBeforeChangeCallback = providedCallback;
    } else {
      throw new Error(
        "Provided callback for onbeforechange was not a function"
      );
    }
    return this;
  }

  onchange(providedCallback: introChangeCallback) {
    if (isFunction(providedCallback)) {
      this._introChangeCallback = providedCallback;
    } else {
      throw new Error("Provided callback for onchange was not a function.");
    }
    return this;
  }

  onafterchange(providedCallback: introAfterChangeCallback) {
    if (isFunction(providedCallback)) {
      this._introAfterChangeCallback = providedCallback;
    } else {
      throw new Error("Provided callback for onafterchange was not a function");
    }
    return this;
  }

  oncomplete(providedCallback: introCompleteCallback) {
    if (isFunction(providedCallback)) {
      this._introCompleteCallback = providedCallback;
    } else {
      throw new Error("Provided callback for oncomplete was not a function.");
    }
    return this;
  }

  onhintsadded(providedCallback: hintsAddedCallback) {
    if (isFunction(providedCallback)) {
      this._hintsAddedCallback = providedCallback;
    } else {
      throw new Error("Provided callback for onhintsadded was not a function.");
    }
    return this;
  }

  onhintclick(providedCallback: hintClickCallback) {
    if (isFunction(providedCallback)) {
      this._hintClickCallback = providedCallback;
    } else {
      throw new Error("Provided callback for onhintclick was not a function.");
    }
    return this;
  }

  onhintclose(providedCallback: hintCloseCallback) {
    if (isFunction(providedCallback)) {
      this._hintCloseCallback = providedCallback;
    } else {
      throw new Error("Provided callback for onhintclose was not a function.");
    }
    return this;
  }

  onstart(providedCallback: introStartCallback) {
    if (isFunction(providedCallback)) {
      this._introStartCallback = providedCallback;
    } else {
      throw new Error("Provided callback for onstart was not a function.");
    }
    return this;
  }

  onexit(providedCallback: introExitCallback) {
    if (isFunction(providedCallback)) {
      this._introExitCallback = providedCallback;
    } else {
      throw new Error("Provided callback for onexit was not a function.");
    }
    return this;
  }

  onskip(providedCallback: introSkipCallback) {
    if (isFunction(providedCallback)) {
      this._introSkipCallback = providedCallback;
    } else {
      throw new Error("Provided callback for onskip was not a function.");
    }
    return this;
  }

  onbeforeexit(providedCallback: introBeforeExitCallback) {
    if (isFunction(providedCallback)) {
      this._introBeforeExitCallback = providedCallback;
    } else {
      throw new Error("Provided callback for onbeforeexit was not a function.");
    }
    return this;
  }

  async addHints() {
    await populateHints(this, this._targetElement);
    return this;
  }

  async hideHint(stepId: number) {
    await hideHint(this, stepId);
    return this;
  }

  async hideHints() {
    await hideHints(this);
    return this;
  }

  showHint(stepId: number) {
    showHint(stepId);
    return this;
  }

  async showHints() {
    await showHints(this);
    return this;
  }

  removeHints() {
    removeHints(this);
    return this;
  }

  removeHint(stepId: number) {
    removeHint(stepId);
    return this;
  }

  async showHintDialog(stepId: number) {
    await showHintDialog(this, stepId);
    return this;
  }
}
