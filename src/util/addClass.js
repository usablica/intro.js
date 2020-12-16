import forEach from "./forEach";

/**
 * Append a class to an element
 *
 * @api private
 * @method _addClass
 * @param {Object} element
 * @param {String} className
 * @returns null
 */
export default function addClass(element, className) {
  if (element instanceof SVGElement) {
    // svg
    const pre = element.getAttribute("class") || "";

    if (!pre.match(className)) {
      // check if element doesn't already have className
      element.setAttribute("class", `${pre} ${className}`);
    }
  } else {
    if (element.classList !== undefined) {
      // check for modern classList property
      const classes = className.split(" ");
      forEach(classes, (cls) => {
        element.classList.add(cls);
      });
    } else if (!element.className.match(className)) {
      // check if element doesn't already have className
      element.className += ` ${className}`;
    }
  }
}
