import observeLayout from "./observeLayout";

// the callback runs in the next animation frame
const frame = () => new Promise((resolve) => setTimeout(resolve, 50));

describe("observeLayout", () => {
  beforeEach(() => {
    document.body.innerHTML = `<div id="page"></div><div id="ours"></div>`;
  });

  test("calls back when the DOM changes", async () => {
    const onChange = jest.fn();
    const observer = observeLayout(onChange);

    document.getElementById("page")!.appendChild(document.createElement("p"));
    await frame();

    expect(onChange).toHaveBeenCalledTimes(1);
    observer.disconnect();
  });

  test("calls back once per frame for many changes", async () => {
    const onChange = jest.fn();
    const observer = observeLayout(onChange);

    const page = document.getElementById("page")!;
    page.appendChild(document.createElement("p"));
    await Promise.resolve();
    page.setAttribute("class", "changed");
    await Promise.resolve();
    page.textContent = "text";
    await frame();

    expect(onChange).toHaveBeenCalledTimes(1);
    observer.disconnect();
  });

  test("ignores the changes it is told to", async () => {
    const onChange = jest.fn();
    const ours = document.getElementById("ours")!;
    const observer = observeLayout(onChange, (node) => ours.contains(node));

    ours.setAttribute("style", "left: 10px");
    await frame();

    expect(onChange).not.toHaveBeenCalled();
    observer.disconnect();
  });

  test("calls back after a transition, an animation or an image load", async () => {
    const onChange = jest.fn();
    const observer = observeLayout(onChange);

    document.getElementById("page")!.dispatchEvent(new Event("transitionend"));
    await frame();
    document.getElementById("page")!.dispatchEvent(new Event("load"));
    await frame();

    expect(onChange).toHaveBeenCalledTimes(2);
    observer.disconnect();
  });

  test("stops once disconnected", async () => {
    const onChange = jest.fn();
    const observer = observeLayout(onChange);
    observer.disconnect();

    document.getElementById("page")!.appendChild(document.createElement("p"));
    document.getElementById("page")!.dispatchEvent(new Event("transitionend"));
    await frame();

    expect(onChange).not.toHaveBeenCalled();
  });
});
