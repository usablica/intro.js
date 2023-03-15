import addClass from "./addClass";
import getPropValue from "./getPropValue";

/**
 * To set the show element
 * This function set a relative (in most cases) position and changes the z-index
 *
 * @api private
 */
export default function setShowElement(targetElement: HTMLElement) {
  addClass(targetElement, "introjs-showElement");

  const currentElementPosition = getPropValue(targetElement, "position");
  if (
    currentElementPosition !== "absolute" &&
    currentElementPosition !== "relative" &&
    currentElementPosition !== "sticky" &&
    currentElementPosition !== "fixed"
  ) {
    //change to new intro item
    addClass(targetElement, "introjs-relativePosition");
  }
}
