import { Campaign, TourCampaign, HintCampaign } from "./types";
import { Tour } from "../tour/tour";
import { Hint } from "../hint/hint";

/**
 * Base interface for all campaign experiences
 * This allows us to work with different experience types uniformly
 */
export interface CampaignExperience {
  start(): Promise<void>;
  exit(): Promise<void>;
  onComplete(callback: () => void): void;
  onExit(callback: () => void): void;
}

class TourExperienceAdapter implements CampaignExperience {
  private tour: Tour;

  constructor(tour: Tour) {
    this.tour = tour;
  }

  async start(): Promise<void> {
    await this.tour.start();
  }

  async exit(): Promise<void> {
    await this.tour.exit();
  }

  onComplete(callback: () => void): void {
    this.tour.onComplete(callback);
  }

  onExit(callback: () => void): void {
    this.tour.onExit(callback);
  }
}

class HintExperienceAdapter implements CampaignExperience {
  private hint: Hint;

  constructor(hint: Hint) {
    this.hint = hint;
  }

  async start(): Promise<void> {
    await this.hint.render();
  }

  async exit(): Promise<void> {
    this.hint.destroy();
  }

  onComplete(callback: () => void): void {
    this.hint.onHintClose(() => {
      const allHidden = this.hint
        .getHints()
        .every((h) => h.isActive && !h.isActive.val);
      if (allHidden) {
        callback();
      }
    });
  }

  onExit(callback: () => void): void {
    this.hint.onHintClose(callback);
  }
}

export class ExperienceFactory {
  static createExperience(campaign: Campaign): CampaignExperience {
    switch (campaign.mode) {
      case "tour":
        return this.createTourExperience(campaign);
      case "hint":
        return this.createHintExperience(campaign);
      default: {
        const _exhaustive: never = campaign;
        throw new Error(`Unsupported experience type: ${(_exhaustive as { mode: string }).mode}`);
      }
    }
  }

  private static createTourExperience(campaign: TourCampaign): TourExperienceAdapter {
    const tour = new Tour();
    tour.setOptions(campaign.options);
    return new TourExperienceAdapter(tour);
  }

  private static createHintExperience(campaign: HintCampaign): HintExperienceAdapter {
    const hint = new Hint(undefined, campaign.options);
    return new HintExperienceAdapter(hint);
  }
}
