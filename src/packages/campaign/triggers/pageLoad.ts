import { CampaignTrigger } from "../types";
import { TriggerCallback, TriggerCleanup } from "./types";
import DOMEvent from "../../../util/DOMEvent";

/**
 * Setup page load trigger
 */
export function setupPageLoadTrigger(
  campaignId: string,
  trigger: CampaignTrigger,
  callback: TriggerCallback
): TriggerCleanup {
  if (document.readyState === "complete") {
    if (trigger.delay) {
      setTimeout(() => callback(campaignId, trigger), trigger.delay);
    } else {
      callback(campaignId, trigger);
    }
    return () => {};
  } else {
    const handler = () => {
      if (trigger.delay) {
        setTimeout(() => callback(campaignId, trigger), trigger.delay);
      } else {
        callback(campaignId, trigger);
      }
    };

    DOMEvent.on(window, "load" as any, handler, false);
    
    return () => {
      DOMEvent.off(window, "load" as any, handler, false);
    };
  }
}
