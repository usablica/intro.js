import { getMockTour } from "./mock";
import { Tour } from "./tour";
import dom from "../dom";
import {
  sleep,
  waitMsForDerivations,
  waitMsForExitTransition,
} from "../../util/sleep";

const { div } = dom.tags;

describe("refresh", () => {
  let mockTour: Tour;
  let targetElement: HTMLElement;

  beforeEach(() => {
    mockTour = getMockTour();
    targetElement = div();
    dom.add(document.body, targetElement);
  });

  afterEach(async () => {
    await mockTour.exit();
    await sleep(waitMsForExitTransition);
  });

  test("should not refetch the steps when refreshStep is false", async () => {
    // Arrange
    mockTour.addStep({
      intro: "first",
    });

    await mockTour.start();
    await sleep(waitMsForDerivations);

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
  });

  test("should fetch the steps when refreshStep is true", async () => {
    // Arrange
    mockTour.addStep({
      intro: "first",
    });

    await mockTour.start();
    await sleep(waitMsForDerivations);

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

  test("keeps the theme class on the recreated root when refreshStep is true", async () => {
    // Arrange
    mockTour.setOptions({ theme: "dark" });
    mockTour.addStep({
      intro: "first",
    });

    await mockTour.start();
    await sleep(waitMsForDerivations);

    expect(
      document
        .querySelector(".introjs-tour")
        ?.classList.contains("introjs-dark")
    ).toBe(true);

    // Act - refreshing with refreshSteps recreates the root element
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
    await sleep(waitMsForDerivations);

    // Assert - the newly created root should still carry the theme class
    const newRoot = document.querySelector(".introjs-tour");
    expect(newRoot).not.toBeNull();
    expect(newRoot?.classList.contains("introjs-dark")).toBe(true);
  });
});
