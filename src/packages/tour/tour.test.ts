import { getMockPartialSteps } from "./tests/mock";
import { Tour } from "./tour";

describe("Tour", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe("start", () => {
    it("should clean up all event listeners", async () => {
      // Arrange
      const tour = new Tour();
      tour.addSteps(getMockPartialSteps());
      const addEventListenerSpy = jest.spyOn(window, "addEventListener");
      const removeEventListenerSpy = jest.spyOn(window, "removeEventListener");

      // Act
      await tour.start();
      await tour.exit();

      // Assert
      expect(addEventListenerSpy).toBeCalledTimes(2);
      expect(removeEventListenerSpy).toBeCalledTimes(2);
    });

    it("should not enable keyboard navigation and resize when start is false", async () => {
      // Arrange
      const tour = new Tour();
      tour.enableKeyboardNavigation = jest.fn();
      tour.enableRefreshOnResize = jest.fn();

      // Act
      await tour.start();

      // Assert
      expect(tour.enableKeyboardNavigation).not.toBeCalled();
      expect(tour.enableRefreshOnResize).not.toBeCalled();
    });
  });

  describe("enableRefreshOnResize", () => {
    it("should add event listener for resize", () => {
      // Arrange
      const tour = new Tour();
      const addEventListenerSpy = jest.spyOn(window, "addEventListener");

      // Act
      tour.enableRefreshOnResize();

      // Assert
      expect(addEventListenerSpy).toBeCalledWith(
        "resize",
        expect.any(Function),
        true
      );
    });
  });

  describe("disableRefreshOnResize", () => {
    it('should remove event listener for "resize"', () => {
      // Arrange
      const tour = new Tour();
      const removeEventListenerSpy = jest.spyOn(window, "removeEventListener");

      // Act
      tour.enableRefreshOnResize();
      tour.disableRefreshOnResize();

      // Assert
      expect(removeEventListenerSpy).toBeCalledWith(
        "resize",
        expect.any(Function),
        true
      );
    });
  });

  describe("enableKeyboardNavigation", () => {
    it("should not add event listener when keyboard navigation is disabled", () => {
      // Arrange
      const tour = new Tour();
      tour.setOption("keyboardNavigation", false);
      const addEventListenerSpy = jest.spyOn(window, "addEventListener");

      // Act
      tour.enableKeyboardNavigation();

      // Assert
      expect(addEventListenerSpy).not.toBeCalledWith(
        "keydown",
        expect.any(Function),
        true
      );
    });

    it('should add event listener for "keydown"', () => {
      // Arrange
      const tour = new Tour();
      const addEventListenerSpy = jest.spyOn(window, "addEventListener");

      // Act
      tour.enableKeyboardNavigation();

      // Assert
      expect(addEventListenerSpy).toBeCalledWith(
        "keydown",
        expect.any(Function),
        true
      );
    });
  });

  describe("disableKeyboardNavigation", () => {
    it('should remove event listener for "keydown"', () => {
      // Arrange
      const tour = new Tour();
      const removeEventListenerSpy = jest.spyOn(window, "removeEventListener");

      // Act
      tour.enableKeyboardNavigation();
      tour.disableKeyboardNavigation();

      // Assert
      expect(removeEventListenerSpy).toBeCalledWith(
        "keydown",
        expect.any(Function),
        true
      );
    });
  });
});
