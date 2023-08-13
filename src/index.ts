import { version } from "../package.json";
import { IntroJs } from "./intro";
import stamp from "./util/stamp";

/**
 * Create a new IntroJS instance
 *
 * @param targetElm Optional target element to start the tour/hint on
 * @returns
 */
const introJs = (targetElm?: string | HTMLElement) => {
  let instance: IntroJs;

  if (typeof targetElm === "object") {
    instance = new IntroJs(targetElm);
  } else if (typeof targetElm === "string") {
    //select the target element with query selector
    const targetElement = document.querySelector<HTMLElement>(targetElm);

    if (targetElement) {
      instance = new IntroJs(targetElement);
    } else {
      throw new Error("There is no element with given selector.");
    }
  } else {
    instance = new IntroJs(document.body);
  }
  // add instance to list of _instances
  // passing group to stamp to increment
  // from 0 onward somewhat reliably
  introJs.instances[stamp(instance, "introjs-instance")] = instance;

  return instance;
};

/**
 * Current IntroJs version
 *
 * @property version
 * @type String
 */
introJs.version = version;

/**
 * key-val object helper for introJs instances
 *
 * @property instances
 * @type Object
 */
introJs.instances = {} as { [key: number]: IntroJs };

export default introJs;
