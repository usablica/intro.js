import introForElement from "../../src/core/introForElement";
import * as fetchIntroSteps from "../../src/core/fetchIntroSteps";
import * as addOverlayLayer from "../../src/core/addOverlayLayer";
import * as nextStep from "../../src/core/steps";
import introJs from "../../src";

describe("introForElement", () => {
  test("should call the onstart callback", () => {
    jest.spyOn(fetchIntroSteps, "default").mockReturnValue(true);
    jest.spyOn(addOverlayLayer, "default").mockReturnValue(true);
    jest.spyOn(nextStep, "nextStep").mockReturnValue(true);

    const onstartCallback = jest.fn();

    const context = introJs().setOptions({
      isActive: true,
    });

    context._introStartCallback = onstartCallback;

    introForElement.call(context, document.body);

    expect(onstartCallback).toBeCalledTimes(1);
    expect(onstartCallback).toBeCalledWith(document.body);
  });

  test("should not start the tour if isActive is false", () => {
    const fetchIntroStepsMock = jest.spyOn(fetchIntroSteps, "default");
    const addOverlayLayerMock = jest.spyOn(addOverlayLayer, "default");
    const nextStepMock = jest.spyOn(nextStep, "nextStep");

    const context = introJs().setOptions({
      isActive: false,
    });

    introForElement.call(context, document.body);

    expect(fetchIntroStepsMock).toBeCalledTimes(0);
    expect(addOverlayLayerMock).toBeCalledTimes(0);
    expect(nextStepMock).toBeCalledTimes(0);
  });
});
