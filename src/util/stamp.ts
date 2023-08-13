/**
 * Mark any object with an incrementing number
 * used for keeping track of objects
 *
 * @param Object obj   Any object or DOM Element
 * @param String key
 * @return Object
 */
const stamp = (() => {
  const keys: {
    [key: string]: number;
  } = {};
  return function stamp<T>(obj: T, key = "introjs-stamp"): number {
    // each group increments from 0
    keys[key] = keys[key] || 0;

    // stamp only once per object
    // @ts-ignore
    if (obj[key] === undefined) {
      // increment key for each new object
      // @ts-ignore
      obj[key] = keys[key]++;
    }

    // @ts-ignore
    return obj[key];
  };
})();

export default stamp;
