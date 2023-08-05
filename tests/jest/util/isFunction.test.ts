import isFunction from "../../../src/util/isFunction";

describe("isFunction", () => {
  it("should return false when string is passed", () => {
    const res = isFunction("abc");

    expect(res).toBeFalse();
  });

  it("should return false when undefined is passed", () => {
    const res = isFunction(undefined);

    expect(res).toBeFalse();
  });

  it("should return false when null is passed", () => {
    const res = isFunction(null);

    expect(res).toBeFalse();
  });

  it("should return true when function is passed", () => {
    const res = isFunction(() => "abc");

    expect(res).toBeTrue();
  });
});
