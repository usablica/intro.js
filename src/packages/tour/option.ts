import { TooltipPosition } from "../../packages/tooltip";
import { TourStep, ScrollTo } from "./steps";
import { Translator, LanguageCode } from "../../i18n/language";
import { ThemeType } from "./theme";

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
   Can be a Language object for custom languages or a language code string for built-in languages.
   Built-in language codes: "en_US", "es_ES", "fr_FR", "de_DE", "fa_IR"
   Defaults to the user's browser language if not provided. */
  language?: LanguageCode;
  /* Theme for the tour - light, dark, auto, or custom theme name */
  theme?: ThemeType;
  /* Path to custom CSS file for theme (optional) */
  themePath?: string;
}

export function getDefaultTourOptions(translator?: Translator): TourOptions {
  const activeTranslator = translator ?? new Translator();

  return {
    steps: [],
    isActive: true,
    nextLabel: activeTranslator.translate("buttons.next"),
    prevLabel: activeTranslator.translate("buttons.prev"),
    skipLabel: "×",
    doneLabel: activeTranslator.translate("buttons.done"),
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
    stepNumbersOfLabel: activeTranslator.translate(
      "messages.stepNumbersOfLabel"
    ),
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
    dontShowAgainLabel: activeTranslator.translate(
      "messages.dontShowAgainLabel"
    ),
    dontShowAgainCookie: "introjs-dontShowAgain",
    dontShowAgainCookieDays: 365,
    helperElementPadding: 10,

    buttonClass: "introjs-button",
    progressBarAdditionalClass: "",
    tooltipRenderAsHtml: true,
    language: activeTranslator.getLanguage(),
    theme: "auto",
  };
}
