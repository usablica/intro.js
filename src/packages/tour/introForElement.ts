import addOverlayLayer from "../../core/addOverlayLayer";
import DOMEvent from "../../util/DOMEvent";
import { nextStep } from "./steps";
import onKeyDown from "../../core/onKeyDown";
import onResize from "./onResize";
import fetchIntroSteps from "../../core/fetchIntroSteps";
import isFunction from "../../util/isFunction";
import { Tour } from "./tour";

/**
 * Initiate a new introduction/guide from an element in the page
 *
 * @api private
 */
export default async function introForElement(
  tour: Tour,
  targetElm: HTMLElement
): Promise<Boolean> {
  // don't start the tour if the instance is not active
  if (!tour.isActive()) return false;

  if (isFunction(tour._introStartCallback)) {
    await tour._introStartCallback.call(tour, targetElm);
  }

  //set it to the introJs object
  const steps = fetchIntroSteps(tour, targetElm);

  if (steps.length === 0) {
    return false;
  }

  tour.setSteps(steps);

  //add overlay layer to the page
  if (addOverlayLayer(tour, targetElm)) {
    //then, start the show
    await nextStep(tour);

    targetElm.addEventListener;
    if (tour.getOption("keyboardNavigation")) {
      DOMEvent.on(window, "keydown", onKeyDown, tour, true);
    }

    //for window resize
    DOMEvent.on(window, "resize", onResize, tour, true);
  }

  return false;
}
