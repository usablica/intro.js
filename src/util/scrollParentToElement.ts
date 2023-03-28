import getScrollParent from "./getScrollParent";

/**
 * scroll a scrollable element to a child element
 */
export default function scrollParentToElement(
  scrollToElement: boolean,
  targetElement: HTMLElement
) {
  if (!scrollToElement) return;

  const parent = getScrollParent(targetElement);

  if (parent === document.body) return;

  parent.scrollTop = targetElement.offsetTop - parent.offsetTop;
}
