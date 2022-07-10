import forEach from "../util/forEach";
import showElement from "./showElement";
import exitIntro from "./exitIntro";
import { IntroJs } from "../IntroJs";

/**
 * Go to specific step of introduction
 *
 * @api private
 * @method _goToStep
 */
export async function goToStep(this: IntroJs, step: number) {
  //because steps starts with zero
  this._currentStep = step - 2;
  if (typeof this._introItems !== "undefined") {
    await nextStep.call(this);
  }
}

/**
 * Go to the specific step of introduction with the explicit [data-step] number
 *
 * @api private
 * @method _goToStepNumber
 */
export async function goToStepNumber(this: IntroJs, step: number) {
  this._currentStepNumber = step;
  if (typeof this._introItems !== "undefined") {
    await nextStep.call(this);
  }
}

/**
 * Go to next step on intro
 *
 * @api private
 * @method _nextStep
 */
export async function nextStep(this: IntroJs) {
  this._direction = "forward";

  if (typeof this._currentStepNumber !== "undefined") {
    forEach(this._introItems, ({ step }, i) => {
      if (step === this._currentStepNumber) {
        this._currentStep = i - 1;
        this._currentStepNumber = undefined;
      }
    });
  }

  if (typeof this._currentStep === "undefined") {
    this._currentStep = 0;
  } else {
    ++this._currentStep;
  }

  const nextStep = this._introItems[this._currentStep];
  let continueStep = true;

  if (typeof this._introBeforeChangeCallback !== "undefined") {
    continueStep = await this._introBeforeChangeCallback.call(
      this,
      nextStep && nextStep.element
    );
  }

  // if `onbeforechange` returned `false`, stop displaying the element
  if (continueStep === false) {
    --this._currentStep;
    return false;
  }

  if (this._introItems.length <= this._currentStep) {
    //end of the intro
    //check if any callback is defined
    if (typeof this._introCompleteCallback === "function") {
      await this._introCompleteCallback.call(this, this._currentStep, "end");
    }
    await exitIntro.call(this, this._targetElement);
    return;
  }

  await showElement.call(this, nextStep);
}

/**
 * Go to previous step on intro
 *
 * @api private
 * @method _previousStep
 */
export async function previousStep(this: IntroJs) {
  this._direction = "backward";

  if (this._currentStep === undefined || this._currentStep === 0) {
    return false;
  }

  --this._currentStep;

  const nextStep = this._introItems[this._currentStep];
  let continueStep = true;

  if (typeof this._introBeforeChangeCallback !== "undefined") {
    continueStep = await this._introBeforeChangeCallback.call(
      this,
      nextStep && nextStep.element
    );
  }

  // if `onbeforechange` returned `false`, stop displaying the element
  if (continueStep === false) {
    ++this._currentStep;
    return false;
  }

  await showElement.call(this, nextStep);
}

/**
 * Returns the current step of the intro
 *
 * @returns {number | boolean}
 */
export function currentStep(this: IntroJs) {
  return this._currentStep;
}
