import { CampaignTrigger } from "../types";
import { TriggerCallback, TriggerCleanup } from "./types";

/**
 * Setup first visit trigger
 */
export function setupFirstVisitTrigger(
  campaignId: string,
  trigger: CampaignTrigger,
  callback: TriggerCallback
): TriggerCleanup {
  const cookieName = trigger.cookieName || `introjs-first-visit-${campaignId}`;
  const hasVisited = localStorage.getItem(cookieName);

  if (!hasVisited) {
    localStorage.setItem(cookieName, Date.now().toString());

    if (trigger.delay) {
      setTimeout(() => callback(campaignId, trigger), trigger.delay);
    } else {
      callback(campaignId, trigger);
    }
  }

  // No cleanup needed for first visit trigger
  return () => {};
}
