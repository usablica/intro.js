/**
 * Overwrites obj1's values with obj2's and adds obj2's if non existent in obj1
 * via: http://stackoverflow.com/questions/171251/how-can-i-merge-properties-of-two-javascript-objects-dynamically
 *
 * @param obj1
 * @param obj2
 * @returns obj3 a new object based on obj1 and obj2
 */

export default function mergeOptions(obj1, obj2) {
  const obj3 = {};
  let attrname;
  for (attrname in obj1) {
    obj3[attrname] = obj1[attrname];
  }
  for (attrname in obj2) {
    obj3[attrname] = obj2[attrname];
  }
  return obj3;
}
