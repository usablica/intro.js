/**
 * IntroJs main class
 *
 * @class IntroJs
 */
function IntroJs(obj) {
  this._targetElement = obj;
  this._introItems = [];

  this._options = {
    /** Next button label in tooltip box */
    nextLabel: "Next &rarr;",
    /** Previous button label in tooltip box */
    prevLabel: "&larr; Back",
    /** Skip button label in tooltip box */
    skipLabel: "Skip",
    /** Done button label in tooltip box */
    doneLabel: "Done",
    /** Hide previous button in the first step? Otherwise, it will be disabled button. */
    hidePrev: false,
    /** Hide next button in the last step? Otherwise, it will be disabled button. */
    hideNext: false,
    /** Default tooltip box position */
    tooltipPosition: "bottom",
    /** Next CSS class for tooltip boxes */
    tooltipClass: "",
    /** CSS class that is added to the helperLayer */
    highlightClass: "",
    /** Close introduction when pressing Escape button? */
    exitOnEsc: true,
    /** Close introduction when clicking on overlay layer? */
    exitOnOverlayClick: true,
    /** Show step numbers in introduction? */
    showStepNumbers: true,
    /** Let user use keyboard to navigate the tour? */
    keyboardNavigation: true,
    /** Show tour control buttons? */
    showButtons: true,
    /** Show tour bullets? */
    showBullets: true,
    /** Show tour progress? */
    showProgress: false,
    /** Scroll to highlighted element? */
    scrollToElement: true,
    /**
     * Should we scroll the tooltip or target element?
     *
     * Options are: 'element' or 'tooltip'
     */
    scrollTo: "element",
    /** Padding to add after scrolling when element is not in the viewport (in pixels) */
    scrollPadding: 30,
    /** Set the overlay opacity */
    overlayOpacity: 0.5,
    /** Precedence of positions, when auto is enabled */
    positionPrecedence: ["bottom", "top", "right", "left"],
    /** Disable an interaction with element? */
    disableInteraction: false,
    /** Set how much padding to be used around helper element */
    helperElementPadding: 10,
    /** Default hint position */
    hintPosition: "top-middle",
    /** Hint button label */
    hintButtonLabel: "Got it",
    /** Adding animation to hints? */
    hintAnimation: true,
    /** additional classes to put on the buttons */
    buttonClass: "introjs-button",
    /** additional classes to put on progress bar */
    progressBarAdditionalClass: false,
  };
}

export default IntroJs;
