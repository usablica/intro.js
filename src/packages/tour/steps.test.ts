import { fetchSteps, nextStep, previousStep } from "./steps";
import _showElement from "./showElement";
import { appendMockSteps, getMockSteps, getMockTour } from "./tests/mock";
import createElement from "../../util/createElement";

jest.mock("./showElement");
jest.mock("./exitIntro");

describe("steps", () => {
  describe("previousStep", () => {
    test("should decrement the step counter", async () => {
      // Arrange
      const mockTour = getMockTour();
      mockTour.setCurrentStep(1);

      // Act
      await previousStep(mockTour);

      // Assert
      expect(mockTour.getCurrentStep()).toBe(0);
    });

    test("should not decrement when step is 0", async () => {
      // Arrange
      const mockTour = getMockTour();
      mockTour.setCurrentStep(0);

      // Act
      await previousStep(mockTour);

      // Assert
      expect(mockTour.getCurrentStep()).toBe(0);
    });
  });

  describe("nextStep", () => {
    test("should increment the step counter", async () => {
      // Arrange
      const mockTour = getMockTour();
      mockTour.setCurrentStep(0);

      // Act
      await nextStep(mockTour);

      // Assert
      expect(mockTour.getCurrentStep()).toBe(1);
    });

    test("should call ShowElement", async () => {
      // Arrange
      const showElementMock = jest.fn();
      (_showElement as jest.Mock).mockImplementation(showElementMock);
      const mockTour = getMockTour();

      // Act
      await nextStep(mockTour);

      // Assert
      expect(showElementMock).toHaveBeenCalledTimes(1);
    });

    test("should call the onBeforeChange callback", async () => {
      // Arrange
      const mockTour = getMockTour();
      const fnBeforeChangeCallback = jest.fn();
      mockTour.onBeforeChange(fnBeforeChangeCallback);

      // Act
      await nextStep(mockTour);

      // Assert
      expect(fnBeforeChangeCallback).toHaveBeenCalledTimes(1);
      expect(fnBeforeChangeCallback).toHaveBeenCalledWith(
        undefined,
        1,
        "forward"
      );
    });

    test("should not continue when onBeforeChange return false", async () => {
      // Arrange
      const mockTour = getMockTour();
      const showElementMock = jest.fn();
      (_showElement as jest.Mock).mockImplementation(showElementMock);
      const fnBeforeChangeCallback = jest.fn();
      fnBeforeChangeCallback.mockReturnValue(false);

      mockTour.onbeforechange(fnBeforeChangeCallback);

      // Act
      await nextStep(mockTour);

      // Assert
      expect(fnBeforeChangeCallback).toHaveBeenCalledTimes(1);
      expect(showElementMock).toHaveBeenCalledTimes(0);
    });

    test("should wait for the onBeforeChange promise object", async () => {
      // Arrange
      const mockTour = getMockTour();
      const showElementMock = jest.fn();
      (_showElement as jest.Mock).mockImplementation(showElementMock);

      const onBeforeChangeMock = jest.fn();
      const sideEffect: number[] = [];

      mockTour.onbeforechange(async () => {
        return new Promise<boolean>((res) => {
          setTimeout(() => {
            sideEffect.push(1);
            onBeforeChangeMock();
            res(true);
          }, 50);
        });
      });

      expect(sideEffect).toHaveLength(0);

      // Act
      await nextStep(mockTour);

      // Assert
      expect(sideEffect).toHaveLength(1);
      expect(onBeforeChangeMock).toHaveBeenCalledBefore(showElementMock);
    });

    test("should call the complete callback", async () => {
      // Arrange
      const mockTour = getMockTour();
      const fnCompleteCallback = jest.fn();
      mockTour.oncomplete(fnCompleteCallback);

      // Act
      await nextStep(mockTour);
      await nextStep(mockTour);

      // Assert
      expect(fnCompleteCallback).toBeCalledTimes(1);
      expect(fnCompleteCallback).toHaveBeenCalledWith(2, "end");
    });

    test("should be able to add steps using addStep()", async () => {
      // Arrange
      const mockTour = getMockTour();
      mockTour.addStep({
        element: createElement("div"),
        intro: "test step",
      });

      // Act
      await mockTour.render();

      // Assert
      expect(mockTour.getSteps()).toHaveLength(1);
      expect(mockTour.getStep(0).intro).toBe("test step");
    });

    test("should be able to add steps using addSteps()", async () => {
      // Arrange
      const mockTour = getMockTour();

      mockTour.addSteps([
        {
          intro: "first step",
        },
        {
          element: createElement("div"),
          intro: "second step",
        },
      ]);

      // Act
      await mockTour.render();

      // Assert
      expect(mockTour.getSteps()).toHaveLength(2);
      expect(mockTour.getStep(0).intro).toBe("first step");
      expect(mockTour.getStep(1).intro).toBe("second step");
    });
  });

  describe("fetchSteps", () => {
    test("should add floating element from options.steps to the list", () => {
      // Arrange
      const mockTour = getMockTour();
      mockTour.setOption("steps", getMockSteps());

      // Act
      const steps = fetchSteps(mockTour);

      // Assert
      expect(steps.length).toBe(4);

      expect(steps[0].position).toBe("floating");
      expect(steps[0].intro).toBe("Step One of the tour");
      expect(steps[0].step).toBe(1);

      expect(steps[1].position).toBe("floating");
      expect(steps[1].intro).toBe("Step Two of the tour");
      expect(steps[1].step).toBe(2);
    });

    test("should find and add elements from options.steps to the list", () => {
      // Arrange
      const mockTour = getMockTour();
      const [mockStepOneElement, mockStepTwoElement, _, __] = appendMockSteps();

      // Act
      const steps = fetchSteps(mockTour);

      // Assert
      expect(steps.length).toBe(7);

      expect(steps[0].element).toBe(mockStepOneElement);
      expect(steps[0].position).toBe("bottom");
      expect(steps[0].intro).toBe("first");
      expect(steps[0].step).toBe(1);

      expect(steps[1].element).toBe(mockStepTwoElement);
      expect(steps[1].position).toBe("top");
      expect(steps[1].intro).toBe("second");
      expect(steps[1].step).toBe(2);

      expect(steps[2].position).toBe("floating");
      expect(steps[2].intro).toBe("third");
      expect(steps[2].step).toBe(3);
    });

    test("should find the data-* elements from the DOM", () => {
      // Arrange
      const targetElement = createElement("div");
      appendMockSteps(targetElement);
      const mockTour = getMockTour(targetElement);

      // Act
      const steps = fetchSteps(mockTour);

      // Assert
      expect(steps.length).toBe(2);

      expect(steps[0].position).toBe("bottom");
      expect(steps[0].intro).toBe("first");
      expect(steps[0].step).toBe(1);

      expect(steps[1].position).toBe("left");
      expect(steps[1].intro).toBe("second");
      expect(steps[1].step).toBe(2);
    });

    test("should respect the custom step attribute (DOM)", () => {
      // Arrange
      appendMockSteps();

      const mockTour = getMockTour();

      // Act
      const steps = fetchSteps(mockTour);

      // Assert
      expect(steps.length).toBe(2);

      expect(steps[0].intro).toBe("first");
      expect(steps[0].step).toBe(1);

      expect(steps[1].intro).toBe("second");
      expect(steps[1].step).toBe(5);
    });

    test("should ignore DOM elements when options.steps is available", () => {
      // Arrange
      appendMockSteps();
      var mockTour = getMockTour();
      mockTour.setOption("steps", getMockSteps());

      // Act
      const steps = fetchSteps(mockTour);

      // Assert
      expect(steps.length).toBe(2);
      expect(steps[0].intro).toBe("steps-first");
      expect(steps[1].intro).toBe("steps-second");
    });

    it("should correctly sort based on data-step", () => {
      // Arrange
      const targetElement = document.createElement("div");
      appendMockSteps(targetElement);
      const mockTour = getMockTour(targetElement);

      // Act
      const steps = fetchSteps(mockTour);

      // Assert
      expect(steps.length).toBe(4);

      expect(steps[0].intro).toBe("one");
      expect(steps[0].step).toBe(1);

      expect(steps[1].intro).toBe("two");
      expect(steps[1].step).toBe(2);

      expect(steps[2].intro).toBe("three");
      expect(steps[2].step).toBe(3);

      expect(steps[3].intro).toBe("four");
      expect(steps[3].step).toBe(5);
    });
  });
});
