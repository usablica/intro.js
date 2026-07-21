import { CampaignFrequency } from "./types";

/**
 * Campaign storage - manages campaign execution history and frequency
 */
export class CampaignStorage {
  private storagePrefix = "introjs-campaign-";

  /**
   * Check if a campaign can be executed based on frequency settings
   */
  canExecuteCampaign(campaignId: string, frequency: CampaignFrequency): boolean {
    const key = `${this.storagePrefix}${campaignId}`;
    const data = this.getExecutionData(key);

    // Check execution limit — treat limit=0 as "never show"
    if (frequency.limit !== undefined && data.count >= frequency.limit) {
      return false;
    }

    switch (frequency.type) {
      case "once":
        return data.count === 0;

      case "session":
        return !sessionStorage.getItem(key);

      case "daily":
        return this.checkTimeWindow(data.lastExecution, 24 * 60 * 60 * 1000);

      case "weekly":
        return this.checkTimeWindow(data.lastExecution, 7 * 24 * 60 * 60 * 1000);

      case "monthly":
        return this.checkTimeWindow(data.lastExecution, 30 * 24 * 60 * 60 * 1000);

      case "always":
        if (frequency.cooldownMs) {
          return this.checkTimeWindow(data.lastExecution, frequency.cooldownMs);
        }
        return true;

      default:
        return true;
    }
  }

  /**
   * Track campaign execution
   */
  trackCampaignExecution(campaignId: string): void {
    const key = `${this.storagePrefix}${campaignId}`;
    const data = this.getExecutionData(key);

    data.count += 1;
    data.lastExecution = Date.now();

    localStorage.setItem(key, JSON.stringify(data));
    sessionStorage.setItem(key, "executed");
  }

  private getExecutionData(key: string): {
    count: number;
    lastExecution: number | null;
  } {
    const stored = localStorage.getItem(key);
    if (!stored) return { count: 0, lastExecution: null };

    try {
      return JSON.parse(stored);
    } catch {
      return { count: 0, lastExecution: null };
    }
  }

  private checkTimeWindow(
    lastExecution: number | null,
    windowMs: number
  ): boolean {
    if (!lastExecution) return true;
    return Date.now() - lastExecution >= windowMs;
  }

  resetCampaign(campaignId: string): void {
    const key = `${this.storagePrefix}${campaignId}`;
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
  }

  resetAll(): void {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(this.storagePrefix)) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach((key) => localStorage.removeItem(key));

    const sessionKeysToRemove: string[] = [];
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key && key.startsWith(this.storagePrefix)) {
        sessionKeysToRemove.push(key);
      }
    }
    sessionKeysToRemove.forEach((key) => sessionStorage.removeItem(key));
  }

  getStats(campaignId: string): { count: number; lastExecution: Date | null } {
    const key = `${this.storagePrefix}${campaignId}`;
    const data = this.getExecutionData(key);
    return {
      count: data.count,
      lastExecution: data.lastExecution ? new Date(data.lastExecution) : null,
    };
  }

  getAllStats(): Record<string, { count: number; lastExecution: Date | null }> {
    const stats: Record<string, { count: number; lastExecution: Date | null }> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(this.storagePrefix)) {
        const campaignId = key.replace(this.storagePrefix, "");
        stats[campaignId] = this.getStats(campaignId);
      }
    }
    return stats;
  }
}
