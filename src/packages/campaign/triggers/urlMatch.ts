import { CampaignTrigger, isUrlMatchTrigger } from "../types";
import { TriggerCallback, TriggerCleanup } from "./types";

/**
 * Setup URL match trigger
 */
export function setupUrlMatchTrigger(
  campaignId: string,
  trigger: CampaignTrigger,
  callback: TriggerCallback
): TriggerCleanup {
  if (!isUrlMatchTrigger(trigger)) {
    return () => {};
  }

  const currentUrl = window.location.href;
  let matches = false;

  switch (trigger.matchType) {
    case "exact":
      matches = currentUrl === trigger.pattern;
      break;
    case "contains":
      matches = currentUrl.includes(trigger.pattern);
      break;
    case "regex":
    default:
      try {
        matches = new RegExp(trigger.pattern).test(currentUrl);
      } catch {
        console.warn(`Invalid URL regex pattern: "${trigger.pattern}"`);
      }
      break;
  }

  if (matches) {
    if (trigger.delay) {
      setTimeout(() => callback(campaignId, trigger), trigger.delay);
    } else {
      callback(campaignId, trigger);
    }
  }

  // No cleanup needed for URL match trigger
  return () => {};
}
