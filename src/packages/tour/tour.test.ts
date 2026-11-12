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

    test("should call onexit and oncomplete when pressing the right arrow key on a one-step tour", async () => {
      // Arrange - end-to-end: real keydown event through the wired-up
      // window listener (enableKeyboardNavigation), not calling onKeyDown()
      // directly. Regression test for https://github.com/usablica/intro.js/issues/951
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
      window.dispatchEvent(
        new KeyboardEvent("keydown", { code: "ArrowRight" })
      );
      await waitFor(1000);

      // Assert
      expect(onexitMock).toBeCalledTimes(1);
      expect(oncompleteMock).toBeCalledTimes(1);
    });

    test("should complete a multi-step tour when pressing the right arrow key on the last step", async () => {
      // Arrange
      const onexitMock = jest.fn();
      const oncompleteMock = jest.fn();

      mockTour
        .setOptions({
          steps: [
            { intro: "step 1" },
            { intro: "step 2" },
            { intro: "step 3" },
          ],
        })
        .onExit(onexitMock)
        .onComplete(oncompleteMock);

      // Act - advance to the last step first, via the same keyboard path
      await mockTour.start();
      window.dispatchEvent(
        new KeyboardEvent("keydown", { code: "ArrowRight" })
      );
      await waitFor(500);
      window.dispatchEvent(
        new KeyboardEvent("keydown", { code: "ArrowRight" })
      );
      await waitFor(500);

      // Assert - still on the last step, tour hasn't completed yet
      expect(mockTour.getCurrentStep()).toBe(2);
      expect(oncompleteMock).not.toBeCalled();

      // Act - one more right-arrow press on the actual last step must
      // complete the tour instead of crashing / doing nothing
      window.dispatchEvent(
        new KeyboardEvent("keydown", { code: "ArrowRight" })
      );
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

  describe("isEnd", () => {
    test("should be false before the tour has started", () => {
      // Arrange
      const mockTour = getMockTour();
      mockTour.setSteps(getMockSteps());

      // Assert
      expect(mockTour.isEnd()).toBeFalsy();
    });

    test("should be false when not on the last step", async () => {
      // Arrange
      const mockTour = getMockTour();
      mockTour.setSteps(getMockSteps());
      await mockTour.setCurrentStep(0);

      // Assert
      expect(mockTour.isEnd()).toBeFalsy();
    });

    test("should be true when on the last step", async () => {
      // Arrange
      const steps = getMockSteps();
      const mockTour = getMockTour();
      mockTour.setSteps(steps);
      await mockTour.setCurrentStep(steps.length - 1);

      // Assert
      expect(mockTour.isEnd()).toBeTruthy();
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

  describe("setTheme / getTheme", () => {
    beforeEach(() => {
      // other tests in this file may leave a stray .introjs-tour element
      // behind; start from a clean slate so querySelector below is unambiguous.
      document.querySelectorAll(".introjs-tour").forEach((el) => el.remove());
    });

    afterEach(async () => {
      document
        .querySelectorAll("[data-introjs-theme]")
        .forEach((link) => link.remove());
    });

    test("getTheme returns undefined before the tour starts", () => {
      const mockTour = getMockTour();
      expect(mockTour.getTheme()).toBeUndefined();
    });

    test("applies the theme option once the tour starts", async () => {
      const mockTour = getMockTour();
      mockTour.setOptions({ theme: "dark" });
      mockTour.addStep({ intro: "first" });

      await mockTour.start();
      await sleep(waitMsForDerivations);

      expect(mockTour.getTheme()).toBe("dark");
      expect(
        document
          .querySelector(".introjs-tour")
          ?.classList.contains("introjs-dark")
      ).toBe(true);

      await mockTour.exit();
      await sleep(waitMsForExitTransition);
    });

    test("switches the theme on a running tour", async () => {
      const mockTour = getMockTour();
      mockTour.setOptions({ theme: "light" });
      mockTour.addStep({ intro: "first" });

      await mockTour.start();
      await sleep(waitMsForDerivations);

      await mockTour.setTheme("dark");

      expect(mockTour.getTheme()).toBe("dark");
      expect(
        document
          .querySelector(".introjs-tour")
          ?.classList.contains("introjs-dark")
      ).toBe(true);
      expect(mockTour.getOption("theme")).toBe("dark");

      await mockTour.exit();
      await sleep(waitMsForExitTransition);
    });
  });

  // https://github.com/usablica/intro.js/issues/1061
  describe("afterChange", () => {
    let mockTour: Tour;

    const tooltipTextNow = () =>
      document.querySelector(".introjs-tooltiptext")?.textContent?.trim();

    beforeEach(() => {
      document.body.innerHTML = "";
      mockTour = getMockTour();
      mockTour.setOptions({
        steps: [{ intro: "step one" }, { intro: "step two" }],
      });
    });

    afterEach(async () => {
      await mockTour.exit();
      await sleep(waitMsForExitTransition);
    });

    test("is called for the first step once its tooltip is rendered", async () => {
      // Arrange
      const seen: Array<string | undefined> = [];
      mockTour.onAfterChange(() => {
        seen.push(tooltipTextNow());
      });

      // Act
      await mockTour.start();

      // Assert
      expect(seen).toEqual(["step one"]);
    });

    test("is called for later steps once the tooltip of the new step is rendered", async () => {
      // Arrange
      const seen: Array<string | undefined> = [];
      mockTour.onAfterChange(() => {
        seen.push(tooltipTextNow());
      });
      await mockTour.start();

      // Act
      await mockTour.nextStep();

      // Assert - it used to still see the previous step's tooltip
      expect(seen).toEqual(["step one", "step two"]);
    });

    test("is called for the previous step once its tooltip is rendered", async () => {
      // Arrange
      const seen: Array<string | undefined> = [];
      await mockTour.start();
      await mockTour.nextStep();
      // let the DOM settle on step two, so a stale tooltip can't look correct
      await sleep(50);
      mockTour.onAfterChange(() => {
        seen.push(tooltipTextNow());
      });

      // Act
      await mockTour.previousStep();

      // Assert
      expect(seen).toEqual(["step one"]);
    });

    test("is awaited when it is async", async () => {
      // Arrange
      const order: string[] = [];
      await mockTour.start();
      mockTour.onAfterChange(async () => {
        await sleep(20);
        order.push("callback finished");
      });

      // Act
      await mockTour.nextStep();
      order.push("nextStep resolved");

      // Assert
      expect(order).toEqual(["callback finished", "nextStep resolved"]);
    });

    test("does not keep nextStep waiting for long", async () => {
      // Arrange
      await mockTour.start();

      // Act
      const startedAt = Date.now();
      await mockTour.nextStep();

      // Assert - well below the fallback timeout used when nothing renders
      expect(Date.now() - startedAt).toBeLessThan(90);
    });

    test("does not wait for a render that will not happen when beforeChange blocks the step", async () => {
      // Arrange
      await mockTour.start();
      mockTour.onBeforeChange(() => false);
      const onAfterChange = jest.fn();
      mockTour.onAfterChange(onAfterChange);

      // Act
      const startedAt = Date.now();
      await mockTour.nextStep();

      // Assert - the step didn't change, so nothing is rendered: no waiting
      expect(mockTour.getCurrentStep()).toBe(0);
      expect(Date.now() - startedAt).toBeLessThan(90);
      expect(onAfterChange).toBeCalledTimes(1);
    });

    test("keeps up with several nextStep calls in a row", async () => {
      // Arrange
      mockTour.setOptions({
        steps: [1, 2, 3, 4, 5].map((n) => ({ intro: `step ${n}` })),
      });
      const onAfterChange = jest.fn();
      mockTour.onAfterChange(onAfterChange);
      await mockTour.start();

      // Act
      const pending = [];
      for (let i = 0; i < 3; i++) {
        pending.push(mockTour.nextStep());
        await sleep(2);
      }
      await Promise.all(pending);
      await sleep(50);

      // Assert
      expect(mockTour.getCurrentStep()).toBe(3);
      expect(tooltipTextNow()).toBe("step 4");
      expect(onAfterChange).toBeCalledTimes(4);
    });

    test("does not hang when the tour exits while waiting for the render", async () => {
      // Arrange
      await mockTour.start();

      // Act - let nextStep reach the point where it waits for the render
      const pending = mockTour.nextStep();
      await sleep(0);
      await mockTour.exit();

      // Assert
      const outcome = await Promise.race([
        pending.then(() => "settled"),
        sleep(300).then(() => "hung"),
      ]);
      expect(outcome).toBe("settled");
    });
  });

  describe("onEvent", () => {
    let mockTour: Tour;

    beforeEach(() => {
      mockTour = getMockTour();
      document.body.innerHTML = `<div><h1 id='title'>Title</h1></div>`;
    });

    afterEach(async () => {
      await mockTour.exit();
    });

    const types = (listener: jest.Mock) =>
      listener.mock.calls.map(([event]) => event.type);

    test("should throw when the listener is not a function", () => {
      expect(() => mockTour.onEvent("x" as any)).toThrow();
    });

    test("should emit start, step, complete and exit when the tour is finished", async () => {
      // Arrange
      const listener = jest.fn();
      mockTour
        .setOptions({
          tourId: "onboarding",
          steps: [{ title: "Hi", intro: "first" }, { intro: "second" }],
        })
        .onEvent(listener);

      // Act
      await mockTour.start();
      nextButton().click();
      await waitFor(500);
      doneButton().click();
      await waitFor(1000);

      // Assert
      expect(types(listener)).toEqual([
        "start",
        "step",
        "step",
        "complete",
        "exit",
      ]);

      const [start, firstStep, , complete, exit] = listener.mock.calls.map(
        ([event]) => event
      );
      expect(start).toEqual({
        type: "start",
        tourId: "onboarding",
        totalSteps: 2,
        timestamp: expect.any(Number),
      });
      expect(firstStep).toMatchObject({
        type: "step",
        step: 0,
        stepTitle: "Hi",
      });
      expect(complete).toMatchObject({ step: 1, reason: "done" });
      expect(exit).toMatchObject({ step: 1, totalSteps: 2 });
    });

    test("should emit skip and exit with the step the user left on", async () => {
      // Arrange
      const listener = jest.fn();
      mockTour
        .setOptions({ steps: [{ intro: "first" }, { intro: "second" }] })
        .onEvent(listener);

      // Act
      await mockTour.start();
      skipButton().click();
      await waitFor(1000);

      // Assert
      expect(types(listener)).toEqual(["start", "step", "skip", "exit"]);
      expect(listener.mock.calls[3][0]).toMatchObject({
        type: "exit",
        step: 0,
      });
      expect(listener.mock.calls[3][0].tourId).toBeUndefined();
    });

    test("should emit complete with reason skip when skipping on the last step", async () => {
      // Arrange
      const listener = jest.fn();
      mockTour.setOptions({ steps: [{ intro: "only" }] }).onEvent(listener);

      // Act
      await mockTour.start();
      skipButton().click();
      await waitFor(1000);

      // Assert
      expect(types(listener)).toEqual([
        "start",
        "step",
        "skip",
        "complete",
        "exit",
      ]);
      expect(listener.mock.calls[3][0].reason).toBe("skip");
    });

    test("should not emit skip when onSkip cancels it", async () => {
      // Arrange
      const listener = jest.fn();
      mockTour
        .setOptions({ steps: [{ intro: "first" }, { intro: "second" }] })
        .onSkip(() => false)
        .onEvent(listener);

      // Act
      await mockTour.start();
      skipButton().click();
      await waitFor(500);

      // Assert
      expect(types(listener)).toEqual(["start", "step"]);
    });

    test("should support several listeners next to the on* callbacks", async () => {
      // Arrange
      const first = jest.fn();
      const second = jest.fn();
      const onExit = jest.fn();
      mockTour
        .setOptions({ steps: [{ intro: "only" }] })
        .onExit(onExit)
        .onEvent(first)
        .onEvent(second);

      // Act
      await mockTour.start();
      await mockTour.exit();

      // Assert
      expect(types(first)).toEqual(["start", "step", "exit"]);
      expect(types(second)).toEqual(["start", "step", "exit"]);
      expect(onExit).toBeCalledTimes(1);
    });

    test("should keep running the tour when a listener throws", async () => {
      // Arrange
      const consoleError = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});
      const listener = jest.fn();
      mockTour
        .setOptions({ steps: [{ intro: "first" }, { intro: "second" }] })
        .onEvent(() => {
          throw new Error("analytics is down");
        })
        .onEvent(listener);

      // Act
      await mockTour.start();
      await mockTour.nextStep();

      // Assert
      expect(mockTour.getCurrentStep()).toBe(1);
      expect(types(listener)).toEqual(["start", "step", "step"]);
      expect(consoleError).toHaveBeenCalled();
      consoleError.mockRestore();
    });

    test("should stop calling a listener removed with offEvent", async () => {
      // Arrange
      const listener = jest.fn();
      mockTour
        .setOptions({ steps: [{ intro: "first" }, { intro: "second" }] })
        .onEvent(listener);

      // Act
      await mockTour.start();
      mockTour.offEvent(listener);
      await mockTour.nextStep();

      // Assert
      expect(types(listener)).toEqual(["start", "step"]);
    });

    test("should not emit exit when the tour never started", async () => {
      // Arrange
      const listener = jest.fn();
      mockTour.onEvent(listener);

      // Act
      await mockTour.exit();

      // Assert
      expect(listener).not.toBeCalled();
    });
  });
});
