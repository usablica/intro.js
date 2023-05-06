import showElement from "./showElement";
import exitIntro from "./exitIntro";
import { IntroJs } from "src/intro";

export type ScrollTo = "off" | "element" | "tooltip";

export type Step = {
  step?: number;
  title?: string;
  intro?: string;
  tooltipClass?: string;
  highlightClass?: string;
  element?: HTMLElement | string;
  position?: string;
  scrollTo?: ScrollTo;
  disableInteraction?: boolean;

  hint?: string,
  hintTargetElement?: HTMLElement;
  hintAnimation?: boolean;
  hintPosition?: string;
};

/**
 * Go to specific step of introduction
 *
 * @api private
 */
export async function goToStep(intro: IntroJs, step: number) {
  //because steps starts with zero
  intro._currentStep = step - 2;
  if (typeof intro._introItems !== "undefined") {
    await nextStep(intro);
  }
}

/**
 * Go to the specific step of introduction with the explicit [data-step] number
 *
 * @api private
 */
export async function goToStepNumber(intro: IntroJs, step: number) {
  intro._currentStepNumber = step;
  if (typeof intro._introItems !== "undefined") {
    await nextStep(intro);
  }
}

/**
 * Go to next step on intro
 *
 * @api private
 */
export async function nextStep(intro: IntroJs) {
  intro._direction = "forward";

  if (typeof intro._currentStepNumber !== "undefined") {
    for (let i = 0; i < intro._introItems.length; i++) {
      const item = intro._introItems[i];
      if (item.step === intro._currentStepNumber) {
        intro._currentStep = i - 1;
        intro._currentStepNumber = undefined;
      }
    }
  }

  if (typeof intro._currentStep === "undefined") {
    intro._currentStep = 0;
  } else {
    ++intro._currentStep;
  }

  const nextStep = intro._introItems[intro._currentStep];
  let continueStep = true;

  if (typeof intro._introBeforeChangeCallback !== "undefined") {
    continueStep = await intro._introBeforeChangeCallback.call(
      intro,
      nextStep && nextStep.element
    );
  }

  // if `onbeforechange` returned `false`, stop displaying the element
  if (continueStep === false) {
    --intro._currentStep;
    return false;
  }

  if (intro._introItems.length <= intro._currentStep) {
    //end of the intro
    //check if any callback is defined
    if (typeof intro._introCompleteCallback === "function") {
      await intro._introCompleteCallback.call(intro, intro._currentStep, "end");
    }

    await exitIntro(intro, intro._targetElement);

    return false;
  }

  await showElement(intro, nextStep);

  return true;
}

/**
 * Go to previous step on intro
 *
 * @api private
 */
export async function previousStep(intro: IntroJs) {
  intro._direction = "backward";

  if (intro._currentStep === 0) {
    return false;
  }

  --intro._currentStep;

  const nextStep = intro._introItems[intro._currentStep];
  let continueStep = true;

  if (typeof intro._introBeforeChangeCallback !== "undefined") {
    continueStep = await intro._introBeforeChangeCallback.call(
      intro,
      nextStep && nextStep.element
    );
  }

  // if `onbeforechange` returned `false`, stop displaying the element
  if (continueStep === false) {
    ++intro._currentStep;
    return false;
  }

  await showElement(intro, nextStep);

  return true;
}
