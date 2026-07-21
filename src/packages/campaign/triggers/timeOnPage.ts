import { CampaignTrigger, isTimeOnPageTrigger } from "../types";
import { TriggerCallback, TriggerCleanup } from "./types";

/**
 * Setup time on page trigger
 */
export function setupTimeOnPageTrigger(
  campaignId: string,
  trigger: CampaignTrigger,
  callback: TriggerCallback
): TriggerCleanup {
  if (!isTimeOnPageTrigger(trigger)) {
    return () => {};
  }

  const timer = window.setTimeout(() => {
    callback(campaignId, trigger);
  }, trigger.duration);

  return () => {
    clearTimeout(timer);
  };
}
