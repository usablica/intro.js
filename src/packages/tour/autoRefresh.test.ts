import { Tour } from "./tour";
import { Hint } from "../hint/hint";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// jsdom has no layout: the test moves the target by changing its rect
const setTop = (element: HTMLElement, top: number) => {
  element.getBoundingClientRect = () => new DOMRect(20, top, 200, 40);
};

describe("refresh when the page changes around the target", () => {
  let target: HTMLElement;

  beforeEach(() => {
    jest.restoreAllMocks();
    document.body.innerHTML = `<div id="top"></div><div id="target">target</div>`;
    target = document.getElementById("target") as HTMLElement;
    setTop(target, 100);
  });

  afterEach(() => {
    document.body.innerHTML = "";
  });

  const addBanner = () => {
    // content added above the target pushes it down
    document.getElementById("top")!.appendChild(document.createElement("div"));
    setTop(target, 250);
  };

  test("refreshes a tour when its target moves", async () => {
    const tour = new Tour();
    tour.setOptions({ steps: [{ element: "#target", intro: "hi" }] });
    await tour.start();
    await sleep(100);
    const refresh = jest.spyOn(tour, "refresh");

    addBanner();
    await sleep(100);

    expect(refresh).toHaveBeenCalled();
    await tour.exit(true);
  });

  test("doesn't refresh a tour when nothing moved", async () => {
    const tour = new Tour();
    tour.setOptions({ steps: [{ element: "#target", intro: "hi" }] });
    await tour.start();
    await sleep(100);
    const refresh = jest.spyOn(tour, "refresh");

    // a change somewhere else on the page that doesn't move the target
    document.getElementById("top")!.setAttribute("data-x", "1");
    await sleep(100);

    expect(refresh).not.toHaveBeenCalled();
    await tour.exit(true);
  });

  test("stops watching once the tour exits", async () => {
    const tour = new Tour();
    tour.setOptions({ steps: [{ element: "#target", intro: "hi" }] });
    await tour.start();
    await sleep(100);
    await tour.exit(true);
    const refresh = jest.spyOn(tour, "refresh");

    addBanner();
    await sleep(100);

    expect(refresh).not.toHaveBeenCalled();
  });

  test("refreshes hints when their element moves", async () => {
    const hint = new Hint(document.body, {
      hints: [{ element: "#target", hint: "hi" }],
    });
    await hint.render();
    await sleep(100);
    const refresh = jest.spyOn(hint, "refresh");

    addBanner();
    await sleep(100);

    expect(refresh).toHaveBeenCalled();
    hint.destroy();
  });
});
