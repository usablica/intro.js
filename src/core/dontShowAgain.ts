import { IntroJs } from "../intro";
import { deleteCookie, getCookie, setCookie } from "../util/cookie";

const dontShowAgainCookieValue = "true";

/**
 * Set the "Don't show again" state
 *
 * @api private
 */
export function setDontShowAgain(intro: IntroJs, dontShowAgain: boolean) {
  if (dontShowAgain) {
    setCookie(
      intro._options.dontShowAgainCookie,
      dontShowAgainCookieValue,
      intro._options.dontShowAgainCookieDays
    );
  } else {
    deleteCookie(intro._options.dontShowAgainCookie);
  }
}

/**
 * Get the "Don't show again" state from cookies
 *
 * @api private
 */
export function getDontShowAgain(intro: IntroJs): boolean {
  const dontShowCookie = getCookie(intro._options.dontShowAgainCookie);
  return dontShowCookie !== "" && dontShowCookie === dontShowAgainCookieValue;
}
