import introJs from "../src";
import {
  content,
  className,
  skipButton,
  nextButton,
  prevButton,
  doneButton,
  tooltipText,
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
});
