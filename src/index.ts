import { version } from "../package.json";
import { Hint } from "./packages/hint";
import { Tour } from "./packages/tour";

/**
 * Intro.js module
 */
const introJs = {
  /**
   * Create a new Intro.js Tour instance
   * @param elementOrSelector Optional target element to start the Tour on
   */
  tour: (elementOrSelector?: string | HTMLElement) =>
    new Tour(elementOrSelector),

  /**
   * Create a new Intro.js Hint instance
   * @param elementOrSelector Optional target element to start the Hint on
   */
  hint: (elementOrSelector?: string | HTMLElement) =>
    new Hint(elementOrSelector),

  /**
   * Current Intro.js version
   */
  version: version,
};

export default introJs;
