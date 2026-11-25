import { setPositionRelativeTo } from "./positionRelativeTo";
import { getBoundingClientRectSpy } from "../../tests/jest/helper";
import dom from "../packages/dom";

const { div } = dom.tags;

describe("setPositionRelativeTo", () => {
  it("should return if helperLayer or currentStep is null", () => {
    // Act
    const result = setPositionRelativeTo(
      null as unknown as HTMLElement,
      null as unknown as HTMLElement,
      null as unknown as HTMLElement,
      10
    );

    // Assert
    expect(result).toBeUndefined();
  });

  it("should set the correct width, height, top, left", () => {
    // Arrange
    const stepElement = div();
    stepElement.getBoundingClientRect = getBoundingClientRectSpy(
      200,
      100,
      10,
      50,
      100,
      100
    );

    const helperLayer = div();
    helperLayer.getBoundingClientRect = getBoundingClientRectSpy(
      500,
      500,
      5,
      10,
      15,
      20
    );

    // Act
    setPositionRelativeTo(document.body, helperLayer, stepElement, 10);

    // Assert
    expect(helperLayer.style.width).toBe("210px");
    expect(helperLayer.style.height).toBe("110px");
    expect(helperLayer.style.top).toBe("5px");
    expect(helperLayer.style.left).toBe("45px");
  });

  it("should add fixedTooltip if element is fixed", () => {
    // Arrange
    const stepElementParent = div();
    const stepElement = div();
    stepElement.style.position = "fixed";
    stepElementParent.appendChild(stepElement);

    const helperLayer = div();

    // Act
    setPositionRelativeTo(stepElementParent, helperLayer, stepElement, 10);

    // Assert
    expect(helperLayer.className).toBe("introjs-fixedTooltip");
  });

  it("should remove the fixedTooltip className if element is not fixed", () => {
    // Arrange
    const stepElement = div();
    stepElement.style.position = "absolute";

    const helperLayer = div();
    helperLayer.className = "introjs-fixedTooltip";

    // Act
    setPositionRelativeTo(document.body, helperLayer, stepElement, 10);

    // Assert
    expect(helperLayer.className).not.toBe("introjs-fixedTooltip");
  });

  describe("at the edges of the page", () => {
    beforeEach(() => {
      Object.defineProperty(document.documentElement, "clientWidth", {
        value: 400,
        configurable: true,
      });
    });

    afterEach(() => {
      delete (document.documentElement as { clientWidth?: number }).clientWidth;
    });

    it("doesn't let the padding stick out on the right", () => {
      // a 100px wide target that ends at the right edge of the page
      const stepElement = div();
      stepElement.getBoundingClientRect = getBoundingClientRectSpy(
        100,
        40,
        50,
        300,
        90,
        400
      );
      const helperLayer = div();

      setPositionRelativeTo(document.body, helperLayer, stepElement, 10);

      expect(helperLayer.style.left).toBe("295px");
      // 300 + 100 = 400: the padding is cut on the right only
      expect(helperLayer.style.width).toBe("105px");
      expect(helperLayer.style.top).toBe("45px");
      expect(helperLayer.style.height).toBe("50px");
    });

    it("doesn't let the padding stick out on the left and at the top", () => {
      const stepElement = div();
      stepElement.getBoundingClientRect = getBoundingClientRectSpy(
        100,
        40,
        0,
        0,
        40,
        100
      );
      const helperLayer = div();

      setPositionRelativeTo(document.body, helperLayer, stepElement, 10);

      expect(helperLayer.style.left).toBe("0px");
      expect(helperLayer.style.top).toBe("0px");
      expect(helperLayer.style.width).toBe("105px");
      expect(helperLayer.style.height).toBe("45px");
    });

    it("keeps the padding of a target that is wider than the page", () => {
      // the page scrolls sideways anyway
      const stepElement = div();
      stepElement.getBoundingClientRect = getBoundingClientRectSpy(
        600,
        40,
        50,
        100,
        90,
        700
      );
      const helperLayer = div();

      setPositionRelativeTo(document.body, helperLayer, stepElement, 10);

      expect(helperLayer.style.left).toBe("95px");
      expect(helperLayer.style.width).toBe("610px");
    });

    it("keeps the padding inside a positioned container", () => {
      const container = div();
      container.style.position = "relative";
      document.body.appendChild(container);
      const stepElement = div();
      stepElement.getBoundingClientRect = getBoundingClientRectSpy(
        100,
        40,
        0,
        0,
        40,
        100
      );
      container.getBoundingClientRect = getBoundingClientRectSpy(
        400,
        400,
        0,
        0,
        400,
        400
      );
      const helperLayer = div();

      setPositionRelativeTo(container, helperLayer, stepElement, 10);

      expect(helperLayer.style.left).toBe("-5px");
      expect(helperLayer.style.width).toBe("110px");
      container.remove();
    });
  });

  it("highlights only the part of the target its scroll container shows", () => {
    // a 200 x 100 container at (0, 0), its target scrolled half out of it
    const container = div();
    container.style.overflowX = "auto";
    container.style.overflowY = "auto";
    Object.defineProperty(container, "clientWidth", { value: 200 });
    Object.defineProperty(container, "clientHeight", { value: 100 });
    container.getBoundingClientRect = () => new DOMRect(0, 0, 200, 100);
    document.body.appendChild(container);

    const stepElement = div();
    container.appendChild(stepElement);
    stepElement.getBoundingClientRect = () => new DOMRect(150, 20, 100, 40);
    const helperLayer = div();

    setPositionRelativeTo(document.body, helperLayer, stepElement, 10);

    // 150 - 5 .. 200: no padding on the side the container cuts off
    expect(helperLayer.style.left).toBe("145px");
    expect(helperLayer.style.width).toBe("55px");
    expect(helperLayer.style.top).toBe("15px");
    expect(helperLayer.style.height).toBe("50px");
    container.remove();
  });
});
