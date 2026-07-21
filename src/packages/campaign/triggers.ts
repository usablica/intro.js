import { CampaignTrigger } from "./types";
import {
  TriggerCallback,
  setupFirstVisitTrigger,
  setupElementClickTrigger,
  setupElementHoverTrigger,
  setupIdleUserTrigger,
  setupPageLoadTrigger,
  setupScrollToElementTrigger,
  setupTimeOnPageTrigger,
  setupExitIntentTrigger,
  setupFormInteractionTrigger,
  setupCustomEventTrigger,
  setupUrlMatchTrigger,
  setupDeviceTypeTrigger,
  setupReturningUserTrigger,
  setupSessionCountTrigger,
  setupScrollDepthTrigger,
  setupElementVisibleTrigger,
} from "./triggers/index";

export class TriggerDetector {
  private cleanupFunctions: Map<string, (() => void)[]> = new Map();
  private isInitialized = false;

  initialize(): void {
    if (this.isInitialized) return;
    this.isInitialized = true;
  }

  addTrigger(
    campaignId: string,
    trigger: CampaignTrigger,
    callback: TriggerCallback
  ): void {
    if (!this.cleanupFunctions.has(campaignId)) {
      this.cleanupFunctions.set(campaignId, []);
    }

    const cleanup = this.setupTrigger(campaignId, trigger, callback);
    if (cleanup) {
      this.cleanupFunctions.get(campaignId)!.push(cleanup);
    }
  }

  removeCampaignTriggers(campaignId: string): void {
    const cleanups = this.cleanupFunctions.get(campaignId);
    if (cleanups) {
      cleanups.forEach((cleanup) => cleanup());
      this.cleanupFunctions.delete(campaignId);
    }
  }

  private setupTrigger(
    campaignId: string,
    trigger: CampaignTrigger,
    callback: TriggerCallback
  ): (() => void) | null {
    switch (trigger.type) {
      case "first_visit":
        return setupFirstVisitTrigger(campaignId, trigger, callback);
      case "element_click":
        return setupElementClickTrigger(campaignId, trigger, callback);
      case "element_hover":
        return setupElementHoverTrigger(campaignId, trigger, callback);
      case "idle_user":
        return setupIdleUserTrigger(campaignId, trigger, callback);
      case "page_load":
        return setupPageLoadTrigger(campaignId, trigger, callback);
      case "scroll_to_element":
        return setupScrollToElementTrigger(campaignId, trigger, callback);
      case "time_on_page":
        return setupTimeOnPageTrigger(campaignId, trigger, callback);
      case "exit_intent":
        return setupExitIntentTrigger(campaignId, trigger, callback);
      case "form_interaction":
        return setupFormInteractionTrigger(campaignId, trigger, callback);
      case "custom_event":
        return setupCustomEventTrigger(campaignId, trigger, callback);
      case "url_match":
        return setupUrlMatchTrigger(campaignId, trigger, callback);
      case "device_type":
        return setupDeviceTypeTrigger(campaignId, trigger, callback);
      case "returning_user":
        return setupReturningUserTrigger(campaignId, trigger, callback);
      case "session_count":
        return setupSessionCountTrigger(campaignId, trigger, callback);
      case "scroll_depth":
        return setupScrollDepthTrigger(campaignId, trigger, callback);
      case "element_visible":
        return setupElementVisibleTrigger(campaignId, trigger, callback);
      default:
        return null;
    }
  }

  destroy(): void {
    Array.from(this.cleanupFunctions.keys()).forEach((campaignId) => {
      this.removeCampaignTriggers(campaignId);
    });
    this.isInitialized = false;
  }
}
