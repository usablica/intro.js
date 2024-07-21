import { start } from "./start";
import * as steps from "./steps";
import * as addOverlayLayer from "./addOverlayLayer";
import * as nextStep from "./steps";
import { getMockTour } from "./mock";

describe("start", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test("should call the onstart callback", () => {
    jest.spyOn(steps, "fetchSteps").mockReturnValue([]);
    jest.spyOn(addOverlayLayer, "default").mockReturnValue(true);
    jest.spyOn(nextStep, "nextStep").mockReturnValue(Promise.resolve(true));

    const onstartCallback = jest.fn();

    const mockTour = getMockTour();
    mockTour.onStart(onstartCallback);

    start(mockTour);

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

    start(mockTour);

    expect(fetchIntroStepsMock).toBeCalledTimes(0);
    expect(addOverlayLayerMock).toBeCalledTimes(0);
    expect(nextStepMock).toBeCalledTimes(0);
  });

  test("should fetch the steps", async () => {
    // Arrange
    const targetElement = document.createElement("div");
    document.body.appendChild(targetElement);

    const mockTour = getMockTour();
    mockTour.addStep({
      intro: "first",
    });

    // Act
    await mockTour.start();

    // Assert
    expect(mockTour.getSteps()).toHaveLength(1);
    expect(document.querySelectorAll(".introjs-bullets ul li").length).toBe(1);
  });
});
