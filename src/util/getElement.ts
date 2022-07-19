/**
 * Get a DOM element for ts
 *
 * @return HTMLElement
 * @param element
 * @param tagname
 */
export default function _getElement(
  element: Document | HTMLElement | Element,
  tagname: string
): HTMLElement | null {
  return element.querySelector(tagname) as HTMLElement;
}
