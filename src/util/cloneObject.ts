import {IntroItem} from "../index";

/*
 * makes a copy of the object
 * @api private
 * @method _cloneObject
 */
export default function cloneObject(object: HTMLElement): IntroItem {
  if (object === null || typeof object !== "object" || typeof object.nodeType !== "undefined") {
    // @ts-ignore
    return object;
  }
  // @ts-ignore
  const temp: DOMElement = {};
  for (const key in object) {
    // @ts-ignore
    temp[key] = typeof window.jQuery !== "undefined" && object[key] instanceof window.jQuery ? object[key] : cloneObject(object[key]);
  }
  return temp;
}
