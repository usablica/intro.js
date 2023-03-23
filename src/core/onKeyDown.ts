import { nextStep, previousStep } from "./steps";
import exitIntro from "./exitIntro";

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
 *
 * @param type var
 * @return type
 */
export default async function onKeyDown(e) {
  let code = e.code === undefined ? e.which : e.code;

  // if e.which is null
  if (code === null) {
    code = e.charCode === null ? e.keyCode : e.charCode;
  }

  if ((code === "Escape" || code === 27) && this._options.exitOnEsc === true) {
    //escape key pressed, exit the intro
    //check if exit callback is defined
    await exitIntro.call(this, this._targetElement);
  } else if (code === "ArrowLeft" || code === 37) {
    //left arrow
    await previousStep.call(this);
  } else if (code === "ArrowRight" || code === 39) {
    //right arrow
    await nextStep.call(this);
  } else if (code === "Enter" || code === "NumpadEnter" || code === 13) {
    //srcElement === ie
    const target = e.target || e.srcElement;
    if (target && target.className.match("introjs-prevbutton")) {
      //user hit enter while focusing on previous button
      await previousStep.call(this);
    } else if (target && target.className.match("introjs-skipbutton")) {
      //user hit enter while focusing on skip button
      if (
        this._introItems.length - 1 === this._currentStep &&
        typeof this._introCompleteCallback === "function"
      ) {
        await this._introCompleteCallback.call(this, this._currentStep, "skip");
      }

      await exitIntro.call(this, this._targetElement);
    } else if (target && target.getAttribute("data-step-number")) {
      // user hit enter while focusing on step bullet
      target.click();
    } else {
      //default behavior for responding to enter
      await nextStep.call(this);
    }

    //prevent default behaviour on hitting Enter, to prevent steps being skipped in some browsers
    if (e.preventDefault) {
      e.preventDefault();
    } else {
      e.returnValue = false;
    }
  }
}
