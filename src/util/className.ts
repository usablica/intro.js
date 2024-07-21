/**
 * Append CSS classes to an element
 * @api private
 */
export const addClass = (
  element: HTMLElement | SVGElement,
  ...classNames: string[]
) => {
  for (const className of classNames) {
    if (element instanceof SVGElement) {
      // svg
      const pre = element.getAttribute("class") || "";

      if (!pre.match(className)) {
        // check if element doesn't already have className
        setClass(element, pre, className);
      }
    } else {
      if (element.classList !== undefined) {
        // check for modern classList property
        element.classList.add(className);
      } else if (!element.className.match(className)) {
        // check if element doesn't already have className
        setClass(element, element.className, className);
      }
    }
  }
};

/**
 * Set CSS classes to an element
 * @param element element to set class
 * @param classNames list of class names
 */
export const setClass = (
  element: HTMLElement | SVGElement,
  ...classNames: string[]
) => {
  const className = classNames.filter(Boolean).join(" ");

  if (element instanceof SVGElement) {
    element.setAttribute("class", className);
  } else {
    if (element.classList !== undefined) {
      element.classList.value = className;
    } else {
      element.className = className;
    }
  }
};

/**
 * Remove a class from an element
 *
 * @api private
 */
export const removeClass = (
  element: HTMLElement | SVGElement,
  classNameRegex: RegExp | string
) => {
  if (element instanceof SVGElement) {
    const pre = element.getAttribute("class") || "";

    element.setAttribute(
      "class",
      pre.replace(classNameRegex, "").replace(/\s\s+/g, " ").trim()
    );
  } else {
    element.className = element.className
      .replace(classNameRegex, "")
      .replace(/\s\s+/g, " ")
      .trim();
  }
};
