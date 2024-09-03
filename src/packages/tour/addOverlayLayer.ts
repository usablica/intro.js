import { style } from "../../util/style";
import { Tour } from "./tour";
import { overlayClassName } from "./classNames";
import van from "../dom/van";

const { div } = van.tags;

/**
 * Add overlay layer to the page
 *
 * @api private
 */
export default function addOverlayLayer(tour: Tour) {
  const exitOnOverlayClick = tour.getOption("exitOnOverlayClick") === true;

  const overlayLayer = div({
    className: overlayClassName,
    style: style({
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      position: "fixed",
      cursor: exitOnOverlayClick ? "pointer" : "auto",
    }),
  });

  tour.appendToRoot(overlayLayer);

  if (exitOnOverlayClick) {
    overlayLayer.onclick = async () => {
      await tour.exit();
    };
  }

  return true;
}
