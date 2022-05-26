import { deleteCookie, getCookie, setCookie } from "../util/cookie";
import { IntroJs } from "../IntroJs";

const dontShowAgainCookieValue = "true";

/**
 * Set the "Don't show again" state
 *
 * @api private
 * @param {Boolean} dontShowAgain
 * @method setDontShowAgain
 */
export function setDontShowAgain(this: IntroJs, dontShowAgain: boolean) {
  if (dontShowAgain) {
    setCookie(
      this._options.dontShowAgainCookie!,
      dontShowAgainCookieValue,
      this._options.dontShowAgainCookieDays!
    );
  } else {
    deleteCookie(this._options.dontShowAgainCookie!);
  }
}

/**
 * Get the "Don't show again" state from cookies
 *
 * @api private
 * @method getDontShowAgain
 */
export function getDontShowAgain(this: IntroJs) {
  const dontShowCookie = getCookie(this._options.dontShowAgainCookie!);
  return dontShowCookie && dontShowCookie === dontShowAgainCookieValue;
}
