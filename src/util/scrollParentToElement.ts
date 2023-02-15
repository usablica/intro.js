import getScrollParent from "./getScrollParent";

/**
 * scroll a scrollable element to a child element
 */
export default function scrollParentToElement(targetElement: HTMLElement) {
  if (!this._options.scrollToElement) return;

  const parent = getScrollParent(targetElement);

  const scrollEl = this._introItems[this._currentStep].scrollElRef || this._options.scrollElRef || parent;

  if (scrollEl === document.body) return;

  parent.scrollTop = targetElement.offsetTop - parent.offsetTop;
}
