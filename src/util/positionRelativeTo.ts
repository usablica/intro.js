import getOffset from "./getOffset";
import isFixed from "./isFixed";
import { removeClass, addClass } from "./className";
import setStyle from "./style";

export const getPositionRelativeTo = (
  relativeElement: HTMLElement,
  element: HTMLElement,
  targetElement: HTMLElement,
  padding: number
) => {
  if (!element || !relativeElement || !targetElement) {
    return;
  }

  // If the target element is fixed, the tooltip should be fixed as well.
  // Otherwise, remove a fixed class that may be left over from the previous
  // step.
  if (targetElement instanceof Element && isFixed(targetElement)) {
    addClass(element, "introjs-fixedTooltip");
  } else {
    removeClass(element, "introjs-fixedTooltip");
  }

  const position = getOffset(targetElement, relativeElement);

  let left = position.left - padding / 2;
  let right = position.right + padding / 2;
  let top = position.top - padding / 2;
  const bottom = position.bottom + padding / 2;

  // The padding must not make the page scrollable: for a target at the edge
  // of the page it would stick out by padding / 2 and the page would scroll
  // sideways. Only the padding is cut, never the target itself.
  if (isPositionedOnPage(relativeElement)) {
    const pageWidth = document.documentElement.clientWidth;
    if (position.left >= 0) left = Math.max(left, 0);
    if (position.right <= pageWidth) {
      // themes with box-sizing: content-box draw their border (and
      // padding) outside of the width we set
      right = Math.min(right, pageWidth - horizontalExtra(element));
    }
    if (position.top >= 0) top = Math.max(top, 0);
  }

  return {
    width: `${right - left}px`,
    height: `${bottom - top}px`,
    top: `${top}px`,
    left: `${left}px`,
  };
};

/**
 * The width an element takes on top of its CSS width
 */
const horizontalExtra = (element: HTMLElement) => {
  const style = getComputedStyle(element);
  if (style.boxSizing === "border-box") return 0;

  return [
    style.paddingLeft,
    style.paddingRight,
    style.borderLeftWidth,
    style.borderRightWidth,
  ].reduce((sum, value) => sum + (parseFloat(value) || 0), 0);
};

/**
 * Whether the layers are positioned on the page (or the screen, for a fixed
 * target), rather than in a container that is positioned itself
 */
const isPositionedOnPage = (relativeElement: HTMLElement) => {
  const position = getComputedStyle(relativeElement).position;
  return (
    relativeElement === document.body ||
    relativeElement === document.documentElement ||
    (position !== "relative" && position !== "sticky")
  );
};

/**
 * Sets the position of the element relative to the target element
 * @api private
 */
export const setPositionRelativeTo = (
  relativeElement: HTMLElement,
  element: HTMLElement,
  targetElement: HTMLElement,
  padding: number
) => {
  const styles = getPositionRelativeTo(
    relativeElement,
    element,
    targetElement,
    padding
  );

  if (!styles) return;

  //set new position to helper layer
  setStyle(element, styles);
};
