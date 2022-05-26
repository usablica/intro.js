import getScrollParent from "./getScrollParent";
import { IntroJs } from "../IntroJs";

/**
 * scroll a scrollable element to a child element
 *
 * @param {Object} targetElement
 */
export default function scrollParentToElement(
  this: IntroJs,
  targetElement: HTMLElement
) {
  if (!this._options.scrollToElement) return;

  const parent = getScrollParent(targetElement);

  if (parent === document.body) return;

  parent.scrollTop = targetElement.offsetTop - parent.offsetTop;
}
