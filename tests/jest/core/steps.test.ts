import { nextStep, previousStep } from "../../../src/core/steps";
import _showElement from "../../../src/core/showElement";
import { IntroJs } from "src/intro";

jest.mock("../../../src/core/showElement");

describe("steps", () => {
  let context: IntroJs = {
    _currentStep: 0,
    _introItems: [],
    _introBeforeChangeCallback: undefined,
  } as IntroJs;

  beforeEach(() => {
    context = {
      _currentStep: 0,
      _introItems: [
        {
          intro: "hello",
          position: "top",
        },
        {
          intro: "world",
          position: "top",
        },
      ],
      _introBeforeChangeCallback: undefined,
    } as IntroJs;
  });

  describe("previousStep", () => {
    test("should decrement the step counter", async () => {
      context._currentStep = 1;

      await previousStep(context);

      expect(context._currentStep).toBe(0);
    });

    test("should not decrement when step is 0", async () => {
      expect(context._currentStep).toBe(0);

      await previousStep(context);

      expect(context._currentStep).toBe(0);
    });
  });

  describe("nextStep", () => {
    test("should increment the step counter", async () => {
      expect(context._currentStep).toBe(0);

      await nextStep(context);

      expect(context._currentStep).toBe(1);
    });

    test("should call ShowElement", async () => {
      const showElementMock = jest.fn();
      (_showElement as jest.Mock).mockImplementation(showElementMock);

      await nextStep(context);

      expect(showElementMock).toHaveBeenCalledTimes(1);
    });

    test("should call the onBeforeChange callback", async () => {
      const mock = jest.fn();

      context._introBeforeChangeCallback = mock;

      await nextStep(context);

      expect(mock).toHaveBeenCalledTimes(1);
    });

    test("should wait for the onBeforeChange promise object", async () => {
      const showElementMock = jest.fn();
      (_showElement as jest.Mock).mockImplementation(showElementMock);

      const onBeforeChangeMock = jest.fn();
      const sideEffect = [];

      context._introBeforeChangeCallback = async () => {
        return new Promise<boolean>((res) => {
          setTimeout(() => {
            sideEffect.push(1);
            onBeforeChangeMock();
            res(true);
          }, 50);
        });
      };

      expect(sideEffect).toHaveLength(0);

      await nextStep(context);

      expect(sideEffect).toHaveLength(1);
      expect(onBeforeChangeMock).toHaveBeenCalledBefore(showElementMock);
    });
  });
});
