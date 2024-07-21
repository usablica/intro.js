import { Hint } from "./hint";
import { hideHintClassName } from "./className";
import { dataStepAttribute } from "./dataAttributes";
import { removeClass } from "../../util/className";
import { hintElement, hintElements } from "./selector";

/**
 * Show all hints
 *
 * @api private
 */
export async function showHints(hint: Hint) {
  const elements = hintElements();

  if (elements?.length) {
    for (const hintElement of Array.from(elements)) {
      const step = hintElement.getAttribute(dataStepAttribute);

      if (!step) continue;

      showHint(parseInt(step, 10));
    }
  } else {
    // or render hints if there are none
    await hint.render();
  }
}

/**
 * Show a hint
 *
 * @api private
 */
export function showHint(stepId: number) {
  const element = hintElement(stepId);

  if (element) {
    removeClass(element, new RegExp(hideHintClassName, "g"));
  }
}
