import { queryElementByClassName } from "../../util/queryElement";
import {
  className,
  content,
  doneButton,
  find,
  nextButton,
  prevButton,
  skipButton,
  tooltipText,
  waitFor,
} from "../../../tests/jest/helper";
import * as dontShowAgain from "./dontShowAgain";
import { getMockPartialSteps, getMockTour } from "./mock";
import { Tour } from "./tour";
import { helperLayerClassName, overlayClassName } from "./classNames";

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
    let mockTour: Tour;

    beforeEach(() => {
      mockTour = getMockTour();

      document.body.innerHTML = `<div>
          <h1 id='title'>Title</h1>
          <p id='paragraph'>Paragraph</p>
          <div id='position-absolute' style='position: absolute;'>Position Absolute</div>
          <div id='position-fixed' style='position: fixed;'>Position Fixed</div>
        </div>`;
    });

    afterEach(async () => {
      await mockTour.exit();
    });

    test("should not start the tour twice", async () => {
      // Arrange
      mockTour.addSteps(getMockPartialSteps());
      const onStartMock = jest.fn();
      mockTour.onStart(onStartMock);

      // Act
      await mockTour.start();
      await mockTour.start();

      // Assert
      expect(onStartMock).toBeCalledTimes(1);
    });

    test("should start floating intro with one step", async () => {
      // Arrange & Act
      await mockTour
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
    });

    test("should start floating intro with two steps", async () => {
      // Arrange
      mockTour.setOptions({
        steps: [
          {
            intro: "step one",
          },
          {
            intro: "step two",
          },
        ],
      });

      // Act
      await mockTour.start();

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
      const mockElement = document.querySelector("#paragraph");
      mockTour.setOptions({
        steps: [
          {
            intro: "step one",
            element: mockElement,
          },
        ],
      });

      // Act
      await mockTour.start();

      // Assert
      expect(mockElement?.className).toContain("introjs-showElement");
      expect(mockElement?.className).toContain("introjs-relativePosition");
    });

    test("should remove the container element after exit() is called", async () => {
      // Arrange
      const mockElement = document.querySelector("#paragraph");
      mockTour.setOptions({
        steps: [
          {
            intro: "step one",
            element: mockElement,
          },
        ],
      });

      // Act
      await mockTour.start();
      await mockTour.exit();

      // Assert
      expect(mockElement?.className).not.toContain("introjs-showElement");
      expect(queryElementByClassName(helperLayerClassName)).toBeNull();
      expect(queryElementByClassName(overlayClassName)).toBeNull();
    });

    test("should not highlight the target element if queryString is incorrect", async () => {
      // Arrange
      const mockElement = document.querySelector("#non-existing-element");
      mockTour.setOptions({
        steps: [
          {
            intro: "step one",
            element: mockElement,
          },
        ],
      });

      // Act
      await mockTour.start();

      // Assert
      expect(className(".introjs-showElement")).toContain(
        "introjsFloatingElement"
      );
    });

    test("should not add relativePosition if target element is fixed", async () => {
      // Arrange
      const fixedMockElement = document.querySelector("#position-fixed");
      mockTour.setOptions({
        steps: [
          {
            intro: "step one",
            element: fixedMockElement,
          },
        ],
      });

      // Act
      await mockTour.start();

      // Assert
      expect(fixedMockElement?.className).toContain("introjs-showElement");
      expect(fixedMockElement?.className).not.toContain(
        "introjs-relativePosition"
      );
    });

    test("should not add relativePosition if target element is fixed or absolute", async () => {
      // Arrange
      const absoluteMockElement = document.querySelector("#position-absolute");
      mockTour.setOptions({
        steps: [
          {
            intro: "step one",
            element: absoluteMockElement,
          },
        ],
      });

      // Act
      await mockTour.start();

      // Assert
      expect(absoluteMockElement?.className).toContain("introjs-showElement");
      expect(absoluteMockElement?.className).not.toContain(
        "introjs-relativePosition"
      );
    });

    test("should call the onstart callback", async () => {
      // Arrange
      const fn = jest.fn();
      mockTour
        .setOptions({
          steps: [
            {
              intro: "step one",
              element: document.querySelector("h1"),
            },
          ],
        })
        .onStart(fn);

      // Act
      await mockTour.start();

      // Assert
      expect(fn).toBeCalledTimes(1);
      expect(fn).toBeCalledWith(window.document.body);
    });

    test("should call onexit and oncomplete when there is one step", async () => {
      // Arrange
      const onexitMock = jest.fn();
      const oncompleteMock = jest.fn();

      mockTour
        .setOptions({
          steps: [
            {
              intro: "hello world",
            },
          ],
        })
        .onExit(onexitMock)
        .onComplete(oncompleteMock);

      // Act
      await mockTour.start();
      nextButton().click();
      await waitFor(1000);

      // Assert
      expect(onexitMock).toBeCalledTimes(1);
      expect(oncompleteMock).toBeCalledTimes(1);
    });

    test("should call onexit when skip is clicked", async () => {
      // Arrange
      const onexitMock = jest.fn();
      const oncompleteMock = jest.fn();

      mockTour
        .setOptions({
          steps: [
            {
              intro: "hello world",
            },
          ],
        })
        .onExit(onexitMock)
        .onComplete(oncompleteMock);

      // Act
      await mockTour.start();
      skipButton().click();
      await waitFor(1000);

      // Assert
      expect(onexitMock).toBeCalledTimes(1);
      expect(oncompleteMock).toBeCalledTimes(1);
    });

    test("should call not oncomplete when skip is clicked and there are two steps", async () => {
      // Arrange
      const onexitMock = jest.fn();
      const oncompleteMMock = jest.fn();
      mockTour
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
        .onComplete(oncompleteMMock);

      // Act
      await mockTour.start();
      skipButton().click();
      await waitFor(1000);

      // Assert
      expect(onexitMock).toBeCalledTimes(1);
      expect(oncompleteMMock).toBeCalledTimes(0);
    });

    test("should not append the dontShowAgain checkbox when its inactive", async () => {
      // Arrange
      mockTour.setOptions({
        dontShowAgain: false,
        steps: [
          {
            intro: "hello world",
          },
        ],
      });

      // Act
      await mockTour.start();

      // Assert
      expect(find(".introjs-dontShowAgain")).toBeNull();
    });

    test("should append the dontShowAgain checkbox", async () => {
      // Arrange
      mockTour.setOptions({
        dontShowAgain: true,
        steps: [
          {
            intro: "hello world",
          },
        ],
      });

      // Act
      await mockTour.start();

      // Assert
      expect(find(".introjs-dontShowAgain")).not.toBeNull();
    });

    test("should call setDontShowAgain when then checkbox is clicked", async () => {
      // Arrange
      const setDontShowAgainSpy = jest.spyOn(dontShowAgain, "setDontShowAgain");

      mockTour.setOptions({
        dontShowAgain: true,
        steps: [
          {
            intro: "hello world",
          },
        ],
      });

      // Act
      await mockTour.start();
      const checkbox = find(".introjs-dontShowAgain input");
      checkbox.click();

      // Assert
      expect(setDontShowAgainSpy).toBeCalledTimes(1);
      expect(setDontShowAgainSpy).toBeCalledWith(
        true,
        mockTour.getOption("dontShowAgainCookie"),
        mockTour.getOption("dontShowAgainCookieDays")
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
      mockTour.enableKeyboardNavigation = jest.fn();
      mockTour.enableRefreshOnResize = jest.fn();

      // Act
      await mockTour.start();

      // Assert
      expect(mockTour.enableKeyboardNavigation).not.toBeCalled();
      expect(mockTour.enableRefreshOnResize).not.toBeCalled();
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

  describe("hasStarted", () => {
    test("should be false if the tour has not started", async () => {
      const mockTour = getMockTour();
      mockTour.addSteps(getMockPartialSteps());

      // Act
      expect(mockTour.hasStarted()).toBeFalsy();
    });

    test("it should be true if the tour has started", async () => {
      // Arrange
      const mockTour = getMockTour();
      mockTour.addSteps(getMockPartialSteps());

      // Act
      await mockTour.start();

      // Act
      expect(mockTour.hasStarted()).toBeTruthy();
    });

    test("it should be false if the tour has started and exited", async () => {
      // Arrange
      const mockTour = getMockTour();
      mockTour.addSteps(getMockPartialSteps());

      // Act
      await mockTour.start();
      await mockTour.exit();

      // Act
      expect(mockTour.hasStarted()).toBeFalsy();
    });
  });
});
