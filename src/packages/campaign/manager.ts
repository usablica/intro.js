import {
  Campaign,
  CampaignTrigger,
  CampaignCollection,
  CampaignTargeting,
} from "./types";
import { TriggerDetector } from "./triggers";
import { UserTracker } from "./userTracker";
import { CampaignStorage } from "./storage";
import isFunction from "../../util/isFunction";
import {
  ExperienceFactory,
  CampaignExperience,
} from "./experienceFactory";

export class CampaignManager {
  private campaigns: Map<string, Campaign> = new Map();
  private triggerDetector: TriggerDetector;
  private userTracker: UserTracker;
  private storage: CampaignStorage;
  private activeExperiences: Map<string, CampaignExperience> = new Map();
  private globalTargeting: CampaignTargeting | undefined;
  private isInitialized = false;

  constructor() {
    this.triggerDetector = new TriggerDetector();
    this.userTracker = new UserTracker();
    this.storage = new CampaignStorage();
  }

  initialize(): void {
    if (this.isInitialized) return;
    this.userTracker.initialize();
    this.triggerDetector.initialize();
    this.isInitialized = true;
  }

  loadCampaigns(config: CampaignCollection | Campaign[]): void {
    if (!Array.isArray(config)) {
      this.globalTargeting = config.global?.targeting;
    }

    const campaigns = Array.isArray(config) ? config : config.campaigns;
    for (const campaign of campaigns) {
      if (campaign.active) {
        this.campaigns.set(campaign.id, campaign);
        this.setupCampaignTriggers(campaign);
      }
    }
  }

  async loadCampaignsFromUrl(url: string): Promise<void> {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const config = await response.json();
      this.loadCampaigns(config);
    } catch (error) {
      console.error("Failed to load campaigns from URL:", error);
    }
  }

  addCampaign(campaign: Campaign): void {
    if (campaign.active) {
      this.campaigns.set(campaign.id, campaign);
      this.setupCampaignTriggers(campaign);
    }
  }

  removeCampaign(campaignId: string): void {
    const campaign = this.campaigns.get(campaignId);
    if (campaign) {
      this.triggerDetector.removeCampaignTriggers(campaignId);
      this.campaigns.delete(campaignId);

      const activeExperience = this.activeExperiences.get(campaignId);
      if (activeExperience) {
        this.activeExperiences.delete(campaignId);
        void activeExperience.exit();
      }
    }
  }

  getCampaigns(): Campaign[] {
    return Array.from(this.campaigns.values());
  }

  getCampaign(campaignId: string): Campaign | undefined {
    return this.campaigns.get(campaignId);
  }

  private async shouldExecuteCampaign(campaign: Campaign): Promise<boolean> {
    if (campaign.frequency) {
      if (!this.storage.canExecuteCampaign(campaign.id, campaign.frequency)) {
        return false;
      }
    }

    // Global targeting applies to all campaigns
    if (this.globalTargeting) {
      if (!(await this.checkTargeting(this.globalTargeting))) return false;
    }

    // Per-campaign targeting
    if (campaign.targeting) {
      if (!(await this.checkTargeting(campaign.targeting))) return false;
    }

    return true;
  }

  private async checkTargeting(targeting: CampaignTargeting): Promise<boolean> {
    const userContext = this.userTracker.getUserContext();

    if (targeting.userAgent) {
      const matches = targeting.userAgent.some((pattern: string) => {
        try {
          return new RegExp(pattern).test(userContext.userAgent);
        } catch {
          console.warn(`Invalid userAgent regex pattern: "${pattern}"`);
          return false;
        }
      });
      if (!matches) return false;
    }

    if (targeting.language) {
      if (targeting.language.indexOf(userContext.language) === -1) return false;
    }

    if (targeting.referrer) {
      const referrer = document.referrer;
      const matches = targeting.referrer.some((pattern: string) => {
        try {
          return new RegExp(pattern).test(referrer);
        } catch {
          console.warn(`Invalid referrer regex pattern: "${pattern}"`);
          return false;
        }
      });
      if (!matches) return false;
    }

    if (targeting.queryParams) {
      const urlParams = new URLSearchParams(window.location.search);
      for (const [key, value] of Object.entries(targeting.queryParams)) {
        if (urlParams.get(key) !== value) return false;
      }
    }

    if (targeting.localStorage) {
      for (const [key, value] of Object.entries(targeting.localStorage)) {
        if (localStorage.getItem(key) !== value) return false;
      }
    }

    if (targeting.sessionStorage) {
      for (const [key, value] of Object.entries(targeting.sessionStorage)) {
        if (sessionStorage.getItem(key) !== value) return false;
      }
    }

    if (targeting.customFunction) {
      const customFn = (window as any)[targeting.customFunction];
      if (isFunction(customFn)) {
        const result = await customFn(userContext);
        if (!result) return false;
      }
    }

    return true;
  }

  async executeCampaign(
    campaignId: string,
    trigger: CampaignTrigger
  ): Promise<boolean> {
    const campaign = this.campaigns.get(campaignId);
    if (!campaign) return false;

    // Prevent launching the same campaign twice simultaneously
    if (this.activeExperiences.has(campaignId)) return false;

    if (!(await this.shouldExecuteCampaign(campaign))) {
      return false;
    }

    try {
      const experience = ExperienceFactory.createExperience(campaign);

      experience.onComplete(() => {
        this.activeExperiences.delete(campaignId);
      });

      experience.onExit(() => {
        this.activeExperiences.delete(campaignId);
      });

      this.activeExperiences.set(campaignId, experience);

      await experience.start();

      // Track only after successful start
      this.storage.trackCampaignExecution(campaignId);

      return true;
    } catch (error) {
      console.error(`Failed to start campaign ${campaign.mode} (trigger: ${trigger.type}):`, error);
      this.activeExperiences.delete(campaignId);
      return false;
    }
  }

  private setupCampaignTriggers(campaign: Campaign): void {
    for (const trigger of campaign.triggers) {
      this.triggerDetector.addTrigger(
        campaign.id,
        trigger,
        (triggeredCampaignId, triggeredTrigger) => {
          this.executeCampaign(triggeredCampaignId, triggeredTrigger).catch(
            (err) => console.error("Campaign execution error:", err)
          );
        }
      );
    }
  }

  async stopAllCampaigns(): Promise<void> {
    await Promise.all(
      Array.from(this.activeExperiences.values()).map((exp) => exp.exit())
    );
    this.activeExperiences.clear();
  }

  async destroy(): Promise<void> {
    await this.stopAllCampaigns();
    this.triggerDetector.destroy();
    this.campaigns.clear();
    this.globalTargeting = undefined;
    this.isInitialized = false;
  }
}

let globalCampaignManager: CampaignManager | null = null;

export function getCampaignManager(): CampaignManager {
  if (!globalCampaignManager) {
    globalCampaignManager = new CampaignManager();
  }
  return globalCampaignManager;
}

export async function initializeCampaigns(
  config: CampaignCollection | Campaign[] | string
): Promise<CampaignManager> {
  const manager = getCampaignManager();
  manager.initialize();

  if (typeof config === "string") {
    await manager.loadCampaignsFromUrl(config);
  } else {
    manager.loadCampaigns(config);
  }

  return manager;
}
