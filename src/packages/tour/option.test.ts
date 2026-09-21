import { getDefaultTourOptions } from "./option";
import { Translator } from "../../i18n/language";

Object.defineProperty(global, "navigator", {
  value: { language: "en-US" },
  writable: true,
});

describe("getDefaultTourOptions", () => {
  it("should default the theme to light, not auto", () => {
    expect(getDefaultTourOptions().theme).toBe("light");
  });

  it("should create a new Translator internally if none is injected", () => {
    const opts = getDefaultTourOptions();
    const t = new Translator();
    t.setLanguage("en_US");
    expect(opts.nextLabel).toBe(t.translate("buttons.next"));
    expect(opts.doneLabel).toBe(t.translate("buttons.done"));
    expect(opts.language).toEqual("en_US");
  });

  it("should use the injected translator's language for translations", () => {
    const translator = new Translator();
    translator.setLanguage("fr_FR");
    const opts = getDefaultTourOptions(translator);

    expect(opts.nextLabel).toBe(translator.translate("buttons.next"));
    expect(opts.prevLabel).toBe(translator.translate("buttons.prev"));
    expect(opts.doneLabel).toBe(translator.translate("buttons.done"));
    expect(opts.language).toEqual("fr_FR");
  });

  it("should update all labels correctly for different languages", () => {
    const translator = new Translator();
    translator.setLanguage("es_ES");
    const opts = getDefaultTourOptions(translator);

    expect(opts.nextLabel).toBe(translator.translate("buttons.next"));
    expect(opts.stepNumbersOfLabel).toBe(
      translator.translate("messages.stepNumbersOfLabel")
    );
    expect(opts.dontShowAgainLabel).toBe(
      translator.translate("messages.dontShowAgainLabel")
    );
    expect(opts.language).toEqual("es_ES");
  });

  it("should always return an independent translator when called separately", () => {
    const opts1 = getDefaultTourOptions();
    const opts2 = getDefaultTourOptions();

    expect(opts1.nextLabel).toBe(opts2.nextLabel);
    expect(opts1.language).toEqual("en_US");
  });

  it("should default to en_US if translator not provided", () => {
    const opts = getDefaultTourOptions();
    expect(opts.language).toEqual("en_US");
  });
});
