import { CampaignTrigger, isIdleUserTrigger } from "../types";
import { TriggerCallback, TriggerCleanup } from "./types";
import DOMEvent from "../../../util/DOMEvent";

/**
 * Setup idle user trigger
 */
export function setupIdleUserTrigger(
  campaignId: string,
  trigger: CampaignTrigger,
  callback: TriggerCallback
): TriggerCleanup {
  if (!isIdleUserTrigger(trigger)) {
    return () => {};
  }

  const idleTime = trigger.idleTime;
  let idleTimer: number;
  let isIdle = false;

  const resetTimer = () => {
    if (isIdle) return;

    clearTimeout(idleTimer);
    idleTimer = window.setTimeout(() => {
      isIdle = true;
      callback(campaignId, trigger);
    }, idleTime);
  };

  const events = [
    "mousedown",
    "mousemove",
    "keypress",
    "scroll",
    "touchstart",
  ];

  const handlers = events.map((event) => {
    const handler = resetTimer;
    DOMEvent.on(document, event as any, handler, true);
    return () => DOMEvent.off(document, event as any, handler, true);
  });

  const handleVisibility = () => {
    if (document.hidden) {
      clearTimeout(idleTimer);
    } else {
      resetTimer();
    }
  };

  DOMEvent.on(document, "visibilitychange" as any, handleVisibility, false);

  resetTimer();

  return () => {
    clearTimeout(idleTimer);
    handlers.forEach((cleanup) => cleanup());
    DOMEvent.off(document, "visibilitychange" as any, handleVisibility, false);
  };
}
