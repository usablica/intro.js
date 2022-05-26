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
import { getDontShowAgain, setDontShowAgain } from "./core/dontShowAgain";

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
  isActive?: boolean;
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
  scrollTo?: string;
  helperElementPadding?: number;
  skipLabel?: string;
  nextToDone?: boolean;
  buttonClass?: string;
  nextLabel?: string;
  tooltipPosition?: string;
  hintAnimation?: boolean;
  dontShowAgainCookie?: string;
  dontShowAgainCookieDays?: number;
  steps?: Array<Step>;
  hints?: Array<any>;
  group?: string;
  autoPosition?: boolean;
  dontShowAgain?: boolean;
  dontShowAgainLabel?: string;
  stepNumbersOfLabel?: string;
  hintShowButton?: boolean;
  hintAutoRefreshInterval?: number;
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
  this: IntroJs,
  element?: HTMLElement
) => boolean;
export type IntroBeforeChangeCallback = (
  this: IntroJs,
  element?: any
) => boolean;
export type IntroAfterChangeCallback = (
  this: IntroJs,
  element?: HTMLElement
) => void;
export type IntroCompleteCallback = (
  this: IntroJs,
  currentStep: number | undefined,
  status: string
) => void;
export type IntroExitCallback = (this: IntroJs) => void;
export type IntroSkipCallback = (this: IntroJs) => void;
export type IntroStartCallback = (this: IntroJs, element?: HTMLElement) => void;
export type IntroBeforeExitCallback = (this: IntroJs) => boolean;
export type HintsAddedCallback = (this: IntroJs) => void;
export type HintsAutoRefreshFunction = (this: IntroJs) => void;
export type HintClickCallback = (
  hintElement?: HTMLElement,
  item?: IntroItem,
  stepId?: number
) => void;
export type HintCloseCallback = (
  this: IntroJs,
  step?: number | undefined | string
) => void;

export class IntroJs {
  _options: Options;
  _introItems: IntroItem[] = [];
  _currentStep: number | undefined = undefined;
  _direction: string | undefined = undefined;
  _currentStepNumber: number | undefined = undefined;
  _lastShowElementTimer: number | undefined = undefined;
  _targetElement: HTMLElement;

  _introBeforeChangeCallback: IntroBeforeChangeCallback | undefined;
  _introChangeCallback: IntroChangeCallback | undefined;
  _introAfterChangeCallback: IntroAfterChangeCallback | undefined;
  _introCompleteCallback: IntroCompleteCallback | undefined;
  _hintsAddedCallback: HintsAddedCallback | undefined;
  _hintClickCallback: HintClickCallback | undefined;
  _hintCloseCallback: HintCloseCallback | undefined;
  _introExitCallback: IntroExitCallback | undefined;
  _introProvidedCallback: IntroStartCallback | undefined;
  _introSkipCallback: IntroSkipCallback | undefined;
  _introStartCallback: IntroStartCallback | undefined;
  _introBeforeExitCallback: IntroBeforeExitCallback | undefined;
  _hintsAutoRefreshFunction: HintsAutoRefreshFunction | undefined;

  constructor(obj: HTMLElement) {
    this._targetElement = obj;
    this._introItems = [];

    this._options = {
      /* Is this tour instance active? Don't show the tour again if this flag is set to false */
      isActive: true,
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
      /* "Don't show again" cookie name and expiry (in days) */
      dontShowAgainCookie: "introjs-dontShowAgain",
      dontShowAgainCookieDays: 365,
      /* Pagination "of" label */
      stepNumbersOfLabel: "of",
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
      /* To determine the tooltip position automatically based on the window.width/height */
      autoPosition: true,
      /* To display the "Don't show again" checkbox in the tour */
      dontShowAgain: false,
      dontShowAgainLabel: "Don't show this again",
      /* Display the "Got it" button? */
      hintShowButton: true,
      /* Hints auto-refresh interval in ms (set to -1 to disable) */
      hintAutoRefreshInterval: 10,
    };
  }
  isActive() {
    if (this._options.dontShowAgain && getDontShowAgain.call(this)) {
      return false;
    }

    return this._options.isActive;
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
  start() {
    introForElement.call(this, this._targetElement);
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
  setDontShowAgain(dontShowAgain: boolean) {
    setDontShowAgain.call(this, dontShowAgain);
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
  onstart(providedCallback: IntroStartCallback) {
    if (typeof providedCallback === "function") {
      this._introStartCallback = providedCallback;
    } else {
      throw new Error("Provided callback for onstart was not a function.");
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
