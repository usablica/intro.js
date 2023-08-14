import isFunction from "../util/isFunction";
import exitIntro from "./exitIntro";
import showElement from "./showElement";
import { IntroJs } from "../intro";

export type ScrollTo = "off" | "element" | "tooltip";

export type TooltipPosition =
  | "floating"
  | "top"
  | "bottom"
  | "left"
  | "right"
  | "top-right-aligned"
  | "top-left-aligned"
  | "top-middle-aligned"
  | "bottom-right-aligned"
  | "bottom-left-aligned"
  | "bottom-middle-aligned";

export type HintPosition =
  | "top-left"
  | "top-right"
  | "top-middle"
  | "bottom-left"
  | "bottom-right"
  | "bottom-middle"
  | "middle-left"
  | "middle-right"
  | "middle-middle";

export type IntroStep = {
  step: number;
  title: string;
  intro: string;
  tooltipClass?: string;
  highlightClass?: string;
  element?: HTMLElement | string | null;
  position: TooltipPosition;
  scrollTo: ScrollTo;
  disableInteraction?: boolean;
};

export type HintStep = {
  element?: HTMLElement | string | null;
  tooltipClass?: string;
  position: TooltipPosition;
  hint?: string;
  hintTargetElement?: HTMLElement;
  hintAnimation?: boolean;
  hintPosition: HintPosition;
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

  if (intro._currentStep === -1) {
    intro._currentStep = 0;
  } else {
    ++intro._currentStep;
  }

  const nextStep = intro._introItems[intro._currentStep];
  let continueStep = true;

  if (isFunction(intro._introBeforeChangeCallback)) {
    continueStep = await intro._introBeforeChangeCallback.call(
      intro,
      nextStep && (nextStep.element as HTMLElement),
      intro._currentStep,
      intro._direction
    );
  }

  // if `onbeforechange` returned `false`, stop displaying the element
  if (continueStep === false) {
    --intro._currentStep;
    return false;
  }

  if (intro._introItems.length <= intro._currentStep) {
    // end of the intro
    // check if any callback is defined
    if (isFunction(intro._introCompleteCallback)) {
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

  if (intro._currentStep <= 0) {
    return false;
  }

  --intro._currentStep;

  const nextStep = intro._introItems[intro._currentStep];
  let continueStep = true;

  if (isFunction(intro._introBeforeChangeCallback)) {
    continueStep = await intro._introBeforeChangeCallback.call(
      intro,
      nextStep && (nextStep.element as HTMLElement),
      intro._currentStep,
      intro._direction
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
