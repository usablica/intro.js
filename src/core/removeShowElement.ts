import removeClass from "../util/removeClass";

/**
 * To remove all show element(s)
 *
 * @api private
 */
export default function removeShowElement() {
  const elms = Array.from(
    document.querySelectorAll<HTMLElement>(".introjs-showElement")
  );

  for (const elm of elms) {
    removeClass(elm, /introjs-[a-zA-Z]+/g);
  }
}
