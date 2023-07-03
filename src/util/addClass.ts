/**
 * Append a class to an element
 * @api private
 */
export default function addClass(element: HTMLElement, className: string) {
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
      for (const cls of classes) {
        element.classList.add(cls);
      }
    } else if (!element.className.match(className)) {
      // check if element doesn't already have className
      element.className += ` ${className}`;
    }
  }
}
