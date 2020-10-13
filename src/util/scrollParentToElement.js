/**
 * scroll a scrollable element to a child element
 *
 * @param Element parent
 * @param Element element
 * @return Null
 */
export default function scrollParentToElement(parent, { offsetTop }) {
  parent.scrollTop = offsetTop - parent.offsetTop;
}
