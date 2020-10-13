/**
 * Get an element position on the page
 * Thanks to `meouw`: http://stackoverflow.com/a/442474/375966
 *
 * @api private
 * @method _getOffset
 * @param {Object} element
 * @returns Element's position info
 */
export default function getOffset(element) {
  const body = document.body;
  const docEl = document.documentElement;
  const scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
  const scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;
  const x = element.getBoundingClientRect();
  return {
    top: x.top + scrollTop,
    width: x.width,
    height: x.height,
    left: x.left + scrollLeft,
  };
}
