import mergeOptions from "./util/mergeOptions";
import stamp from "./util/stamp";
import exitIntro from "./core/exitIntro";
import refresh from "./core/refresh";
import introForElement from "./core/introForElement";
import { getDontShowAgain, setDontShowAgain } from "./core/dontShowAgain";
import { version } from "../package.json";
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
  Step,
  currentStep,
  goToStep,
  goToStepNumber,
  nextStep,
  previousStep,
} from "./core/steps";

class IntroJs {
  public _targetElement: HTMLElement;
  public _introItems: Step[] = [];
  public _options: Record<string, any>;
  public _introBeforeChangeCallback: Function;
  public _introChangeCallback: Function;
  public _introAfterChangeCallback: Function;
  public _introCompleteCallback: Function;
  public _hintsAddedCallback: Function;
  public _hintClickCallback: Function;
  public _hintCloseCallback: Function;
  public _introStartCallback: Function;
  public _introExitCallback: Function;
  public _introSkipCallback: Function;
  public _introBeforeExitCallback: Function;

  public constructor(targetElement: HTMLElement) {
    this._targetElement = targetElement;

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
      /* Display the pagination detail */
      showStepNumbers: false,
      /* Pagination "of" label */
      stepNumbersOfLabel: "of",
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
      /*
       * Should we scroll the tooltip or target element?
       *
       * Options are: 'element' or 'tooltip'
       */
      scrollTo: "element",
      /* Reference Element to manage scroll */
      scrollElRef: null,
      /* Padding to add after scrolling when element is not in the viewport (in pixels) */
      scrollPadding: 30,
      /* Set the overlay opacity */
      overlayOpacity: 0.5,
      /* To determine the tooltip position automatically based on the window.width/height */
      autoPosition: true,
      /* Precedence of positions, when auto is enabled */
      positionPrecedence: ["bottom", "top", "right", "left"],
      /* Disable an interaction with element? */
      disableInteraction: false,
      /* To display the "Don't show again" checkbox in the tour */
      dontShowAgain: false,
      dontShowAgainLabel: "Don't show this again",
      /* "Don't show again" cookie name and expiry (in days) */
      dontShowAgainCookie: "introjs-dontShowAgain",
      dontShowAgainCookieDays: 365,
      /* Set how much padding to be used around helper element */
      helperElementPadding: 10,
      /* Default hint position */
      hintPosition: "top-middle",
      /* Hint button label */
      hintButtonLabel: "Got it",
      /* Display the "Got it" button? */
      hintShowButton: true,
      /* Hints auto-refresh interval in ms (set to -1 to disable) */
      hintAutoRefreshInterval: 10,
      /* Adding animation to hints? */
      hintAnimation: true,
      /* additional classes to put on the buttons */
      buttonClass: "introjs-button",
      /* additional classes to put on progress bar */
      progressBarAdditionalClass: false,
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

  setOption(option, value) {
    this._options[option] = value;
    return this;
  }

  setOptions(options) {
    this._options = mergeOptions(this._options, options);
    return this;
  }

  async start() {
    await introForElement.call(this, this._targetElement);
    return this;
  }

  async goToStep(step: number) {
    await goToStep.call(this, step);
    return this;
  }

  addStep(options) {
    if (!this._options.steps) {
      this._options.steps = [];
    }

    this._options.steps.push(options);

    return this;
  }

  addSteps(steps: Step[]) {
    if (!steps.length) return this;

    for (let index = 0; index < steps.length; index++) {
      this.addStep(steps[index]);
    }

    return this;
  }

  async goToStepNumber(step: number) {
    await goToStepNumber.call(this, step);
    return this;
  }

  async nextStep() {
    await nextStep.call(this);
    return this;
  }

  async previousStep() {
    await previousStep.call(this);
    return this;
  }

  currentStep() {
    return currentStep.call(this);
  }

  async exit(force: boolean) {
    await exitIntro.call(this, this._targetElement, force);
    return this;
  }

  refresh(refreshSteps?: boolean) {
    refresh.call(this, refreshSteps);
    return this;
  }

  setDontShowAgain(dontShowAgain: boolean) {
    setDontShowAgain.call(this, dontShowAgain);
    return this;
  }

  onbeforechange(providedCallback: Function) {
    if (typeof providedCallback === "function") {
      this._introBeforeChangeCallback = providedCallback;
    } else {
      throw new Error(
        "Provided callback for onbeforechange was not a function"
      );
    }
    return this;
  }

  onchange(providedCallback: Function) {
    if (typeof providedCallback === "function") {
      this._introChangeCallback = providedCallback;
    } else {
      throw new Error("Provided callback for onchange was not a function.");
    }
    return this;
  }

  onafterchange(providedCallback: Function) {
    if (typeof providedCallback === "function") {
      this._introAfterChangeCallback = providedCallback;
    } else {
      throw new Error("Provided callback for onafterchange was not a function");
    }
    return this;
  }

  oncomplete(providedCallback: Function) {
    if (typeof providedCallback === "function") {
      this._introCompleteCallback = providedCallback;
    } else {
      throw new Error("Provided callback for oncomplete was not a function.");
    }
    return this;
  }

  onhintsadded(providedCallback: Function) {
    if (typeof providedCallback === "function") {
      this._hintsAddedCallback = providedCallback;
    } else {
      throw new Error("Provided callback for onhintsadded was not a function.");
    }
    return this;
  }

  onhintclick(providedCallback: Function) {
    if (typeof providedCallback === "function") {
      this._hintClickCallback = providedCallback;
    } else {
      throw new Error("Provided callback for onhintclick was not a function.");
    }
    return this;
  }

  onhintclose(providedCallback: Function) {
    if (typeof providedCallback === "function") {
      this._hintCloseCallback = providedCallback;
    } else {
      throw new Error("Provided callback for onhintclose was not a function.");
    }
    return this;
  }

  onstart(providedCallback: Function) {
    if (typeof providedCallback === "function") {
      this._introStartCallback = providedCallback;
    } else {
      throw new Error("Provided callback for onstart was not a function.");
    }
    return this;
  }

  onexit(providedCallback: Function) {
    if (typeof providedCallback === "function") {
      this._introExitCallback = providedCallback;
    } else {
      throw new Error("Provided callback for onexit was not a function.");
    }
    return this;
  }

  onskip(providedCallback: Function) {
    if (typeof providedCallback === "function") {
      this._introSkipCallback = providedCallback;
    } else {
      throw new Error("Provided callback for onskip was not a function.");
    }
    return this;
  }

  onbeforeexit(providedCallback: Function) {
    if (typeof providedCallback === "function") {
      this._introBeforeExitCallback = providedCallback;
    } else {
      throw new Error("Provided callback for onbeforeexit was not a function.");
    }
    return this;
  }

  async addHints() {
    await populateHints.call(this, this._targetElement);
    return this;
  }

  async hideHint(stepId: number) {
    await hideHint.call(this, stepId);
    return this;
  }

  async hideHints() {
    await hideHints.call(this);
    return this;
  }

  showHint(stepId: number) {
    showHint.call(this, stepId);
    return this;
  }

  async showHints() {
    await showHints.call(this);
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

  async showHintDialog(stepId: number) {
    await showHintDialog.call(this, stepId);
    return this;
  }
}

const introJs = (targetElm?: string | HTMLElement) => {
  let instance: IntroJs;

  if (typeof targetElm === "object") {
    //Ok, create a new instance
    instance = new IntroJs(targetElm);
  } else if (typeof targetElm === "string") {
    //select the target element with query selector
    const targetElement = document.querySelector<HTMLElement>(targetElm);

    if (targetElement) {
      instance = new IntroJs(targetElement);
    } else {
      throw new Error("There is no element with given selector.");
    }
  } else {
    instance = new IntroJs(document.body);
  }
  // add instance to list of _instances
  // passing group to stamp to increment
  // from 0 onward somewhat reliably
  introJs.instances[stamp(instance, "introjs-instance")] = instance;

  return instance;
};

/**
 * Current IntroJs version
 *
 * @property version
 * @type String
 */
introJs.version = version;

/**
 * key-val object helper for introJs instances
 *
 * @property instances
 * @type Object
 */
introJs.instances = {};

export default introJs;
