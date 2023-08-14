import { nextStep, previousStep } from "../../../src/core/steps";
import _showElement from "../../../src/core/showElement";
import { IntroJs } from "../../../src/intro";
import introJs from "../../../src";

jest.mock("../../../src/core/showElement");
jest.mock("../../../src/core/exitIntro");

describe("steps", () => {
  let context: IntroJs;

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
      const fnBeforeChangeCallback = jest.fn();
      context._introBeforeChangeCallback = fnBeforeChangeCallback;

      await nextStep(context);

      expect(fnBeforeChangeCallback).toHaveBeenCalledTimes(1);
      expect(fnBeforeChangeCallback).toHaveBeenCalledWith(
        undefined,
        1,
        "forward"
      );
    });

    test("should not continue when onBeforeChange return false", async () => {
      const showElementMock = jest.fn();
      (_showElement as jest.Mock).mockImplementation(showElementMock);
      const fnBeforeChangeCallback = jest.fn();
      fnBeforeChangeCallback.mockReturnValue(false);

      context._introBeforeChangeCallback = fnBeforeChangeCallback;

      await nextStep(context);

      expect(fnBeforeChangeCallback).toHaveBeenCalledTimes(1);
      expect(showElementMock).toHaveBeenCalledTimes(0);
    });

    test("should wait for the onBeforeChange promise object", async () => {
      const showElementMock = jest.fn();
      (_showElement as jest.Mock).mockImplementation(showElementMock);

      const onBeforeChangeMock = jest.fn();
      const sideEffect: number[] = [];

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

    test("should call the complete callback", async () => {
      const fnCompleteCallback = jest.fn();
      context._introCompleteCallback = fnCompleteCallback;
      await nextStep(context);
      await nextStep(context);

      expect(fnCompleteCallback).toBeCalledTimes(1);
      expect(fnCompleteCallback).toHaveBeenCalledWith(2, "end");
    });

    test("should be able to add steps using addStep()", async () => {
      const intro = introJs();

      intro.addStep({
        element: document.createElement("div"),
        intro: "test step",
      });

      await intro.start();

      expect(intro._introItems).toHaveLength(1);
      expect(intro._introItems[0].intro).toBe("test step");
    });

    test("should be able to add steps using addSteps()", async () => {
      const intro = introJs();

      intro.addSteps([
        {
          intro: "first step",
        },
        {
          element: document.createElement("div"),
          intro: "second step",
        },
      ]);

      await intro.start();

      expect(intro._introItems).toHaveLength(2);
      expect(intro._introItems[0].intro).toBe("first step");
      expect(intro._introItems[1].intro).toBe("second step");
    });
  });
});
