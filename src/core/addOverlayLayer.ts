import exitIntro from "./exitIntro";
import createElement from "../util/createElement";
import setStyle from "../util/setStyle";

/**
 * Add overlay layer to the page
 *
 * @api private
 * @method _addOverlayLayer
 * @param {Object} targetElm
 */
export default function addOverlayLayer(targetElm) {
  const overlayLayer = createElement("div", {
    className: "introjs-overlay",
  });

  setStyle(overlayLayer, {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    position: "fixed",
  });

  targetElm.appendChild(overlayLayer);

  if (this._options.exitOnOverlayClick === true) {
    setStyle(overlayLayer, {
      cursor: "pointer",
    });

    overlayLayer.onclick = async () => {
      await exitIntro.call(this, targetElm);
    };
  }

  return true;
}
