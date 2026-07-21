import { CampaignTrigger, isElementHoverTrigger } from "../types";
import { TriggerCallback, TriggerCleanup } from "./types";
import DOMEvent from "../../../util/DOMEvent";

/**
 * Setup element hover trigger
 */
export function setupElementHoverTrigger(
  campaignId: string,
  trigger: CampaignTrigger,
  callback: TriggerCallback
): TriggerCleanup {
  if (!isElementHoverTrigger(trigger)) {
    return () => {};
  }

  const hoverDuration = trigger.hoverDuration ?? 0;
  let hoverTimer: number | null = null;
  let activeTarget: Element | null = null;

  const onMouseOver = (event: Event) => {
    const target = (event.target as Element).closest(trigger.selector);
    if (!target || target === activeTarget) return;

    activeTarget = target;

    if (hoverDuration > 0) {
      hoverTimer = window.setTimeout(() => {
        callback(campaignId, trigger);
      }, hoverDuration);
    } else {
      callback(campaignId, trigger);
    }
  };

  const onMouseOut = (event: Event) => {
    const related = (event as MouseEvent).relatedTarget as Element | null;
    if (activeTarget && (!related || !activeTarget.contains(related))) {
      if (hoverTimer !== null) {
        clearTimeout(hoverTimer);
        hoverTimer = null;
      }
      activeTarget = null;
    }
  };

  DOMEvent.on(document, "mouseover" as any, onMouseOver, false);
  DOMEvent.on(document, "mouseout" as any, onMouseOut, false);

  return () => {
    if (hoverTimer !== null) clearTimeout(hoverTimer);
    DOMEvent.off(document, "mouseover" as any, onMouseOver, false);
    DOMEvent.off(document, "mouseout" as any, onMouseOut, false);
  };
}
