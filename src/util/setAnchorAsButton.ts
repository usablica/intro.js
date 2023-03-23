/**
 * Setting anchors to behave like buttons
 *
 * @api private
 */
export default function setAnchorAsButton(anchor: HTMLElement) {
  anchor.setAttribute("role", "button");
  anchor.tabIndex = 0;
}
