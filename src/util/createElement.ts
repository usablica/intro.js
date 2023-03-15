import setStyle from "./setStyle";

/**
 * Create a DOM element with various attributes
 */
export default function _createElement(
  tagname: string,
  attrs?: Object
): HTMLElement {
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
