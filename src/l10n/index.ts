import { en_US } from "./en_US";
import { es_ES } from "./es_ES";
import { tr_TR } from "./tr_TR";

export const availableLocales = ["en_US", "es_ES", "tr_TR"] as const;

export type Strings = {
  next: string;
  prev: string;
  skip: string;
  done: string;
  stepNumbersOf: string;
  dontShowAgain: string;
  gotIt: string;
};

export const strings = (locale: string): Strings => {
  switch (locale) {
    case "tr_TR":
      return tr_TR;
    case "es_ES":
      return es_ES;
    case "en_US":
    default:
      return en_US;
  }
};
