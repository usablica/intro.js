/**
 * Remove a class from an element
 *
 * @api private
 * @method _removeClass
 * @param {Object} element
 * @param {RegExp|String} classNameRegex can be regex or string
 * @returns null
 */
export default function removeClass(element, classNameRegex) {
  if (element instanceof SVGElement) {
    const pre = element.getAttribute("class") || "";

    element.setAttribute(
      "class",
      pre.replace(classNameRegex, "").replace(/^\s+|\s+$/g, "")
    );
  } else {
    element.className = element.className
      .replace(classNameRegex, "")
      .replace(/^\s+|\s+$/g, "");
  }
}
