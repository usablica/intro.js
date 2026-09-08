import onKeyDown from "./onKeyDown";
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
});
