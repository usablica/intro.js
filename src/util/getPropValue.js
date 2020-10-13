/**
 * Get an element CSS property on the page
 * Thanks to JavaScript Kit: http://www.javascriptkit.com/dhtmltutors/dhtmlcascade4.shtml
 *
 * @api private
 * @method _getPropValue
 * @param {Object} element
 * @param {String} propName
 * @returns string property value
 */
export default function getPropValue(element, propName) {
  let propValue = "";
  if (element.currentStyle) {
    //IE
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
