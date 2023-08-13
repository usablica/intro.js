import introJs from "../../../src/index";

describe("exitIntro", () => {
  test("should reset the _currentStep", () => {
    const intro = introJs();
    intro
      .setOptions({
        steps: [
          {
            intro: "step one",
            element: document.querySelector("h1"),
          },
        ],
      })
      .start();

    intro.exit(false);

    expect(intro._currentStep).toBe(-1);
  });

  test("should call the onexit and onbeforeexit callbacks", async () => {
    const fnOnExit = jest.fn();
    const fnOnBeforeExit = jest.fn();
    fnOnBeforeExit.mockReturnValue(true);

    const intro = introJs(document.body);
    intro
      .setOptions({
        steps: [
          {
            intro: "step one",
            element: document.querySelector("h1") as HTMLElement,
          },
        ],
      })
      .onexit(fnOnExit)
      .onbeforeexit(fnOnBeforeExit);

    await intro.start();
    await intro.exit(false);

    expect(fnOnExit).toBeCalledTimes(1);

    expect(fnOnBeforeExit).toBeCalledTimes(1);
    expect(fnOnBeforeExit).toHaveBeenCalledWith(document.body);
    expect(fnOnBeforeExit).toHaveBeenCalledBefore(fnOnExit);
  });

  test("should not continue when onbeforeexit returns false", async () => {
    const fnOnExit = jest.fn();
    const fnOnBeforeExit = jest.fn();
    fnOnBeforeExit.mockReturnValue(false);

    const intro = introJs(document.body);
    intro
      .setOptions({
        steps: [
          {
            intro: "step one",
            element: document.querySelector("h1"),
          },
        ],
      })
      .onexit(fnOnExit)
      .onbeforeexit(fnOnBeforeExit);

    await intro.start();
    await intro.exit(false);

    expect(fnOnExit).toBeCalledTimes(0);

    expect(fnOnBeforeExit).toBeCalledTimes(1);
    expect(fnOnBeforeExit).toHaveBeenCalledWith(document.body);
  });

  test("should not continue when exit force is true", async () => {
    const fnOnExit = jest.fn();
    const fnOnBeforeExit = jest.fn();
    fnOnBeforeExit.mockReturnValue(false);

    const intro = introJs(document.body);
    intro
      .setOptions({
        steps: [
          {
            intro: "step one",
            element: document.querySelector("h1"),
          },
        ],
      })
      .onexit(fnOnExit)
      .onbeforeexit(fnOnBeforeExit);

    await intro.start();
    await intro.exit(false);

    expect(fnOnExit).toBeCalledTimes(0);
    expect(fnOnBeforeExit).toBeCalledTimes(1);
  });

  test("should continue when exit force is true and beforeExit callback returns false", async () => {
    const fnOnExit = jest.fn();
    const fnOnBeforeExit = jest.fn();
    fnOnBeforeExit.mockReturnValue(false);

    const intro = introJs(document.body);
    intro
      .setOptions({
        steps: [
          {
            intro: "step one",
            element: document.querySelector("h1") as HTMLElement,
          },
        ],
      })
      .onexit(fnOnExit)
      .onbeforeexit(fnOnBeforeExit);

    await intro.start();
    await intro.exit(true);

    expect(fnOnExit).toBeCalledTimes(1);
    expect(fnOnBeforeExit).toBeCalledTimes(1);
  });
});
