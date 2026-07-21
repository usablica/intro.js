import { CampaignTrigger, isReturningUserTrigger } from "../types";
import { TriggerCallback, TriggerCleanup } from "./types";

/**
 * Setup returning user trigger
 */
export function setupReturningUserTrigger(
  campaignId: string,
  trigger: CampaignTrigger,
  callback: TriggerCallback
): TriggerCleanup {
  if (!isReturningUserTrigger(trigger)) {
    return () => {};
  }

  const cookieName = trigger.cookieName || "introjs-returning-user";
  const hasVisited = localStorage.getItem(cookieName);

  if (!hasVisited) {
    // First visit — mark and skip
    localStorage.setItem(cookieName, Date.now().toString());
    return () => {};
  }

  // userTracker already incremented the count for this visit,
  // so previousVisits = totalVisits - 1
  const totalVisits = parseInt(
    localStorage.getItem("introjs-campaign-session-count") || "0",
    10
  );
  const previousVisits = Math.max(0, totalVisits - 1);
  const minVisits = trigger.minVisits ?? 1;

  if (previousVisits >= minVisits) {
    if (trigger.delay) {
      setTimeout(() => callback(campaignId, trigger), trigger.delay);
    } else {
      callback(campaignId, trigger);
    }
  }

  return () => {};
}
