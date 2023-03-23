import forEach from "../util/forEach";
import removeClass from "../util/removeClass";

/**
 * To remove all show element(s)
 *
 * @api private
 */
export default function removeShowElement() {
  const elms = Array.from(document.querySelectorAll(".introjs-showElement"));

  forEach(elms, (elm) => {
    removeClass(elm, /introjs-[a-zA-Z]+/g);
  });
}
