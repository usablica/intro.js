import { queryElementsByClassName } from "src/util/queryElement";
import { removeClass } from "../../util/className";
import { showElementClassName } from "./classNames";

/**
 * To remove all show element(s)
 *
 * @api private
 */
export default function removeShowElement() {
  const elms = Array.from(queryElementsByClassName(showElementClassName));

  for (const elm of elms) {
    removeClass(elm, /introjs-[a-zA-Z]+/g);
  }
}
