import { Hint } from "./hint";

const setSize = (element: Element, prop: string, value: unknown) =>
  Object.defineProperty(element, prop, { value, configurable: true });

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

describe("hints in a scroll container", () => {
  let target: HTMLElement;
  // where the target is in the viewport: the test "scrolls" by changing it
  let targetLeft: number;

  beforeEach(() => {
    document.body.innerHTML = `<div id="box"><div id="a">A</div></div>`;
    const box = document.getElementById("box") as HTMLElement;
    target = document.getElementById("a") as HTMLElement;

    // jsdom has no layout: a 300 x 100 scroll container at (0, 0)
    box.style.overflowX = "auto";
    box.style.overflowY = "auto";
    setSize(box, "clientWidth", 300);
    setSize(box, "clientHeight", 100);
    box.getBoundingClientRect = () => new DOMRect(0, 0, 300, 100);
    target.getBoundingClientRect = () => new DOMRect(targetLeft, 20, 100, 40);
  });

  afterEach(() => {
    document.body.innerHTML = "";
  });

  const icon = () => document.querySelector(".introjs-hint") as HTMLElement;

  test("hides the icon of an element scrolled out of view, and shows it again", async () => {
    targetLeft = 500;
    const hint = new Hint(document.body, {
      hints: [{ element: "#a", hint: "A" }],
    });
    await hint.render();
    await sleep(10);

    expect(icon().classList.contains("introjs-hint-clipped")).toBe(true);

    targetLeft = 20;
    hint.refresh();
    await sleep(10);

    expect(icon().classList.contains("introjs-hint-clipped")).toBe(false);
    hint.destroy();
  });

  test("closes the dialog of a hint whose element is scrolled out of view", async () => {
    targetLeft = 20;
    const hint = new Hint(document.body, {
      hints: [{ element: "#a", hint: "A" }],
    });
    await hint.render();
    await hint.showHintDialog(0);
    expect(hint.getActiveHintSignal().val).toBe(0);

    targetLeft = 500;
    hint.refresh();
    await sleep(10);

    expect(hint.getActiveHintSignal().val).toBeUndefined();
    hint.destroy();
  });
});
