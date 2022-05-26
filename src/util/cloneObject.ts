import { IntroItem } from "../IntroJs";

/*
 * makes a copy of the object
 * @api private
 * @method _cloneObject
 */
export default function cloneObject(object: HTMLElement): IntroItem {
  if (
    object === null ||
    typeof object !== "object" ||
    typeof object.nodeType !== "undefined"
  ) {
    // @ts-ignore
    return object;
  }
  // @ts-ignore
  const temp: DOMElement = {};
  for (const key in object) {
    temp[key] =
      // @ts-ignore
      typeof window.jQuery !== "undefined" &&
      // @ts-ignore
      object[key] instanceof window.jQuery
        ? // @ts-ignore
          object[key]
        : // @ts-ignore
          cloneObject(object[key]);
  }
  return temp;
}
