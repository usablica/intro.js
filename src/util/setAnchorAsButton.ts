/**
 * Setting anchors to behave like buttons
 *
 * @api private
 * @method _setAnchorAsButton
 */
export default function setAnchorAsButton(anchor: HTMLElement) {
  anchor.setAttribute("role", "button");
  anchor.tabIndex = 0;
}
