import getOffset from "../util/getOffset";
import exitIntro from "./exitIntro";

/**
 * Add overlay layer to the page
 *
 * @api private
 * @method _addOverlayLayer
 * @param {Object} targetElm
 */
export default function addOverlayLayer(targetElm) {
  const overlayLayer = document.createElement("div");
  let styleText = "";
  const self = this;

  //set css class name
  overlayLayer.className = "introjs-overlay";

  //check if the target element is body, we should calculate the size of overlay layer in a better way
  if (!targetElm.tagName || targetElm.tagName.toLowerCase() === "body") {
    styleText += "top: 0;bottom: 0; left: 0;right: 0;position: fixed;";
    overlayLayer.style.cssText = styleText;
  } else {
    //set overlay layer position
    const elementPosition = getOffset(targetElm);
    if (elementPosition) {
      styleText += `width: ${elementPosition.width}px; height:${elementPosition.height}px; top:${elementPosition.top}px;left: ${elementPosition.left}px;`;
      overlayLayer.style.cssText = styleText;
    }
  }

  targetElm.appendChild(overlayLayer);

  overlayLayer.onclick = () => {
    if (self._options.exitOnOverlayClick === true) {
      exitIntro.call(self, targetElm);
    }
  };

  window.setTimeout(() => {
    styleText += `opacity: ${self._options.overlayOpacity.toString()};`;
    overlayLayer.style.cssText = styleText;
  }, 10);

  return true;
}
