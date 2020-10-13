/**
 * Find the nearest scrollable parent
 * copied from https://stackoverflow.com/questions/35939886/find-first-scrollable-parent
 *
 * @param Element element
 * @return Element
 */
export default function getScrollParent(element) {
  let style = window.getComputedStyle(element);
  const excludeStaticParent = style.position === "absolute";
  const overflowRegex = /(auto|scroll)/;

  if (style.position === "fixed") return document.body;

  for (let parent = element; (parent = parent.parentElement); ) {
    style = window.getComputedStyle(parent);
    if (excludeStaticParent && style.position === "static") {
      continue;
    }
    if (overflowRegex.test(style.overflow + style.overflowY + style.overflowX))
      return parent;
  }

  return document.body;
}
