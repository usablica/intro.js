export const queryElement = (
  selector: string,
  container?: HTMLElement | null
): HTMLElement | null => {
  return (container ?? document).querySelector(selector);
};

export const queryElements = (
  selector: string,
  container?: HTMLElement | null
): NodeListOf<HTMLElement> => {
  return (container ?? document).querySelectorAll(selector);
};

export const queryElementByClassName = (
  className: string,
  container?: HTMLElement | null
): HTMLElement | null => {
  return queryElement(`.${className}`, container);
};

export const queryElementsByClassName = (
  className: string,
  container?: HTMLElement | null
): NodeListOf<HTMLElement> => {
  return queryElements(`.${className}`, container);
};

export const getElementByClassName = (
  className: string,
  container?: HTMLElement | null
): HTMLElement => {
  const element = queryElementByClassName(className, container);
  if (!element) {
    throw new Error(`Element with class name ${className} not found`);
  }
  return element;
};
