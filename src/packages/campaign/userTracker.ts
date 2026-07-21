import { detectDeviceType } from "./triggers/utils";

/**
 * User tracker - tracks user behavior and context
 */
export class UserTracker {
  private isInitialized = false;
  private userContext: {
    isFirstVisit: boolean;
    sessionCount: number;
    lastVisit?: Date;
    device: "mobile" | "tablet" | "desktop";
    language: string;
    userAgent: string;
  } | null = null;

  /**
   * Initialize the user tracker
   */
  initialize(): void {
    if (this.isInitialized) return;

    // Track session count
    const sessionCountKey = "introjs-campaign-session-count";
    const sessionCount =
      parseInt(localStorage.getItem(sessionCountKey) || "0", 10) + 1;
    localStorage.setItem(sessionCountKey, sessionCount.toString());

    // Check if first visit
    const firstVisitKey = "introjs-campaign-first-visit";
    const isFirstVisit = !localStorage.getItem(firstVisitKey);
    if (isFirstVisit) {
      localStorage.setItem(firstVisitKey, Date.now().toString());
    }

    // Get last visit
    const lastVisitKey = "introjs-campaign-last-visit";
    const lastVisitStr = localStorage.getItem(lastVisitKey);
    const lastVisit = lastVisitStr
      ? new Date(parseInt(lastVisitStr, 10))
      : undefined;
    localStorage.setItem(lastVisitKey, Date.now().toString());

    // Detect device type
    const device = detectDeviceType();

    // Get language
    const language = navigator.language || "en";

    // Get user agent
    const userAgent = navigator.userAgent;

    this.userContext = {
      isFirstVisit,
      sessionCount,
      lastVisit,
      device,
      language,
      userAgent,
    };

    this.isInitialized = true;
  }

  /**
   * Get user context
   */
  getUserContext() {
    if (!this.userContext) {
      throw new Error("UserTracker not initialized. Call initialize() first.");
    }
    return this.userContext;
  }

  /**
   * Reset user tracking data
   */
  reset(): void {
    localStorage.removeItem("introjs-campaign-session-count");
    localStorage.removeItem("introjs-campaign-first-visit");
    localStorage.removeItem("introjs-campaign-last-visit");
    this.userContext = null;
    this.isInitialized = false;
  }
}
