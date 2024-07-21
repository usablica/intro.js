import * as cookie from "../../../src/util/cookie";
import { setDontShowAgain, getDontShowAgain } from "./dontShowAgain";

describe("dontShowAgain", () => {
  test("should call set cookie", () => {
    const setCookieMock = jest.spyOn(cookie, "setCookie");

    setDontShowAgain(true, "cookie-name", 7);

    expect(setCookieMock).toBeCalledTimes(1);
    expect(setCookieMock).toBeCalledWith("cookie-name", "true", 7);
  });

  test("should call delete cookie", () => {
    const setCookieMock = jest.spyOn(cookie, "setCookie");
    const deleteCookieMock = jest.spyOn(cookie, "deleteCookie");

    setDontShowAgain(false, "cookie-name", 7);

    expect(setCookieMock).toBeCalledTimes(0);
    expect(deleteCookieMock).toBeCalledTimes(1);
    expect(deleteCookieMock).toBeCalledWith("cookie-name");
  });

  test("should return true when cookie is valid", () => {
    jest.spyOn(cookie, "getCookie").mockReturnValue("true");

    expect(getDontShowAgain("cookie-name")).toBe(true);
  });

  test("should return false when cookie is invalid", () => {
    jest.spyOn(cookie, "getCookie").mockReturnValue("invalid-state");

    expect(getDontShowAgain("cookie-name")).toBe(false);
  });
});
