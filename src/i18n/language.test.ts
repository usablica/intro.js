import { Translator, getAvailableLanguages, LanguageCode } from "./language";

// Store original navigator
const originalNavigator = global.navigator;

// Mock navigator object
const createMockNavigator = (language?: string, userLanguage?: string) => {
  const mockNavigator: any = {};

  if (language !== undefined) mockNavigator.language = language;
  if (userLanguage !== undefined) mockNavigator.userLanguage = userLanguage;

  if (language === undefined && userLanguage === undefined) {
    mockNavigator.language = "en-US";
  }

  Object.defineProperty(global, "navigator", {
    value: mockNavigator,
    writable: true,
    configurable: true,
  });

  return mockNavigator;
};

describe("Translator", () => {
  beforeEach(() => createMockNavigator());
  afterAll(() => {
    Object.defineProperty(global, "navigator", {
      value: originalNavigator,
      writable: true,
      configurable: true,
    });
  });

  describe("Constructor", () => {
    it("should use provided language code", () => {
      const translator = new Translator("es_ES");
      expect(translator.translate("buttons.next")).toBe("Siguiente");
    });

    it("should detect browser language and match locale", () => {
      createMockNavigator("fr-FR");
      const translator = new Translator();
      expect(translator.translate("buttons.next")).toBe("Suivant");
    });

    it("should fallback to en_US for unsupported languages", () => {
      createMockNavigator("sv-SE");
      const translator = new Translator();
      expect(translator.translate("buttons.next")).toBe("Next");
    });

    it("should handle underscores and dashes in language codes", () => {
      createMockNavigator("es_ES");
      const translator1 = new Translator();
      expect(translator1.translate("buttons.next")).toBe("Siguiente");

      createMockNavigator("fr-FR");
      const translator2 = new Translator();
      expect(translator2.translate("buttons.next")).toBe("Suivant");
    });
  });

  describe("setLanguage", () => {
    it("should change active language correctly", () => {
      const translator = new Translator("en_US");
      translator.setLanguage("fr_FR");
      expect(translator.translate("buttons.done")).toBe("Terminé");

      translator.setLanguage("fa_IR");
      expect(translator.translate("buttons.done")).toBe("پایان");
    });

    it("should work with all supported languages", () => {
      const translator = new Translator();
      getAvailableLanguages().forEach((code) => {
        translator.setLanguage(code);
        expect(typeof translator.translate("buttons.next")).toBe("string");
      });
    });
  });

  describe("newly added languages", () => {
    it.each([
      ["ru_RU", "Далее"],
      ["zh_CN", "下一步"],
      ["pt_BR", "Próximo"],
      ["it_IT", "Avanti"],
      ["ja_JP", "次へ"],
      ["tr_TR", "İleri"],
      ["ko_KR", "다음"],
    ])("translates buttons.next for %s", (code, expected) => {
      const translator = new Translator(code as LanguageCode);
      expect(translator.translate("buttons.next")).toBe(expected);
    });

    it.each(["ru_RU", "zh_CN", "pt_BR", "it_IT", "ja_JP", "tr_TR", "ko_KR"])(
      "has non-empty translations for every key in %s",
      (code) => {
        const translator = new Translator(code as LanguageCode);
        [
          "buttons.next",
          "buttons.prev",
          "buttons.skip",
          "buttons.done",
          "buttons.gotIt",
          "messages.dontShowAgainLabel",
          "messages.stepNumbersOfLabel",
        ].forEach((key) => {
          const translated = translator.translate(key);
          expect(translated).not.toBe(key);
          expect(translated.length).toBeGreaterThan(0);
        });
      }
    );
  });

  describe("translate", () => {
    let translator: Translator;

    beforeEach(() => (translator = new Translator("en_US")));

    it("should translate standard keys", () => {
      expect(translator.translate("buttons.next")).toBe("Next");
      expect(translator.translate("buttons.prev")).toBe("Back");
      expect(translator.translate("buttons.done")).toBe("Done");
    });

    it("should return key if not found", () => {
      expect(translator.translate("nonexistent.key")).toBe("nonexistent.key");
    });
  });

  describe("getAvailableLanguages", () => {
    it("should return all language codes", () => {
      const codes = getAvailableLanguages();
      expect(codes).toEqual(
        expect.arrayContaining(["en_US", "es_ES", "fr_FR", "de_DE", "fa_IR"])
      );
    });
  });

  describe("Integration with Tour options", () => {
    class MockTour {
      private _options: any = {};
      setOptions(options: any) {
        const processed = { ...options };
        if (processed.language) {
          const translator = new Translator(processed.language);
          processed.nextLabel =
            processed.nextLabel ?? translator.translate("buttons.next");
          processed.prevLabel =
            processed.prevLabel ?? translator.translate("buttons.prev");
          processed.doneLabel =
            processed.doneLabel ?? translator.translate("buttons.done");
        }
        this._options = { ...this._options, ...processed };
      }
      getOption(key: string) {
        return this._options[key];
      }
    }

    it("should translate labels based on language code", () => {
      const tour = new MockTour();
      tour.setOptions({ language: "es_ES" });
      expect(tour.getOption("nextLabel")).toBe("Siguiente");
      expect(tour.getOption("prevLabel")).toBe("Atrás");
      expect(tour.getOption("doneLabel")).toBe("Hecho");
    });

    it("should not override custom labels", () => {
      const tour = new MockTour();
      tour.setOptions({ language: "fr_FR", nextLabel: "Custom Next" });
      expect(tour.getOption("nextLabel")).toBe("Custom Next");
      expect(tour.getOption("doneLabel")).toBe("Terminé");
    });

    it("should handle multiple languages sequentially", () => {
      const tour = new MockTour();
      tour.setOptions({ language: "de_DE" });
      expect(tour.getOption("nextLabel")).toBe("Weiter");

      tour.setOptions({ language: "fa_IR" });
      expect(tour.getOption("nextLabel")).toBe("بعدی");
    });
  });
});
