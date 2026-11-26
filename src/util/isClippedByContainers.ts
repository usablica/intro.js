type Box = { left: number; top: number; right: number; bottom: number };

/**
 * The boxes (in viewport coordinates) that the elements around an element
 * clip it to: those with an overflow other than visible, like a scroll
 * container. The page itself doesn't count: what is outside the screen can
 * be scrolled to.
 */
const clippingBoxes = (element: Element): Box[] => {
  const boxes: Box[] = [];

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
    boxes.push({
      left,
      top,
      right: left + container.clientWidth,
      bottom: top + container.clientHeight,
    });
  }

  return boxes;
};

/**
 * The box (in viewport coordinates) that the elements around an element
 * clip it to, or undefined when none of them clips it
 *
 * @api private
 */
export function clippingBounds(element: Element): Box | undefined {
  const boxes = clippingBoxes(element);
  if (!boxes.length) return undefined;

  return boxes.reduce((bounds, box) => ({
    left: Math.max(bounds.left, box.left),
    top: Math.max(bounds.top, box.top),
    right: Math.min(bounds.right, box.right),
    bottom: Math.min(bounds.bottom, box.bottom),
  }));
}

/**
 * Whether a point (in viewport coordinates) of an element is cut off by one
 * of the elements around it that clip their content (e.g. a scroll
 * container scrolled away from it)
 *
 * @api private
 */
export default function isClippedByContainers(
  element: HTMLElement,
  x: number,
  y: number
): boolean {
  return clippingBoxes(element).some(
    (box) => x < box.left || x > box.right || y < box.top || y > box.bottom
  );
}

/**
 * The part of an element that the elements around it don't clip, in
 * viewport coordinates. Its width or height is 0 when nothing of the
 * element is visible.
 *
 * @api private
 */
export function visibleRect(element: Element): Box {
  const rect = element.getBoundingClientRect();
  let { left, top, right, bottom } = rect;

  // move every edge into every box: a part of the element that is cut off
  // collapses onto the edge of the box (to an empty box at that edge when
  // nothing of the element is visible)
  const clamp = (value: number, min: number, max: number) =>
    Math.min(Math.max(value, min), max);

  for (const box of clippingBoxes(element)) {
    left = clamp(left, box.left, box.right);
    right = clamp(right, box.left, box.right);
    top = clamp(top, box.top, box.bottom);
    bottom = clamp(bottom, box.top, box.bottom);
  }

  return { left, top, right, bottom };
}
