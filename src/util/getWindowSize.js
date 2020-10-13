/**
 * Provides a cross-browser way to get the screen dimensions
 * via: http://stackoverflow.com/questions/5864467/internet-explorer-innerheight
 *
 * @api private
 * @method _getWinSize
 * @returns {Object} width and height attributes
 */
export default function getWinSize() {
  if (window.innerWidth !== undefined) {
    return { width: window.innerWidth, height: window.innerHeight };
  } else {
    const D = document.documentElement;
    return { width: D.clientWidth, height: D.clientHeight };
  }
}
