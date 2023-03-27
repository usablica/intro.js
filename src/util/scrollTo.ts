import getWindowSize from "./getWindowSize";
import elementInViewport from "./elementInViewport";

/**
 * To change the scroll of `window` after highlighting an element
 *
 * @api private
 */
export default function scrollTo(
  scrollTo: string,
  targetElement: HTMLElement,
  tooltipLayer: HTMLElement
) {
  if (scrollTo === "off") return;
  let rect: DOMRect;

  if (!this._options.scrollToElement) return;

  if (scrollTo === "tooltip") {
    rect = tooltipLayer.getBoundingClientRect();
  } else {
    rect = targetElement.getBoundingClientRect();
  }

  if (!elementInViewport(targetElement)) {
    const winHeight = getWindowSize().height;
    const top = rect.bottom - (rect.bottom - rect.top);

    // TODO (afshinm): do we need scroll padding now?
    // I have changed the scroll option and now it scrolls the window to
    // the center of the target element or tooltip.

    const scrollEl = this._introItems[this._currentStep].scrollElRef || this._options.scrollElRef || window;

    if (top < 0 || targetElement.clientHeight > winHeight) {
      scrollEl.scrollBy(
        0,
        rect.top -
        (winHeight / 2 - rect.height / 2) -
        this._options.scrollPadding
      ); // 30px padding from edge to look nice

      //Scroll down
    } else {
      scrollEl.scrollBy(
        0,
        rect.top -
        (winHeight / 2 - rect.height / 2) +
        this._options.scrollPadding
      ); // 30px padding from edge to look nice
    }
  }
}
