/**
 * Intro.js Campaign System
 *
 * A no-code campaign management system for Intro.js that allows you to create
 * and manage guided tours and hints using JSON configuration files.
 *
 * @example
 * ```typescript
 * import { initializeCampaigns } from 'intro.js/campaign';
 *
 * // Load campaigns from JSON file
 * await initializeCampaigns('/campaigns.json');
 *
 * // Or load campaigns from object
 * await initializeCampaigns({
 *   version: '1.0.0',
 *   campaigns: [
 *     {
 *       id: 'welcome-tour',
 *       name: 'Welcome Tour',
 *       active: true,
 *       mode: 'tour',
 *       triggers: [{ type: 'first_visit' }],
 *       options: {
 *         steps: [
 *           { element: '#step1', intro: 'Welcome!' }
 *         ]
 *       }
 *     }
 *   ]
 * });
 * ```
 */

export * from "./types";
export {
  CampaignManager,
  getCampaignManager,
  initializeCampaigns,
} from "./manager";
export { TriggerDetector } from "./triggers";
export { UserTracker } from "./userTracker";
export { CampaignStorage } from "./storage";
