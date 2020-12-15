import createElement from "../../src/util/createElement";

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
