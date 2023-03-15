/*
 * Makes a copy of an object
 * @api private
 */
export default function cloneObject<T extends Object>(source: T): T {
  if (
    source === null ||
    typeof source !== "object" ||
    source.hasOwnProperty("nodeType")
  ) {
    return source;
  }

  const temp = {} as T;

  for (const key in source) {
    // @ts-ignore:next-line
    if ("jQuery" in window && source[key] instanceof window.jQuery) {
      temp[key] = source[key];
    } else {
      temp[key] = cloneObject(source[key]);
    }
  }
  return temp;
}
