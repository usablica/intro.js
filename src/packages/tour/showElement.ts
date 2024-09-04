import { addClass } from "../../util/className";
import { TourStep } from "./steps";
import removeShowElement from "./removeShowElement";
import createElement from "../../util/createElement";
import {
  disableInteractionClassName,
  helperLayerClassName,
} from "./classNames";
import { Tour } from "./tour";
import {
  queryElementByClassName,
} from "../../util/queryElement";
import { setPositionRelativeToStep } from "./position";
import getPropValue from "../../util/getPropValue";
import van from "../dom/van";
import { HelperLayer } from "./helperLayer";
import { ReferenceLayer } from "../tooltip/referenceLayer";
import { DisableInteraction } from "./disableInteraction";

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

  const oldHelperLayer = queryElementByClassName(helperLayerClassName);

  //remove old classes if the element still exist
  removeShowElement();

  // TODO: replace with hasStarted()
  if (oldHelperLayer === null) {
    const helperLayer = HelperLayer({
      currentStep: tour.currentStepSignal,
      steps: tour.getSteps(),
      targetElement: tour.getTargetElement(),
      tourHighlightClass: tour.getOption("highlightClass"),
      overlayOpacity: tour.getOption("overlayOpacity"),
      helperLayerPadding: tour.getOption("helperElementPadding"),
    });

    const referenceLayer = ReferenceLayer({
      tour,
    });

    //add helper layer to target element
    van.add(tour.getRoot(), helperLayer);
    van.add(tour.getRoot(), referenceLayer);

    // disable interaction
    if (step.disableInteraction) {
      van.add(
        tour.getRoot(),
        DisableInteraction({
          currentStep: tour.currentStepSignal,
          steps: tour.getSteps(),
          targetElement: tour.getTargetElement(),
          helperElementPadding: tour.getOption("helperElementPadding"),
        })
      );
    }
  }

  setShowElement(step.element as HTMLElement);

  await tour.callback("afterChange")?.call(tour, step.element);
}
