import { CampaignTrigger, isScrollToElementTrigger } from "../types";
import { TriggerCallback, TriggerCleanup } from "./types";
import DOMEvent from "../../../util/DOMEvent";

/**
 * Setup scroll to element trigger
 */
export function setupScrollToElementTrigger(
  campaignId: string,
  trigger: CampaignTrigger,
  callback: TriggerCallback
): TriggerCleanup {
  if (!isScrollToElementTrigger(trigger)) {
    return () => {};
  }

  const handler = () => {
    const element = document.querySelector(trigger.selector);
    if (element) {
      const rect = element.getBoundingClientRect();
      const elementHeight = rect.height;
      if (elementHeight <= 0) return;

      const threshold = trigger.threshold || 0.5;
      const visibleHeight =
        Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);
      const visibilityRatio = visibleHeight / elementHeight;

      if (visibilityRatio >= threshold) {
        callback(campaignId, trigger);
        DOMEvent.off(window, "scroll", handler, false);
      }
    }
  };

  DOMEvent.on(window, "scroll", handler, false);
  
  return () => {
    DOMEvent.off(window, "scroll", handler, false);
  };
}
