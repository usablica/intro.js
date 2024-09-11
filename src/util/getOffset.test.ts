import getOffset from "./getOffset";
import dom from "../packages/dom";

const { div } = dom.tags;

const mockBoundingClientRect = (
  element: HTMLElement,
  domRect: Partial<DOMRect>
) => {
  const getBoundingClientRectSpy = jest.fn(() => {
    const rect: DOMRect = {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      toJSON: () => null,
      ...domRect,
    };
    return rect;
  });
  element.getBoundingClientRect = getBoundingClientRectSpy;

  return element;
};

describe("getOffset", () => {
  afterEach(() => {
    document.body.innerHTML = "";
    document.body.scrollTop = 0;
    document.body.scrollLeft;
  });

  it("should return the correct offset without scroll", () => {
    // Arrange
    const element = mockBoundingClientRect(div(), {
      top: 100,
      left: 10,
      bottom: 350,
      right: 50,
      height: 250,
    });
    document.body.appendChild(element);

    // Act
    const result = getOffset(element);

    // Assert
    expect(result).toEqual({
      absoluteBottom: 350,
      absoluteLeft: 10,
      absoluteRight: 50,
      absoluteTop: 100,
      bottom: 350,
      height: 250,
      left: 10,
      right: 10,
      top: 100,
      width: 0,
    });
  });

  it("should return the correct offset with scrollTop", () => {
    // Arrange
    const element = mockBoundingClientRect(div(), {
      top: 100,
      left: 10,
      bottom: 350,
      right: 50,
      height: 250,
    });
    document.body.scrollTop = 150;
    document.body.appendChild(element);

    // Act
    const result = getOffset(element);

    // Assert
    expect(result).toEqual({
      absoluteBottom: 350,
      absoluteLeft: 10,
      absoluteRight: 50,
      absoluteTop: 100,
      bottom: 500,
      height: 250,
      left: 10,
      right: 10,
      top: 250,
      width: 0,
    });
  });

  it("should ignore scroll values when element is fixed", () => {
    // Arrange
    const element = mockBoundingClientRect(
      div({
        style: "position: fixed",
      }),
      {
        top: 100,
        left: 10,
        bottom: 350,
        right: 50,
        height: 250,
      }
    );
    document.body.scrollTop = 150;
    document.body.scrollLeft = 100;
    document.body.appendChild(element);

    // Act
    const result = getOffset(element);

    // Assert
    expect(result).toEqual({
      absoluteBottom: 350,
      absoluteLeft: 10,
      absoluteRight: 50,
      absoluteTop: 100,
      bottom: 350,
      height: 250,
      left: 10,
      right: 10,
      top: 100,
      width: 0,
    });
  });

  it("should return position relative to a relative element", () => {
    // Given
    const relativeElement = mockBoundingClientRect(
      div({
        style: "position: relative",
      }),
      {
        top: 100,
        left: 10,
        bottom: 700,
        right: 50,
        height: 550,
      }
    );

    const element = mockBoundingClientRect(div(), {
      top: 150,
      left: 30,
      bottom: 350,
      right: 150,
      height: 250,
    });

    relativeElement.appendChild(element);

    // When
    const result = getOffset(element, relativeElement);

    // Then
    expect(result).toEqual({
      absoluteBottom: 350,
      absoluteLeft: 30,
      absoluteRight: 150,
      absoluteTop: 150,
      bottom: 300,
      height: 250,
      left: 20,
      right: 20,
      top: 50,
      width: 0,
    });
  });

  it("should return position relative to a sticky element", () => {
    // Given
    const relativeElement = mockBoundingClientRect(
      div({
        style: "position: sticky",
      }),
      {
        top: 100,
        left: 10,
        bottom: 700,
        right: 50,
        height: 550,
      }
    );

    const element = mockBoundingClientRect(div(), {
      top: 150,
      left: 30,
      bottom: 350,
      right: 150,
      height: 250,
    });

    relativeElement.appendChild(element);

    // When
    const result = getOffset(element, relativeElement);

    // Then
    expect(result).toEqual({
      absoluteBottom: 350,
      absoluteLeft: 30,
      absoluteRight: 150,
      absoluteTop: 150,
      bottom: 300,
      height: 250,
      left: 20,
      right: 20,
      top: 50,
      width: 0,
    });
  });
});
