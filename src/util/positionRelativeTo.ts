import getOffset from "./getOffset";
import isFixed from "./isFixed";
import { removeClass, addClass } from "./className";
import setStyle from "./style";
import { visibleRect } from "./isClippedByContainers";

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

  // only the part of the target that its scroll containers (or any element
  // around it that clips its content) don't cut off. On a side that is cut
  // off the highlight ends at the edge of the container, without padding
  const rect = targetElement.getBoundingClientRect();
  const visible = visibleRect(targetElement);
  const cut = {
    left: visible.left - rect.left,
    right: rect.right - visible.right,
    top: visible.top - rect.top,
    bottom: rect.bottom - visible.bottom,
  };
  const pad = (side: keyof typeof cut) => (cut[side] > 0 ? 0 : padding / 2);

  const target = {
    left: position.left + cut.left,
    right: position.right - cut.right,
    top: position.top + cut.top,
    bottom: position.bottom - cut.bottom,
  };

  let left = target.left - pad("left");
  let right = target.right + pad("right");
  let top = target.top - pad("top");
  const bottom = target.bottom + pad("bottom");

  // The padding must not make the page scrollable: for a target at the edge
  // of the page it would stick out by padding / 2 and the page would scroll
  // sideways. Only the padding is cut, never the target itself.
  if (isPositionedOnPage(relativeElement)) {
    const pageWidth = document.documentElement.clientWidth;
    if (target.left >= 0) left = Math.max(left, 0);
    if (target.right <= pageWidth) {
      // themes with box-sizing: content-box draw their border (and
      // padding) outside of the width we set
      right = Math.min(right, pageWidth - horizontalExtra(element));
    }
    if (target.top >= 0) top = Math.max(top, 0);
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
