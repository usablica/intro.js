import { fetchSteps, nextStep, previousStep } from "./steps";
import _showElement from "./showElement";
import { appendMockSteps, getMockPartialSteps, getMockSteps, getMockTour } from "./tests/mock";
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
      mockTour.setSteps(getMockSteps());

      // Act
      await nextStep(mockTour);

      // Assert
      expect(showElementMock).toHaveBeenCalledTimes(1);
    });

    test("should call the onBeforeChange callback", async () => {
      // Arrange
      const mockTour = getMockTour();
      mockTour.setSteps(getMockSteps());
      const fnBeforeChangeCallback = jest.fn();
      mockTour.onBeforeChange(fnBeforeChangeCallback);

      // Act
      await nextStep(mockTour);

      // Assert
      expect(fnBeforeChangeCallback).toHaveBeenCalledTimes(1);
      expect(fnBeforeChangeCallback).toHaveBeenCalledWith(
        undefined,
        0,
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

      mockTour.onBeforeChange(fnBeforeChangeCallback);

      // Act
      await nextStep(mockTour);

      // Assert
      expect(fnBeforeChangeCallback).toHaveBeenCalledTimes(1);
      expect(showElementMock).toHaveBeenCalledTimes(0);
    });

    test("should wait for the onBeforeChange promise object", async () => {
      // Arrange
      const mockTour = getMockTour();
      mockTour.setSteps(getMockSteps());
      const showElementMock = jest.fn();
      (_showElement as jest.Mock).mockImplementation(showElementMock);

      const onBeforeChangeMock = jest.fn();
      const sideEffect: number[] = [];

      mockTour.onBeforeChange(async () => {
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
      mockTour.setSteps(getMockSteps().slice(0, 2));
      const fnCompleteCallback = jest.fn();
      mockTour.onComplete(fnCompleteCallback);

      // Act
      await nextStep(mockTour);
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
      expect(steps.length).toBe(5);

      expect(steps[0].position).toBe("floating");
      expect(steps[0].title).toBe("Floating title 1");
      expect(steps[0].intro).toBe("Step One of the tour");
      expect(steps[0].step).toBe(1);

      expect(steps[1].position).toBe("floating");
      expect(steps[1].title).toBe("Floating title 2");
      expect(steps[1].intro).toBe("Step Two of the tour");
      expect(steps[1].step).toBe(2);
    });

    test("should find and add elements from options.steps to the list", () => {
      // Arrange
      document.body.appendChild(createElement("h1"));

      const mockTour = getMockTour();
      mockTour.addSteps(getMockPartialSteps());

      // Act
      const steps = fetchSteps(mockTour);

      // Assert
      expect(steps.length).toBe(5);

      expect(steps[0].position).toBe("floating");
      expect(steps[0].title).toBe("Floating title 1");
      expect(steps[0].intro).toBe("Step One of the tour");
      expect(steps[0].step).toBe(1);

      expect(steps[1].position).toBe("floating");
      expect(steps[1].title).toBe("Floating title 2");
      expect(steps[1].intro).toBe("Step Two of the tour");
      expect(steps[1].step).toBe(2);

      expect(steps[2].position).toBe("top");
      expect(steps[2].title).toBe("First title");
      expect(steps[2].intro).toBe("Step Three of the tour");
      expect(steps[2].step).toBe(3);

      expect(steps[3].element).toStrictEqual(getMockPartialSteps()[3].element);
      expect(steps[3].position).toBe("right");
      expect(steps[3].intro).toBe("Step Four of the tour");
      expect(steps[3].step).toBe(4);

      expect(steps[4].position).toBe("floating");
      expect(steps[4].intro).toBe("Element not found");
      expect(steps[4].step).toBe(5);
    });

    test("should find the data-* elements from the DOM with the correct order", () => {
      // Arrange
      const targetElement = createElement("div");
      const [mockElementOne, mockElementTwo, mockElementThree, mockElementFour] = appendMockSteps(targetElement);
      const mockTour = getMockTour(targetElement);

      // Act
      const steps = fetchSteps(mockTour);

      // Assert
      expect(steps.length).toBe(4);

      expect(steps[0].position).toBe("bottom");
      expect(steps[0].intro).toBe("Mock element");
      expect(steps[0].element).toBe(mockElementOne);
      expect(steps[0].step).toBe(1);

      expect(steps[1].position).toBe("left");
      expect(steps[1].intro).toBe("Mock element left position");
      expect(steps[1].element).toBe(mockElementTwo);
      expect(steps[1].step).toBe(2);

      expect(steps[2].position).toBe("bottom");
      expect(steps[2].intro).toBe("Mock element second to last");
      expect(steps[2].element).toBe(mockElementThree);
      expect(steps[2].step).toBe(10);

      expect(steps[3].position).toBe("bottom");
      expect(steps[3].intro).toBe("Mock element last");
      expect(steps[3].element).toBe(mockElementFour);
      expect(steps[3].step).toBe(20);
    });

    test("should respect the custom step attribute (DOM)", () => {
      // Arrange
      appendMockSteps();

      const mockTour = getMockTour();

      // Act
      const steps = fetchSteps(mockTour);

      // Assert
      expect(steps.length).toBe(4);

      expect(steps[2].intro).toBe("Mock element second to last");
      expect(steps[2].step).toBe(10);

      expect(steps[3].intro).toBe("Mock element last");
      expect(steps[3].step).toBe(20);
    });

    test("should ignore DOM elements when options.steps is available", () => {
      // Arrange
      appendMockSteps();
      var mockTour = getMockTour();
      mockTour.setOption("steps", getMockSteps());

      // Act
      const steps = fetchSteps(mockTour);

      // Assert
      expect(steps.length).toBe(5);
      expect(steps[0].intro).toBe("Step One of the tour");
      expect(steps[1].intro).toBe("Step Two of the tour");
    });
  });
});
