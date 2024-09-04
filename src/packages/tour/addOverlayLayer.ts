import { Tour } from "./tour";
import van from "../dom/van";
import { OverlayLayer } from "./overlayLayer";

/**
 * Add overlay layer to the page
 *
 * @api private
 */
export default function addOverlayLayer(tour: Tour) {
  //const exitOnOverlayClick = tour.getOption("exitOnOverlayClick") === true;

  //const overlayLayer = OverlayLayer({
  //  exitOnOverlayClick,
  //  onExitTour: async () => {
  //    return tour.exit();
  //  },
  //});

  //van.add(tour.getRoot(), overlayLayer);

  return true;
}
