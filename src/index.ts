import { version } from "../package.json";
import { Hint } from "./packages/hint";
import { Tour } from "./packages/tour";
import { CampaignManager, initializeCampaigns, getCampaignManager } from "./packages/campaign";

class LegacyIntroJs extends Tour {
  /**
   * @deprecated introJs().addHints() is deprecated, please use introJs.hint().addHints() instead
   * @param args
   */
  addHints(..._: any[]) {
    console.error(
      "introJs().addHints() is deprecated, please use introJs.hint.addHints() instead."
    );
  }

  /**
   * @deprecated introJs().addHint() is deprecated, please use introJs.hint.addHint() instead
   * @param args
   */
  addHint(..._: any[]) {
    console.error(
      "introJs().addHint() is deprecated, please use introJs.hint.addHint() instead."
    );
  }

  /**
   * @deprecated introJs().removeHints() is deprecated, please use introJs.hint.hideHints() instead
   * @param args
   */
  removeHints(..._: any[]) {
    console.error(
      "introJs().removeHints() is deprecated, please use introJs.hint.removeHints() instead."
    );
  }
}

/**
 * Intro.js module
 */
const introJs = (elementOrSelector?: string | HTMLElement) => {
  console.warn(
    "introJs() is deprecated. Please use introJs.tour() or introJs.hint() instead."
  );
  return new LegacyIntroJs(elementOrSelector);
};

/**
 * Create a new Intro.js Tour instance
 * @param elementOrSelector Optional target element to start the Tour on
 */
introJs.tour = (elementOrSelector?: string | HTMLElement) =>
  new Tour(elementOrSelector);

/**
 * Create a new Intro.js Hint instance
 * @param elementOrSelector Optional target element to start the Hint on
 */
introJs.hint = (elementOrSelector?: string | HTMLElement) =>
  new Hint(elementOrSelector);

/**
 * Create a new Intro.js campaign manager instance
 */
introJs.campaign = () => new CampaignManager();

/**
 * Initialize campaigns from configuration
 * @param config Campaign configuration (JSON object, array, or URL to JSON file)
 */
introJs.initializeCampaigns = initializeCampaigns;

/**
 * Get the global campaign manager instance
 */
introJs.getCampaignManager = getCampaignManager;

/**
 * Manually trigger a campaign by ID
 * @param campaignId The ID of the campaign to trigger
 */
introJs.triggerCampaign = async (campaignId: string): Promise<boolean> => {
  const manager = getCampaignManager();
  const campaign = manager.getCampaign(campaignId);
  
  if (!campaign) {
    console.error(`Campaign "${campaignId}" not found`);
    return false;
  }
  
  return await manager.executeCampaign(campaignId, {
    type: 'custom_event',
    eventName: 'manual_trigger'
  });
};

/**
 * Current Intro.js version
 */
introJs.version = version;

export default introJs;
