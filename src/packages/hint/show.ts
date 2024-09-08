import { Hint } from "./hint";
import { HintItem } from "./hintItem";

/**
 * Show all hints
 *
 * @api private
 */
export async function showHints(hint: Hint) {
  if (hint.isRendered()) {
    for (const hintItem of hint.getHints()) {
      showHint(hintItem);
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
export function showHint(hintItem: HintItem) {
  const activeSignal = hintItem.isActive;

  if (activeSignal) {
    activeSignal.val = true;
  }
}
