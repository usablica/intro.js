import { CampaignTrigger } from "../types";

/**
 * Trigger callback function type
 */
export type TriggerCallback = (
  campaignId: string,
  trigger: CampaignTrigger
) => void;

/**
 * Trigger cleanup function type
 */
export type TriggerCleanup = () => void;
