import onKeyDown from "./onKeyDown";
import { skipButtonClassName } from "./classNames";
import { getMockSteps, getMockTour } from "./mock";

jest.mock("./showElement");
jest.mock("./exitIntro");

describe("onKeyDown", () => {
  describe("Enter key on the skip button", () => {
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

      const skipButton = document.createElement("a");
      skipButton.className = skipButtonClassName;
      document.body.appendChild(skipButton);

      const event = new KeyboardEvent("keydown", { code: "Enter" });
      Object.defineProperty(event, "target", { value: skipButton });

      // Act
      await onKeyDown(mockTour, event);

      // Assert
      expect(fnCompleteCallback).toHaveBeenCalledTimes(1);
      expect(fnCompleteCallback).toHaveBeenCalledWith(steps.length - 1, "skip");

      skipButton.remove();
    });

    test("should not call the complete callback when not on the last step", async () => {
      // Arrange
      const steps = getMockSteps();
      const mockTour = getMockTour();
      mockTour.setSteps(steps);
      await mockTour.setCurrentStep(0);

      const fnCompleteCallback = jest.fn();
      mockTour.onComplete(fnCompleteCallback);

      const skipButton = document.createElement("a");
      skipButton.className = skipButtonClassName;
      document.body.appendChild(skipButton);

      const event = new KeyboardEvent("keydown", { code: "Enter" });
      Object.defineProperty(event, "target", { value: skipButton });

      // Act
      await onKeyDown(mockTour, event);

      // Assert
      expect(fnCompleteCallback).not.toHaveBeenCalled();

      skipButton.remove();
    });
  });
});
