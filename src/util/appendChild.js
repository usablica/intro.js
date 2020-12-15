import setStyle from "./setStyle";

/**
 * Appends `element` to `parentElement`
 *
 * @param {Element} parentElement
 * @param {Element} element
 * @param {Boolean} [animate=false]
 */
export default function appendChild(parentElement, element, animate) {
  if (animate) {
    const existingOpacity = element.style.opacity || "1";

    setStyle(element, {
      opacity: "0",
    });

    window.setTimeout(() => {
      setStyle(element, {
        opacity: existingOpacity,
      });
    }, 10);
  }

  parentElement.appendChild(element);
}
