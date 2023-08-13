import _createElement from "../../../src/util/createElement";
import elementInViewport from "../../../src/util/elementInViewport";

describe("elementInViewport", () => {
  test("should return true when element is in viewport", () => {
    // Arrange
    const getBoundingClientRectSpy = jest.fn(
      () =>
        ({
          top: 100,
          left: 10,
          bottom: 100,
          right: 50,
        } as DOMRect)
    );
    const elm = _createElement("div");
    elm.getBoundingClientRect = getBoundingClientRectSpy;

    // Act
    const isInViewport = elementInViewport(elm);

    // Assert
    expect(isInViewport).toBeTrue();
  });

  test("should return false when element left is not in viewport", () => {
    // Arrange
    const getBoundingClientRectSpy = jest.fn(
      () =>
        ({
          top: -100,
          left: 10,
          bottom: 100,
          right: 50,
        } as DOMRect)
    );
    const elm = _createElement("div");
    elm.getBoundingClientRect = getBoundingClientRectSpy;

    // Act
    const isInViewport = elementInViewport(elm);

    // Assert
    expect(isInViewport).toBeFalse();
  });

  test("should return false when element right is not in viewport", () => {
    // Arrange
    const getBoundingClientRectSpy = jest.fn(
      () =>
        ({
          top: 100,
          left: 10,
          bottom: 100,
          right: window.innerWidth + 50,
        } as DOMRect)
    );
    const elm = _createElement("div");
    elm.getBoundingClientRect = getBoundingClientRectSpy;

    // Act
    const isInViewport = elementInViewport(elm);

    // Assert
    expect(isInViewport).toBeFalse();
  });

  test("should return false when element top is not in viewport", () => {
    // Arrange
    const getBoundingClientRectSpy = jest.fn(
      () =>
        ({
          top: -100,
          left: 10,
          bottom: 100,
          right: 50,
        } as DOMRect)
    );
    const elm = _createElement("div");
    elm.getBoundingClientRect = getBoundingClientRectSpy;

    // Act
    const isInViewport = elementInViewport(elm);

    // Assert
    expect(isInViewport).toBeFalse();
  });

  test("should return false when element bottom is not in viewport", () => {
    // Arrange
    const getBoundingClientRectSpy = jest.fn(
      () =>
        ({
          top: 100,
          left: 10,
          bottom: window.innerHeight + 5,
          right: 50,
        } as DOMRect)
    );
    const elm = _createElement("div");
    elm.getBoundingClientRect = getBoundingClientRectSpy;

    // Act
    const isInViewport = elementInViewport(elm);

    // Assert
    expect(isInViewport).toBeFalse();
  });
});
