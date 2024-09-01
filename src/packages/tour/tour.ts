import { nextStep, previousStep, TourStep } from "./steps";
import { Package } from "../package";
import {
  introAfterChangeCallback,
  introBeforeChangeCallback,
  introBeforeExitCallback,
  introChangeCallback,
  introCompleteCallback,
  introExitCallback,
  introSkipCallback,
  introStartCallback,
} from "./callback";
import { getDefaultTourOptions, TourOptions } from "./option";
import { setOptions, setOption } from "../../option";
import { start } from "./start";
import exitIntro from "./exitIntro";
import isFunction from "../../util/isFunction";
import { getDontShowAgain, setDontShowAgain } from "./dontShowAgain";
import refresh from "./refresh";
import { getContainerElement } from "../../util/containerElement";
import DOMEvent from "../../util/DOMEvent";
import onKeyDown from "./onKeyDown";
import onResize from "./onResize";
import van from "../dom/van";

/**
 * Intro.js Tour class
 */
export class Tour implements Package<TourOptions> {
  private _steps: TourStep[] = [];
  private _currentStep: number = -1;
  public currentStepSignal = van.state<number>(-1);
  private _direction: "forward" | "backward";
  private readonly _targetElement: HTMLElement;
  private _options: TourOptions;

  private readonly callbacks: {
    beforeChange?: introBeforeChangeCallback;
    change?: introChangeCallback;
    afterChange?: introAfterChangeCallback;
    complete?: introCompleteCallback;
    start?: introStartCallback;
    exit?: introExitCallback;
    skip?: introSkipCallback;
    beforeExit?: introBeforeExitCallback;
  } = {};

  // Event handlers
  private _keyboardNavigationHandler?: (e: KeyboardEvent) => Promise<void>;
  private _refreshOnResizeHandler?: (e: Event) => void;

  /**
   * Create a new Tour instance
   * @param elementOrSelector Optional target element or CSS query to start the Tour on
   * @param options Optional Tour options
   */
  public constructor(
    elementOrSelector?: string | HTMLElement,
    options?: Partial<TourOptions>
  ) {
    this._targetElement = getContainerElement(elementOrSelector);
    this._options = options
      ? setOptions(this._options, options)
      : getDefaultTourOptions();
  }

  /**
   * Get a specific callback function
   * @param callbackName callback name
   */
  callback<K extends keyof typeof this.callbacks>(
    callbackName: K
  ): (typeof this.callbacks)[K] | undefined {
    const callback = this.callbacks[callbackName];
    if (isFunction(callback)) {
      return callback;
    }
    return undefined;
  }

  /**
   * Go to a specific step of the tour
   * @param step step number
   */
  async goToStep(step: number) {
    // step - 2 because steps starts from zero index and nextStep() increments the step
    this.setCurrentStep(step - 2);
    await nextStep(this);
    return this;
  }

  /**
   * Go to a specific step of the tour with the explicit [data-step] number
   * @param stepNumber [data-step] value of the step
   */
  async goToStepNumber(stepNumber: number) {
    for (let i = 0; i < this._steps.length; i++) {
      const item = this._steps[i];

      if (item.step === stepNumber) {
        // i - 1 because nextStep() increments the step
        this.setCurrentStep(i - 1);
        break;
      }
    }

    await nextStep(this);

    return this;
  }

  /**
   * Add a step to the tour options.
   * This method should be used in conjunction with the `start()` method.
   * @param step step to add
   */
  addStep(step: Partial<TourStep>) {
    if (!this._options.steps) {
      this._options.steps = [];
    }

    this._options.steps.push(step);

    return this;
  }

  /**
   * Add multiple steps to the tour options.
   * This method should be used in conjunction with the `start()` method.
   * @param steps steps to add
   */
  addSteps(steps: Partial<TourStep>[]) {
    if (!steps.length) return this;

    for (const step of steps) {
      this.addStep(step);
    }

    return this;
  }

  /**
   * Set the steps of the tour
   * @param steps steps to set
   */
  setSteps(steps: TourStep[]): this {
    this._steps = steps;
    return this;
  }

  /**
   * Get all available steps of the tour
   */
  getSteps(): TourStep[] {
    return this._steps;
  }

  /**
   * Get a specific step of the tour
   * @param {number} step step number
   */
  getStep(step: number): TourStep {
    return this._steps[step];
  }

  /**
   * Get the current step of the tour
   */
  getCurrentStep(): number {
    return this._currentStep;
  }

  /**
   * @deprecated `currentStep()` is deprecated, please use `getCurrentStep()` instead.
   */
  currentStep(): number {
    return this._currentStep;
  }

  /**
   * Set the current step of the tour and the direction of the tour
   * @param step
   */
  setCurrentStep(step: number): this {
    if (step >= this._currentStep) {
      this._direction = "forward";
    } else {
      this._direction = "backward";
    }

    this.currentStepSignal.val = step;
    this._currentStep = step;
    return this;
  }

  /**
   * Increment the current step of the tour (does not start the tour step, must be called in conjunction with `nextStep`)
   */
  incrementCurrentStep(): this {
    if (this.getCurrentStep() === -1) {
      this.setCurrentStep(0);
    } else {
      this.setCurrentStep(this.getCurrentStep() + 1);
    }

    return this;
  }

  /**
   * Decrement the current step of the tour (does not start the tour step, must be in conjunction with `previousStep`)
   */
  decrementCurrentStep(): this {
    if (this.getCurrentStep() > 0) {
      this.setCurrentStep(this._currentStep - 1);
    }

    return this;
  }

  /**
   * Get the direction of the tour (forward or backward)
   */
  getDirection() {
    return this._direction;
  }

  /**
   * Go to the next step of the tour
   */
  async nextStep() {
    this.currentStepSignal.val! += 1;
    await nextStep(this);
    return this;
  }

  /**
   * Go to the previous step of the tour
   */
  async previousStep() {
    await previousStep(this);
    return this;
  }

  /**
   * Check if the current step is the last step
   */
  isEnd(): boolean {
    return this.getCurrentStep() >= this._steps.length;
  }

  /**
   * Check if the current step is the last step of the tour
   */
  isLastStep(): boolean {
    return this.getCurrentStep() === this._steps.length - 1;
  }

  /**
   * Get the target element of the tour
   */
  getTargetElement(): HTMLElement {
    return this._targetElement;
  }

  /**
   * Set the options for the tour
   * @param partialOptions key/value pair of options
   */
  setOptions(partialOptions: Partial<TourOptions>): this {
    this._options = setOptions(this._options, partialOptions);
    return this;
  }

  /**
   * Set a specific option for the tour
   * @param key option key
   * @param value option value
   */
  setOption<K extends keyof TourOptions>(key: K, value: TourOptions[K]): this {
    this._options = setOption(this._options, key, value);
    return this;
  }

  /**
   * Get a specific option for the tour
   * @param key option key
   */
  getOption<K extends keyof TourOptions>(key: K): TourOptions[K] {
    return this._options[key];
  }

  /**
   * Clone the current tour instance
   */
  clone(): ThisType<this> {
    return new Tour(this._targetElement, this._options);
  }

  /**
   * Returns true if the tour instance is active
   */
  isActive(): boolean {
    if (
      this.getOption("dontShowAgain") &&
      getDontShowAgain(this.getOption("dontShowAgainCookie"))
    ) {
      return false;
    }

    return this.getOption("isActive");
  }

  /**
   * Returns true if the tour has started
   */
  hasStarted(): boolean {
    return this.getCurrentStep() > -1;
  }

  /**
   * Set the `dontShowAgain` option for the tour so that the tour does not show twice to the same user
   * This is a persistent option that is stored in the browser's cookies
   *
   * @param dontShowAgain boolean value to set the `dontShowAgain` option
   */
  setDontShowAgain(dontShowAgain: boolean) {
    setDontShowAgain(
      dontShowAgain,
      this.getOption("dontShowAgainCookie"),
      this.getOption("dontShowAgainCookieDays")
    );
    return this;
  }

  /**
   * Enable keyboard navigation for the tour
   */
  enableKeyboardNavigation() {
    if (this.getOption("keyboardNavigation")) {
      this._keyboardNavigationHandler = (e: KeyboardEvent) =>
        onKeyDown(this, e);
      DOMEvent.on(window, "keydown", this._keyboardNavigationHandler, true);
    }

    return this;
  }

  /**
   * Disable keyboard navigation for the tour
   */
  disableKeyboardNavigation() {
    if (this._keyboardNavigationHandler) {
      DOMEvent.off(window, "keydown", this._keyboardNavigationHandler, true);
      this._keyboardNavigationHandler = undefined;
    }

    return this;
  }

  /**
   * Enable refresh on window resize for the tour
   */
  enableRefreshOnResize() {
    this._refreshOnResizeHandler = (_: Event) => onResize(this);
    DOMEvent.on(window, "resize", this._refreshOnResizeHandler, true);
  }

  /**
   * Disable refresh on window resize for the tour
   */
  disableRefreshOnResize() {
    if (this._refreshOnResizeHandler) {
      DOMEvent.off(window, "resize", this._refreshOnResizeHandler, true);
      this._refreshOnResizeHandler = undefined;
    }
  }

  /**
   * Starts the tour and shows the first step
   */
  async start() {
    if (await start(this)) {
      this.enableKeyboardNavigation();
      this.enableRefreshOnResize();
    }

    return this;
  }

  /**
   * Exit the tour
   * @param {boolean} force whether to force exit the tour
   */
  async exit(force?: boolean) {
    if (await exitIntro(this, force ?? false)) {
      this.disableKeyboardNavigation();
      this.disableRefreshOnResize();
    }

    return this;
  }

  /**
   * Refresh the tour
   * @param {boolean} refreshSteps whether to refresh the tour steps
   */
  refresh(refreshSteps?: boolean) {
    refresh(this, refreshSteps);
    return this;
  }

  /**
   * @deprecated onbeforechange is deprecated, please use onBeforeChange instead.
   */
  onbeforechange(callback: introBeforeChangeCallback) {
    return this.onBeforeChange(callback);
  }

  /**
   * Add a callback to be called before the tour changes steps
   * @param {Function} callback callback function to be called
   */
  onBeforeChange(callback: introBeforeChangeCallback) {
    if (!isFunction(callback)) {
      throw new Error(
        "Provided callback for onBeforeChange was not a function"
      );
    }

    this.callbacks.beforeChange = callback;
    return this;
  }

  /**
   * @deprecated onchange is deprecated, please use onChange instead.
   */
  onchange(callback: introChangeCallback) {
    this.onChange(callback);
  }

  /**
   * Add a callback to be called when the tour changes steps
   * @param {Function} callback callback function to be called
   */
  onChange(callback: introChangeCallback) {
    if (!isFunction(callback)) {
      throw new Error("Provided callback for onChange was not a function.");
    }

    this.callbacks.change = callback;
    return this;
  }

  /**
   * @deprecated onafterchange is deprecated, please use onAfterChange instead.
   */
  onafterchange(callback: introAfterChangeCallback) {
    this.onAfterChange(callback);
  }

  /**
   * Add a callback to be called after the tour changes steps
   * @param {Function} callback callback function to be called
   */
  onAfterChange(callback: introAfterChangeCallback) {
    if (!isFunction(callback)) {
      throw new Error("Provided callback for onAfterChange was not a function");
    }

    this.callbacks.afterChange = callback;
    return this;
  }

  /**
   * @deprecated oncomplete is deprecated, please use onComplete instead.
   */
  oncomplete(callback: introCompleteCallback) {
    return this.onComplete(callback);
  }

  /**
   * Add a callback to be called when the tour is completed
   * @param {Function} callback callback function to be called
   */
  onComplete(callback: introCompleteCallback) {
    if (!isFunction(callback)) {
      throw new Error("Provided callback for oncomplete was not a function.");
    }

    this.callbacks.complete = callback;
    return this;
  }

  /**
   * @deprecated onstart is deprecated, please use onStart instead.
   */
  onstart(callback: introStartCallback) {
    return this.onStart(callback);
  }

  /**
   * Add a callback to be called when the tour is started
   * @param {Function} callback callback function to be called
   */
  onStart(callback: introStartCallback) {
    if (!isFunction(callback)) {
      throw new Error("Provided callback for onstart was not a function.");
    }

    this.callbacks.start = callback;
    return this;
  }

  /**
   * @deprecated onexit is deprecated, please use onExit instead.
   */
  onexit(callback: introExitCallback) {
    return this.onExit(callback);
  }

  /**
   * Add a callback to be called when the tour is exited
   * @param {Function} callback callback function to be called
   */
  onExit(callback: introExitCallback) {
    if (!isFunction(callback)) {
      throw new Error("Provided callback for onexit was not a function.");
    }

    this.callbacks.exit = callback;
    return this;
  }

  /**
   * @deprecated onskip is deprecated, please use onSkip instead.
   */
  onskip(callback: introSkipCallback) {
    return this.onSkip(callback);
  }

  /**
   * Add a callback to be called when the tour is skipped
   * @param {Function} callback callback function to be called
   */
  onSkip(callback: introSkipCallback) {
    if (!isFunction(callback)) {
      throw new Error("Provided callback for onskip was not a function.");
    }

    this.callbacks.skip = callback;
    return this;
  }

  /**
   * @deprecated onbeforeexit is deprecated, please use onBeforeExit instead.
   */
  onbeforeexit(callback: introBeforeExitCallback) {
    return this.onBeforeExit(callback);
  }

  /**
   * Add a callback to be called before the tour is exited
   * @param {Function} callback callback function to be called
   */
  onBeforeExit(callback: introBeforeExitCallback) {
    if (!isFunction(callback)) {
      throw new Error("Provided callback for onbeforeexit was not a function.");
    }

    this.callbacks.beforeExit = callback;
    return this;
  }
}
