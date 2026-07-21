import { CampaignTrigger, isScrollDepthTrigger } from "../types";
import { TriggerCallback, TriggerCleanup } from "./types";
import DOMEvent from "../../../util/DOMEvent";

/**
 * Setup scroll depth trigger
 */
export function setupScrollDepthTrigger(
  campaignId: string,
  trigger: CampaignTrigger,
  callback: TriggerCallback
): TriggerCleanup {
  if (!isScrollDepthTrigger(trigger)) {
    return () => {};
  }

  const handler = () => {
    const scrollableHeight =
      document.documentElement.scrollHeight - window.innerHeight;

    if (scrollableHeight <= 0) return;

    const scrollPercent = (window.scrollY / scrollableHeight) * 100;

    if (scrollPercent >= trigger.percentage) {
      callback(campaignId, trigger);
      DOMEvent.off(window, "scroll", handler, false);
    }
  };

  DOMEvent.on(window, "scroll", handler, false);
  
  return () => {
    DOMEvent.off(window, "scroll", handler, false);
  };
}
