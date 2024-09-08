import { TooltipPosition } from "../../packages/tooltip";
import { Hint } from "./hint";
import cloneObject from "../../util/cloneObject";
import { queryElement, queryElements } from "../../util/queryElement";
import {
  dataHintAttribute,
  dataHintPositionAttribute,
  dataTooltipClassAttribute,
} from "./dataAttributes";
import { State } from "../dom/van";

export type HintPosition =
  | "top-left"
  | "top-right"
  | "top-middle"
  | "bottom-left"
  | "bottom-right"
  | "bottom-middle"
  | "middle-left"
  | "middle-right"
  | "middle-middle";

export type HintItem = {
  element?: HTMLElement | string | null;
  tooltipClass?: string;
  position: TooltipPosition;
  hint?: string;
  // this is the HintIcon element for this particular hint
  // used for positioning the HintTooltip
  hintTooltipElement?: HTMLElement;
  hintAnimation?: boolean;
  hintPosition: HintPosition;
  isActive?: State<boolean>;
};

export const fetchHintItems = (hint: Hint) => {
  hint.setHints([]);

  const targetElement = hint.getTargetElement();
  const hints = hint.getOption("hints");

  if (hints && hints.length > 0) {
    for (const _hint of hints) {
      const hintItem = cloneObject(_hint);

      if (typeof hintItem.element === "string") {
        // grab the element with given selector from the page
        hintItem.element = queryElement(hintItem.element);
      }

      hintItem.hintPosition =
        hintItem.hintPosition || hint.getOption("hintPosition");
      hintItem.hintAnimation =
        hintItem.hintAnimation || hint.getOption("hintAnimation");

      if (hintItem.element !== null) {
        hint.addHint(hintItem as HintItem);
      }
    }
  } else {
    const elements = Array.from(
      queryElements(`*[${dataHintAttribute}]`, targetElement)
    );

    if (!elements || !elements.length) {
      return false;
    }

    //first add intro items with data-step
    for (const element of elements) {
      // hint animation
      let hintAnimationAttr = element.getAttribute(dataHintPositionAttribute);

      let hintAnimation: boolean = hint.getOption("hintAnimation");
      if (hintAnimationAttr) {
        hintAnimation = hintAnimationAttr === "true";
      }

      hint.addHint({
        element: element,
        hint: element.getAttribute(dataHintAttribute) || "",
        hintPosition: (element.getAttribute(dataHintPositionAttribute) ||
          hint.getOption("hintPosition")) as HintPosition,
        hintAnimation,
        tooltipClass:
          element.getAttribute(dataTooltipClassAttribute) || undefined,
        position: (element.getAttribute("data-position") ||
          hint.getOption("tooltipPosition")) as TooltipPosition,
      });
    }
  }

  return true;
};
