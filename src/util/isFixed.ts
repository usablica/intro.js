import getPropValue from "./getPropValue";

/**
 * Checks to see if target element (or parents) position is fixed or not
 *
 * @api private
 */
export default function isFixed(element: HTMLElement): boolean {
  const parent = element.parentElement;

  if (!parent || parent.nodeName === "HTML") {
    return false;
  }

  if (getPropValue(element, "position") === "fixed") {
    return true;
  }

  return isFixed(parent);
}
