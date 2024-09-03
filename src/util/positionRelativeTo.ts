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

  return {
    width: `${position.width + padding}px`,
    height: `${position.height + padding}px`,
    top: `${position.top - padding / 2}px`,
    left: `${position.left - padding / 2}px`,
  };
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
