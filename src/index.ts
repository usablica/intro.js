import { version } from "../package.json";
import { Hint } from "./packages/hint";
import { Tour } from "./packages/tour";
import {
  registerTheme,
  registerThemes,
  getThemePath,
  getRegisteredThemes,
} from "./packages/tour/theme";
export type { ThemeType, ThemeRegistration } from "./packages/tour/theme";

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

/**
 * Register a custom theme so it can be referenced by name in the `theme` tour option
 */
introJs.registerTheme = registerTheme;

/**
 * Register multiple custom themes at once
 */
introJs.registerThemes = registerThemes;

/**
 * Get the CSS path registered for a given theme name, if any
 */
introJs.getThemePath = getThemePath;

/**
 * List the names of all currently registered themes
 */
introJs.getRegisteredThemes = getRegisteredThemes;

export default introJs;
