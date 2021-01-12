import setStyle from "./setStyle";

/**
 * Removes `element` from `parentElement`
 */
export default function removeChild(element: HTMLElement, animate: boolean = false) {
  if (!element || !element.parentElement) return;

  const parentElement = element.parentElement;

  if (animate) {
    setStyle(element, {
      opacity: "0",
    });

    window.setTimeout(() => {
      parentElement.removeChild(element);
    }, 500);
  } else {
    parentElement.removeChild(element);
  }
}
