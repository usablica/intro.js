/*
 * makes a copy of the object
 * @api private
 * @method _cloneObject
 */
export default function cloneObject(object) {
  if (
    object === null ||
    typeof object !== "object" ||
    typeof object.nodeType !== "undefined"
  ) {
    return object;
  }
  const temp = {};
  for (const key in object) {
    if (
      typeof window.jQuery !== "undefined" &&
      object[key] instanceof window.jQuery
    ) {
      temp[key] = object[key];
    } else {
      temp[key] = cloneObject(object[key]);
    }
  }
  return temp;
}
