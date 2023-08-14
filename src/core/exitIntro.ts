import DOMEvent from "./DOMEvent";
import onKeyDown from "./onKeyDown";
import onResize from "./onResize";
import removeShowElement from "./removeShowElement";
import removeChild from "../util/removeChild";
import { IntroJs } from "../intro";
import isFunction from "../util/isFunction";

/**
 * Exit from intro
 *
 * @api private
 * @param {Boolean} force - Setting to `true` will skip the result of beforeExit callback
 */
export default async function exitIntro(
  intro: IntroJs,
  targetElement: HTMLElement,
  force: boolean = false
) {
  let continueExit = true;

  // calling onbeforeexit callback
  //
  // If this callback return `false`, it would halt the process
  if (intro._introBeforeExitCallback !== undefined) {
    continueExit = await intro._introBeforeExitCallback.call(
      intro,
      targetElement
    );
  }

  // skip this check if `force` parameter is `true`
  // otherwise, if `onbeforeexit` returned `false`, don't exit the intro
  if (!force && continueExit === false) return;

  // remove overlay layers from the page
  const overlayLayers = Array.from(
    targetElement.querySelectorAll<HTMLElement>(".introjs-overlay")
  );

  if (overlayLayers && overlayLayers.length) {
    for (const overlayLayer of overlayLayers) {
      removeChild(overlayLayer);
    }
  }

  //remove all helper layers
  const helperLayer = targetElement.querySelector<HTMLElement>(
    ".introjs-helperLayer"
  );
  removeChild(helperLayer, true);

  const referenceLayer = targetElement.querySelector<HTMLElement>(
    ".introjs-tooltipReferenceLayer"
  );
  removeChild(referenceLayer);

  //remove disableInteractionLayer
  const disableInteractionLayer = targetElement.querySelector<HTMLElement>(
    ".introjs-disableInteraction"
  );
  removeChild(disableInteractionLayer);

  //remove intro floating element
  const floatingElement = document.querySelector<HTMLElement>(
    ".introjsFloatingElement"
  );
  removeChild(floatingElement);

  removeShowElement();

  //clean listeners
  DOMEvent.off(window, "keydown", onKeyDown, intro, true);
  DOMEvent.off(window, "resize", onResize, intro, true);

  //check if any callback is defined
  if (isFunction(intro._introExitCallback)) {
    await intro._introExitCallback.call(intro);
  }

  // set the step to default
  intro._currentStep = -1;
}
