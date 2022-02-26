import introForElement from "../../src/core/introForElement";
import * as fetchIntroSteps from "../../src/core/fetchIntroSteps";
import * as addOverlayLayer from "../../src/core/addOverlayLayer";
import * as nextStep from "../../src/core/steps";

describe("introForElement", () => {
  test("should call the onstart callback", () => {
    jest.spyOn(fetchIntroSteps, "default").mockReturnValue(true);
    jest.spyOn(addOverlayLayer, "default").mockReturnValue(true);
    jest.spyOn(nextStep, "nextStep").mockReturnValue(true);

    const onstartCallback = jest.fn();

    const self = {
      _options: {},
      _introStartCallback: onstartCallback,
    };

    introForElement.call(self, document.body);

    expect(onstartCallback).toBeCalledTimes(1);
    expect(onstartCallback).toBeCalledWith(document.body);
  });
});
