import { Hint } from "./hint";

/**
 * Triggers when user clicks on the hint element
 *
 * @api private
 */
export async function showHintDialog(hint: Hint, stepId: number) {
  const item = hint.getHint(stepId);

  if (!item) return;

  hint._activeHintSignal.val = stepId;

  // call the callback function (if any)
  await hint.callback("hintClick")?.call(hint, item);
}
