import {
  appendDummyElement,
  className,
  content,
  doneButton,
  find,
  nextButton,
  prevButton,
  skipButton,
  tooltipText,
} from "../../../tests/jest/helper";
import * as dontShowAgain from "./dontShowAgain";
import { getMockPartialSteps } from "./tests/mock";
import { Tour } from "./tour";

describe("Tour", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe("constructor", () => {
    test("should set the targetElement to document.body", () => {
      // Arrange & Act
      const tour = new Tour();

      // Assert
      expect(tour.getTargetElement()).toBe(document.body);
    });

    test("should set the correct targetElement", () => {
      // Arrange
      const stubTargetElement = document.createElement("div");

      // Act
      const tour = new Tour(stubTargetElement);

      // Assert
      expect(tour.getTargetElement()).toBe(stubTargetElement);
    });
  });

  describe("start", () => {
    test("should start floating intro with one step", async () => {
      // Arrange & Act
      const tour = new Tour();
      await tour
        .setOptions({
          steps: [
            {
              intro: "hello world",
            },
          ],
        })
        .start();

      // Assert
      expect(content(tooltipText())).toBe("hello world");
      expect(content(doneButton())).toBe("Done");
      expect(prevButton()).toBeNull();
      expect(className(".introjs-showElement")).toContain(
        "introjsFloatingElement"
      );
      expect(className(".introjs-showElement")).toContain(
        "introjs-relativePosition"
      );

      // Cleanup
      await tour.exit();
    });

    test("should start floating intro with two steps", async () => {
      // Arrange
      const tour = new Tour();

      // Act
      await tour
        .setOptions({
          steps: [
            {
              intro: "step one",
            },
            {
              intro: "step two",
            },
          ],
        })
        .start();

      // Assert
      expect(content(tooltipText())).toBe("step one");

      expect(doneButton()).toBeNull();

      expect(prevButton()).not.toBeNull();
      expect(className(prevButton())).toContain("introjs-disabled");

      expect(nextButton()).not.toBeNull();
      expect(className(nextButton())).not.toContain("introjs-disabled");

      expect(className(".introjs-showElement")).toContain(
        "introjsFloatingElement"
      );
      expect(className(".introjs-showElement")).toContain(
        "introjs-relativePosition"
      );
    });

    test("should highlight the target element", async () => {
      // Arrange
      const p = appendDummyElement();
      const tour = new Tour();

      // Act
      await tour
        .setOptions({
          steps: [
            {
              intro: "step one",
              element: document.querySelector("p"),
            },
          ],
        })
        .start();

      // Assert
      expect(p.className).toContain("introjs-showElement");
      expect(p.className).toContain("introjs-relativePosition");
    });

    test("should not highlight the target element if queryString is incorrect", async () => {
      // Arrange
      const p = appendDummyElement();
      const tour = new Tour();

      // Act
      await tour
        .setOptions({
          steps: [
            {
              intro: "step one",
              element: document.querySelector("div"),
            },
          ],
        })
        .start();

      // Assert
      expect(p.className).not.toContain("introjs-showElement");
      expect(className(".introjs-showElement")).toContain(
        "introjsFloatingElement"
      );
    });

    test("should not add relativePosition if target element is fixed or absolute", async () => {
      // Arrange
      const absolute = appendDummyElement(
        "h1",
        "hello world",
        "position: absolute"
      );
      const fixed = appendDummyElement("h2", "hello world", "position: fixed");

      const tour = new Tour();

      // Act
      await tour
        .setOptions({
          steps: [
            {
              intro: "step one",
              element: document.querySelector("h1"),
            },
            {
              intro: "step two",
              element: document.querySelector("h2"),
            },
          ],
        })
        .start();

      // Assert
      expect(absolute.className).toContain("introjs-showElement");
      expect(absolute.className).not.toContain("introjs-relativePosition");

      await tour.nextStep();

      expect(fixed.className).toContain("introjs-showElement");
      expect(fixed.className).not.toContain("introjs-relativePosition");
    });

    test("should call the onstart callback", async () => {
      // Arrange
      const fn = jest.fn();
      const tour = new Tour();

      // Act
      await tour
        .setOptions({
          steps: [
            {
              intro: "step one",
              element: document.querySelector("h1"),
            },
          ],
        })
        .onStart(fn)
        .start();

      // Assert
      expect(fn).toBeCalledTimes(1);
      expect(fn).toBeCalledWith(window.document.body);
    });

    test("should call onexit and oncomplete when there is one step", async () => {
      // Arrange
      const onexitMock = jest.fn();
      const oncompleteMMock = jest.fn();

      const tour = new Tour();
      await tour
        .setOptions({
          steps: [
            {
              intro: "hello world",
            },
          ],
        })
        .onExit(onexitMock)
        .onComplete(oncompleteMMock)
        .start();

      // Act
      await nextButton().click();

      // Assert
      expect(onexitMock).toBeCalledTimes(1);
      expect(oncompleteMMock).toBeCalledTimes(1);
    });

    test("should call onexit when skip is clicked", async () => {
      // Arrange
      const onexitMock = jest.fn();
      const oncompleteMMock = jest.fn();

      const tour = new Tour();
      await tour
        .setOptions({
          steps: [
            {
              intro: "hello world",
            },
          ],
        })
        .onExit(onexitMock)
        .onComplete(oncompleteMMock)
        .start();

      // Act
      await skipButton().click();

      // Assert
      expect(onexitMock).toBeCalledTimes(1);
      expect(oncompleteMMock).toBeCalledTimes(1);
    });

    test("should call not oncomplete when skip is clicked and there are two steps", async () => {
      // Arrange
      const onexitMock = jest.fn();
      const oncompleteMMock = jest.fn();
      const tour = new Tour();
      await tour
        .setOptions({
          steps: [
            {
              intro: "first",
            },
            {
              intro: "second",
            },
          ],
        })
        .onExit(onexitMock)
        .onComplete(oncompleteMMock)
        .start();

      // Act
      skipButton().click();

      // Assert
      expect(onexitMock).toBeCalledTimes(1);
      expect(oncompleteMMock).toBeCalledTimes(0);
    });

    test("should not append the dontShowAgain checkbox when its inactive", async () => {
      // Arrange
      const tour = new Tour();

      // Act
      await tour
        .setOptions({
          dontShowAgain: false,
          steps: [
            {
              intro: "hello world",
            },
          ],
        })
        .start();

      // Assert
      expect(find(".introjs-dontShowAgain")).toBeNull();
    });

    test("should append the dontShowAgain checkbox", async () => {
      // Arrange
      const tour = new Tour();

      // Act
      await tour
        .setOptions({
          dontShowAgain: true,
          steps: [
            {
              intro: "hello world",
            },
          ],
        })
        .start();

      // Assert
      expect(find(".introjs-dontShowAgain")).not.toBeNull();
    });

    test("should call setDontShowAgain when then checkbox is clicked", async () => {
      // Arrange
      const setDontShowAgainSpy = jest.spyOn(dontShowAgain, "setDontShowAgain");
      const tour = new Tour();

      tour.setOptions({
        dontShowAgain: true,
        steps: [
          {
            intro: "hello world",
          },
        ],
      });

      // Act
      await tour.start();
      const checkbox = find(".introjs-dontShowAgain input");
      checkbox.click();

      // Assert
      expect(setDontShowAgainSpy).toBeCalledTimes(1);
      expect(setDontShowAgainSpy).toBeCalledWith(
        true,
        tour.getOption("dontShowAgainCookie"),
        tour.getOption("dontShowAgainCookieDays")
      );
    });

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

  describe("isActive", () => {
    test("should be false if isActive flag is false", () => {
      // Arrange
      const tour = new Tour();

      // Act
      tour.setOptions({
        isActive: false,
      });

      // Assert
      expect(tour.isActive()).toBeFalsy();
    });

    test("should be true if dontShowAgain is active but cookie is missing", () => {
      // Arrange
      jest.spyOn(dontShowAgain, "getDontShowAgain").mockReturnValueOnce(false);

      const tour = new Tour();

      // Act
      tour.setOptions({
        isActive: true,
        dontShowAgain: true,
      });

      // Assert
      expect(tour.isActive()).toBeTruthy();
    });

    test("should be false if dontShowAgain is active but isActive is true", () => {
      // Arrange
      jest.spyOn(dontShowAgain, "getDontShowAgain").mockReturnValueOnce(true);
      const tour = new Tour();

      // Act
      tour.setOptions({
        isActive: true,
        dontShowAgain: true,
      });

      // Assert
      expect(tour.isActive()).toBeFalsy();
    });
  });
});
