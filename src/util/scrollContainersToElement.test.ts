import scrollContainersToElement from "./scrollContainersToElement";

const setSize = (element: Element, prop: string, value: unknown) =>
  Object.defineProperty(element, prop, { value, configurable: true });

// jsdom has no layout: a 300 x 100 scroll container at (0, 0) whose content
// is 1000 x 1000, and a target that the test places inside the content
const setup = (overflow = "auto") => {
  const container = document.createElement("div");
  container.style.overflowX = overflow;
  container.style.overflowY = overflow;
  const target = document.createElement("div");
  container.appendChild(target);
  document.body.appendChild(container);

  // jsdom doesn't scroll: keep the scroll position ourselves
  const scroll = { left: 0, top: 0 };
  Object.defineProperty(container, "scrollLeft", {
    get: () => scroll.left,
    set: (value: number) => (scroll.left = value),
    configurable: true,
  });
  Object.defineProperty(container, "scrollTop", {
    get: () => scroll.top,
    set: (value: number) => (scroll.top = value),
    configurable: true,
  });

  setSize(container, "clientWidth", 300);
  setSize(container, "clientHeight", 100);
  setSize(container, "scrollWidth", 1000);
  setSize(container, "scrollHeight", 1000);
  container.getBoundingClientRect = () => new DOMRect(0, 0, 300, 100);

  // the target is at (x, y) of the content: where it shows depends on the
  // scroll position of the container
  const place = (x: number, y: number, width = 100, height = 40) => {
    target.getBoundingClientRect = () =>
      new DOMRect(
        x - container.scrollLeft,
        y - container.scrollTop,
        width,
        height
      );
  };

  return { container, target, place };
};

describe("scrollContainersToElement", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  test("scrolls a container sideways to an element right of the view", () => {
    const { container, target, place } = setup();
    place(500, 20);

    scrollContainersToElement(true, target);

    // the right edge of the element 10px inside: 600 - 300 + 10
    expect(container.scrollLeft).toBe(310);
    expect(container.scrollTop).toBe(0);
  });

  test("scrolls a container down to an element below the view", () => {
    const { container, target, place } = setup();
    place(20, 400);

    scrollContainersToElement(true, target);

    // 440 - 100 + 10
    expect(container.scrollTop).toBe(350);
    expect(container.scrollLeft).toBe(0);
  });

  test("scrolls back to an element left of the view", () => {
    const { container, target, place } = setup();
    container.scrollLeft = 400;
    place(100, 20);

    scrollContainersToElement(true, target);

    expect(container.scrollLeft).toBe(90);
  });

  test("keeps the start of an element larger than the view in view", () => {
    const { container, target, place } = setup();
    place(500, 20, 600);

    scrollContainersToElement(true, target);

    expect(container.scrollLeft).toBe(490);
  });

  test("leaves a container alone when the element is already visible", () => {
    const { container, target, place } = setup();
    place(50, 20);

    scrollContainersToElement(true, target);

    expect(container.scrollLeft).toBe(0);
    expect(container.scrollTop).toBe(0);
  });

  test("doesn't scroll containers that hide their overflow", () => {
    const { container, target, place } = setup("hidden");
    place(500, 400);

    scrollContainersToElement(true, target);

    expect(container.scrollLeft).toBe(0);
    expect(container.scrollTop).toBe(0);
  });

  test("doesn't scroll when scrolling is off", () => {
    const { container, target, place } = setup();
    place(500, 400);

    scrollContainersToElement(false, target);

    expect(container.scrollLeft).toBe(0);
    expect(container.scrollTop).toBe(0);
  });
});
