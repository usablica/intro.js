/**
 * Find the nearest scrollable parent
 * copied from https://stackoverflow.com/questions/35939886/find-first-scrollable-parent
 *
 * @return Element
 * @param element
 */
export default function getScrollParent(element: HTMLElement): HTMLElement {
  let style = window.getComputedStyle(element);
  const excludeStaticParent = style.position === "absolute";
  const overflowRegex = /(auto|scroll)/;

  if (style.position === "fixed") return document.body;

  for (let parent = element; (parent = parent.parentElement as HTMLElement); ) {
    style = window.getComputedStyle(parent);
    if (excludeStaticParent && style.position === "static") {
      continue;
    }
    if (overflowRegex.test(style.overflow + style.overflowY + style.overflowX))
      return parent as HTMLElement;
  }

  return document.body as HTMLElement;
}
