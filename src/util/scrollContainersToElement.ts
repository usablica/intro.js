// room to keep between the element and the edges of its scroll container
const MARGIN = 10;

const scrollable = /(auto|scroll|overlay)/;

/**
 * Whether the user can scroll the element, horizontally or vertically
 */
const isScrollContainer = (element: HTMLElement) => {
  const style = getComputedStyle(element);
  return (
    (scrollable.test(style.overflowX) &&
      element.scrollWidth > element.clientWidth) ||
    (scrollable.test(style.overflowY) &&
      element.scrollHeight > element.clientHeight)
  );
};

/**
 * How far to scroll along one axis to bring [start, end] into
 * [viewStart, viewEnd]: only as far as needed, and never so far that the
 * start of the element leaves the view (for an element larger than it)
 */
const distance = (
  start: number,
  end: number,
  viewStart: number,
  viewEnd: number
) => {
  if (start < viewStart + MARGIN) return start - viewStart - MARGIN;
  if (end > viewEnd - MARGIN) {
    return Math.min(end - viewEnd + MARGIN, start - viewStart - MARGIN);
  }
  return 0;
};

/**
 * Scroll every scroll container the element is in (both directions, from
 * the innermost one out) so the element is visible in it. The page itself
 * is scrolled by scrollTo() afterwards.
 *
 * @api private
 */
export default function scrollContainersToElement(
  scrollToElement: boolean,
  targetElement: HTMLElement
) {
  if (!scrollToElement || !targetElement) return;

  for (
    let container = targetElement.parentElement;
    container &&
    container !== document.body &&
    container !== document.documentElement;
    container = container.parentElement
  ) {
    if (!isScrollContainer(container)) continue;

    // measure again for every container: scrolling an inner one moves the
    // element in the outer ones
    const rect = targetElement.getBoundingClientRect();
    const box = container.getBoundingClientRect();
    // the padding box: without the borders and the scrollbars
    const left = box.left + container.clientLeft;
    const top = box.top + container.clientTop;

    container.scrollLeft += distance(
      rect.left,
      rect.right,
      left,
      left + container.clientWidth
    );
    container.scrollTop += distance(
      rect.top,
      rect.bottom,
      top,
      top + container.clientHeight
    );
  }
}
