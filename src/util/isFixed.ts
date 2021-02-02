import getPropValue from "./getPropValue";

/**
 * Checks to see if target element (or parents) position is fixed or not
 *
 * @api private
 * @method _isFixed
 * @param {Object} element
 * @returns Boolean
 */
export default function isFixed(element: HTMLElement): boolean {
  const p = element.parentNode as HTMLElement;

  if (!p || p.nodeName === "HTML") {
    return false;
  }

  if (getPropValue(element, "position") === "fixed") {
    return true;
  }

  return isFixed(p);
}
