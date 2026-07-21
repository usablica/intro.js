import { CampaignTrigger, isElementVisibleTrigger } from "../types";
import { TriggerCallback, TriggerCleanup } from "./types";
import DOMEvent from "../../../util/DOMEvent";

/**
 * Setup element visible trigger
 */
export function setupElementVisibleTrigger(
  campaignId: string,
  trigger: CampaignTrigger,
  callback: TriggerCallback
): TriggerCleanup {
  if (!isElementVisibleTrigger(trigger)) {
    return () => {};
  }

  let hasTriggered = false;

  const checkVisibility = () => {
    if (hasTriggered) return;

    const element = document.querySelector(trigger.selector);
    if (!element) return;

    const rect = element.getBoundingClientRect();
    const elementHeight = rect.height;
    if (elementHeight <= 0) return;

    const threshold = trigger.threshold || 0.5;
    const visibleHeight =
      Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);
    const visibilityRatio = visibleHeight / elementHeight;

    if (visibilityRatio >= threshold) {
      hasTriggered = true;
      callback(campaignId, trigger);
      DOMEvent.off(window, "scroll", handler, false);
      DOMEvent.off(window, "resize" as any, handler, false);
    }
  };

  const handler = () => checkVisibility();

  // Add listeners before initial check so DOMEvent.off inside checkVisibility works correctly
  DOMEvent.on(window, "scroll", handler, false);
  DOMEvent.on(window, "resize" as any, handler, false);

  checkVisibility();

  return () => {
    DOMEvent.off(window, "scroll", handler, false);
    DOMEvent.off(window, "resize" as any, handler, false);
  };
}
