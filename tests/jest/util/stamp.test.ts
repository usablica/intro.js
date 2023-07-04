import { IntroJs } from "../../../src/intro";
import stamp from "../../../src/util/stamp";

describe("stamp", () => {
  test("should stamp an IntroJS object", () => {
    const instance = new IntroJs(document.body);
    const stamped = stamp(instance);

    expect(stamped).toBe(0);
  });

  test("should increase the stamp number", () => {
    const instance = new IntroJs(document.body);
    stamp(instance);
    const stamped = stamp(instance);

    expect(stamped).toBe(1);
  });
});
