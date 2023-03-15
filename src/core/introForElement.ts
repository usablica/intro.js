import addOverlayLayer from "./addOverlayLayer";
import DOMEvent from "./DOMEvent";
import { nextStep } from "./steps";
import onKeyDown from "./onKeyDown";
import onResize from "./onResize";
import fetchIntroSteps from "./fetchIntroSteps";

/**
 * Initiate a new introduction/guide from an element in the page
 *
 * @api private
 */
export default async function introForElement(targetElm: HTMLElement): Promise<Boolean> {
  // don't start the tour if the instance is not active
  if (!this.isActive()) return false;

  if (this._introStartCallback !== undefined) {
    await this._introStartCallback.call(this, targetElm);
  }

  //set it to the introJs object
  const steps = fetchIntroSteps.call(this, targetElm);

  if (steps.length === 0) {
    return false;
  }

  this._introItems = steps;

  //add overlay layer to the page
  if (addOverlayLayer.call(this, targetElm)) {
    //then, start the show
    await nextStep.call(this);

    if (this._options.keyboardNavigation) {
      DOMEvent.on(window, "keydown", onKeyDown, this, true);
    }
    //for window resize
    DOMEvent.on(window, "resize", onResize, this, true);
  }

  return false;
}
