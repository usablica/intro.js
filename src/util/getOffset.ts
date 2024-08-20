import getPropValue from "./getPropValue";
import isFixed from "./isFixed";

export type Offset = {
  width: number;
  height: number;
  left: number;
  right: number;
  top: number;
  bottom: number;
  absoluteTop: number;
  absoluteLeft: number;
  absoluteRight: number;
  absoluteBottom: number;
};

/**
 * Get an element position on the page relative to another element (or body) including scroll offset
 * Thanks to `meouw`: http://stackoverflow.com/a/442474/375966
 *
 * @api private
 * @returns Element's position info
 */
export default function getOffset(
  element: HTMLElement,
  relativeEl?: HTMLElement
): Offset {
  const body = document.body;
  const docEl = document.documentElement;
  const scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
  const scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;

  relativeEl = relativeEl || body;

  const x = element.getBoundingClientRect();
  const xr = relativeEl.getBoundingClientRect();
  const relativeElPosition = getPropValue(relativeEl, "position");

  let obj: { top: number; left: number } = { top: 0, left: 0 };

  if (
    (relativeEl.tagName.toLowerCase() !== "body" &&
      relativeElPosition === "relative") ||
    relativeElPosition === "sticky"
  ) {
    // when the container of our target element is _not_ body and has either "relative" or "sticky" position, we should not
    // consider the scroll position but we need to include the relative x/y of the container element
    obj = Object.assign(obj, {
      top: x.top - xr.top,
      left: x.left - xr.left,
    });
  } else {
    if (isFixed(element)) {
      obj = Object.assign(obj, {
        top: x.top,
        left: x.left,
      });
    } else {
      obj = Object.assign(obj, {
        top: x.top + scrollTop,
        left: x.left + scrollLeft,
      });
    }
  }

  return {
    ...obj,
    ...{
      width: x.width,
      height: x.height,
      bottom: obj.top + x.height,
      right: obj.left + x.width,
      absoluteTop: x.top,
      absoluteLeft: x.left,
      absoluteBottom: x.bottom,
      absoluteRight: x.right,
    },
  };
}
