import isClippedByContainers from "./isClippedByContainers";

const setSize = (element: Element, prop: string, value: unknown) =>
  Object.defineProperty(element, prop, { value, configurable: true });

// jsdom has no layout: a 300 x 100 container at (50, 50)
const container = (overflow: string, parent: HTMLElement = document.body) => {
  const box = document.createElement("div");
  box.style.overflowX = overflow;
  box.style.overflowY = overflow;
  parent.appendChild(box);
  setSize(box, "clientWidth", 300);
  setSize(box, "clientHeight", 100);
  box.getBoundingClientRect = () => new DOMRect(50, 50, 300, 100);
  return box;
};

describe("isClippedByContainers", () => {
  let target: HTMLElement;

  beforeEach(() => {
    document.body.innerHTML = "";
    target = document.createElement("div");
  });

  test("is false for a point inside the container", () => {
    container("auto").appendChild(target);

    expect(isClippedByContainers(target, 100, 80)).toBe(false);
  });

  test("is true for a point the container has scrolled away", () => {
    container("auto").appendChild(target);

    expect(isClippedByContainers(target, 500, 80)).toBe(true);
    expect(isClippedByContainers(target, 100, 300)).toBe(true);
    expect(isClippedByContainers(target, 10, 80)).toBe(true);
  });

  test("counts containers that hide their overflow", () => {
    container("hidden").appendChild(target);

    expect(isClippedByContainers(target, 500, 80)).toBe(true);
  });

  test("ignores elements that don't clip", () => {
    container("visible").appendChild(target);

    expect(isClippedByContainers(target, 500, 80)).toBe(false);
  });

  test("checks every container around the element", () => {
    const outer = container("auto");
    const inner = document.createElement("div");
    outer.appendChild(inner);
    inner.appendChild(target);

    expect(isClippedByContainers(target, 500, 80)).toBe(true);
  });

  test("ignores the page", () => {
    document.body.appendChild(target);

    expect(isClippedByContainers(target, 5000, 5000)).toBe(false);
  });
});
