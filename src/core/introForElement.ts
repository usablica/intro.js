import addOverlayLayer from "./addOverlayLayer";
import DOMEvent from "./DOMEvent";
import { nextStep } from "./steps";
import onKeyDown from "./onKeyDown";
import onResize from "./onResize";
import fetchIntroSteps from "./fetchIntroSteps";
import { IntroJs } from "src/intro";

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
    await intro._introStartCallback(targetElm);
  }

  //set it to the introJs object
  const steps = fetchIntroSteps(intro, targetElm);

  if (steps.length === 0) {
    return false;
  }

  intro._introItems = steps;

  //add overlay layer to the page
  if (addOverlayLayer(intro, targetElm)) {
    //then, start the show
    await nextStep(intro);

    targetElm.addEventListener;
    if (intro._options.keyboardNavigation) {
      DOMEvent.on(window, "keydown", onKeyDown, intro, true);
    }

    //for window resize
    DOMEvent.on(window, "resize", onResize, intro, true);
  }

  return false;
}
