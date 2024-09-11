import { removeShowElement } from "./showElement";
import { Tour } from "./tour";

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

  removeShowElement();

  //check if any callback is defined
  await tour.callback("exit")?.call(tour);

  // set the step to default
  // this would update the signal to the tour that the tour has ended
  // and the corresponding components would be updated
  tour.resetCurrentStep();

  return true;
}
