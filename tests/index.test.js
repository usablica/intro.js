import introJs from "../src";
import { find, content, className } from "./helper";

describe("intro", () => {
  afterEach(() => {
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

    expect(content(".introjs-tooltiptext")).toBe("hello world");

    expect(content(".introjs-donebutton")).toBe("Done");

    expect(find(".introjs-prevbutton")).toBeNull();

    expect(className(".introjs-showElement")).toContain(
      "introjsFloatingElement"
    );
    expect(className(".introjs-showElement")).toContain(
      "introjs-relativePosition"
    );
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

    expect(content(".introjs-tooltiptext")).toBe("step one");

    expect(find(".introjs-donebutton")).toBeNull();

    expect(find(".introjs-prevbutton")).not.toBeNull();
    expect(className(".introjs-prevbutton")).toContain("introjs-disabled");

    expect(find(".introjs-nextbutton")).not.toBeNull();
    expect(className(".introjs-nextbutton")).not.toContain("introjs-disabled");

    expect(className(".introjs-showElement")).toContain(
      "introjsFloatingElement"
    );
    expect(className(".introjs-showElement")).toContain(
      "introjs-relativePosition"
    );
  });
});
