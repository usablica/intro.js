import stamp from "./util/stamp";
// @ts-ignore
import { version } from "../package.json";
import { IntroJs } from "./IntroJs";

class IntroInstances {
  readonly instances: { [key: string]: IntroJs } = {};

  constructor() {
    this.instances = {};
  }

  createInstance(
    targetElm: HTMLElement | string | undefined = undefined
  ): IntroJs {
    let instance: IntroJs | null = null;

    if (typeof targetElm === "object") {
      //Ok, create a new instance
      instance = new IntroJs(targetElm);
    } else if (typeof targetElm === "string") {
      //select the target element with query selector
      const targetElement = document.querySelector(targetElm) as HTMLElement;

      if (targetElement) {
        instance = new IntroJs(targetElement);
      } else {
        throw new Error("There is no element with given selector.");
      }
    } else {
      instance = new IntroJs(document.body);
    }

    if (instance === null) {
      throw new Error("There is no element with given selector.");
    }

    // add instance to list of _instances
    // passing group to stamp to increment
    // from 0 onward somewhat reliably
    this.instances[stamp(instance, "introjs-instance")] = instance;

    return instance;
  }
}

const instances = new IntroInstances();

const introJs = (targetElm: HTMLElement | string | undefined = undefined) => {
  return instances.createInstance(targetElm);
};

introJs.version = version;
// introJs.prototype.get = (target: IntroInstances, prop: string) => {
//   /* This will return the property on the "parent" object
//    */
//   if (typeof instances.instances[prop] !== "undefined") {
//     return instances.instances[prop];
//   }
//
//   throw new Error("There is no element with given selector.");
// };

export default introJs;
