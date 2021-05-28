import introJs from "../src";
import {
  content,
  className,
  skipButton,
  nextButton,
  prevButton,
  doneButton,
  tooltipText,
  appendDummyElement,
} from "./helper";

describe("intro", () => {
  beforeEach(() => {
    document.getElementsByTagName("html")[0].innerHTML = "";
  });

  test("should start floating intro with one step", () => {
    introJs()
      .setOptions({
        steps: [
          {
            intro: "hello world",
          },
        ],
      })
      .start();

    expect(content(tooltipText())).toBe("hello world");

    expect(content(doneButton())).toBe("Done");

    expect(prevButton()).toBeNull();

    expect(className(".introjs-showElement")).toContain(
      "introjsFloatingElement"
    );
    expect(className(".introjs-showElement")).toContain(
      "introjs-relativePosition"
    );
  });

  test("should call onexit and oncomplete when there is one step", () => {
    const onexitMock = jest.fn();
    const oncompleteMMock = jest.fn();

    introJs()
      .setOptions({
        steps: [
          {
            intro: "hello world",
          },
        ],
      })
      .onexit(onexitMock)
      .oncomplete(oncompleteMMock)
      .start();

    nextButton().click();

    expect(onexitMock).toBeCalledTimes(1);
    expect(oncompleteMMock).toBeCalledTimes(1);
  });

  test("should call onexit when skip is clicked", () => {
    const onexitMock = jest.fn();
    const oncompleteMMock = jest.fn();

    introJs()
      .setOptions({
        steps: [
          {
            intro: "hello world",
          },
        ],
      })
      .onexit(onexitMock)
      .oncomplete(oncompleteMMock)
      .start();

    skipButton().click();

    expect(onexitMock).toBeCalledTimes(1);
    expect(oncompleteMMock).toBeCalledTimes(1);
  });

  test("should not call oncomplete when skip is clicked and there are two steps", () => {
    const onexitMock = jest.fn();
    const oncompleteMMock = jest.fn();

    introJs()
      .setOptions({
        steps: [
          {
            intro: "first",
          },
          {
            intro: "second",
          },
        ],
      })
      .onexit(onexitMock)
      .oncomplete(oncompleteMMock)
      .start();

    skipButton().click();

    expect(onexitMock).toBeCalledTimes(1);
    expect(oncompleteMMock).toBeCalledTimes(0);
  });

  test("should start floating intro with two steps", () => {
    introJs()
      .setOptions({
        steps: [
          {
            intro: "step one",
          },
          {
            intro: "step two",
          },
        ],
      })
      .start();

    expect(content(tooltipText())).toBe("step one");

    expect(doneButton()).toBeNull();

    expect(prevButton()).not.toBeNull();
    expect(className(prevButton())).toContain("introjs-disabled");

    expect(nextButton()).not.toBeNull();
    expect(className(nextButton())).not.toContain("introjs-disabled");

    expect(className(".introjs-showElement")).toContain(
      "introjsFloatingElement"
    );
    expect(className(".introjs-showElement")).toContain(
      "introjs-relativePosition"
    );
  });

  test("should highlight the target element", () => {
    const p = appendDummyElement();

    introJs()
      .setOptions({
        steps: [
          {
            intro: "step one",
            element: document.querySelector("p"),
          },
        ],
      })
      .start();

    expect(p.className).toContain("introjs-showElement");
    expect(p.className).toContain("introjs-relativePosition");
  });

  test("should not highlight the target element if queryString is incorrect", () => {
    const p = appendDummyElement();

    introJs()
      .setOptions({
        steps: [
          {
            intro: "step one",
            element: document.querySelector("div"),
          },
        ],
      })
      .start();

    expect(p.className).not.toContain("introjs-showElement");
    expect(className(".introjs-showElement")).toContain(
      "introjsFloatingElement"
    );
  });

  test("should not add relativePosition if target element is fixed or absolute", () => {
    const absolute = appendDummyElement(
      "h1",
      "hello world",
      "position: absolute"
    );
    const fixed = appendDummyElement("h2", "hello world", "position: fixed");

    const intro = introJs();
    intro
      .setOptions({
        steps: [
          {
            intro: "step one",
            element: document.querySelector("h1"),
          },
          {
            intro: "step two",
            element: document.querySelector("h2"),
          },
        ],
      })
      .start();

    expect(absolute.className).toContain("introjs-showElement");
    expect(absolute.className).not.toContain("introjs-relativePosition");

    intro.nextStep();

    expect(fixed.className).toContain("introjs-showElement");
    expect(fixed.className).not.toContain("introjs-relativePosition");
  });

  test("should only add appropriate step classes on steps", () => {
    const ijs = introJs()
      .setOptions({
        steps: [
          {
            intro: "step one",
          },
          {
            intro: "step two",
          }
        ],
      })
      .start();

    expect(className(".introjs-tooltipReferenceLayer")).toContain(
      "step-1"
    );

    ijs.nextStep();

    expect(className(".introjs-tooltipReferenceLayer")).toContain(
      "step-2"
    );
  });

  test("should add/remove no-title class on appropriate steps", () => {
    const ijs = introJs()
      .setOptions({
        steps: [
          {
            intro: "step one",
          },
          {
            title: "test title",
            intro: "step two",
          },
          {
            intro: "step three"
          }
        ],
      })
      .start();

    expect(className(".introjs-tooltip-header")).toContain(
      "no-title"
    );

    ijs.nextStep();

    expect(className(".introjs-tooltip-header")).not.toContain(
      "no-title"
    );

    ijs.nextStep();

    expect(className(".introjs-tooltip-header")).toContain(
      "no-title"
    );
  });

  test("should call local step events instead of global when available", () => {
    let calledLocalOnBeforeChange = false;
    let calledLocalOnChange = false;
    let calledGlobalOnBeforeChange = false;
    let calledGlobalOnChange = false;

    const ijs = introJs()
      .setOptions({
        steps: [
          {
            intro: "step one",
          },
          {
            intro: "step two",
            onbeforechange (next) {
              calledLocalOnBeforeChange = true;

              next();
            },
            onchange () {
              calledLocalOnChange = true;
            }
          },
          {
            intro: "step three"
          }
        ],
      })
      .onbeforechange(() => {
        calledGlobalOnBeforeChange = true;
      })
      .onchange(() => {
        calledGlobalOnChange = true;
      })
      .start();

    expect(calledLocalOnBeforeChange).toBe(false);
    expect(calledLocalOnChange).toBe(false);
    expect(calledGlobalOnBeforeChange).toBe(true);
    expect(calledGlobalOnChange).toBe(true);

    calledGlobalOnBeforeChange = false;
    calledGlobalOnChange = false;

    ijs.nextStep();

    expect(calledLocalOnBeforeChange).toBe(true);
    expect(calledLocalOnChange).toBe(true);
    expect(calledGlobalOnBeforeChange).toBe(false);
    expect(calledGlobalOnChange).toBe(false);

    calledLocalOnBeforeChange = false;
    calledLocalOnChange = false;

    ijs.nextStep();

    expect(calledLocalOnBeforeChange).toBe(false);
    expect(calledLocalOnChange).toBe(false);
    expect(calledGlobalOnChange).toBe(true);
    expect(calledGlobalOnChange).toBe(true);

    calledGlobalOnBeforeChange = false;
    calledGlobalOnChange = false;
  });
});
