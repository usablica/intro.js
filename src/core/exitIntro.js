import forEach from "../util/forEach";
import removeShowElement from "./removeShowElement";
import removeChild from "../util/removeChild";

/**
 * Exit from intro
 *
 * @api private
 * @this {import('./IntroJs').default}
 * @method _exitIntro
 * @param {Object} targetElement
 * @param {Boolean} force - Setting to `true` will skip the result of beforeExit callback
 */
export default function exitIntro(targetElement, force) {
  let continueExit = true;

  // calling onbeforeexit callback
  //
  // If this callback return `false`, it would halt the process
  if (this._introBeforeExitCallback !== undefined) {
    continueExit = this._introBeforeExitCallback.call(this);
  }

  // skip this check if `force` parameter is `true`
  // otherwise, if `onbeforeexit` returned `false`, don't exit the intro
  if (!force && continueExit === false) return;

  // remove overlay layers from the page
  const overlayLayers = targetElement.querySelectorAll(".introjs-overlay");

  if (overlayLayers && overlayLayers.length) {
    forEach(overlayLayers, (overlayLayer) => removeChild(overlayLayer));
  }

  //remove disableInteractionLayer
  const disableInteractionLayer = targetElement.querySelector(
    ".introjs-disableInteraction"
  );
  removeChild(disableInteractionLayer);

  //remove intro floating element
  const floatingElement = document.querySelector(".introjsFloatingElement");
  removeChild(floatingElement);

  removeShowElement();

  // signal to all listeners that introjs has exited
  this.fire('exit');

  // check if any callback is defined
  if (this._introExitCallback !== undefined) {
    this._introExitCallback.call(this);
  }

  this._currentStep = undefined;
}
