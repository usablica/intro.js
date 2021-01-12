/**
 * Create a DOM element with various attributes
 *
 * @param {String} tagname
 * @param {Object} attrs
 * @return Element
 */
import setStyle from "./setStyle";

export default function _createElement(tagname: string, attrs: {[key: string]: string} = {}) {
  let element = document.createElement(tagname) as HTMLElement;

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
      // @ts-ignore
      element[k] = v;
    }
  }

  return element;
}
