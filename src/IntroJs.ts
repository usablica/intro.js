import mergeOptions from "./util/mergeOptions";
import exitIntro from "./core/exitIntro";
import refresh from "./core/refresh";
import introForElement from "./core/introForElement";

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
  currentStep,
  goToStep,
  goToStepNumber,
  nextStep,
  previousStep,
} from "./core/steps";

export interface IntroItem {
  element: HTMLElement;
  title?: string | null;
  intro?: string | null;
  step?: number;
  hint?: string;
  hintPosition?: string;
  hintAnimation?: boolean;
  tooltipClass?: string | null;
  highlightClass?: string | null;
  position?: string;
  scrollTo?: string;
  disableInteraction?: boolean;
}

export interface Options {
  showButtons?: boolean;
  scrollPadding?: number;
  prevLabel?: string;
  showProgress?: boolean;
  hintButtonLabel?: string;
  positionPrecedence?: string[];
  progressBarAdditionalClass?: boolean;
  doneLabel?: string;
  hideNext?: boolean;
  hidePrev?: boolean;
  group?: string;
  highlightClass?: string;
  showStepNumbers?: boolean;
  keyboardNavigation?: boolean;
  overlayOpacity?: number;
  disableInteraction?: boolean;
  exitOnEsc?: boolean;
  exitOnOverlayClick?: boolean;
  tooltipClass?: string;
  showBullets?: boolean;
  hintPosition?: string;
  scrollToElement?: boolean;
  autoPosition?: boolean;
  scrollTo?: string;
  helperElementPadding?: number;
  skipLabel?: string;
  nextToDone?: boolean;
  buttonClass?: string;
  nextLabel?: string;
  tooltipPosition?: string;
  hintAnimation?: boolean;
  steps?: Array<Step>;
  hints?: Array<any>;
}

export interface Step {
  element?: HTMLElement | HTMLDivElement | HTMLParagraphElement | string | null;
  intro: string;
  position?:
    | "top"
    | "right"
    | "left"
    | "bottom"
    | "bottom-left-aligned"
    | "bottom-middle-aligned"
    | "bottom-right-aligned"
    | "auto";
}

export type IntroChangeCallback = (
  intro?: IntroJs,
  element?: HTMLElement
) => boolean;
export type IntroBeforeChangeCallback = (
  intro?: IntroJs,
  step?: number
) => void;
export type IntroAfterChangeCallback = (intro?: IntroJs) => void;
export type IntroCompleteCallback = (intro?: IntroJs) => void;
export type IntroExitCallback = (intro?: IntroJs) => void;
export type IntroSkipCallback = (intro?: IntroJs) => void;
export type IntroBeforeExitCallback = (intro?: IntroJs) => void;
export type HintsAddedCallback = (intro?: IntroJs) => void;
export type HintClickCallback = (
  hintElement?: HTMLElement,
  item?: IntroItem,
  stepId?: number
) => void;
export type HintCloseCallback = (intro?: IntroJs, step?: number) => void;

export class IntroJs {
  _options: Options;
  _introItems: IntroItem[] = [];
  _currentStep: number | undefined = undefined;
  _direction: string | undefined = undefined;
  _currentStepNumber: number | undefined = undefined;
  _lastShowElementTimer: number | undefined = undefined;
  _targetElement: HTMLElement | null = null;

  _introBeforeChangeCallback: IntroBeforeChangeCallback;
  _introChangeCallback: IntroChangeCallback;
  _introAfterChangeCallback: IntroAfterChangeCallback;
  _introCompleteCallback: IntroCompleteCallback;
  _hintsAddedCallback: HintsAddedCallback;
  _hintClickCallback: HintClickCallback;
  _hintCloseCallback: HintCloseCallback;
  _introExitCallback: IntroExitCallback;
  _introSkipCallback: IntroSkipCallback;
  _introBeforeExitCallback: IntroBeforeExitCallback;

  constructor(obj: HTMLElement | null = null) {
    this._targetElement = obj;
    this._introItems = [];

    this._options = {
      /* Next button label in tooltip box */
      nextLabel: "Next",
      /* Previous button label in tooltip box */
      prevLabel: "Back",
      /* Skip button label in tooltip box */
      skipLabel: "×",
      /* Done button label in tooltip box */
      doneLabel: "Done",
      /* Hide previous button in the first step? Otherwise, it will be disabled button. */
      hidePrev: false,
      /* Hide next button in the last step? Otherwise, it will be disabled button (note: this will also hide the "Done" button) */
      hideNext: false,
      /* Change the Next button to Done in the last step of the intro? otherwise, it will render a disabled button */
      nextToDone: true,
      /* Default tooltip box position */
      tooltipPosition: "bottom",
      /* Next CSS class for tooltip boxes */
      tooltipClass: "",
      /* Start intro for a group of elements */
      group: "",
      /* CSS class that is added to the helperLayer */
      highlightClass: "",
      /* Close introduction when pressing Escape button? */
      exitOnEsc: true,
      /* Close introduction when clicking on overlay layer? */
      exitOnOverlayClick: true,
      /* Show step numbers in introduction? */
      showStepNumbers: false,
      /* Let user use keyboard to navigate the tour? */
      keyboardNavigation: true,
      /* Show tour control buttons? */
      showButtons: true,
      /* Show tour bullets? */
      showBullets: true,
      /* Show tour progress? */
      showProgress: false,
      /* Scroll to highlighted element? */
      scrollToElement: true,
      /* To determine the tooltip position automatically based on the window.width/height */
      autoPosition: true,
      /*
       * Should we scroll the tooltip or target element?
       *
       * Options are: 'element' or 'tooltip'
       */
      scrollTo: "element",
      /* Padding to add after scrolling when element is not in the viewport (in pixels) */
      scrollPadding: 30,
      /* Set the overlay opacity */
      overlayOpacity: 0.5,
      /* Precedence of positions, when auto is enabled */
      positionPrecedence: ["bottom", "top", "right", "left"],
      /* Disable an interaction with element? */
      disableInteraction: false,
      /* Set how much padding to be used around helper element */
      helperElementPadding: 10,
      /* Default hint position */
      hintPosition: "top-middle",
      /* Hint button label */
      hintButtonLabel: "Got it",
      /* Adding animation to hints? */
      hintAnimation: true,
      /* additional classes to put on the buttons */
      buttonClass: "introjs-button",
      /* additional classes to put on progress bar */
      progressBarAdditionalClass: false,
    };
  }

  clone() {
    return new IntroJs(this._targetElement);
  }
  setOption(option: string, value: any) {
    // @ts-ignore
    this._options[option] = value;
    return this;
  }
  setOptions(options: Options) {
    this._options = mergeOptions(this._options, options);
    return this;
  }
  start(group: number | undefined = undefined) {
    introForElement.call(this, this._targetElement, group);
    return this;
  }
  goToStep(step: number) {
    goToStep.call(this, step);
    return this;
  }
  addStep(options: Step) {
    if (!this._options.steps) {
      this._options.steps = [];
    }

    this._options.steps.push(options);

    return this;
  }
  addSteps(steps: Array<Step>) {
    if (!steps.length) return;

    for (let index = 0; index < steps.length; index++) {
      this.addStep(steps[index]);
    }

    return this;
  }
  goToStepNumber(step: number) {
    goToStepNumber.call(this, step);

    return this;
  }
  nextStep() {
    nextStep.call(this);
    return this;
  }
  previousStep() {
    previousStep.call(this);
    return this;
  }
  currentStep() {
    return currentStep.call(this);
  }
  exit(force: boolean = false) {
    exitIntro.call(this, this._targetElement, force);
    return this;
  }
  refresh(refreshSteps: boolean = false) {
    refresh.call(this, refreshSteps);
    return this;
  }
  onbeforechange(providedCallback: IntroBeforeChangeCallback) {
    if (typeof providedCallback === "function") {
      this._introBeforeChangeCallback = providedCallback;
    } else {
      throw new Error(
        "Provided callback for onbeforechange was not a function"
      );
    }
    return this;
  }
  onchange(providedCallback: IntroChangeCallback) {
    if (typeof providedCallback === "function") {
      this._introChangeCallback = providedCallback;
    } else {
      throw new Error("Provided callback for onchange was not a function.");
    }
    return this;
  }
  onafterchange(providedCallback: IntroAfterChangeCallback) {
    if (typeof providedCallback === "function") {
      this._introAfterChangeCallback = providedCallback;
    } else {
      throw new Error("Provided callback for onafterchange was not a function");
    }
    return this;
  }
  oncomplete(providedCallback: IntroCompleteCallback) {
    if (typeof providedCallback === "function") {
      this._introCompleteCallback = providedCallback;
    } else {
      throw new Error("Provided callback for oncomplete was not a function.");
    }
    return this;
  }
  onhintsadded(providedCallback: HintsAddedCallback) {
    if (typeof providedCallback === "function") {
      this._hintsAddedCallback = providedCallback;
    } else {
      throw new Error("Provided callback for onhintsadded was not a function.");
    }
    return this;
  }
  onhintclick(providedCallback: HintClickCallback) {
    if (typeof providedCallback === "function") {
      this._hintClickCallback = providedCallback;
    } else {
      throw new Error("Provided callback for onhintclick was not a function.");
    }
    return this;
  }
  onhintclose(providedCallback: HintCloseCallback) {
    if (typeof providedCallback === "function") {
      this._hintCloseCallback = providedCallback;
    } else {
      throw new Error("Provided callback for onhintclose was not a function.");
    }
    return this;
  }
  onexit(providedCallback: IntroExitCallback) {
    if (typeof providedCallback === "function") {
      this._introExitCallback = providedCallback;
    } else {
      throw new Error("Provided callback for onexit was not a function.");
    }
    return this;
  }
  onskip(providedCallback: IntroSkipCallback) {
    if (typeof providedCallback === "function") {
      this._introSkipCallback = providedCallback;
    } else {
      throw new Error("Provided callback for onskip was not a function.");
    }
    return this;
  }
  onbeforeexit(providedCallback: IntroBeforeExitCallback) {
    if (typeof providedCallback === "function") {
      this._introBeforeExitCallback = providedCallback;
    } else {
      throw new Error("Provided callback for onbeforeexit was not a function.");
    }
    return this;
  }
  addHints() {
    populateHints.call(this, this._targetElement);
    return this;
  }
  hideHint(stepId: number) {
    hideHint.call(this, stepId);
    return this;
  }
  hideHints() {
    hideHints.call(this);
    return this;
  }
  showHint(stepId: number) {
    showHint.call(this, stepId);
    return this;
  }
  showHints() {
    showHints.call(this);
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
  showHintDialog(stepId: number) {
    showHintDialog.call(this, stepId);
    return this;
  }
}
