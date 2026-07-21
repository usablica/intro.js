import { CampaignTrigger, isCustomEventTrigger } from "../types";
import { TriggerCallback, TriggerCleanup } from "./types";
import DOMEvent from "../../../util/DOMEvent";

/**
 * Setup custom event trigger
 */
export function setupCustomEventTrigger(
  campaignId: string,
  trigger: CampaignTrigger,
  callback: TriggerCallback
): TriggerCleanup {
  if (!isCustomEventTrigger(trigger)) {
    return () => {};
  }

  const handler = () => {
    callback(campaignId, trigger);
  };

  DOMEvent.on(document, trigger.eventName as any, handler, false);
  
  return () => {
    DOMEvent.off(document, trigger.eventName as any, handler, false);
  };
}
