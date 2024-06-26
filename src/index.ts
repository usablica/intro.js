import { version } from "../package.json";
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
   * Current Intro.js version
   */
  version: version,
};

export default introJs;
