/**
 * Sets the style of an DOM element
 *
 * @param {Object} element
 * @param {Object|string} style
 * @return null
 */
export default function setStyle(element, style) {
  let cssText = "";

  if (element.style.cssText) {
    cssText += element.style.cssText;
  }

  if (typeof style === "string") {
    cssText += style;
  } else {
    for (const rule in style) {
      cssText += `${rule}:${style[rule]};`;
    }
  }

  element.style.cssText = cssText;
}
