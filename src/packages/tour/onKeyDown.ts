import { nextStep, previousStep } from "./steps";
import { Tour } from "./tour";
import {
  previousButtonClassName,
  skipButtonClassName,
  tooltipClassName,
} from "./classNames";
import { dataStepNumberAttribute } from "./dataAttributes";
import getPropValue from "../../util/getPropValue";

/**
 * Determine whether the tour is currently displayed right-to-left.
 * The tooltip itself is checked first, since RTL support (e.g. the
 * bundled introjs-rtl.css) may only set `direction: rtl` on the
 * tooltip rather than on the page or the target element. If the
 * tooltip isn't found (or has no explicit direction), fall back to
 * the tour's target element, which picks up a `dir="rtl"` set on the
 * page itself.
 */
function isTourRTL(tour: Tour): boolean {
  const tooltip = document.querySelector<HTMLElement>(`.${tooltipClassName}`);
  if (tooltip) {
    return getPropValue(tooltip, "direction") === "rtl";
  }

  return getPropValue(tour.getTargetElement(), "direction") === "rtl";
}

/**
 * on keyCode:
 * https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/keyCode
 * This feature has been removed from the Web standards.
 * Though some browsers may still support it, it is in
 * the process of being dropped.
 * Instead, you should use KeyboardEvent.code,
 * if it's implemented.
 *
 * jQuery's approach is to test for
 *   (1) e.which, then
 *   (2) e.charCode, then
 *   (3) e.keyCode
 * https://github.com/jquery/jquery/blob/a6b0705294d336ae2f63f7276de0da1195495363/src/event.js#L638
 */
export default async function onKeyDown(tour: Tour, e: KeyboardEvent) {
  let code = e.code === undefined ? e.which : e.code;

  // if e.which is null
  if (code === null) {
    code = e.charCode === null ? e.keyCode : e.charCode;
  }

  // in RTL, arrow directions are reversed: left arrow moves forward
  // and right arrow moves backward
  const isRTL = isTourRTL(tour);

  if (
    (code === "Escape" || code === 27) &&
    tour.getOption("exitOnEsc") === true
  ) {
    //escape key pressed, exit the intro
    //check if exit callback is defined
    await tour.exit();
  } else if (code === "ArrowLeft" || code === 37) {
    //left arrow
    await (isRTL ? nextStep(tour) : previousStep(tour));
  } else if (code === "ArrowRight" || code === 39) {
    //right arrow
    await (isRTL ? previousStep(tour) : nextStep(tour));
  } else if (code === "Enter" || code === "NumpadEnter" || code === 13) {
    //srcElement === ie
    const target = (e.target || e.srcElement) as HTMLElement;
    if (target && target.className.match(previousButtonClassName)) {
      //user hit enter while focusing on previous button
      await previousStep(tour);
    } else if (target && target.className.match(skipButtonClassName)) {
      // user hit enter while focusing on skip button
      if (tour.isEnd()) {
        await tour
          .callback("complete")
          ?.call(tour, tour.getCurrentStep(), "skip");
      }

      await tour.exit();
    } else if (target && target.getAttribute(dataStepNumberAttribute)) {
      // user hit enter while focusing on step bullet
      target.click();
    } else {
      //default behavior for responding to enter
      await nextStep(tour);
    }

    //prevent default behaviour on hitting Enter, to prevent steps being skipped in some browsers
    if (e.preventDefault) {
      e.preventDefault();
    } else {
      e.returnValue = false;
    }
  }
}
