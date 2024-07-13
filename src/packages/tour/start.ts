import addOverlayLayer from "./addOverlayLayer";
import { nextStep } from "./steps";
import { fetchSteps } from "./steps";
import { Tour } from "./tour";

/**
 * Initiate a new tour the page
 *
 * @api private
 */
export const start = async (tour: Tour): Promise<Boolean> => {
  // don't start the tour if the instance is not active
  if (!tour.isActive()) {
    return false;
  }

  // don't start the tour if it's already started
  if (tour.hasStarted()) {
    return false;
  }

  await tour.callback("start")?.call(tour, tour.getTargetElement());

  //set it to the introJs object
  const steps = fetchSteps(tour);

  if (steps.length === 0) {
    return false;
  }

  tour.setSteps(steps);

  //add overlay layer to the page
  if (addOverlayLayer(tour)) {
    //then, start the show
    await nextStep(tour);

    return true;
  }

  return false;
};
