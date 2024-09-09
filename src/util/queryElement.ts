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

export const queryElementsByClassName = (
  className: string,
  container?: HTMLElement | null
): NodeListOf<HTMLElement> => {
  return queryElements(`.${className}`, container);
};

export const getElement = (
  selector: string,
  container?: HTMLElement | null
) => {
  const element = queryElement(selector, container);

  if (!element) {
    throw new Error(`Element with selector ${selector} not found`);
  }

  return element;
};
