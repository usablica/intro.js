import {
  HintPosition,
  HintStep,
  IntroStep,
  ScrollTo,
  TooltipPosition,
} from "./core/steps";

export interface Options {
  steps: Partial<IntroStep>[];
  hints: Partial<HintStep>[];
  /* Is this tour instance active? Don't show the tour again if this flag is set to false */
  isActive: boolean;
  /* Next button label in tooltip box */
  nextLabel: string;
  /* Previous button label in tooltip box */
  prevLabel: string;
  /* Skip button label in tooltip box */
  skipLabel: string;
  /* Done button label in tooltip box */
  doneLabel: string;
  /* Hide previous button in the first step? Otherwise, it will be disabled button. */
  hidePrev: boolean;
  /* Hide next button in the last step? Otherwise, it will be disabled button (note: this will also hide the "Done" button) */
  hideNext: boolean;
  /* Change the Next button to Done in the last step of the intro? otherwise, it will render a disabled button */
  nextToDone: boolean;
  /* Default tooltip box position */
  tooltipPosition: string;
  /* Next CSS class for tooltip boxes */
  tooltipClass: string;
  /* Start intro for a group of elements */
  group: string;
  /* CSS class that is added to the helperLayer */
  highlightClass: string;
  /* Close introduction when pressing Escape button? */
  exitOnEsc: boolean;
  /* Close introduction when clicking on overlay layer? */
  exitOnOverlayClick: boolean;
  /* Display the pagination detail */
  showStepNumbers: boolean;
  /* Pagination "of" label */
  stepNumbersOfLabel: string;
  /* Let user use keyboard to navigate the tour? */
  keyboardNavigation: boolean;
  /* Show tour control buttons? */
  showButtons: boolean;
  /* Show tour bullets? */
  showBullets: boolean;
  /* Show tour progress? */
  showProgress: boolean;
  /* Scroll to highlighted element? */
  scrollToElement: boolean;
  /*
   * Should we scroll the tooltip or target element?
   * Options are: 'element', 'tooltip' or 'off'
   */
  scrollTo: ScrollTo;
  /* Padding to add after scrolling when element is not in the viewport (in pixels) */
  scrollPadding: number;
  /* Set the overlay opacity */
  overlayOpacity: number;
  /* To determine the tooltip position automatically based on the window.width/height */
  autoPosition: boolean;
  /* Precedence of positions, when auto is enabled */
  positionPrecedence: TooltipPosition[];
  /* Disable an interaction with element? */
  disableInteraction: boolean;
  /* To display the "Don't show again" checkbox in the tour */
  dontShowAgain: boolean;
  dontShowAgainLabel: string;
  /* "Don't show again" cookie name and expiry (in days) */
  dontShowAgainCookie: string;
  dontShowAgainCookieDays: number;
  /* Set how much padding to be used around helper element */
  helperElementPadding: number;
  /* Default hint position */
  hintPosition: HintPosition;
  /* Hint button label */
  hintButtonLabel: string;
  /* Display the "Got it" button? */
  hintShowButton: boolean;
  /* Hints auto-refresh interval in ms (set to -1 to disable) */
  hintAutoRefreshInterval: number;
  /* Adding animation to hints? */
  hintAnimation: boolean;
  /* additional classes to put on the buttons */
  buttonClass: string;
  /* additional classes to put on progress bar */
  progressBarAdditionalClass: boolean;
}

export function getDefaultOptions(): Options {
  return {
    steps: [],
    hints: [],
    isActive: true,
    nextLabel: "Next",
    prevLabel: "Back",
    skipLabel: "×",
    doneLabel: "Done",
    hidePrev: false,
    hideNext: false,
    nextToDone: true,
    tooltipPosition: "bottom",
    tooltipClass: "",
    group: "",
    highlightClass: "",
    exitOnEsc: true,
    exitOnOverlayClick: true,
    showStepNumbers: false,
    stepNumbersOfLabel: "of",
    keyboardNavigation: true,
    showButtons: true,
    showBullets: true,
    showProgress: false,
    scrollToElement: true,
    scrollTo: "element",
    scrollPadding: 30,
    overlayOpacity: 0.5,
    autoPosition: true,
    positionPrecedence: ["bottom", "top", "right", "left"],
    disableInteraction: false,

    dontShowAgain: false,
    dontShowAgainLabel: "Don't show this again",
    dontShowAgainCookie: "introjs-dontShowAgain",
    dontShowAgainCookieDays: 365,
    helperElementPadding: 10,

    hintPosition: "top-middle",
    hintButtonLabel: "Got it",
    hintShowButton: true,
    hintAutoRefreshInterval: 10,
    hintAnimation: true,
    buttonClass: "introjs-button",
    progressBarAdditionalClass: false,
  };
}

export function setOption<K extends keyof Options>(
  options: Options,
  key: K,
  value: Options[K]
): Options {
  options[key] = value;
  return options;
}

export function setOptions(
  options: Options,
  partialOptions: Partial<Options>
): Options {
  for (const [key, value] of Object.entries(partialOptions)) {
    options = setOption(options, key as keyof Options, value);
  }
  return options;
}
