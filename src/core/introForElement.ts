import addOverlayLayer from "./addOverlayLayer";
import DOMEvent from "./DOMEvent";
import { nextStep } from "./steps";
import onKeyDown from "./onKeyDown";
import onResize from "./onResize";
import fetchIntroSteps from "./fetchIntroSteps";
import { IntroJs } from "src";

/**
 * Initiate a new introduction/guide from an element in the page
 *
 * @api private
 */
export default async function introForElement(
  intro: IntroJs,
  targetElm: HTMLElement
): Promise<Boolean> {
  // don't start the tour if the instance is not active
  if (!intro.isActive()) return false;

  if (intro._introStartCallback !== undefined) {
    await intro._introStartCallback.call(intro, targetElm);
  }

  //set it to the introJs object
  const steps = fetchIntroSteps(this, targetElm);

  if (steps.length === 0) {
    return false;
  }

  intro._introItems = steps;

  //add overlay layer to the page
  if (addOverlayLayer(this, targetElm)) {
    //then, start the show
    await nextStep.call(this);

    if (intro._options.keyboardNavigation) {
      DOMEvent.on(window, "keydown", onKeyDown, this, true);
    }
    //for window resize
    DOMEvent.on(window, "resize", onResize, this, true);
  }

  return false;
}
