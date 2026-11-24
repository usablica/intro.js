import scrollTo, { scrollTooltipIntoView } from "./scrollTo";

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

  describe("scrollTooltipIntoView", () => {
    const placeVertically = (element: HTMLElement, top: number) => {
      element.getBoundingClientRect = () => new DOMRect(300, top, 200, 150);
    };

    test("scrolls a tooltip below the screen into view", () => {
      // the visible part ends at 800
      placeVertically(tooltipLayer, 700);

      scrollTooltipIntoView(true, "element", 30, tooltipLayer);

      expect(tooltipLayer.scrollIntoView).toHaveBeenCalledWith({
        block: "nearest",
        inline: "nearest",
      });
    });

    test("scrolls a tooltip above the screen into view", () => {
      placeVertically(tooltipLayer, -40);

      scrollTooltipIntoView(true, "element", 30, tooltipLayer);

      expect(tooltipLayer.scrollIntoView).toHaveBeenCalled();
    });

    test("leaves a visible tooltip alone", () => {
      placeVertically(tooltipLayer, 100);

      scrollTooltipIntoView(true, "element", 30, tooltipLayer);

      expect(tooltipLayer.scrollIntoView).not.toHaveBeenCalled();
    });

    test("doesn't scroll when scrolling is off", () => {
      placeVertically(tooltipLayer, 700);

      scrollTooltipIntoView(true, "off", 30, tooltipLayer);
      scrollTooltipIntoView(false, "element", 30, tooltipLayer);

      expect(tooltipLayer.scrollIntoView).not.toHaveBeenCalled();
    });
  });

  describe("with a tooltip fixed to the screen", () => {
    const bar = () => {
      // a bar over the bottom 150px of an 800px high screen
      tooltipLayer.style.position = "fixed";
      tooltipLayer.getBoundingClientRect = () => new DOMRect(0, 650, 393, 150);
    };

    test("scrolls the target out from under it", () => {
      bar();
      target.getBoundingClientRect = () => new DOMRect(100, 700, 100, 40);

      scrollTooltipIntoView(true, "element", 30, tooltipLayer, target);

      // the bottom of the target 30px above the bar: 740 - 650 + 30
      expect(window.scrollBy).toHaveBeenCalledWith(0, 120);
    });

    test("doesn't scroll the top of a tall target off the screen", () => {
      bar();
      target.getBoundingClientRect = () => new DOMRect(100, 100, 100, 700);

      scrollTooltipIntoView(true, "element", 30, tooltipLayer, target);

      expect(window.scrollBy).toHaveBeenCalledWith(0, 70);
    });

    test("leaves a target above it alone", () => {
      bar();
      target.getBoundingClientRect = () => new DOMRect(100, 300, 100, 40);

      scrollTooltipIntoView(true, "element", 30, tooltipLayer, target);

      expect(window.scrollBy).not.toHaveBeenCalled();
    });
  });
});
