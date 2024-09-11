import { Hint } from "./hint";
import { HintItem } from "./hintItem";

/**
 * Hide a hint
 *
 * @api private
 */
export async function hideHint(hint: Hint, hintItem: HintItem) {
  const isActiveSignal = hintItem.isActive;

  if (isActiveSignal) {
    isActiveSignal.val = false;
  }

  hint.hideHintDialog();

  // call the callback function (if any)
  hint.callback("hintClose")?.call(hint, hintItem);
}

/**
 * Hide all hints
 *
 * @api private
 */
export async function hideHints(hint: Hint) {
  for (const hintItem of hint.getHints()) {
    await hideHint(hint, hintItem);
  }
}
