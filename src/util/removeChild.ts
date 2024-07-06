import setStyle from "./setStyle";

/**
 * Removes `element` from `parentElement`
 */
export const removeChild = (element: HTMLElement | null) => {
  if (!element || !element.parentElement) return;

  element.parentElement.removeChild(element);
};

export const removeAnimatedChild = async (element: HTMLElement | null) => {
  if (!element) return;

  setStyle(element, {
    opacity: "0",
  });

  return new Promise<void>((resolve) => {
    setTimeout(() => {
      try {
        // removeChild(..) throws an exception if the child has already been removed (https://developer.mozilla.org/en-US/docs/Web/API/Node/removeChild)
        // this try-catch is added to make sure this function doesn't throw an exception if the child has been removed
        // this scenario can happen when start()/exit() is called multiple times and the helperLayer is removed by the
        // previous exit() call (note: this is a timeout)
        removeChild(element);
      } catch (e) {
      } finally {
        resolve();
      }
    }, 500);
  });
};
