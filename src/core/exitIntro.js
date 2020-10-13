import forEach from "../util/forEach";
import removeClass from "../util/removeClass";
import DOMEvent from "./DOMEvent";
import onKeyDown from "./onKeyDown";
import onResize from "./onResize";
import removeShowElement from "./removeShowElement";

/**
 * Exit from intro
 *
 * @api private
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

  //remove overlay layers from the page
  const overlayLayers = targetElement.querySelectorAll(".introjs-overlay");

  if (overlayLayers && overlayLayers.length) {
    forEach(overlayLayers, (overlayLayer) => {
      overlayLayer.style.opacity = 0;
      window.setTimeout(
        function () {
          if (this.parentNode) {
            this.parentNode.removeChild(this);
          }
        }.bind(overlayLayer),
        500
      );
    });
  }

  //remove all helper layers
  const helperLayer = targetElement.querySelector(".introjs-helperLayer");
  if (helperLayer) {
    helperLayer.parentNode.removeChild(helperLayer);
  }

  const referenceLayer = targetElement.querySelector(
    ".introjs-tooltipReferenceLayer"
  );
  if (referenceLayer) {
    referenceLayer.parentNode.removeChild(referenceLayer);
  }

  //remove disableInteractionLayer
  const disableInteractionLayer = targetElement.querySelector(
    ".introjs-disableInteraction"
  );
  if (disableInteractionLayer) {
    disableInteractionLayer.parentNode.removeChild(disableInteractionLayer);
  }

  //remove intro floating element
  const floatingElement = document.querySelector(".introjsFloatingElement");
  if (floatingElement) {
    floatingElement.parentNode.removeChild(floatingElement);
  }

  removeShowElement();

  //remove `introjs-fixParent` class from the elements
  const fixParents = document.querySelectorAll(".introjs-fixParent");
  forEach(fixParents, (parent) => {
    removeClass(parent, /introjs-fixParent/g);
  });

  //clean listeners
  DOMEvent.off(window, "keydown", onKeyDown, this, true);
  DOMEvent.off(window, "resize", onResize, this, true);

  //check if any callback is defined
  if (this._introExitCallback !== undefined) {
    this._introExitCallback.call(this);
  }

  //set the step to zero
  this._currentStep = undefined;
}
