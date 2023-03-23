import { deleteCookie, getCookie, setCookie } from "../util/cookie";

const dontShowAgainCookieValue = "true";

/**
 * Set the "Don't show again" state
 *
 * @api private
 */
export function setDontShowAgain(dontShowAgain: boolean) {
  if (dontShowAgain) {
    setCookie(
      this._options.dontShowAgainCookie,
      dontShowAgainCookieValue,
      this._options.dontShowAgainCookieDays
    );
  } else {
    deleteCookie(this._options.dontShowAgainCookie);
  }
}

/**
 * Get the "Don't show again" state from cookies
 *
 * @api private
 */
export function getDontShowAgain(): boolean {
  const dontShowCookie = getCookie(this._options.dontShowAgainCookie);
  return dontShowCookie && dontShowCookie === dontShowAgainCookieValue;
}
