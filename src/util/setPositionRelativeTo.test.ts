import { setPositionRelativeTo } from "./setPositionRelativeTo";
import createElement from "./createElement";
import { getBoundingClientRectSpy } from "../../cypress/helper";

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
    const stepElement = createElement("div");
    stepElement.getBoundingClientRect = getBoundingClientRectSpy(
      200,
      100,
      10,
      50,
      100,
      100
    );

    const helperLayer = createElement("div");
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
    const stepElementParent = createElement("div");
    const stepElement = createElement("div");
    stepElement.style.position = "fixed";
    stepElementParent.appendChild(stepElement);

    const helperLayer = createElement("div");

    // Act
    setPositionRelativeTo(stepElementParent, helperLayer, stepElement, 10);

    // Assert
    expect(helperLayer.className).toBe("introjs-fixedTooltip");
  });

  it("should remove the fixedTooltip className if element is not fixed", () => {
    // Arrange
    const stepElement = createElement("div");
    stepElement.style.position = "absolute";

    const helperLayer = createElement("div");
    helperLayer.className = "introjs-fixedTooltip";

    // Act
    setPositionRelativeTo(document.body, helperLayer, stepElement, 10);

    // Assert
    expect(helperLayer.className).not.toBe("introjs-fixedTooltip");
  });
});
