# Intro.js Campaign System

The Intro.js Campaign System is a powerful no-code solution for creating and managing guided tours and hints using JSON configuration files. It enables you to create sophisticated user onboarding experiences without writing any JavaScript code.

## Table of Contents

- [Overview](#overview)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Campaign Structure](#campaign-structure)
- [Trigger Types](#trigger-types)
- [Frequency Management](#frequency-management)
- [Targeting Options](#targeting-options)
- [Analytics](#analytics)
- [Examples](#examples)
- [API Reference](#api-reference)

## Overview

The Campaign System allows you to:

- Create tours and hints using JSON configuration
- Define multiple trigger conditions (first visit, element click, idle user, etc.)
- Control campaign frequency and timing
- Target specific user segments
- Track campaign analytics
- Manage multiple campaigns simultaneously

## Installation

The campaign system is included in Intro.js. Import it as follows:

```javascript
import { initializeCampaigns } from 'intro.js/campaign';
```

Or using CommonJS:

```javascript
const { initializeCampaigns } = require('intro.js/campaign');
```

## Quick Start

### 1. Create a Campaign JSON File

Create a `campaigns.json` file:

```json
{
  "version": "1.0.0",
  "campaigns": [
    {
      "id": "welcome-tour",
      "name": "Welcome Tour",
      "active": true,
      "mode": "tour",
      "triggers": [
        {
          "type": "first_visit",
          "delay": 1000
        }
      ],
      "tourOptions": {
        "steps": [
          {
            "element": "#header",
            "intro": "Welcome! This is the header.",
            "position": "bottom"
          }
        ]
      }
    }
  ]
}
```

### 2. Initialize Campaigns

```javascript
import { initializeCampaigns } from 'intro.js/campaign';

// Load from URL
await initializeCampaigns('/campaigns.json');

// Or load from object
await initializeCampaigns({
  version: '1.0.0',
  campaigns: [/* your campaigns */]
});
```

## Campaign Structure

### Basic Campaign Schema

```typescript
interface Campaign {
  id: string;                    // Unique identifier
  name: string;                  // Display name
  description?: string;          // Optional description
  version?: string;              // Campaign version
  active: boolean;               // Enable/disable campaign
  mode: "tour" | "hint";         // Tour or Hint mode
  triggers: CampaignTrigger[];   // Trigger conditions
  tourOptions?: Partial<TourOptions>;  // Tour configuration
  hintOptions?: Partial<HintOptions>;  // Hint configuration
  frequency?: CampaignFrequency; // Frequency settings
  targeting?: CampaignTargeting; // Targeting rules
  analytics?: CampaignAnalytics; // Analytics configuration
}
```

## Trigger Types

### 1. First Visit Trigger

Triggers when a user visits the page for the first time.

```json
{
  "type": "first_visit",
  "delay": 1000,
  "cookieName": "custom-cookie-name"
}
```

### 2. Element Click Trigger

Triggers when a user clicks on a specific element.

```json
{
  "type": "element_click",
  "selector": ".help-button",
  "delay": 500
}
```

### 3. Element Hover Trigger

Triggers when a user hovers over a specific element.

```json
{
  "type": "element_hover",
  "selector": ".feature-icon",
  "hoverDuration": 1000
}
```

### 4. Idle User Trigger

Triggers when a user is idle for a specified period.

```json
{
  "type": "idle_user",
  "idleTime": 30000
}
```

### 5. Page Load Trigger

Triggers when the page finishes loading.

```json
{
  "type": "page_load",
  "delay": 2000
}
```

### 6. Scroll to Element Trigger

Triggers when a user scrolls to a specific element.

```json
{
  "type": "scroll_to_element",
  "selector": ".pricing-section",
  "threshold": 0.5
}
```

### 7. Time on Page Trigger

Triggers after a user spends a specific amount of time on the page.

```json
{
  "type": "time_on_page",
  "duration": 60000
}
```

### 8. Exit Intent Trigger

Triggers when a user shows exit intent (mouse leaves viewport).

```json
{
  "type": "exit_intent",
  "sensitivity": 10
}
```

### 9. Form Interaction Trigger

Triggers when a user interacts with form elements.

```json
{
  "type": "form_interaction",
  "selector": "#signup-form",
  "interactionType": "focus"
}
```

### 10. Custom Event Trigger

Triggers on a custom JavaScript event.

```json
{
  "type": "custom_event",
  "eventName": "userRegistered"
}
```

### 11. URL Match Trigger

Triggers when the URL matches a specific pattern.

```json
{
  "type": "url_match",
  "pattern": "/dashboard.*",
  "matchType": "regex"
}
```

### 12. Device Type Trigger

Triggers for specific device types.

```json
{
  "type": "device_type",
  "device": "mobile"
}
```

### 13. Returning User Trigger

Triggers for users who have visited before.

```json
{
  "type": "returning_user",
  "minVisits": 2
}
```

### 14. Session Count Trigger

Triggers based on session count.

```json
{
  "type": "session_count",
  "count": 3,
  "operator": "equal"
}
```

### 15. Scroll Depth Trigger

Triggers when a user scrolls to a specific depth.

```json
{
  "type": "scroll_depth",
  "percentage": 50
}
```

### 16. Element Visible Trigger

Triggers when a specific element becomes visible.

```json
{
  "type": "element_visible",
  "selector": ".product-demo",
  "threshold": 0.75
}
```

## Frequency Management

Control how often campaigns are shown:

```json
{
  "frequency": {
    "type": "once",           // once, daily, weekly, monthly, session, always
    "limit": 3,               // Maximum number of times to show
    "cooldownMs": 86400000    // Cooldown period in milliseconds
  }
}
```

### Frequency Types

- **once**: Show only once ever
- **daily**: Show once per day
- **weekly**: Show once per week
- **monthly**: Show once per month
- **session**: Show once per session
- **always**: Show every time (use with cooldown)

## Targeting Options

Target specific user segments:

```json
{
  "targeting": {
    "userAgent": ["Chrome.*", "Firefox.*"],
    "language": ["en", "en-US"],
    "referrer": ["google\\.com", "facebook\\.com"],
    "queryParams": {
      "utm_campaign": "summer-sale"
    },
    "localStorage": {
      "userType": "premium"
    },
    "sessionStorage": {
      "firstVisit": "true"
    },
    "customFunction": "isEligibleUser"
  }
}
```

## Analytics

Track campaign performance:

```json
{
  "analytics": {
    "trackViews": true,
    "trackCompletions": true,
    "trackSkips": true,
    "trackStepChanges": true,
    "customEvents": ["button_click", "form_submit"],
    "callbackFunction": "handleCampaignAnalytics"
  }
}
```

### Analytics Callback Example

```javascript
window.handleCampaignAnalytics = function(event, campaign, context) {
  console.log('Campaign Event:', event);
  console.log('Campaign:', campaign.name);
  console.log('Context:', context);
  
  // Send to your analytics service
  analytics.track(`campaign_${event}`, {
    campaignId: campaign.id,
    campaignName: campaign.name,
    userId: context.user.id
  });
};
```

## Examples

### Example 1: Welcome Tour for First-Time Users

```json
{
  "id": "welcome-tour",
  "name": "Welcome Tour",
  "active": true,
  "mode": "tour",
  "triggers": [
    {
      "type": "first_visit",
      "delay": 1000
    }
  ],
  "frequency": {
    "type": "once"
  },
  "tourOptions": {
    "steps": [
      {
        "element": "#dashboard",
        "intro": "Welcome to your dashboard!",
        "position": "bottom"
      },
      {
        "element": "#menu",
        "intro": "Access all features from here.",
        "position": "right"
      }
    ],
    "showProgress": true
  },
  "analytics": {
    "trackCompletions": true
  }
}
```

### Example 2: Feature Discovery on Button Click

```json
{
  "id": "feature-tour",
  "name": "Feature Discovery",
  "active": true,
  "mode": "tour",
  "triggers": [
    {
      "type": "element_click",
      "selector": ".help-icon"
    }
  ],
  "frequency": {
    "type": "session"
  },
  "tourOptions": {
    "steps": [
      {
        "element": ".advanced-features",
        "intro": "Discover our advanced features!",
        "position": "left"
      }
    ]
  }
}
```

### Example 3: Re-engagement for Idle Users

```json
{
  "id": "idle-reengagement",
  "name": "Idle User Re-engagement",
  "active": true,
  "mode": "tour",
  "triggers": [
    {
      "type": "idle_user",
      "idleTime": 30000
    }
  ],
  "frequency": {
    "type": "daily"
  },
  "tourOptions": {
    "steps": [
      {
        "intro": "Still here? Check out these tips!",
        "position": "floating"
      }
    ]
  }
}
```

### Example 4: Mobile-Only Tour

```json
{
  "id": "mobile-tour",
  "name": "Mobile Experience Tour",
  "active": true,
  "mode": "tour",
  "triggers": [
    {
      "type": "device_type",
      "device": "mobile"
    },
    {
      "type": "page_load",
      "delay": 1000
    }
  ],
  "targeting": {
    "device": ["mobile", "tablet"]
  },
  "tourOptions": {
    "steps": [
      {
        "element": ".mobile-menu",
        "intro": "Tap here to access the mobile menu.",
        "position": "bottom"
      }
    ]
  }
}
```

## API Reference

### `initializeCampaigns(config)`

Initialize campaigns from configuration.

**Parameters:**
- `config`: `CampaignCollection | Campaign[] | string` - Campaign configuration or URL

**Returns:** `Promise<CampaignManager>`

**Example:**
```javascript
const manager = await initializeCampaigns('/campaigns.json');
```

### `getCampaignManager()`

Get the global campaign manager instance.

**Returns:** `CampaignManager`

**Example:**
```javascript
import { getCampaignManager } from 'intro.js/campaign';

const manager = getCampaignManager();
```

### CampaignManager Methods

#### `addCampaign(campaign: Campaign)`

Add a campaign programmatically.

```javascript
await manager.addCampaign({
  id: 'new-campaign',
  name: 'New Campaign',
  active: true,
  mode: 'tour',
  triggers: [{ type: 'page_load' }],
  tourOptions: { steps: [] }
});
```

#### `removeCampaign(campaignId: string)`

Remove a campaign.

```javascript
manager.removeCampaign('welcome-tour');
```

#### `getCampaigns(): Campaign[]`

Get all active campaigns.

```javascript
const campaigns = manager.getCampaigns();
```

#### `getCampaign(campaignId: string): Campaign | undefined`

Get a specific campaign.

```javascript
const campaign = manager.getCampaign('welcome-tour');
```

#### `stopAllCampaigns()`

Stop all running campaigns.

```javascript
await manager.stopAllCampaigns();
```

#### `destroy()`

Destroy the campaign manager and clean up.

```javascript
manager.destroy();
```

## Best Practices

1. **Start Simple**: Begin with basic triggers and gradually add complexity
2. **Test Thoroughly**: Test campaigns across different devices and browsers
3. **Monitor Analytics**: Track campaign performance and iterate
4. **Respect Users**: Don't show campaigns too frequently
5. **Mobile First**: Ensure campaigns work well on mobile devices
6. **Performance**: Keep campaign JSON files small and load them asynchronously
7. **Accessibility**: Ensure campaigns are keyboard-navigable and screen-reader friendly

## Troubleshooting

### Campaign Not Triggering

- Check that `active` is set to `true`
- Verify trigger conditions are met
- Check browser console for errors
- Ensure elements referenced in selectors exist

### Campaign Shows Too Often

- Adjust `frequency` settings
- Add `cooldownMs` to prevent frequent displays
- Use `limit` to cap the number of times shown

### Performance Issues

- Reduce the number of active campaigns
- Optimize trigger conditions
- Use `delay` to defer campaign execution
- Load campaigns asynchronously

## Support

For issues, questions, or contributions, please visit:
- GitHub: https://github.com/usablica/intro.js
- Documentation: https://introjs.com/docs

## License

The Campaign System is part of Intro.js and follows the same license.
