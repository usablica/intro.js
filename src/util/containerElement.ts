import { getElement } from "./queryElement";

/**
 * Given an element or a selector, tries to find the appropriate container element.
 */
export const getContainerElement = (
  elementOrSelector?: string | HTMLElement
) => {
  if (!elementOrSelector) {
    return document.body;
  }

  if (typeof elementOrSelector === "string") {
    return getElement(elementOrSelector);
  }

  return elementOrSelector;
};
