export function find(selector: string|Element): HTMLElement {
  if (typeof selector === "string") {
    return document.querySelector(selector) as HTMLElement;
  }

  if (selector instanceof Element) {
    return selector as HTMLElement;
  }

  throw Error("invalid selector");
}

export function content(selector: string|Element) {
  const el = find(selector);

  if (el) {
    return el.innerHTML;
  }

  return null;
}

export function className(selector: string|Element) {
  const el = find(selector);

  if (el) {
    return el.className;
  }

  return null;
}

export function skipButton() {
  return find(".introjs-skipbutton");
}

export function nextButton() {
  return find(".introjs-nextbutton");
}

export function prevButton() {
  return find(".introjs-prevbutton");
}

export function doneButton() {
  return find(".introjs-donebutton");
}

export function tooltipText() {
  return find(".introjs-tooltiptext");
}

/**
 * @returns {Element}
 */
export function appendDummyElement(name?: string, text?: string, style: string = '') {
  const el = document.createElement(name || "p") as HTMLElement;
  el.innerHTML = text || "hello world";
  el.style.cssText = style;

  document.body.appendChild(el);

  return el;
}
