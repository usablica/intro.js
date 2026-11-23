import scrollTo from "./scrollTo";

const place = (element: HTMLElement, left: number, width: number) => {
  element.getBoundingClientRect = () => new DOMRect(left, 100, width, 40);
};

describe("scrollTo", () => {
  let target: HTMLElement;
  let tooltipLayer: HTMLElement;

  beforeEach(() => {
    document.body.innerHTML = "";
    target = document.createElement("div");
    tooltipLayer = document.createElement("div");
    document.body.append(target, tooltipLayer);
    target.scrollIntoView = jest.fn();
    tooltipLayer.scrollIntoView = jest.fn();
    window.scrollBy = jest.fn();

    // a 393px wide screen panned 248px to the right on a wider page
    Object.defineProperty(window, "visualViewport", {
      value: { offsetLeft: 248, offsetTop: 0, width: 393, height: 800 },
      configurable: true,
    });
  });

  afterEach(() => {
    delete (window as { visualViewport?: unknown }).visualViewport;
  });

  test("pans a panned mobile page back to the element", () => {
    place(target, 20, 100);

    scrollTo(true, "element", 30, target, tooltipLayer);

    expect(target.scrollIntoView).toHaveBeenCalledWith({
      block: "nearest",
      inline: "nearest",
    });
    // the margin is only set while scrolling
    expect(target.style.scrollMargin).toBe("");
  });

  test("doesn't pan when the element is visible", () => {
    place(target, 300, 100);

    scrollTo(true, "element", 30, target, tooltipLayer);

    expect(target.scrollIntoView).not.toHaveBeenCalled();
  });

  test("pans to the tooltip with scrollTo: tooltip", () => {
    place(target, 300, 100);
    place(tooltipLayer, 700, 100);

    scrollTo(true, "tooltip", 30, target, tooltipLayer);

    expect(tooltipLayer.scrollIntoView).toHaveBeenCalled();
    expect(target.scrollIntoView).not.toHaveBeenCalled();
  });

  test("doesn't scroll at all when scrolling is off", () => {
    place(target, 20, 100);

    scrollTo(true, "off", 30, target, tooltipLayer);
    scrollTo(false, "element", 30, target, tooltipLayer);

    expect(target.scrollIntoView).not.toHaveBeenCalled();
    expect(window.scrollBy).not.toHaveBeenCalled();
  });
});
