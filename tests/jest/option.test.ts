import { getDefaultOptions, setOption, setOptions } from "../../src/option";

describe("option", () => {
  test("should return the default options", () => {
    const defaultOptions = getDefaultOptions();
    expect(defaultOptions).toBeObject();
  });

  test("should return empty steps array", () => {
    const defaultOptions = getDefaultOptions();
    expect(defaultOptions.steps).toBeEmpty();
  });

  test("should set a single option", () => {
    const defaultOptions = getDefaultOptions();

    const prevNextLabel = defaultOptions.nextLabel;

    setOption(defaultOptions, "nextLabel", "Boo!");

    expect(defaultOptions.nextLabel).toBe("Boo!");
    expect(defaultOptions.nextLabel).not.toEqual(prevNextLabel);
  });

  test("should return the correct updated options", () => {
    const defaultOptions = getDefaultOptions();

    const updatedOptions = setOption(defaultOptions, "nextLabel", "Boo!");

    expect(updatedOptions.nextLabel).toBe("Boo!");
  });

  test("should set a multiple options", () => {
    const defaultOptions = getDefaultOptions();

    const prevNextLabel = defaultOptions.nextLabel;

    setOptions(defaultOptions, {
      nextLabel: "Boo!",
      highlightClass: "HighlightClass",
    });

    expect(defaultOptions.nextLabel).toBe("Boo!");
    expect(defaultOptions.nextLabel).not.toEqual(prevNextLabel);
    expect(defaultOptions.highlightClass).toBe("HighlightClass");
  });
});
