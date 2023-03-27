import showElement from "./showElement";
import exitIntro from "./exitIntro";

export type Step = {
  step?: number;
  title?: string;
  intro: string;
  tooltipClass?: string;
  highlightClass?: string;
  element?: HTMLElement | string;
  position?: string;
  scrollTo?: HTMLElement;
  disableInteraction?: boolean;
  hintAnimation?: boolean;
  hintPosition?: string;
};

/**
 * Go to specific step of introduction
 *
 * @api private
 */
export async function goToStep(step: number) {
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
 */
export async function goToStepNumber(step: number) {
  this._currentStepNumber = step;
  if (typeof this._introItems !== "undefined") {
    await nextStep.call(this);
  }
}

/**
 * Go to next step on intro
 *
 * @api private
 */
export async function nextStep() {
  this._direction = "forward";

  if (typeof this._currentStepNumber !== "undefined") {
    for (let i = 0; i < this._introItems.length; i++) {
      const item = this._introItems[i];
      if (item.step === this._currentStepNumber) {
        this._currentStep = i - 1;
        this._currentStepNumber = undefined;
      }
    }
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

    return false;
  }

  await showElement.call(this, nextStep);

  return true;
}

/**
 * Go to previous step on intro
 *
 * @api private
 */
export async function previousStep() {
  this._direction = "backward";

  if (this._currentStep === 0) {
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

  return true;
}

/**
 * Returns the current step of the intro
 */
export function currentStep(): number | boolean {
  return this._currentStep;
}
