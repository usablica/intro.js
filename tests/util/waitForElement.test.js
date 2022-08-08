import { _waitForElementByTimeout } from "../../src/util/waitForElement";
import { appendDummyElement } from "../helper";

describe("Testing _waitForElementByTimeout", () => {
  const interval = 100;
  const maxTimeout = 3000;

  test("Callback call even if element doesn't appear after timeout", (done) => {
    const callback = jest.fn();
    _waitForElementByTimeout("#not_existed", callback, interval, maxTimeout);
    expect(callback).toBeCalledTimes(0);
    setTimeout(function () {
      expect(callback).toBeCalledTimes(1);
      done();
    }, maxTimeout + interval);
  });

  test("Callback should be called immediately if elements already exists", () => {
    const callback = jest.fn();
    const id = "prev_created";
    const el = appendDummyElement();
    el.setAttribute("id", id);
    _waitForElementByTimeout("#" + id, callback, interval, maxTimeout);
    expect(callback).toBeCalledTimes(1);
  });

  test("Callback must be called after the element appears", (done) => {
    const callback = jest.fn();
    const id = "later_created";
    _waitForElementByTimeout("#" + id, callback, interval, maxTimeout);
    expect(callback).toBeCalledTimes(0);
    const el = appendDummyElement();
    el.setAttribute("id", id);
    setTimeout(function () {
      expect(callback).toBeCalledTimes(1);
      done();
    }, interval);
  });

  test("Check interval is bigger than maximum timeout", (done) => {
    _waitForElementByTimeout("#not_existed", done, 1000, 100);
  });

  test("Check interval is equal to maximum timeout", (done) => {
    _waitForElementByTimeout("#not_existed", done, 1000, 1000);
  });

  test("Check interval is zero", (done) => {
    _waitForElementByTimeout("#not_existed", done, 0, maxTimeout);
  });

  test("Maximum timeout is zero", (done) => {
    _waitForElementByTimeout("#not_existed", done, interval, 0);
  });

  test("Maximum timeout and interval are zero", (done) => {
    _waitForElementByTimeout("#not_existed", done, 0, 0);
  });
});
