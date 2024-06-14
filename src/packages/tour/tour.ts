import { IntroStep } from "../../core/steps";
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

export class Tour implements Package<TourOptions> {
  private _steps: IntroStep[] = [];
  private _currentStep: number = -1;
  public _currentStepNumber: number | undefined;
  public _direction: "forward" | "backward";
  private _targetElement: HTMLElement;
  private _options: TourOptions;
  public _introBeforeChangeCallback?: introBeforeChangeCallback;
  public _introChangeCallback?: introChangeCallback;
  public _introAfterChangeCallback?: introAfterChangeCallback;
  public _introCompleteCallback?: introCompleteCallback;
  public _introStartCallback?: introStartCallback;
  public _introExitCallback?: introExitCallback;
  public _introSkipCallback?: introSkipCallback;
  public _introBeforeExitCallback?: introBeforeExitCallback;

  public constructor(targetElement: HTMLElement) {
    this._targetElement = targetElement;
    this._options = getDefaultTourOptions();
  }

  setCurrentStep(step: number): this {
    this._currentStep = step;
    return this;
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

  setSteps(steps: IntroStep[]): this {
    this._steps = steps;
    return this;
  }

  clone(): ThisType<this> {
    return new Tour(this._targetElement);
  }

  isActive(): boolean {
    throw new Error("Method not implemented.");
  }

  render(): this {
    console.log("Tour");

    return this;
  }

  async start() {
    await introForElement(this, this._targetElement);
    return this;
  }

  async exit(force: boolean) {
    await exitIntro(
      this,
      this._targetElement,
      this._introBeforeExitCallback,
      this._introExitCallback,
      force
    );
    return this;
  }
}
