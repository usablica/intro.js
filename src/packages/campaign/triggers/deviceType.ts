import { CampaignTrigger, isDeviceTypeTrigger } from "../types";
import { TriggerCallback, TriggerCleanup } from "./types";
import { detectDeviceType } from "./utils";

/**
 * Setup device type trigger
 */
export function setupDeviceTypeTrigger(
  campaignId: string,
  trigger: CampaignTrigger,
  callback: TriggerCallback
): TriggerCleanup {
  if (!isDeviceTypeTrigger(trigger)) {
    return () => {};
  }

  const currentDevice = detectDeviceType();

  if (currentDevice === trigger.device) {
    if (trigger.delay) {
      setTimeout(() => callback(campaignId, trigger), trigger.delay);
    } else {
      callback(campaignId, trigger);
    }
  }

  // No cleanup needed for device type trigger
  return () => {};
}
