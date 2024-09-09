import { determineAutoPosition, TooltipPosition } from "./tooltipPosition";

const positionPrecedence: TooltipPosition[] = [
  "bottom",
  "top",
  "right",
  "left",
];

describe("placeTooltip", () => {
  test("should automatically place the tooltip position when there is enough space", () => {
    // Arrange
    // Act
    const position = determineAutoPosition(
      positionPrecedence,
      {
        top: 200,
        left: 200,
        height: 100,
        width: 100,
        right: 300,
        bottom: 300,
        absoluteTop: 200,
        absoluteLeft: 200,
        absoluteRight: 300,
        absoluteBottom: 300,
      },
      100,
      100,
      "top",
      { height: 1000, width: 1000 }
    );

    // Assert
    expect(position).toBe("top-right-aligned");
  });

  test("should use floating tooltips when height/width is limited", () => {
    // Arrange
    // Act
    const position = determineAutoPosition(
      positionPrecedence,
      {
        top: 0,
        left: 0,
        height: 100,
        width: 100,
        right: 0,
        bottom: 0,
        absoluteTop: 0,
        absoluteLeft: 0,
        absoluteRight: 0,
        absoluteBottom: 0,
      },
      100,
      100,
      "top",
      { height: 100, width: 100 }
    );

    // Assert
    expect(position).toBe("floating");
  });

  test("should use bottom middle aligned when there is enough vertical space", () => {
    // Arrange
    // Act
    const position = determineAutoPosition(
      positionPrecedence,
      {
        top: 0,
        left: 0,
        height: 100,
        width: 100,
        right: 0,
        bottom: 0,
        absoluteTop: 0,
        absoluteLeft: 0,
        absoluteRight: 0,
        absoluteBottom: 0,
      },
      100,
      100,
      "left",
      { height: 500, width: 100 }
    );

    // Assert
    expect(position).toBe("bottom-middle-aligned");
  });
});
