import { CampaignTrigger, isFormInteractionTrigger } from "../types";
import { TriggerCallback, TriggerCleanup } from "./types";
import DOMEvent from "../../../util/DOMEvent";

/**
 * Setup form interaction trigger
 */
export function setupFormInteractionTrigger(
  campaignId: string,
  trigger: CampaignTrigger,
  callback: TriggerCallback
): TriggerCleanup {
  if (!isFormInteractionTrigger(trigger)) {
    return () => {};
  }

  const selector = trigger.selector || "form input, form textarea, form select";
  const interactionType = trigger.interactionType ?? "focus";
  const eventName =
    interactionType === "input" ? "input" :
    interactionType === "change" ? "change" :
    "focus";

  // focus doesn't bubble — use capture phase; input/change bubble natively
  const useCapture = eventName === "focus";

  const handler = (event: Event) => {
    const target = event.target as Element;
    if (target.closest(selector)) {
      callback(campaignId, trigger);
    }
  };

  DOMEvent.on(document, eventName as any, handler, useCapture);

  return () => {
    DOMEvent.off(document, eventName as any, handler, useCapture);
  };
}
