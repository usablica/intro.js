export function find(selector: string | HTMLElement): HTMLElement {
  if (typeof selector === "string") {
    return document.querySelector(selector) as HTMLElement;
  }

  if (selector instanceof Element) {
    return selector;
  }

  throw Error("invalid selector");
}

export function content(selector: string | HTMLElement): string | null {
  const el = find(selector);

  if (el) {
    return el.innerHTML;
  }

  return null;
}

export function className(selector: string | HTMLElement): string | null {
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

export function getBoundingClientRectSpy(
  width: number,
  height: number,
  top: number,
  left: number,
  bottom: number,
  right: number
) {
  return jest.fn(
    () =>
      ({
        top,
        left,
        bottom,
        right,
        width,
        height,
      } as DOMRect)
  );
}

export const waitFor = (timeout: number) =>
  new Promise((resolve) => setTimeout(resolve, timeout));
