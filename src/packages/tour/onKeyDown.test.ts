import onKeyDown from "./onKeyDown";
import { skipButtonClassName } from "./classNames";
import { getMockSteps, getMockTour } from "./mock";

jest.mock("./showElement");
jest.mock("./exitIntro");

const createKeyDownEvent = (code: string): KeyboardEvent => {
  return new KeyboardEvent("keydown", { code });
};

describe("onKeyDown", () => {
  describe("in LTR mode", () => {
    test("ArrowRight should move to the next step", async () => {
      // Arrange
      const mockTour = getMockTour();
      mockTour.setSteps(getMockSteps());
      await mockTour.setCurrentStep(0);

      // Act
      await onKeyDown(mockTour, createKeyDownEvent("ArrowRight"));

      // Assert
      expect(mockTour.getCurrentStep()).toBe(1);
    });

    test("ArrowLeft should move to the previous step", async () => {
      // Arrange
      const mockTour = getMockTour();
      mockTour.setSteps(getMockSteps());
      await mockTour.setCurrentStep(1);

      // Act
      await onKeyDown(mockTour, createKeyDownEvent("ArrowLeft"));

      // Assert
      expect(mockTour.getCurrentStep()).toBe(0);
    });
  });

  describe("in RTL mode", () => {
    let targetElement: HTMLElement;

    beforeEach(() => {
      targetElement = document.createElement("div");
      targetElement.style.direction = "rtl";
      document.body.appendChild(targetElement);
    });

    afterEach(() => {
      targetElement.remove();
    });

    test("ArrowLeft should move to the next step", async () => {
      // Arrange
      const mockTour = getMockTour(targetElement);
      mockTour.setSteps(getMockSteps());
      await mockTour.setCurrentStep(0);

      // Act
      await onKeyDown(mockTour, createKeyDownEvent("ArrowLeft"));

      // Assert
      expect(mockTour.getCurrentStep()).toBe(1);
    });

    test("ArrowRight should move to the previous step", async () => {
      // Arrange
      const mockTour = getMockTour(targetElement);
      mockTour.setSteps(getMockSteps());
      await mockTour.setCurrentStep(1);

      // Act
      await onKeyDown(mockTour, createKeyDownEvent("ArrowRight"));

      // Assert
      expect(mockTour.getCurrentStep()).toBe(0);
    });

    test("ArrowLeft on the last step should complete the tour (RTL + isEnd interaction)", async () => {
      // Arrange - RTL reverses ArrowLeft to call nextStep(), which must
      // still correctly detect "last step" and complete rather than
      // crash trying to render a step past the end.
      const steps = getMockSteps();
      const mockTour = getMockTour(targetElement);
      mockTour.setSteps(steps);
      await mockTour.setCurrentStep(steps.length - 1);

      const fnCompleteCallback = jest.fn();
      mockTour.onComplete(fnCompleteCallback);

      // Act
      await onKeyDown(mockTour, createKeyDownEvent("ArrowLeft"));

      // Assert
      expect(fnCompleteCallback).toHaveBeenCalledTimes(1);
      expect(mockTour.getCurrentStep()).toBe(steps.length - 1);
    });
  });

  describe("when only the tooltip element is RTL (e.g. introjs-rtl.css)", () => {
    let tooltip: HTMLElement;

    beforeEach(() => {
      // the target element/page stays LTR; only the rendered tooltip
      // has `direction: rtl`, mirroring the bundled introjs-rtl.css
      tooltip = document.createElement("div");
      tooltip.className = "introjs-tooltip";
      tooltip.style.direction = "rtl";
      document.body.appendChild(tooltip);
    });

    afterEach(() => {
      tooltip.remove();
    });

    test("ArrowLeft should move to the next step", async () => {
      // Arrange
      const mockTour = getMockTour();
      mockTour.setSteps(getMockSteps());
      await mockTour.setCurrentStep(0);

      // Act
      await onKeyDown(mockTour, createKeyDownEvent("ArrowLeft"));

      // Assert
      expect(mockTour.getCurrentStep()).toBe(1);
    });

    test("ArrowRight should move to the previous step", async () => {
      // Arrange
      const mockTour = getMockTour();
      mockTour.setSteps(getMockSteps());
      await mockTour.setCurrentStep(1);

      // Act
      await onKeyDown(mockTour, createKeyDownEvent("ArrowRight"));

      // Assert
      expect(mockTour.getCurrentStep()).toBe(0);
    });
  });

  describe("Enter key on the skip button", () => {
    const pressEnterOnSkipButton = async (
      tour: ReturnType<typeof getMockTour>
    ) => {
      const skipButton = document.createElement("a");
      skipButton.className = skipButtonClassName;
      document.body.appendChild(skipButton);

      const event = new KeyboardEvent("keydown", { code: "Enter" });
      Object.defineProperty(event, "target", { value: skipButton });

      await onKeyDown(tour, event);

      skipButton.remove();
    };

    // Regression test for https://github.com/usablica/intro.js/issues/951 -
    // `isEnd()` used to be dead code (it checked for an out-of-bounds step
    // that could never actually occur), so hitting Enter on the skip
    // button while already on the last step never fired the "complete"
    // callback, unlike clicking the skip button with the mouse.
    test("should call the complete callback when on the last step", async () => {
      // Arrange
      const steps = getMockSteps();
      const mockTour = getMockTour();
      mockTour.setSteps(steps);
      await mockTour.setCurrentStep(steps.length - 1);

      const fnCompleteCallback = jest.fn();
      mockTour.onComplete(fnCompleteCallback);

      // Act
      await pressEnterOnSkipButton(mockTour);

      // Assert
      expect(fnCompleteCallback).toHaveBeenCalledTimes(1);
      expect(fnCompleteCallback).toHaveBeenCalledWith(steps.length - 1, "skip");
    });

    test("should not call the complete callback when not on the last step", async () => {
      // Arrange
      const steps = getMockSteps();
      const mockTour = getMockTour();
      mockTour.setSteps(steps);
      await mockTour.setCurrentStep(0);

      const fnCompleteCallback = jest.fn();
      mockTour.onComplete(fnCompleteCallback);

      // Act
      await pressEnterOnSkipButton(mockTour);

      // Assert
      expect(fnCompleteCallback).not.toHaveBeenCalled();
    });

    // Regression tests for https://github.com/usablica/intro.js/issues/2070 -
    // onSkip returning `false` should cancel the skip, like onBeforeExit
    // does for exiting the tour.
    test("should exit the tour when onSkip does not return false", async () => {
      // Arrange
      const mockTour = getMockTour();
      mockTour.setSteps(getMockSteps());
      await mockTour.setCurrentStep(0);

      const exitSpy = jest.spyOn(mockTour, "exit");
      mockTour.onSkip(() => {});

      // Act
      await pressEnterOnSkipButton(mockTour);

      // Assert
      expect(exitSpy).toHaveBeenCalledTimes(1);
    });

    test("should not exit the tour when onSkip returns false", async () => {
      // Arrange
      const mockTour = getMockTour();
      mockTour.setSteps(getMockSteps());
      await mockTour.setCurrentStep(0);

      const exitSpy = jest.spyOn(mockTour, "exit");
      mockTour.onSkip(() => false);

      // Act
      await pressEnterOnSkipButton(mockTour);

      // Assert
      expect(exitSpy).not.toHaveBeenCalled();
    });
  });
});
