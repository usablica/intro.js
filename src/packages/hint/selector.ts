import {
  queryElementByClassName,
  queryElementsByClassName,
} from "../../util/queryElement";
import { hintClassName, hintsClassName } from "./className";
import { dataStepAttribute } from "./dataAttributes";

const hintsContainer = () => queryElementByClassName(hintsClassName);

export const hintElements = () =>
  queryElementsByClassName(hintClassName, hintsContainer());

export const hintElement = (stepId: number) =>
  queryElementsByClassName(
    `.${hintClassName}[${dataStepAttribute}="${stepId}"]`,
    hintsContainer()
  )[0];
