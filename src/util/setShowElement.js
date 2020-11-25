import addClass from "./addClass";
import getPropValue from "./getPropValue";

/**
 * To set the show element
 * This function set a relative (in most cases) position and changes the z-index
 *
 * @api private
 * @method _setShowElement
 * @param {Object} targetElement
 */
export default function setShowElement({ element }) {
  addClass(element, "introjs-showElement");

  const currentElementPosition = getPropValue(element, "position");
  if (
    currentElementPosition !== "absolute" &&
    currentElementPosition !== "relative" &&
    currentElementPosition !== "sticky" &&
    currentElementPosition !== "fixed"
  ) {
    //change to new intro item
    addClass(element, "introjs-relativePosition");
  }
}
