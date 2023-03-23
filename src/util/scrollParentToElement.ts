import getScrollParent from "./getScrollParent";

/**
 * scroll a scrollable element to a child element
 */
export default function scrollParentToElement(targetElement: HTMLElement) {
  if (!this._options.scrollToElement) return;

  const parent = getScrollParent(targetElement);

  if (parent === document.body) return;

  parent.scrollTop = targetElement.offsetTop - parent.offsetTop;
}
