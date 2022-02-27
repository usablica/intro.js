import addOverlayLayer from "./addOverlayLayer";
import DOMEvent from "./DOMEvent";
import { nextStep } from "./steps";
import onKeyDown from "./onKeyDown";
import onResize from "./onResize";
import fetchIntroSteps from "./fetchIntroSteps";
import { IntroJs } from "../IntroJs";

/**
 * Initiate a new introduction/guide from an element in the page
 *
 * @api private
 * @method introForElement
 * @param {Object} targetElm
 * @returns {Boolean} Success or not?
 */

export default function introForElement(this: IntroJs, targetElm: HTMLElement) {
  if (this._introStartCallback !== undefined) {
    this._introStartCallback.call(this, targetElm);
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
    nextStep.call(this);

    if (this._options.keyboardNavigation) {
      DOMEvent.on(window, "keydown", onKeyDown, this, true);
    }
    //for window resize
    DOMEvent.on(window, "resize", onResize, this, true);
  }
  return false;
}
