import DOMEvent from "../../util/DOMEvent";
import onKeyDown from "../../core/onKeyDown";
import onResize from "./onResize";
import removeShowElement from "../../core/removeShowElement";
import removeChild from "../../util/removeChild";
import { Tour } from "./tour";
import {
  disableInteractionClassName,
  floatingElementClassName,
  helperLayerClassName,
  overlayClassName,
  tooltipReferenceLayerClassName,
} from "./classNames";
import {
  queryElementByClassName,
  queryElementsByClassName,
} from "src/util/queryElement";

/**
 * Exit from intro
 *
 * @api private
 * @param {Boolean} force - Setting to `true` will skip the result of beforeExit callback
 */
export default async function exitIntro(tour: Tour, force: boolean = false) {
  const targetElement = tour.getTargetElement();
  let continueExit: boolean | undefined = true;

  // calling onbeforeexit callback
  //
  // If this callback return `false`, it would halt the process
  continueExit = await tour.callback("beforeExit")?.call(tour, targetElement);

  // skip this check if `force` parameter is `true`
  // otherwise, if `onbeforeexit` returned `false`, don't exit the intro
  if (!force && continueExit === false) return;

  // remove overlay layers from the page
  const overlayLayers = Array.from(
    queryElementsByClassName(overlayClassName, targetElement)
  );

  if (overlayLayers && overlayLayers.length) {
    for (const overlayLayer of overlayLayers) {
      removeChild(overlayLayer);
    }
  }

  //remove all helper layers
  const helperLayer = queryElementByClassName(
    helperLayerClassName,
    targetElement
  );
  removeChild(helperLayer, true);

  const referenceLayer = queryElementByClassName(
    tooltipReferenceLayerClassName,
    targetElement
  );
  removeChild(referenceLayer);

  //remove disableInteractionLayer
  const disableInteractionLayer = queryElementByClassName(
    disableInteractionClassName,
    targetElement
  );
  removeChild(disableInteractionLayer);

  //remove intro floating element
  const floatingElement = queryElementByClassName(
    floatingElementClassName,
    targetElement
  );
  removeChild(floatingElement);

  removeShowElement();

  //clean listeners
  DOMEvent.off(window, "keydown", onKeyDown, tour, true);
  DOMEvent.off(window, "resize", onResize, tour, true);

  //check if any callback is defined
  await tour.callback("exit")?.call(tour);

  // set the step to default
  tour.setCurrentStep(-1);
}
