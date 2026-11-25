/**
 * Whether a point (in viewport coordinates) of an element is cut off by one
 * of the elements around it that clip their content (overflow other than
 * visible, e.g. a scroll container scrolled away from it). The page itself
 * doesn't count: what is outside the screen can be scrolled to.
 *
 * @api private
 */
export default function isClippedByContainers(
  element: HTMLElement,
  x: number,
  y: number
): boolean {
  for (
    let container = element.parentElement;
    container &&
    container !== document.body &&
    container !== document.documentElement;
    container = container.parentElement
  ) {
    const style = getComputedStyle(container);
    if (
      (style.overflowX === "visible" && style.overflowY === "visible") ||
      // overflow doesn't apply to these
      style.display === "inline" ||
      style.display === "contents"
    ) {
      continue;
    }

    // the padding box: content is clipped at it, not at the border
    const box = container.getBoundingClientRect();
    const left = box.left + container.clientLeft;
    const top = box.top + container.clientTop;

    if (
      x < left ||
      x > left + container.clientWidth ||
      y < top ||
      y > top + container.clientHeight
    ) {
      return true;
    }
  }

  return false;
}
