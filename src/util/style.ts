/**
 * Converts a style object to a css text
 * @param style style object
 * @returns css text
 */
export const style = (style: { [key: string]: string | number }): string => {
  let cssText = "";

  for (const rule in style) {
    cssText += `${rule}:${style[rule]};`;
  }

  return cssText;
};

/**
 * Sets the style of an DOM element
 */
export default function setStyle(
  element: HTMLElement,
  styles: string | { [key: string]: string | number }
) {
  let cssText = "";

  if (element.style.cssText) {
    cssText += element.style.cssText;
  }

  if (typeof styles === "string") {
    cssText += styles;
  } else {
    cssText += style(styles);
  }

  element.style.cssText = cssText;
}
