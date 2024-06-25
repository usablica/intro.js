import * as getOffset from "../../util/getOffset";
import * as getWindowSize from "../../util/getWindowSize";
import { placeTooltip } from "./placeTooltip";

describe("placeTooltip", () => {
  test("should automatically place the tooltip position when there is enough space", () => {
    // Arrange
    jest.spyOn(getOffset, "default").mockReturnValue({
      height: 100,
      width: 100,
      top: 0,
      left: 0,
    });

    jest.spyOn(getWindowSize, "default").mockReturnValue({
      height: 1000,
      width: 1000,
    });

    jest.spyOn(Element.prototype, "getBoundingClientRect").mockReturnValue({
      x: 0,
      y: 0,
      toJSON: jest.fn,
      width: 100,
      height: 100,
      top: 200,
      left: 200,
      bottom: 300,
      right: 300,
    });

    const stepElement = document.createElement("div");
    const tooltipLayer = document.createElement("div");
    const arrowLayer = document.createElement("div");

    // Act
    placeTooltip(
      tooltipLayer,
      arrowLayer,
      stepElement,
      "top",
      ["top", "bottom", "left", "right"],
      false,
      true
    );

    // Assert
    expect(tooltipLayer.className).toBe(
      "introjs-tooltip introjs-top-right-aligned"
    );
  });

  test("should skip auto positioning when autoPosition is false", () => {
    // Arrange
    const stepElement = document.createElement("div");
    const tooltipLayer = document.createElement("div");
    const arrowLayer = document.createElement("div");

    // Act
    placeTooltip(
      tooltipLayer,
      arrowLayer,
      stepElement,
      "top",
      ["top", "bottom"],
      false,
      false
    );

    // Assert
    expect(tooltipLayer.className).toBe("introjs-tooltip introjs-top");
  });

  test("should use floating tooltips when height/width is limited", () => {
    // Arrange
    jest.spyOn(getOffset, "default").mockReturnValue({
      height: 100,
      width: 100,
      top: 0,
      left: 0,
    });

    jest.spyOn(getWindowSize, "default").mockReturnValue({
      height: 100,
      width: 100,
    });

    jest.spyOn(Element.prototype, "getBoundingClientRect").mockReturnValue({
      x: 0,
      y: 0,
      toJSON: jest.fn,
      width: 100,
      height: 100,
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
    });

    const stepElement = document.createElement("div");
    const tooltipLayer = document.createElement("div");
    const arrowLayer = document.createElement("div");

    // Act
    placeTooltip(
      tooltipLayer,
      arrowLayer,
      stepElement,
      "left",
      ["top", "bottom", "left", "right"],
      false,
      true
    );

    // Assert
    expect(tooltipLayer.className).toBe("introjs-tooltip introjs-floating");
  });

  test("should use bottom middle aligned when there is enough vertical space", () => {
    // Arrange
    jest.spyOn(getOffset, "default").mockReturnValue({
      height: 100,
      width: 100,
      top: 0,
      left: 0,
    });

    jest.spyOn(getWindowSize, "default").mockReturnValue({
      height: 500,
      width: 100,
    });

    jest.spyOn(Element.prototype, "getBoundingClientRect").mockReturnValue({
      x: 0,
      y: 0,
      toJSON: jest.fn,
      width: 100,
      height: 100,
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
    });

    const stepElement = document.createElement("div");
    const tooltipLayer = document.createElement("div");
    const arrowLayer = document.createElement("div");

    // Act
    placeTooltip(
      tooltipLayer,
      arrowLayer,
      stepElement,
      "left",
      ["top", "bottom", "left", "right"],
      false,
      true
    );

    // Assert
    expect(tooltipLayer.className).toBe(
      "introjs-tooltip introjs-bottom-middle-aligned"
    );
  });

  test("should attach the global custom tooltip css class", () => {
    // Arrange
    const stepElement = document.createElement("div");
    const tooltipLayer = document.createElement("div");
    const arrowLayer = document.createElement("div");

    // Act
    placeTooltip(
      tooltipLayer,
      arrowLayer,
      stepElement,
      "left",
      ["top", "bottom", "left", "right"],
      false,
      true,
      "newClass"
    );

    // Assert
    expect(tooltipLayer.className).toBe(
      "introjs-tooltip newClass introjs-bottom-middle-aligned"
    );
  });
});
