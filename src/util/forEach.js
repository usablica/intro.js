/**
 * Iterates arrays
 *
 * @param {Array} arr
 * @param {Function} forEachFnc
 * @param {Function} [completeFnc]
 * @return {Null}
 */
export default function forEach(arr, forEachFnc, completeFnc) {
  // in case arr is an empty query selector node list
  if (arr) {
    for (let i = 0, len = arr.length; i < len; i++) {
      forEachFnc(arr[i], i);
    }
  }

  if (typeof completeFnc === "function") {
    completeFnc();
  }
}
