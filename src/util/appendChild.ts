import setStyle from "./setStyle";

/**
 * Appends `element` to `parentElement`
 */
export default function appendChild(
  parentElement: HTMLElement,
  element: HTMLElement,
  animate: boolean = false
) {
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
