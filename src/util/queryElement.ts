
export const queryElement = (
  selector: string,
  container?: HTMLElement
): HTMLElement | null => {
  return (container ?? document).querySelector(selector);
};

export const queryElements = (
  selector: string,
  container?: HTMLElement
): NodeListOf<HTMLElement> => {
  return (container ?? document).querySelectorAll(selector);
};

export const queryElementByClassName = (
  className: string,
  container?: HTMLElement
): HTMLElement | null => {
  return queryElement(`.${className}`, container);
};

export const queryElementsByClassName = (
  className: string,
  container?: HTMLElement
): NodeListOf<HTMLElement> => {
  return queryElements(`.${className}`, container);
};

export const getElementByClassName = (
  className: string,
  container?: HTMLElement
): HTMLElement => {
  const element = queryElementByClassName(className, container);
  if (!element) {
    throw new Error(`Element with class name ${className} not found`);
  }
  return element;
};