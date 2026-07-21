import { CampaignTrigger, isElementClickTrigger } from "../types";
import { TriggerCallback, TriggerCleanup } from "./types";
import DOMEvent from "../../../util/DOMEvent";

/**
 * Setup element click trigger
 */
export function setupElementClickTrigger(
  campaignId: string,
  trigger: CampaignTrigger,
  callback: TriggerCallback
): TriggerCleanup {
  if (!isElementClickTrigger(trigger)) {
    return () => {};
  }

  const handler = (event: Event) => {
    const target = (event.target as Element).closest(trigger.selector);
    if (target) {
      if (trigger.delay) {
        setTimeout(() => callback(campaignId, trigger), trigger.delay);
      } else {
        callback(campaignId, trigger);
      }
    }
  };

  DOMEvent.on(document, "click", handler, false);
  
  return () => {
    DOMEvent.off(document, "click", handler, false);
  };
}
