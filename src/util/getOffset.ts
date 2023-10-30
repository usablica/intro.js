import getPropValue from "./getPropValue";
import isFixed from "./isFixed";

/**
 * Get an element position on the page relative to another element (or body)
 * Thanks to `meouw`: http://stackoverflow.com/a/442474/375966
 *
 * @api private
 * @returns Element's position info
 */
export default function getOffset(
  element: HTMLElement,
  relativeEl?: HTMLElement
): { width: number; height: number; left: number; top: number } {
  const body = document.body;
  const docEl = document.documentElement;
  const scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
  const scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;

  relativeEl = relativeEl || body;

  let iframeOffset = { top: 0, left: 0 };

  // Check if the element is inside an iframe
  if (element.ownerDocument !== document) {
    const iframeElement = element.ownerDocument.defaultView?.frameElement as HTMLElement | null;
    if (iframeElement) {
      const iframeRect = iframeElement.getBoundingClientRect();
      iframeOffset = {
        top: iframeRect.top + scrollTop,
        left: iframeRect.left + scrollLeft,
      };
    }
  }

  const x = element.getBoundingClientRect();
  const xr = relativeEl.getBoundingClientRect();
  const relativeElPosition = getPropValue(relativeEl, "position");

  let obj = {
    width: x.width,
    height: x.height,
  };

  if (
    (relativeEl.tagName.toLowerCase() !== "body" &&
      relativeElPosition === "relative") ||
    relativeElPosition === "sticky"
  ) {
    return Object.assign(obj, {
      top: x.top - xr.top + iframeOffset.top,
      left: x.left - xr.left + iframeOffset.left,
    });
  } else {
    if (isFixed(element)) {
      return Object.assign(obj, {
        top: x.top + iframeOffset.top,
        left: x.left + iframeOffset.left,
      });
    } else {
      return Object.assign(obj, {
        top: x.top + scrollTop + iframeOffset.top,
        left: x.left + scrollLeft + iframeOffset.left,
      });
    }
  }
}



