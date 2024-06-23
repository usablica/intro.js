import { render } from "./render";
import * as steps from "./steps";
import * as addOverlayLayer from "./addOverlayLayer";
import * as nextStep from "./steps";
import { getMockTour } from "./tests/mock";

describe("render", () => {
  test("should call the onstart callback", () => {
    jest.spyOn(steps, "fetchSteps").mockReturnValue([]);
    jest.spyOn(addOverlayLayer, "default").mockReturnValue(true);
    jest.spyOn(nextStep, "nextStep").mockReturnValue(Promise.resolve(true));

    const onstartCallback = jest.fn();

    const mockTour = getMockTour();
    mockTour.onStart(onstartCallback);

    render(mockTour);

    expect(onstartCallback).toBeCalledTimes(1);
    expect(onstartCallback).toBeCalledWith(document.body);
  });

  test("should not start the tour if isActive is false", () => {
    const fetchIntroStepsMock = jest
      .spyOn(steps, "fetchSteps")
      .mockReturnValue([]);
    const addOverlayLayerMock = jest.spyOn(addOverlayLayer, "default");
    const nextStepMock = jest.spyOn(nextStep, "nextStep");

    const mockTour = getMockTour();
    mockTour.setOption("isActive", false);

    render(mockTour);

    expect(fetchIntroStepsMock).toBeCalledTimes(0);
    expect(addOverlayLayerMock).toBeCalledTimes(0);
    expect(nextStepMock).toBeCalledTimes(0);
  });
});
