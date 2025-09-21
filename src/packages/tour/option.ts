import { TooltipPosition } from "../../packages/tooltip";
import { TourStep, ScrollTo } from "./steps";
import { Translator, Language } from "../../i18n/language";
import enUS from "../../i18n/en_US";

export interface TourOptions {
  steps: Partial<TourStep>[];
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
  tooltipPosition: TooltipPosition;
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
  /* additional classes to put on the buttons */
  buttonClass: string;
  /* additional classes to put on progress bar */
  progressBarAdditionalClass: string;
  /* Optional property to determine if content should be rendered as HTML */
  tooltipRenderAsHtml?: boolean;
  /* Optional property to set the language of the tour.
   Defaults to the user's browser language if not provided. */
  language?: Language;
}

export function getDefaultTourOptions(language: Language = enUS): TourOptions {
  const translator = new Translator(language);
  return {
    steps: [],
    isActive: true,
    nextLabel: translator.translate("buttons.next"),
    prevLabel: translator.translate("buttons.prev"),
    skipLabel: "×",
    doneLabel: translator.translate("buttons.done"),
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
    stepNumbersOfLabel: translator.translate("messages.stepNumbersOfLabel"),
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
    dontShowAgainLabel: translator.translate("messages.dontShowAgain"),
    dontShowAgainCookie: "introjs-dontShowAgain",
    dontShowAgainCookieDays: 365,
    helperElementPadding: 10,

    buttonClass: "introjs-button",
    progressBarAdditionalClass: "",
    tooltipRenderAsHtml: true,
    language,
  };
}

/**
 * Update tour options with language-aware handling
 * When language is changed, automatically update button labels and messages
 */
export function setTourOptions(
  options: TourOptions,
  partialOptions: Partial<TourOptions>
): TourOptions {
  // If language is being set, update the translated labels automatically
  if (partialOptions.language) {
    const translator = new Translator(partialOptions.language);

    // Only update labels if they weren't explicitly provided in partialOptions
    const updatedOptions: Partial<TourOptions> = {
      ...partialOptions,
    };

    // Update button labels if not explicitly provided
    if (!partialOptions.nextLabel) {
      updatedOptions.nextLabel = translator.translate("buttons.next");
    }
    if (!partialOptions.prevLabel) {
      updatedOptions.prevLabel = translator.translate("buttons.prev");
    }
    if (!partialOptions.doneLabel) {
      updatedOptions.doneLabel = translator.translate("buttons.done");
    }
    if (!partialOptions.stepNumbersOfLabel) {
      updatedOptions.stepNumbersOfLabel = translator.translate(
        "messages.stepNumbersOfLabel"
      );
    }
    if (!partialOptions.dontShowAgainLabel) {
      updatedOptions.dontShowAgainLabel = translator.translate(
        "messages.dontShowAgainLabel"
      );
    }

    partialOptions = updatedOptions;
  }

  // Apply all options
  for (const [key, value] of Object.entries(partialOptions)) {
    (options as any)[key] = value;
  }

  return options;
}
