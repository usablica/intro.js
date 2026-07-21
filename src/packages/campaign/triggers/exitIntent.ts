import { CampaignTrigger, isExitIntentTrigger } from "../types";
import { TriggerCallback, TriggerCleanup } from "./types";
import DOMEvent from "../../../util/DOMEvent";

/**
 * Setup exit intent trigger
 */
export function setupExitIntentTrigger(
  campaignId: string,
  trigger: CampaignTrigger,
  callback: TriggerCallback
): TriggerCleanup {
  if (!isExitIntentTrigger(trigger)) {
    return () => {};
  }

  const sensitivity = trigger.sensitivity ?? 10;

  let hasTriggered = false;

  const handler = (event: MouseEvent) => {
    if (hasTriggered) return;

    if (event.clientY <= sensitivity) {
      hasTriggered = true;
      callback(campaignId, trigger);
    }
  };

  DOMEvent.on(document, "mouseleave" as any, handler, false);

  return () => {
    DOMEvent.off(document, "mouseleave" as any, handler, false);
  };
}
