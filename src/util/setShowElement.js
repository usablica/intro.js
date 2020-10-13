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
  let parentElm;
  // we need to add this show element class to the parent of SVG elements
  // because the SVG elements can't have independent z-index
  if (element instanceof SVGElement) {
    parentElm = element.parentNode;

    while (element.parentNode !== null) {
      if (!parentElm.tagName || parentElm.tagName.toLowerCase() === "body")
        break;

      if (parentElm.tagName.toLowerCase() === "svg") {
        addClass(parentElm, "introjs-showElement introjs-relativePosition");
      }

      parentElm = parentElm.parentNode;
    }
  }

  addClass(element, "introjs-showElement");

  const currentElementPosition = getPropValue(element, "position");
  if (
    currentElementPosition !== "absolute" &&
    currentElementPosition !== "relative" &&
    currentElementPosition !== "fixed"
  ) {
    //change to new intro item
    addClass(element, "introjs-relativePosition");
  }

  parentElm = element.parentNode;
  while (parentElm !== null) {
    if (!parentElm.tagName || parentElm.tagName.toLowerCase() === "body") break;

    //fix The Stacking Context problem.
    //More detail: https://developer.mozilla.org/en-US/docs/Web/Guide/CSS/Understanding_z_index/The_stacking_context
    const zIndex = getPropValue(parentElm, "z-index");
    const opacity = parseFloat(getPropValue(parentElm, "opacity"));
    const transform =
      getPropValue(parentElm, "transform") ||
      getPropValue(parentElm, "-webkit-transform") ||
      getPropValue(parentElm, "-moz-transform") ||
      getPropValue(parentElm, "-ms-transform") ||
      getPropValue(parentElm, "-o-transform");
    if (
      /[0-9]+/.test(zIndex) ||
      opacity < 1 ||
      (transform !== "none" && transform !== undefined)
    ) {
      addClass(parentElm, "introjs-fixParent");
    }

    parentElm = parentElm.parentNode;
  }
}
