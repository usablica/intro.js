/*
 * Makes a copy of an object
 * @api private
 */
export default function cloneObject<T extends Object>(source: T): T {
  if (source === null || typeof source !== "object" || "nodeType" in source) {
    return source;
  }

  const temp = {} as T;

  for (const key in source) {
    if (
      // @ts-ignore:next-line
      ("jQuery" in window && source[key] instanceof window.jQuery) ||
      key === "scrollElRef"
    ) {
      temp[key] = source[key];
    } else if (key === "window") {
      // @ts-ignore:next-line
      temp[key] = window;
    } else {
      temp[key] = cloneObject(source[key]);
    }
  }
  return temp;
}
