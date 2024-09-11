import { getMockTour } from "./mock";

describe("exitIntro", () => {
  test("should reset the _currentStep", async () => {
    const mockTour = getMockTour();
    mockTour.addStep({ element: document.querySelector("h1") });
    await mockTour.start();

    await mockTour.exit(false);

    expect(mockTour.getCurrentStep()).toBeUndefined();
  });

  test("should call the onexit and onbeforeexit callbacks", async () => {
    const fnOnExit = jest.fn();
    const fnOnBeforeExit = jest.fn();
    fnOnBeforeExit.mockReturnValue(true);

    const mockTour = getMockTour();
    mockTour.addStep({ element: document.querySelector("h1") });
    mockTour.onExit(fnOnExit);
    mockTour.onBeforeExit(fnOnBeforeExit);

    await mockTour.start();
    await mockTour.exit(false);

    expect(fnOnExit).toBeCalledTimes(1);

    expect(fnOnBeforeExit).toBeCalledTimes(1);
    expect(fnOnBeforeExit).toHaveBeenCalledWith(document.body);
    expect(fnOnBeforeExit).toHaveBeenCalledBefore(fnOnExit);
  });

  test("should not continue when onbeforeexit returns false", async () => {
    const fnOnExit = jest.fn();
    const fnOnBeforeExit = jest.fn();
    fnOnBeforeExit.mockReturnValue(false);

    const mockTour = getMockTour();
    mockTour.addStep({ element: document.querySelector("h1") });
    mockTour.onExit(fnOnExit);
    mockTour.onBeforeExit(fnOnBeforeExit);

    await mockTour.start();
    await mockTour.exit(false);

    expect(fnOnExit).toBeCalledTimes(0);

    expect(fnOnBeforeExit).toBeCalledTimes(1);
    expect(fnOnBeforeExit).toHaveBeenCalledWith(document.body);

    // test cleanup
    document.body.innerHTML = "";
  });

  test("should not continue when exit force is true", async () => {
    const fnOnExit = jest.fn();
    const fnOnBeforeExit = jest.fn();
    fnOnBeforeExit.mockReturnValue(false);

    const mockTour = getMockTour();
    mockTour.addStep({ element: document.querySelector("h1") });
    mockTour.onExit(fnOnExit);
    mockTour.onBeforeExit(fnOnBeforeExit);

    await mockTour.start();
    await mockTour.exit(false);

    expect(fnOnExit).toBeCalledTimes(0);
    expect(fnOnBeforeExit).toBeCalledTimes(1);

    // test cleanup
    document.body.innerHTML = "";
  });

  test("should continue when exit force is true and beforeExit callback returns false", async () => {
    const fnOnExit = jest.fn();
    const fnOnBeforeExit = jest.fn();
    fnOnBeforeExit.mockReturnValue(false);

    const mockTour = getMockTour();
    mockTour.addStep({ element: document.querySelector("h1") });
    mockTour.onExit(fnOnExit);
    mockTour.onBeforeExit(fnOnBeforeExit);

    await mockTour.start();
    await mockTour.exit(true);

    expect(fnOnExit).toBeCalledTimes(1);
    expect(fnOnBeforeExit).toBeCalledTimes(1);
  });
});
