import addClass from "../../../src/util/addClass";

describe("addClass", () => {
  test("should append when className is empty", () => {
    const el = document.createElement("div");
    addClass(el, "myClass");
    expect(el.className).toBe("myClass");
  });

  test("should append when className is NOT empty", () => {
    const el = document.createElement("div");
    el.className = "firstClass";

    addClass(el, "secondClass");

    expect(el.className).toBe("firstClass secondClass");
  });

  test("should not append duplicate classNames to elements", () => {
    const el = document.createElement("div");
    el.className = "firstClass";

    addClass(el, "firstClass");

    expect(el.className).toBe("firstClass");
  });

  test("should not append duplicate list of classNames to elements", () => {
    const el = document.createElement("div");
    el.className = "firstClass firstClass";

    addClass(el, "firstClass firstClass firstClass");

    expect(el.className).toBe("firstClass");
  });

  test("should not append duplicate list of classNames to an empty className", () => {
    const el = document.createElement("div");

    addClass(el, "firstClass firstClass firstClass");

    expect(el.className).toBe("firstClass");
  });
});
