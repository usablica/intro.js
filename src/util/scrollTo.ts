import elementInViewport from "./elementInViewport";
import getWindowSize from "./getWindowSize";
import { ScrollTo } from "../core/steps";

/**
 * To change the scroll of `window` after highlighting an element
 *
 * @api private
 */
export default function scrollTo(
  scrollToElement: boolean,
  scrollTo: ScrollTo,
  scrollPadding: number,
  targetElement: HTMLElement,
  tooltipLayer: HTMLElement
) {
  if (scrollTo === "off") return;
  let rect: DOMRect;

  if (!scrollToElement) return;

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

    if (top < 0 || targetElement.clientHeight > winHeight) {
      window.scrollBy(
        0,
        rect.top - (winHeight / 2 - rect.height / 2) - scrollPadding
      ); // 30px padding from edge to look nice

      //Scroll down
    } else {
      window.scrollBy(
        0,
        rect.top - (winHeight / 2 - rect.height / 2) + scrollPadding
      ); // 30px padding from edge to look nice
    }
  }
}
