/**
 * Iterates arrays
 */
export default function forEach(
  arr: any[],
  forEachFnc: Function,
  completeFnc?: Function
): void {
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
