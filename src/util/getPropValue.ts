/**
 * Get an element CSS property on the page
 * Thanks to JavaScript Kit: http://www.javascriptkit.com/dhtmltutors/dhtmlcascade4.shtml
 *
 * @api private
 * @returns string property value
 */
export default function getPropValue(
  element: HTMLElement,
  propName: string
): string {
  let propValue = "";
  if ("currentStyle" in element) {
    //IE
    // @ts-ignore
    propValue = element.currentStyle[propName];
  } else if (document.defaultView && document.defaultView.getComputedStyle) {
    //Others
    propValue = document.defaultView
      .getComputedStyle(element, null)
      .getPropertyValue(propName);
  }

  //Prevent exception in IE
  if (propValue && propValue.toLowerCase) {
    return propValue.toLowerCase();
  } else {
    return propValue;
  }
}
