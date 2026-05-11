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
import {
  appendMockSteps,
  getMockPartialSteps,
  getMockTour,
  getMockSteps,
} from "./mock";
import { Tour } from "./tour";
import { helperLayerClassName, overlayClassName } from "./classNames";
import {
  sleep,
  waitMsForDerivations,
  waitMsForExitTransition,
} from "../../util/sleep";
import { axe, toHaveNoViolations } from "jest-axe";
expect.extend(toHaveNoViolations);
jest.setTimeout(40000);

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

    test("should merge user options with default options", () => {
      // Arrange
      const userOptions = { showStepNumbers: true };

      // Act
      const tour = new Tour(undefined, userOptions);

      // Assert
      expect(tour.getOption("showStepNumbers")).toBe(true);
      expect(tour.getOption("showButtons")).toBe(true);
      expect(tour.getOption("exitOnEsc")).toBe(true);
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
      await sleep(waitMsForDerivations);
      await mockTour.exit();
      await sleep(waitMsForExitTransition);

      // Assert
      expect(mockElement?.className).not.toContain("introjs-showElement");
      expect(document.querySelector(`.${helperLayerClassName}`)).toBeNull();
      expect(document.querySelector(`.${overlayClassName}`)).toBeNull();
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
      await sleep(waitMsForDerivations);
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

      // Assert: keyboard + resize + scroll (tour) + resize (autoUpdate in Tooltip)
      expect(addEventListenerSpy).toBeCalledTimes(4);
      // autoUpdate cleanup is async (setInterval), so only tour's 3 are removed synchronously
      expect(removeEventListenerSpy).toBeCalledTimes(3);
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

  describe("tooltipRenderAsHtml", () => {
    beforeEach(() => {
      document.body.innerHTML = ""; // Clear previous test DOM
    });
    test("should render HTML when tooltipRenderAsHtml is true", async () => {
      const tour = new Tour();

      // Arrange & Act
      tour.setOptions({
        tooltipRenderAsHtml: true,
        steps: [
          {
            intro: "<b>Bold text</b> and <i>italic text</i>",
          },
        ],
      });

      await tour.start();

      // Assert
      const tooltip = find(".introjs-tooltiptext");
      expect(tooltip).not.toBeNull();
      expect(tooltip?.querySelector("b")?.textContent).toBe("Bold text");
      expect(tooltip?.querySelector("i")?.textContent).toBe("italic text");
    });

    test("should not render HTML when tooltipRenderAsHtml is false", async () => {
      const tour = new Tour();

      // Arrange & Act
      tour.setOptions({
        tooltipRenderAsHtml: false,
        steps: [
          {
            intro: "<b>Bold text</b> and <i>italic text</i>",
          },
        ],
      });

      await tour.start();

      // Assert
      const tooltip = find(".introjs-tooltiptext");
      expect(tooltip).not.toBeNull();
      expect(tooltip?.innerHTML).toContain(
        "&lt;b&gt;Bold text&lt;/b&gt; and &lt;i&gt;italic text&lt;/i&gt;"
      );
      expect(tooltip?.querySelector("b")).toBeNull();
      expect(tooltip?.querySelector("i")).toBeNull();
    });
  });
  test("should have no accessibility violations across all tour steps", async () => {
    const container = document.createElement("main");
    container.setAttribute("role", "main");
    document.body.appendChild(container);

    const textEl = document.createElement("p");
    textEl.id = "paragraph";
    textEl.textContent = "This is a sample paragraph for the tour.";

    const imgEl = document.createElement("img");
    imgEl.id = "sample-image";
    imgEl.src = "https://via.placeholder.com/150";
    imgEl.alt = "Sample placeholder image";

    const videoEl = document.createElement("video");
    videoEl.id = "sample-video";
    videoEl.controls = true;
    const source = document.createElement("source");
    source.src = "https://www.w3schools.com/html/mov_bbb.mp4";
    source.type = "video/mp4";
    videoEl.appendChild(source);

    const linkEl = document.createElement("a");
    linkEl.id = "sample-link";
    linkEl.href = "#";
    linkEl.textContent = "Learn more";

    container.appendChild(textEl);
    container.appendChild(imgEl);
    container.appendChild(videoEl);
    container.appendChild(linkEl);

    appendMockSteps(container);

    const mockTour = getMockTour(container);
    mockTour.setOptions({
      steps: [
        { element: "#paragraph", intro: "Accessible text content" },
        { element: "#sample-image", intro: "Accessible image with alt text" },
        { element: "#sample-video", intro: "Accessible video with controls" },
        { element: "#sample-link", intro: "Accessible link element" },
      ],
    });

    await mockTour.start();

    for (let i = 0; i < mockTour.getSteps().length; i++) {
      if (i < mockTour.getSteps().length - 1) {
        const results = await axe(document.body);
        expect(results).toHaveNoViolations();
        await mockTour.nextStep();
      }
    }
  });

  describe("setCurrentStep", () => {
    test("should call beforeChange and proceed when callback returns true", async () => {
      const mockTour = getMockTour();
      mockTour.setSteps(getMockSteps());

      const fnBeforeChange = jest.fn().mockResolvedValue(true);
      mockTour.onBeforeChange(fnBeforeChange);

      // Act
      await mockTour.setCurrentStep(1);

      // Assert
      expect(fnBeforeChange).toHaveBeenCalledTimes(1);
      expect(mockTour.getCurrentStep()).toBe(1);
    });

    test("should allow backward step even if callback returns false", async () => {
      const mockTour = getMockTour();
      mockTour.setSteps(getMockSteps());
      mockTour.setCurrentStep(1);

      const fnBeforeChange = jest.fn().mockResolvedValue(false);
      mockTour.onBeforeChange(fnBeforeChange);

      // Act
      await mockTour.setCurrentStep(0);

      // Assert
      expect(fnBeforeChange).toHaveBeenCalledTimes(1);
      expect(mockTour.getCurrentStep()).toBe(0);
    });

    test("should return early if target step does not exist", async () => {
      const mockTour = getMockTour();
      mockTour.setSteps(getMockSteps());

      // Act
      const result = await mockTour.setCurrentStep(999);

      // Assert
      expect(result).toBe(mockTour);
      expect(mockTour.getCurrentStep()).toBe(undefined);
    });
  });
});
