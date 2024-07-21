import { version } from "../package.json";
import { Hint } from "./packages/hint";
import { Tour } from "./packages/tour";

class LegacyIntroJs extends Tour {
  /**
   * @deprecated introJs().addHints() is deprecated, please use introJs.hint().addHints() instead
   * @param args
   */
  addHints(..._: any[]) {
    console.error(
      "introJs().addHints() is deprecated, please use introJs.hint.addHints() instead."
    );
  }

  /**
   * @deprecated introJs().addHint() is deprecated, please use introJs.hint.addHint() instead
   * @param args
   */
  addHint(..._: any[]) {
    console.error(
      "introJs().addHint() is deprecated, please use introJs.hint.addHint() instead."
    );
  }

  /**
   * @deprecated introJs().removeHints() is deprecated, please use introJs.hint.hideHints() instead
   * @param args
   */
  removeHints(..._: any[]) {
    console.error(
      "introJs().removeHints() is deprecated, please use introJs.hint.removeHints() instead."
    );
  }
}

/**
 * Intro.js module
 */
const introJs = (elementOrSelector?: string | HTMLElement) => {
  console.warn(
    "introJs() is deprecated. Please use introJs.tour() or introJs.hint() instead."
  );
  return new LegacyIntroJs(elementOrSelector);
};

/**
 * Create a new Intro.js Tour instance
 * @param elementOrSelector Optional target element to start the Tour on
 */
introJs.tour = (elementOrSelector?: string | HTMLElement) =>
  new Tour(elementOrSelector);

/**
 * Create a new Intro.js Hint instance
 * @param elementOrSelector Optional target element to start the Hint on
 */
introJs.hint = (elementOrSelector?: string | HTMLElement) =>
  new Hint(elementOrSelector);

/**
 * Current Intro.js version
 */
introJs.version = version;

export default introJs;
