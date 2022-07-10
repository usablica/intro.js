import { nextStep, previousStep } from "../../src/core/steps";
import _showElement from "../../src/core/showElement";

jest.mock("../../src/core/showElement");

describe("steps", () => {
  let context = {};

  beforeEach(() => {
    context = {
      _currentStep: 0,
      _introItems: [
        {
          tooltip: "hello",
          position: "top",
        },
        {
          tooltip: "world",
          position: "top",
        },
      ],
    };
  });

  describe("previousStep", () => {
    test("should decrement the step counter", async () => {
      context._currentStep = 1;

      await previousStep.call(context);

      expect(context._currentStep).toBe(0);
    });

    test("should not decrement when step is 0", async () => {
      expect(context._currentStep).toBe(0);

      await previousStep.call(context);

      expect(context._currentStep).toBe(0);
    });
  });

  describe("nextStep", () => {
    test("should increment the step counter", async () => {
      expect(context._currentStep).toBe(0);

      await nextStep.call(context);

      expect(context._currentStep).toBe(1);
    });

    test("should call ShowElement", async () => {
      const showElementMock = jest.fn();
      _showElement.mockImplementation(showElementMock);

      await nextStep.call(context);

      expect(showElementMock).toHaveBeenCalledTimes(1);
    });

    test("should call the onBeforeChange callback", async () => {
      const mock = jest.fn();

      context._introBeforeChangeCallback = mock;

      await nextStep.call(context);

      expect(mock).toHaveBeenCalledTimes(1);
    });

    test("should wait for the onBeforeChange promise object", async () => {
      const showElementMock = jest.fn();
      _showElement.mockImplementation(showElementMock);

      const onBeforeChangeMock = jest.fn();
      const sideEffect = [];

      context._introBeforeChangeCallback = async () => {
        return new Promise((res) => {
          setTimeout(() => {
            sideEffect.push(1);
            onBeforeChangeMock();
            res();
          }, 50);
        });
      };

      expect(sideEffect).toHaveLength(0);

      await nextStep.call(context);

      expect(sideEffect).toHaveLength(1);
      expect(onBeforeChangeMock).toHaveBeenCalledBefore(showElementMock);
    });
  });
});
