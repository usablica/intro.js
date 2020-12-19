import getWindowSize from "./getWindowSize";
import elementInViewport from "./elementInViewport";

/**
 * To change the scroll of `window` after highlighting an element
 *
 * @api private
 * @param {String} scrollTo
 * @param {Object} targetElement
 * @param {Object} tooltipLayer
 */
export default function scrollTo(scrollTo, { element }, tooltipLayer) {
  if (scrollTo === "off") return;
  let rect;

  if (!this._options.scrollToElement) return;

  if (scrollTo === "tooltip") {
    rect = tooltipLayer.getBoundingClientRect();
  } else {
    rect = element.getBoundingClientRect();
  }

  if (!elementInViewport(element)) {
    const winHeight = getWindowSize().height;
    const top = rect.bottom - (rect.bottom - rect.top);

    // TODO (afshinm): do we need scroll padding now?
    // I have changed the scroll option and now it scrolls the window to
    // the center of the target element or tooltip.

    if (top < 0 || element.clientHeight > winHeight) {
      window.scrollBy(
        0,
        rect.top -
          (winHeight / 2 - rect.height / 2) -
          this._options.scrollPadding
      ); // 30px padding from edge to look nice

      //Scroll down
    } else {
      window.scrollBy(
        0,
        rect.top -
          (winHeight / 2 - rect.height / 2) +
          this._options.scrollPadding
      ); // 30px padding from edge to look nice
    }
  }
}
