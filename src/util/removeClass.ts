/**
 * Remove a class from an element
 *
 * @api private
 */
export default function removeClass(
  element: HTMLElement,
  classNameRegex: RegExp | string
) {
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
