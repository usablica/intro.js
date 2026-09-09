import onKeyDown from "./onKeyDown";
import { skipButtonClassName } from "./classNames";
import { getMockSteps, getMockTour } from "./mock";

jest.mock("./showElement");
jest.mock("./exitIntro");

describe("onKeyDown", () => {
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
