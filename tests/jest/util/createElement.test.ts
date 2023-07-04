import createElement from "../../../src/util/createElement";

describe("createElement", () => {
  test("should create an element", () => {
    expect(createElement("div").tagName).toBe("DIV");
    expect(createElement("b").tagName).toBe("B");
  });

  test("should create an element with properties", () => {
    const el = createElement("div", {
      className: "myClass",
    });

    expect(el.className).toBe("myClass");
  });

  test("should create an element with data-* props", () => {
    const el = createElement("div", {
      "data-test-prop": "10",
    });

    expect(el.getAttribute("data-test-prop")).toBe("10");
  });

  test("should create an element with correct style", () => {
    const el = createElement("div", {
      style: "background: red;font-size: 12px;",
    });

    expect(el.style.fontSize).toBe("12px");
    expect(el.style.backgroundColor).toBe("red");
  });

  test("should create an element with onclick", () => {
    const mock = jest.fn();
    const el = createElement("div", {
      onclick: mock,
    });

    el.click();
    el.click();

    expect(mock).toBeCalledTimes(2);
  });
});
