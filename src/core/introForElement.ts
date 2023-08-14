import addOverlayLayer from "./addOverlayLayer";
import DOMEvent from "./DOMEvent";
import { nextStep } from "./steps";
import onKeyDown from "./onKeyDown";
import onResize from "./onResize";
import fetchIntroSteps from "./fetchIntroSteps";
import { IntroJs } from "../intro";
import isFunction from "../util/isFunction";

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

  if (isFunction(intro._introStartCallback)) {
    await intro._introStartCallback.call(intro, targetElm);
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
