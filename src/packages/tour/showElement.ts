import { addClass } from "../../util/className";
import { TourStep } from "./steps";
import removeShowElement from "./removeShowElement";
import { Tour } from "./tour";
import getPropValue from "../../util/getPropValue";
/**
 * To set the show element
 * This function set a relative (in most cases) position and changes the z-index
 *
 * @api private
 */
function setShowElement(targetElement: HTMLElement) {
  addClass(targetElement, "introjs-showElement");

  const currentElementPosition = getPropValue(targetElement, "position");
  if (
    currentElementPosition !== "absolute" &&
    currentElementPosition !== "relative" &&
    currentElementPosition !== "sticky" &&
    currentElementPosition !== "fixed"
  ) {
    //change to new intro item
    addClass(targetElement, "introjs-relativePosition");
  }
}

/**
 * Show an element on the page
 *
 * @api private
 */
export default async function _showElement(tour: Tour, step: TourStep) {
  tour.callback("change")?.call(tour, step.element);

  //remove old classes if the element still exist
  removeShowElement();

  setShowElement(step.element as HTMLElement);

  await tour.callback("afterChange")?.call(tour, step.element);
}
