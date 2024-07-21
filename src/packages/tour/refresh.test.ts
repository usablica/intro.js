import * as tooltip from "../../packages/tooltip";
import { getMockTour } from "./mock";

describe("refresh", () => {
  test("should not refetch the steps when refreshStep is false", async () => {
    // Arrange
    jest.spyOn(tooltip, "placeTooltip");

    const targetElement = document.createElement("div");
    document.body.appendChild(targetElement);

    const mockTour = getMockTour();

    mockTour.addStep({
      intro: "first",
    });

    await mockTour.start();

    // Act
    mockTour.setOptions({
      steps: [
        {
          intro: "first",
        },
        {
          intro: "second",
        },
      ],
    });

    mockTour.refresh();

    // Assert
    expect(mockTour.getSteps()).toHaveLength(1);
    expect(mockTour.getStep(0).intro).toBe("first");
    expect(document.querySelectorAll(".introjs-bullets ul li").length).toBe(1);

    // cleanup
    await mockTour.exit();
  });

  test("should fetch the steps when refreshStep is true", async () => {
    // Arrange
    jest.spyOn(tooltip, "placeTooltip");

    const targetElement = document.createElement("div");
    document.body.appendChild(targetElement);

    const mockTour = getMockTour();

    mockTour.addStep({
      intro: "first",
    });

    await mockTour.start();

    // Act
    mockTour.setOptions({
      steps: [
        {
          intro: "first",
        },
        {
          intro: "second",
        },
      ],
    });

    mockTour.refresh(true);

    // Assert
    expect(mockTour.getSteps()).toHaveLength(2);
    expect(mockTour.getStep(1).intro).toBe("second");
    expect(document.querySelectorAll(".introjs-bullets ul li").length).toBe(2);
  });
});
