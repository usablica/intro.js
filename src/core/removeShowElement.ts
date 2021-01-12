import forEach from "../util/forEach";
import removeClass from "../util/removeClass";

/**
 * To remove all show element(s)
 *
 * @api private
 * @method _removeShowElement
 */
export default function removeShowElement() {
  const elms = document.querySelectorAll(".introjs-showElement");

  forEach(elms, (elm) => {
    removeClass(elm, /introjs-[a-zA-Z]+/g);
  });
}
