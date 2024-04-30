/**
 * Makes a copy of an object
 * @api private
 */
export default function cloneObject<T>(source: T): T {
  if (source === null || typeof source !== "object" || "nodeType" in source) {
    return source;
  }

  const temp = {} as T;

  for (const key in source) {
    if (
      "jQuery" in window &&
      window.jQuery &&
      source[key] instanceof (window.jQuery as any)
    ) {
      temp[key] = source[key];
    } else {
      temp[key] = cloneObject(source[key]);
    }
  }
  return temp;
}
