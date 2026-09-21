import { axe, toHaveNoViolations } from "jest-axe";
import { Hint } from "./hint";

expect.extend(toHaveNoViolations);

function getMockHint(container: HTMLElement) {
  let options: any = {};
  let hintsAddedCb: Function | null = null;
  let hintClickCb: Function | null = null;
  let hintCloseCb: Function | null = null;

  return {
    setOptions(opts: any) {
      options = opts;
      return this;
    },
    addHints() {
      if (!options.hints) return;
      options.hints.forEach((h: any, idx: number) => {
        const el =
          typeof h.element === "string"
            ? container.querySelector(h.element)
            : h.element;
        if (!el) return;

        // create mock hint element
        const hintEl = document.createElement("button");
        hintEl.setAttribute("data-hint-id", idx.toString());
        hintEl.setAttribute("aria-label", h.hint || "Hint");
        hintEl.textContent = "?";
        el.insertAdjacentElement("afterend", hintEl);

        hintEl.addEventListener("click", () => {
          if (hintClickCb) hintClickCb(hintEl, h, idx);
        });
      });
      if (hintsAddedCb) hintsAddedCb();
    },
    onhintsadded(cb: Function) {
      hintsAddedCb = cb;
    },
    onhintclick(cb: Function) {
      hintClickCb = cb;
    },
    onhintclose(cb: Function) {
      hintCloseCb = cb;
    },
    closeHint(stepId: number) {
      const el = container.querySelector(`[data-hint-id="${stepId}"]`);
      if (el) {
        el.remove();
        if (hintCloseCb) hintCloseCb(stepId);
      }
    },
    getHints() {
      return options.hints || [];
    },
  };
}

test("should have no accessibility violations for all hints", async () => {
  const container = document.createElement("main");
  container.setAttribute("role", "main");
  document.body.appendChild(container);

  // Mock target elements
  const btn = document.createElement("button");
  btn.id = "btn";
  btn.textContent = "Click me";
  container.appendChild(btn);

  const img = document.createElement("img");
  img.id = "img";
  img.src = "https://via.placeholder.com/100";
  img.alt = "Sample image";
  container.appendChild(img);

  // Create mock hint
  const mockHint = getMockHint(container);
  mockHint.setOptions({
    hints: [
      { element: "#btn", hint: "This is a button" },
      { element: "#img", hint: "This is an image" },
    ],
  });

  mockHint.onhintsadded(() => console.log("Hints added"));
  type HintOption = { element: string | HTMLElement; hint?: string };

  mockHint.onhintclick((item: HintOption, idx: number) =>
    console.log("Hint clicked", idx, item)
  );
  mockHint.onhintclose((idx: number) => console.log("Hint closed", idx));

  // Add hints
  mockHint.addHints();

  // Run accessibility test
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});

describe("enableHintAutoRefresh / disableHintAutoRefresh", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("disableHintAutoRefresh removes the same scroll and resize listeners that enableHintAutoRefresh added", () => {
    const addSpy = jest.spyOn(window, "addEventListener");
    const removeSpy = jest.spyOn(window, "removeEventListener");

    const hint = new Hint();
    hint.enableHintAutoRefresh();

    const scrollHandler = addSpy.mock.calls.find(
      ([type]) => type === "scroll"
    )?.[1];
    const resizeHandler = addSpy.mock.calls.find(
      ([type]) => type === "resize"
    )?.[1];

    expect(scrollHandler).toBeDefined();
    expect(resizeHandler).toBeDefined();
    // enableHintAutoRefresh uses the same debounced function for both events
    expect(scrollHandler).toBe(resizeHandler);

    hint.disableHintAutoRefresh();

    expect(removeSpy).toHaveBeenCalledWith("scroll", scrollHandler, true);
    expect(removeSpy).toHaveBeenCalledWith("resize", resizeHandler, true);
  });

  test("does not leak a duplicate resize listener on disableHintAutoRefresh", () => {
    const addSpy = jest.spyOn(window, "addEventListener");

    const hint = new Hint();
    hint.enableHintAutoRefresh();
    const resizeAddCallsBeforeDisable = addSpy.mock.calls.filter(
      ([type]) => type === "resize"
    ).length;

    hint.disableHintAutoRefresh();

    const resizeAddCallsAfterDisable = addSpy.mock.calls.filter(
      ([type]) => type === "resize"
    ).length;

    // disableHintAutoRefresh should only ever remove listeners, never add new ones
    expect(resizeAddCallsAfterDisable).toBe(resizeAddCallsBeforeDisable);
  });
});
