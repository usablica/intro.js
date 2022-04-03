import {
  getAllCookies,
  getCookie,
  setCookie,
  deleteCookie,
} from "../../src/util/cookie";

describe("cookie", () => {
  let _cookie = "";

  beforeAll(() => {
    Object.defineProperty(window.document, "cookie", {
      get: () => _cookie,
      set: (v) => (_cookie = v),
      split: (s) => _cookie.split(s),
    });
  });

  beforeEach(() => {
    _cookie = "hello=world;abc=bar";
  });

  test("should return undefined when cookie doesnt exist", () => {
    expect(getCookie("doesntExist")).toBe(undefined);
  });

  test("should return the cookie name", () => {
    expect(getCookie("abc")).toBe("bar");
  });

  test("should return all cookies", () => {
    expect(getAllCookies()).toEqual({
      abc: "bar",
      hello: "world",
    });
  });

  test("should set cookie", () => {
    setCookie("new", "foo");
    expect(getCookie("new")).toEqual("foo");
  });

  test("should delete cookie", () => {
    expect(getCookie("hello")).toEqual("world");
    deleteCookie("hello");
    expect(getCookie("hello")).toEqual("");
  });
});
