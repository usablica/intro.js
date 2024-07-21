import { Hint } from "./hint";
import { hideHintClassName } from "./className";
import { addClass } from "../../util/className";
import { removeHintTooltip } from "./tooltip";
import { dataStepAttribute } from "./dataAttributes";
import { hintElement, hintElements } from "./selector";

/**
 * Hide a hint
 *
 * @api private
 */
export async function hideHint(hint: Hint, stepId: number) {
  const element = hintElement(stepId);

  removeHintTooltip();

  if (element) {
    addClass(element, hideHintClassName);
  }

  // call the callback function (if any)
  hint.callback("hintClose")?.call(hint, stepId);
}

/**
 * Hide all hints
 *
 * @api private
 */
export async function hideHints(hint: Hint) {
  const elements = hintElements();

  for (const hintElement of Array.from(elements)) {
    const step = hintElement.getAttribute(dataStepAttribute);

    if (!step) continue;

    await hideHint(hint, parseInt(step, 10));
  }
}
