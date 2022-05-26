import * as placeTooltip from "../../src/core/placeTooltip";
import introJs from "../../src";

describe("refresh", () => {
  test("should refresh the cached intro steps", () => {
    jest.spyOn(placeTooltip, "default").mockReturnValue(true);

    const targetElement = document.createElement("div");
    document.body.appendChild(targetElement);

    const instance = introJs(targetElement).setOptions({
      steps: [
        {
          intro: "first",
        },
      ],
    });

    instance.start();

    expect(instance._introItems.length).toBe(1);
    expect(document.querySelectorAll(".introjs-bullets ul li").length).toBe(1);

    instance
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
      .refresh();

    expect(instance._introItems.length).toBe(1);
    expect(instance._introItems[0].intro).toBe("first");
    expect(document.querySelectorAll(".introjs-bullets ul li").length).toBe(1);

    instance
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
      .refresh(true);

    expect(instance._introItems.length).toBe(2);
    expect(instance._introItems[0].intro).toBe("first");
    expect(instance._introItems[1].intro).toBe("second");
    expect(document.querySelectorAll(".introjs-bullets ul li").length).toBe(2);
  });
});
