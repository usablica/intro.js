import setStyle from "./setStyle";

/**
 * Create a DOM element with various attributes
 */
export default function _createElement<K extends keyof HTMLElementTagNameMap>(
  tagName: K,
  attrs?: { [key: string]: string | Function }
): HTMLElementTagNameMap[K] {
  let element = document.createElement<K>(tagName);

  attrs = attrs || {};

  // regex for matching attributes that need to be set with setAttribute
  const setAttRegex = /^(?:role|data-|aria-)/;

  for (const k in attrs) {
    let v = attrs[k];

    if (k === "style" && typeof v !== "function") {
      setStyle(element, v);
    } else if (typeof v === "string" && k.match(setAttRegex)) {
      element.setAttribute(k, v);
    } else {
      // @ts-ignore
      element[k] = v;
    }
  }

  return element;
}
