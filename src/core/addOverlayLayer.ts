import exitIntro from "./exitIntro";
import createElement from "../util/createElement";
import setStyle from "../util/setStyle";
import { IntroJs } from "../intro";

/**
 * Add overlay layer to the page
 *
 * @api private
 */
export default function addOverlayLayer(
  intro: IntroJs,
  targetElm: HTMLElement
) {
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

  if (intro._options.exitOnOverlayClick === true) {
    setStyle(overlayLayer, {
      cursor: "pointer",
    });

    overlayLayer.onclick = async () => {
      await exitIntro(intro, targetElm);
    };
  }

  return true;
}
