import forEach from "../util/forEach";
import DOMEvent from "./DOMEvent";
import onKeyDown from "./onKeyDown";
import onResize from "./onResize";
import removeShowElement from "./removeShowElement";
import removeChild from "../util/removeChild";
import { IntroJs } from "../IntroJs";
import getElement from "../util/getElement";

/**
 * Exit from intro
 *
 * @api private
 * @method _exitIntro
 * @param {Object} targetElement
 * @param {Boolean} force - Setting to `true` will skip the result of beforeExit callback
 */
export default async function exitIntro(
  this: IntroJs,
  targetElement: HTMLElement,
  force: boolean = false
) {
  let continueExit = true;

  // calling onbeforeexit callback
  //
  // If this callback return `false`, it would halt the process
  if (this._introBeforeExitCallback !== undefined) {
    continueExit = await this._introBeforeExitCallback.call(this);
  }

  // skip this check if `force` parameter is `true`
  // otherwise, if `onbeforeexit` returned `false`, don't exit the intro
  if (!force && continueExit === false) return;

  // remove overlay layers from the page
  const overlayLayers = targetElement.querySelectorAll(".introjs-overlay");

  if (overlayLayers && overlayLayers.length) {
    forEach(overlayLayers, (overlayLayer) => removeChild(overlayLayer));
  }

  //remove all helper layers
  const helperLayer = getElement(targetElement, ".introjs-helperLayer")!;
  removeChild(helperLayer, true);

  const referenceLayer = getElement(
    targetElement,
    ".introjs-tooltipReferenceLayer"
  )!;
  removeChild(referenceLayer);

  //remove disableInteractionLayer
  const disableInteractionLayer = getElement(
    targetElement,
    ".introjs-disableInteraction"
  )!;
  removeChild(disableInteractionLayer);

  //remove intro floating element
  const floatingElement = getElement(document, ".introjsFloatingElement")!;
  removeChild(floatingElement);

  removeShowElement();

  //clean listeners
  DOMEvent.off(window, "keydown", onKeyDown, this, true);
  DOMEvent.off(window, "resize", onResize, this, true);

  //check if any callback is defined
  if (this._introExitCallback !== undefined) {
    await this._introExitCallback.call(this);
  }

  //set the step to zero
  this._currentStep = undefined;
}
