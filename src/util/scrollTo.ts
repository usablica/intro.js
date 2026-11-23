import elementInViewport from "./elementInViewport";
import getWindowSize from "./getWindowSize";
import { ScrollTo } from "../packages/tour/steps";

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

  scrollIntoViewIfNeeded(
    scrollTo === "tooltip" ? tooltipLayer : targetElement,
    rect,
    scrollPadding,
    false
  );
}

/**
 * Once the tooltip is placed next to its target, make sure the user can see
 * it: on a small screen a tall target leaves no room for it on any side
 */
export function scrollTooltipIntoView(
  scrollToElement: boolean,
  scrollTo: ScrollTo,
  scrollPadding: number,
  tooltip: HTMLElement
) {
  if (!scrollToElement || scrollTo === "off") return;

  scrollIntoViewIfNeeded(
    tooltip,
    tooltip.getBoundingClientRect(),
    scrollPadding,
    true
  );
}

/**
 * Scroll an element into the part of the page the user sees. On mobile, a
 * page wider than the screen is panned sideways inside the layout viewport,
 * which window.scrollBy() can't undo, but scrollIntoView() can
 */
function scrollIntoViewIfNeeded(
  element: HTMLElement,
  rect: DOMRect,
  padding: number,
  vertically: boolean
) {
  const viewport = window.visualViewport;
  const left = viewport ? viewport.offsetLeft : 0;
  const top = viewport ? viewport.offsetTop : 0;
  const width = viewport
    ? viewport.width
    : document.documentElement.clientWidth;
  const height = viewport
    ? viewport.height
    : document.documentElement.clientHeight;

  const outside =
    rect.left < left ||
    rect.right > left + width ||
    (vertically && (rect.top < top || rect.bottom > top + height));

  if (!outside || !element.scrollIntoView) return;

  // keep some room around the element, like the vertical scroll does
  const scrollMargin = element.style.scrollMargin;
  element.style.scrollMargin = `${padding}px`;
  // "nearest" only scrolls as far as needed, and not in a direction in which
  // the element is already visible
  element.scrollIntoView({ block: "nearest", inline: "nearest" });
  element.style.scrollMargin = scrollMargin;
}
