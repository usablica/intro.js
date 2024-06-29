import { Hint } from "./hint";
import { dataStepAttribute } from "./dataAttributes";
import { hintElement, hintElements } from "./selector";

/**
 * Removes all hint elements on the page
 * Useful when you want to destroy the elements and add them again (e.g. a modal or popup)
 *
 * @api private
 */
export function removeHints(hint: Hint) {
  const elements = hintElements();

  for (const hintElement of Array.from(elements)) {
    const step = hintElement.getAttribute(dataStepAttribute);

    if (!step) continue;

    removeHint(parseInt(step, 10));
  }

  hint.disableHintAutoRefresh();
}

/**
 * Remove one single hint element from the page
 * Useful when you want to destroy the element and add them again (e.g. a modal or popup)
 * Use removeHints if you want to remove all elements.
 *
 * @api private
 */
export function removeHint(stepId: number) {
  const element = hintElement(stepId);

  if (element && element.parentNode) {
    element.parentNode.removeChild(element);
  }
}
