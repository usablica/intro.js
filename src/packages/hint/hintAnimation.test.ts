import { Hint } from "./hint";

describe("hintAnimation per hint item", () => {
  let target: HTMLElement;

  beforeEach(() => {
    document.body.innerHTML = `<div id="root"><div id="a">A</div><div id="b">B</div></div>`;
    target = document.getElementById("root") as HTMLElement;
  });

  afterEach(() => {
    document.body.innerHTML = "";
  });

  test("hintAnimation: false on a hint item overrides the default true", async () => {
    const hint = new Hint(target, {
      hints: [
        { element: "#a", hint: "A", hintAnimation: false },
        { element: "#b", hint: "B" },
      ],
    });
    await hint.render();

    const items = hint.getHints();
    expect(items[0].hintAnimation).toBe(false);
    expect(items[1].hintAnimation).toBe(true);
    await hint.destroy();
  });

  test("hintAnimation: true on a hint item overrides a global false", async () => {
    const hint = new Hint(target, {
      hintAnimation: false,
      hints: [
        { element: "#a", hint: "A", hintAnimation: true },
        { element: "#b", hint: "B" },
      ],
    });
    await hint.render();

    const items = hint.getHints();
    expect(items[0].hintAnimation).toBe(true);
    expect(items[1].hintAnimation).toBe(false);
    hint.destroy();
  });

  test("the hint icon of an item with hintAnimation: false gets the no-animation class", async () => {
    const hint = new Hint(target, {
      hints: [{ element: "#a", hint: "A", hintAnimation: false }],
    });
    await hint.render();

    expect(document.querySelectorAll(".introjs-hint").length).toBe(1);
    expect(
      document.querySelectorAll(".introjs-hint.introjs-hint-no-anim").length
    ).toBe(1);
    hint.destroy();
  });
});
