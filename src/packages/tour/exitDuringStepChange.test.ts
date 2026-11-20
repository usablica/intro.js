import { getMockTour } from "./mock";
import { Tour } from "./tour";
import { sleep, waitMsForExitTransition } from "../../util/sleep";

// The tour can be exited while a step change is still in progress, e.g. the
// user presses Escape while an async onBeforeChange is running. The step
// change must then be dropped instead of re-opening the tour or throwing.
describe("exiting the tour during a step change", () => {
  let mockTour: Tour;
  let errors: unknown[];
  const onUnhandled = (reason: unknown) => errors.push(reason);

  const tooltip = () => document.querySelector(".introjs-tooltip");

  beforeEach(() => {
    document.body.innerHTML = "";
    errors = [];
    process.on("unhandledRejection", onUnhandled);
    mockTour = getMockTour();
    mockTour.setOptions({
      steps: [{ intro: "step one" }, { intro: "step two" }, { intro: "three" }],
    });
  });

  afterEach(async () => {
    process.off("unhandledRejection", onUnhandled);
    await mockTour.exit(true);
    await sleep(waitMsForExitTransition);
  });

  test("drops nextStep when the tour exits while an async onBeforeChange runs", async () => {
    // Arrange
    await mockTour.start();
    const onAfterChange = jest.fn();
    mockTour
      .onBeforeChange(async () => {
        await sleep(50);
        return true;
      })
      .onAfterChange(onAfterChange);

    // Act
    const pending = mockTour.nextStep();
    await sleep(10);
    await mockTour.exit();
    await pending;
    await sleep(waitMsForExitTransition);

    // Assert - the tour stays closed
    expect(mockTour.getCurrentStep()).toBeUndefined();
    expect(tooltip()).toBeNull();
    expect(onAfterChange).not.toBeCalled();
    expect(errors).toEqual([]);
  });

  test("drops previousStep when the tour exits while an async onBeforeChange runs", async () => {
    // Arrange
    await mockTour.start();
    await mockTour.nextStep();
    mockTour.onBeforeChange(async () => {
      await sleep(50);
      return true;
    });

    // Act
    const pending = mockTour.previousStep();
    await sleep(10);
    await mockTour.exit();
    await pending;
    await sleep(waitMsForExitTransition);

    // Assert
    expect(mockTour.getCurrentStep()).toBeUndefined();
    expect(tooltip()).toBeNull();
    expect(errors).toEqual([]);
  });

  test("does not throw when nextStep and exit are called in the same tick", async () => {
    // Arrange
    await mockTour.start();

    // Act
    const pending = mockTour.nextStep();
    const exiting = mockTour.exit();
    await expect(pending).resolves.toBe(mockTour);
    await exiting;
    await sleep(waitMsForExitTransition);

    // Assert
    expect(mockTour.getCurrentStep()).toBeUndefined();
    expect(tooltip()).toBeNull();
    expect(errors).toEqual([]);
  });

  test("does not open the tour when it exits while the first onBeforeChange runs", async () => {
    // Arrange
    const onAfterChange = jest.fn();
    mockTour
      .onBeforeChange(async () => {
        await sleep(50);
        return true;
      })
      .onAfterChange(onAfterChange);

    // Act
    const starting = mockTour.start();
    await sleep(10);
    await mockTour.exit(true);
    await starting;
    await sleep(waitMsForExitTransition);

    // Assert
    expect(mockTour.getCurrentStep()).toBeUndefined();
    expect(tooltip()).toBeNull();
    expect(onAfterChange).not.toBeCalled();
    expect(errors).toEqual([]);
  });

  test("does not throw when start and exit are called in the same tick", async () => {
    // Arrange
    const onAfterChange = jest.fn();
    mockTour.onAfterChange(onAfterChange);

    // Act
    const starting = mockTour.start();
    await sleep(0);
    const exiting = mockTour.exit();
    await expect(starting).resolves.toBe(mockTour);
    await exiting;
    await sleep(waitMsForExitTransition);

    // Assert
    expect(mockTour.getCurrentStep()).toBeUndefined();
    expect(onAfterChange).not.toBeCalled();
    expect(errors).toEqual([]);
  });

  test("does not fire afterChange or a step event when the tour exits while the step renders", async () => {
    // Arrange
    await mockTour.start();
    const onAfterChange = jest.fn();
    const onEvent = jest.fn();
    mockTour.onAfterChange(onAfterChange).onEvent(onEvent);
    // make the render slow enough to exit in the middle of it
    jest.spyOn(mockTour, "waitForRender").mockImplementation(async () => {
      await sleep(50);
    });

    // Act
    const pending = mockTour.nextStep();
    await sleep(10);
    await mockTour.exit();
    await pending;

    // Assert
    expect(onAfterChange).not.toBeCalled();
    expect(onEvent.mock.calls.map(([e]) => e.type)).toEqual(["exit"]);
    expect(errors).toEqual([]);
  });

  test("still moves to the next step when nothing exits the tour", async () => {
    // Arrange
    await mockTour.start();
    mockTour.onBeforeChange(async () => {
      await sleep(20);
      return true;
    });

    // Act
    await mockTour.nextStep();

    // Assert
    expect(mockTour.getCurrentStep()).toBe(1);
    expect(tooltip()).not.toBeNull();
  });
});
