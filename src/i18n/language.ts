import enUS from "./en_US";
import faIR from "./fa_IR";
import deDE from "./de_DE";
import esES from "./es_ES";
import frFR from "./fr_FR";
import ar_SA from "./ar_SA";
import ru_RU from "./ru_RU";
import zh_CN from "./zh_CN";
import pt_BR from "./pt_BR";
import it_IT from "./it_IT";
import ja_JP from "./ja_JP";
import tr_TR from "./tr_TR";
import ko_KR from "./ko_KR";

const languages = {
  en_US: enUS,
  fa_IR: faIR,
  de_DE: deDE,
  es_ES: esES,
  fr_FR: frFR,
  ar_SA: ar_SA,
  ru_RU: ru_RU,
  zh_CN: zh_CN,
  pt_BR: pt_BR,
  it_IT: it_IT,
  ja_JP: ja_JP,
  tr_TR: tr_TR,
  ko_KR: ko_KR,
} as const;

export type LanguageCode = keyof typeof languages;
export const DefaultLanguage = Object.keys(languages)[0] as LanguageCode;
type Messages = { [key: string]: string | Messages };

export function getAvailableLanguages(): LanguageCode[] {
  return Object.keys(languages) as LanguageCode[];
}

/**
 * The built-in language for a language tag from the browser ("fr-FR",
 * "fr-CA", "fr" or "fr_FR"): the one with the same name, otherwise the one
 * of the same language in another region (so "fr-CA" and "fr" get "fr_FR")
 */
const matchLanguage = (tag: string): LanguageCode | undefined => {
  const codes = Object.keys(languages) as LanguageCode[];
  const wanted = tag.trim().replace(/-/g, "_").toLowerCase();
  if (!wanted) return undefined;

  const language = wanted.split("_")[0];
  return (
    codes.find((code) => code.toLowerCase() === wanted) ??
    codes.find((code) => code.toLowerCase().split("_")[0] === language)
  );
};

/**
 * The languages of the user, most wanted first
 */
const browserLanguages = (): string[] => {
  const list: unknown[] = [
    ...(navigator.languages ?? []),
    navigator.language,
    (navigator as any).userLanguage,
  ];
  return list.filter((tag): tag is string => typeof tag === "string");
};

export class Translator {
  private _languageCode: LanguageCode;

  constructor(languageCode?: LanguageCode) {
    if (languageCode && languages[languageCode]) {
      this._languageCode = languageCode;
    } else {
      // the first language of the user that is built in, in the region they
      // asked for if we have it
      let match: LanguageCode | undefined;
      for (const tag of browserLanguages()) {
        match = matchLanguage(tag);
        if (match) break;
      }

      this._languageCode = match ?? DefaultLanguage;
    }
  }

  setLanguage(code: LanguageCode) {
    if (languages[code]) {
      this._languageCode = code;
    }
  }

  getLanguage(): LanguageCode {
    return this._languageCode;
  }

  private get messages() {
    return languages[this._languageCode];
  }

  private getString(
    message: string,
    obj: Messages = this.messages
  ): string | null {
    const parts = message.split(".");
    let current: Messages | string = obj;

    for (const part of parts) {
      if (typeof current !== "object" || !(part in current)) return null;
      current = current[part];
    }

    return typeof current === "string" ? current : null;
  }

  translate(message: string): string {
    return this.getString(message) ?? message;
  }
}
