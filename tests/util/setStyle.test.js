import setStyle from "../../src/util/setStyle";

describe("setStyle", () => {
  test("should set style when the list is empty", () => {
    const el = document.createElement("div");
    setStyle(el, {
      "text-align": "center",
    });

    expect(el.style.cssText).toBe("text-align: center;");
  });

  test("should set style using cssText", () => {
    const el = document.createElement("div");
    setStyle(el, "text-align: center");

    expect(el.style.cssText).toBe("text-align: center;");
  });

  test("should set when style is not empty", () => {
    const el = document.createElement("div");
    el.style.position = "relative";

    setStyle(el, "text-align: center");

    expect(el.style.cssText).toBe("position: relative; text-align: center;");
  });

  test("should set when style is not empty and given value is an object", () => {
    const el = document.createElement("div");
    el.style.position = "relative";

    setStyle(el, {
      "text-align": "center",
    });

    expect(el.style.cssText).toBe("position: relative; text-align: center;");
  });

  test("should override the existing property", () => {
    const el = document.createElement("div");
    el.style.position = "relative";

    setStyle(el, {
      position: "absolute",
      "text-align": "center",
    });

    expect(el.style.cssText).toBe("position: absolute; text-align: center;");
  });
});
