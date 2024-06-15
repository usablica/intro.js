import { goToStep, nextStep, TourStep } from "./steps";
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
import introForElement from "src/packages/tour/introForElement";
import exitIntro from "./exitIntro";
import isFunction from "src/util/isFunction";

export class Tour implements Package<TourOptions> {
  private _steps: TourStep[] = [];
  private _currentStep: number = -1;
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

  public constructor(targetElement: HTMLElement) {
    this._targetElement = targetElement;
    this._options = getDefaultTourOptions();
  }

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
   * @returns Tour instance
   */
  async goToStep(step: number) {
    // because steps starts from zero index
    this.setCurrentStep(step - 2);
    await nextStep(this);
    return this;
  }

  /**
   * Go to a specific step of the tour with the explicit [data-step] number
   * @param stepNumber
   * @returns
   */
  async goToStepNumber(stepNumber: number) {
    for (let i = 0; i < this._steps.length; i++) {
      const item = this._steps[i];

      if (item.step === stepNumber) {
        this.setCurrentStep(i - 1);
        break;
      }
    }

    await nextStep(this);

    return this;
  }

  getSteps(): TourStep[] {
    return this._steps;
  }

  getStep(step: number): TourStep {
    return this._steps[step];
  }

  getCurrentStep(): number {
    return this._currentStep;
  }

  setCurrentStep(step: number): this {
    if (step >= this._currentStep) {
      this._direction = "forward";
    } else {
      this._direction = "backward";
    }

    this._currentStep = step;
    return this;
  }

  incrementCurrentStep(): this {
    if (this.getCurrentStep() === -1) {
      this.setCurrentStep(0);
    } else {
      this.setCurrentStep(this.getCurrentStep() + 1);
    }

    return this;
  }

  decrementCurrentStep(): this {
    if (this.getCurrentStep() > 0) {
      this.setCurrentStep(this._currentStep - 1);
    }

    return this;
  }

  getDirection() {
    return this._direction;
  }

  /**
   * Check if the current step is the last step
   * @returns boolean
   */
  isEnd(): boolean {
    return this.getCurrentStep() === this._steps.length - 1;
  }

  getTargetElement(): HTMLElement {
    return this._targetElement;
  }

  setOptions(partialOptions: Partial<TourOptions>): this {
    this._options = setOptions(this._options, partialOptions);
    return this;
  }

  setOption<K extends keyof TourOptions>(key: K, value: TourOptions[K]): this {
    this._options = setOption(this._options, key, value);
    return this;
  }

  getOption<K extends keyof TourOptions>(key: K): TourOptions[K] {
    return this._options[key];
  }

  setSteps(steps: TourStep[]): this {
    this._steps = steps;
    return this;
  }

  clone(): ThisType<this> {
    return new Tour(this._targetElement);
  }

  isActive(): boolean {
    throw new Error("Method not implemented.");
  }

  async render(): Promise<this> {
    await introForElement(this, this._targetElement);
    return this;
  }

  /**
   * @deprecated `start()` is deprecated, please use `render()` instead.
   * @returns
   */
  async start() {
    await introForElement(this, this._targetElement);
    return this;
  }

  async exit(force: boolean) {
    await exitIntro(this, force);
    return this;
  }
}
