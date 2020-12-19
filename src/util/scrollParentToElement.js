import getScrollParent from "./getScrollParent";

/**
 * scroll a scrollable element to a child element
 *
 * @param {Object} targetElement
 */
export default function scrollParentToElement(targetElement) {
  const element = targetElement.element;

  if (!this._options.scrollToElement) return;

  const parent = getScrollParent(element);

  if (parent === document.body) return;

  parent.scrollTop = element.offsetTop - parent.offsetTop;
}
