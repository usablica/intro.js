/**
 * Create a DOM element with various attributes
 *
 * @param {String} tagname
 * @param {Object} attrs
 * @return Element
 */
import setStyle from "./setStyle";

export default function _createElement(tagname, attrs) {
  let element = document.createElement(tagname);

  attrs = attrs || {};

  // regex for matching attributes that need to be set with setAttribute
  const setAttRegex = /^(?:role|data-|aria-)/;

  for (const k in attrs) {
    let v = attrs[k];

    if (k === "style") {
      setStyle(element, v);
    } else if (k.match(setAttRegex)) {
      element.setAttribute(k, v);
    } else {
      element[k] = v;
    }
  }

  return element;
}
