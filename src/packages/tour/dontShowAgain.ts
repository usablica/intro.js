import { deleteCookie, getCookie, setCookie } from "../../util/cookie";

const dontShowAgainCookieValue = "true";

/**
 * Set the "Don't show again" state
 *
 * @api private
 */
export function setDontShowAgain(
  dontShowAgain: boolean,
  cookieName: string,
  cookieDays: number
) {
  if (dontShowAgain) {
    setCookie(cookieName, dontShowAgainCookieValue, cookieDays);
  } else {
    deleteCookie(cookieName);
  }
}

/**
 * Get the "Don't show again" state from cookies
 *
 * @api private
 */
export function getDontShowAgain(cookieName: string): boolean {
  const dontShowCookie = getCookie(cookieName);
  return dontShowCookie !== "" && dontShowCookie === dontShowAgainCookieValue;
}
