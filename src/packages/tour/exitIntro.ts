import removeShowElement from "./removeShowElement";
import { removeChild } from "../../util/removeChild";
import { Tour } from "./tour";
import { floatingElementClassName } from "./classNames";
import { queryElementByClassName } from "../../util/queryElement";

/**
 * Exit from intro
 *
 * @api private
 * @param {Boolean} force - Setting to `true` will skip the result of beforeExit callback
 */
export default async function exitIntro(
  tour: Tour,
  force: boolean = false
): Promise<boolean> {
  const targetElement = tour.getTargetElement();
  let continueExit: boolean | undefined = true;

  // calling the onBeforeExit callback if it is defined
  // If this callback return `false`, it would halt the process
  continueExit = await tour.callback("beforeExit")?.call(tour, targetElement);

  // skip this check if `force` parameter is `true`
  // otherwise, if `onBeforEexit` returned `false`, don't exit the intro
  if (!force && continueExit === false) return false;

  //remove intro floating element
  const floatingElement = queryElementByClassName(
    floatingElementClassName,
    targetElement
  );
  removeChild(floatingElement);

  removeShowElement();

  //check if any callback is defined
  await tour.callback("exit")?.call(tour);

  // set the step to default
  tour.resetCurrentStep();

  return true;
}
