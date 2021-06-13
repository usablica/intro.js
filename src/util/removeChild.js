import setStyle from "./setStyle";

/**
 * Removes `element` from `parentElement`
 *
 * @param {Element} element
 * @param {Boolean} [animate=false]
 */
export default function removeChild(element, animate) {
  if (!element || !element.parentElement) return;

  const parentElement = element.parentElement;

  if (animate) {
    setStyle(element, {
      opacity: "0",
    });

    window.setTimeout(() => {
      try {
        // removeChild(..) throws an exception if the child has already been removed (https://developer.mozilla.org/en-US/docs/Web/API/Node/removeChild)
        // this try-catch is added to make sure this function doesn't throw an exception if the child has been removed
        // this scenario can happen when start()/exit() is called multiple times and the helperLayer is removed by the
        // previous exit() call (note: this is a timeout)
        parentElement.removeChild(element);
      } catch (e) {}
    }, 500);
  } else {
    parentElement.removeChild(element);
  }
}
