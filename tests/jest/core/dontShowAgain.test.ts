import * as cookie from "../../../src/util/cookie";
import {
  setDontShowAgain,
  getDontShowAgain,
} from "../../../src/core/dontShowAgain";
import { IntroJs } from "../../../src/intro";

describe("dontShowAgain", () => {
  test("should call set cookie", () => {
    const setCookieMock = jest.spyOn(cookie, "setCookie");

    setDontShowAgain(
      {
        _options: {
          dontShowAgainCookie: "cookie-name",
          dontShowAgainCookieDays: 7,
        },
      } as IntroJs,
      true
    );

    expect(setCookieMock).toBeCalledTimes(1);
    expect(setCookieMock).toBeCalledWith("cookie-name", "true", 7);
  });

  test("should call delete cookie", () => {
    const setCookieMock = jest.spyOn(cookie, "setCookie");
    const deleteCookieMock = jest.spyOn(cookie, "deleteCookie");

    setDontShowAgain(
      {
        _options: {
          dontShowAgainCookie: "cookie-name",
          dontShowAgainCookieDays: 7,
        },
      } as IntroJs,
      false
    );

    expect(setCookieMock).toBeCalledTimes(0);
    expect(deleteCookieMock).toBeCalledTimes(1);
    expect(deleteCookieMock).toBeCalledWith("cookie-name");
  });

  test("should return true when cookie is valid", () => {
    jest.spyOn(cookie, "getCookie").mockReturnValue("true");

    expect(
      getDontShowAgain({
        _options: {
          dontShowAgainCookie: "cookie-name",
          dontShowAgainCookieDays: 7,
        },
      } as IntroJs)
    ).toBe(true);
  });

  test("should return false when cookie is invalid", () => {
    jest.spyOn(cookie, "getCookie").mockReturnValue("invalid-state");

    expect(
      getDontShowAgain({
        _options: {
          dontShowAgainCookie: "cookie-name",
          dontShowAgainCookieDays: 7,
        },
      } as IntroJs)
    ).toBe(false);
  });
});
