import forEach from "../util/forEach";
import showElement from "./showElement";
import exitIntro from "./exitIntro";
import waitForElement from "../util/waitForElement";

/**
 * Go to specific step of introduction
 *
 * @api private
 * @method _goToStep
 */
export function goToStep(step) {
  //because steps starts with zero
  this._currentStep = step - 2;
  if (typeof this._introItems !== "undefined") {
    nextStep.call(this);
  }
}

/**
 * Go to the specific step of introduction with the explicit [data-step] number
 *
 * @api private
 * @method _goToStepNumber
 */
export function goToStepNumber(step) {
  this._currentStepNumber = step;
  if (typeof this._introItems !== "undefined") {
    nextStep.call(this);
  }
}

/**
 * Go to next step on intro
 *
 * @api private
 * @method _nextStep
 */
export function nextStep() {
  this._direction = "forward";
  if (this._waitingNextElement) return;

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
    continueStep = this._introBeforeChangeCallback.call(
      this,
      nextStep &&
        (elementBySelectorNotExists(nextStep) ? undefined : nextStep.element)
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
      this._introCompleteCallback.call(this, this._currentStep, "end");
    }
    exitIntro.call(this, this._targetElement);
    return;
  }

  if (elementBySelectorNotExists(nextStep)) {
    this._waitingNextElement = true;
    waitForElement(nextStep._element, () => {
      this._waitingNextElement = false;
      showElement.call(this, nextStep);
    });
  } else {
    showElement.call(this, nextStep);
  }
}

/**
 * Return true if element locates by selector and doesn't exists yet
 */
function elementBySelectorNotExists(step) {
  return (
    typeof step._element === "string" &&
    document.querySelector(step._element) === null
  );
}

/**
 * Go to previous step on intro
 *
 * @api private
 * @method _previousStep
 */
export function previousStep() {
  this._direction = "backward";

  if (this._currentStep === 0) {
    return false;
  }

  --this._currentStep;

  const nextStep = this._introItems[this._currentStep];
  let continueStep = true;

  if (typeof this._introBeforeChangeCallback !== "undefined") {
    continueStep = this._introBeforeChangeCallback.call(
      this,
      nextStep && nextStep.element
    );
  }

  // if `onbeforechange` returned `false`, stop displaying the element
  if (continueStep === false) {
    ++this._currentStep;
    return false;
  }

  showElement.call(this, nextStep);
}

/**
 * Returns the current step of the intro
 *
 * @returns {number | boolean}
 */
export function currentStep() {
  return this._currentStep;
}
