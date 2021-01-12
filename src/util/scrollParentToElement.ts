import getScrollParent from "./getScrollParent";
import {IntroJs} from "../index";

/**
 * scroll a scrollable element to a child element
 *
 * @param {Object} targetElement
 */
export default function scrollParentToElement(this: IntroJs, targetElement: HTMLElement) {
  // @ts-ignore
  const element = targetElement.element;

  if (!this._options.scrollToElement) return;

  const parent = getScrollParent(element);

  if (parent === document.body) return;

  parent.scrollTop = element.offsetTop - parent.offsetTop;
}
