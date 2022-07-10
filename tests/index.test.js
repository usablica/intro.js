import introJs from "../src";
import {
  find,
  content,
  className,
  skipButton,
  nextButton,
  prevButton,
  doneButton,
  tooltipText,
  appendDummyElement,
} from "./helper";

jest.mock("../src/core/dontShowAgain");

import { getDontShowAgain, setDontShowAgain } from "../src/core/dontShowAgain";

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

  test("should call onexit and oncomplete when there is one step", async () => {
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

    await nextButton().click();

    expect(onexitMock).toBeCalledTimes(1);
    expect(oncompleteMMock).toBeCalledTimes(1);
  });

  test("should call onexit when skip is clicked", async () => {
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

    await skipButton().click();

    expect(onexitMock).toBeCalledTimes(1);
    expect(oncompleteMMock).toBeCalledTimes(1);
  });

  test("should call not oncomplete when skip is clicked and there are two steps", () => {
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

  test("should set the onstart callback", () => {
    const fn = jest.fn();

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
      .onstart(fn);

    expect(intro._introStartCallback).toBe(fn);
  });

  test("should set a unique stamp for each instance", () => {
    const intro1 = introJs();
    const intro2 = introJs();
    const intro3 = introJs();

    expect(intro1["introjs-instance"]).not.toBeNull();
    expect(intro2["introjs-instance"]).not.toBeNull();
    expect(intro3["introjs-instance"]).not.toBeNull();
    expect(intro1["introjs-instance"]).not.toBe(intro2["introjs-instance"]);
    expect(intro2["introjs-instance"]).not.toBe(intro3["introjs-instance"]);
  });

  test("should not append the dontShowAgain checkbox when its inactive", () => {
    introJs()
      .setOptions({
        dontShowAgain: false,
        steps: [
          {
            intro: "hello world",
          },
        ],
      })
      .start();

    expect(find(".introjs-dontShowAgain")).toBeNull();
  });

  test("should append the dontShowAgain checkbox", () => {
    introJs()
      .setOptions({
        dontShowAgain: true,
        steps: [
          {
            intro: "hello world",
          },
        ],
      })
      .start();

    expect(find(".introjs-dontShowAgain")).not.toBeNull();
  });

  test("should call setDontShowAgain when then checkbox is clicked", () => {
    introJs()
      .setOptions({
        dontShowAgain: true,
        steps: [
          {
            intro: "hello world",
          },
        ],
      })
      .start();

    const checkbox = find(".introjs-dontShowAgain input");

    checkbox.click();

    expect(setDontShowAgain).toBeCalledTimes(1);
    expect(setDontShowAgain).toBeCalledWith(true);
  });

  describe("isActive", () => {
    test("should be false if isActive flag is false", () => {
      const intro = introJs().setOptions({
        isActive: false,
      });

      expect(intro.isActive()).toBeFalsy();
    });
    test("should be true if dontShowAgain is active but cookie is missing", () => {
      getDontShowAgain.mockReturnValueOnce(false);

      const intro = introJs().setOptions({
        isActive: true,
        dontShowAgain: true,
      });

      expect(intro.isActive()).toBeTruthy();
    });

    test("should be false if dontShowAgain is active but isActive is true", () => {
      getDontShowAgain.mockReturnValueOnce(true);

      const intro = introJs().setOptions({
        isActive: true,
        dontShowAgain: true,
      });

      expect(intro.isActive()).toBeFalsy();
    });
  });
});
