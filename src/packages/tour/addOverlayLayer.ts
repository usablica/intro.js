import exitIntro from "./exitIntro";
import createElement from "../../util/createElement";
import setStyle from "../../util/setStyle";
import { Tour } from "./tour";
import { overlayClassName } from "./classNames";

/**
 * Add overlay layer to the page
 *
 * @api private
 */
export default function addOverlayLayer(tour: Tour) {
  const overlayLayer = createElement("div", {
    className: overlayClassName,
  });

  setStyle(overlayLayer, {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    position: "fixed",
  });

  tour.getTargetElement().appendChild(overlayLayer);

  if (tour.getOption("exitOnOverlayClick") === true) {
    setStyle(overlayLayer, {
      cursor: "pointer",
    });

    overlayLayer.onclick = async () => {
      await exitIntro(tour);
    };
  }

  return true;
}
