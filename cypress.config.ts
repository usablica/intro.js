import { defineConfig } from "cypress";
import { configureVisualRegression } from "cypress-visual-regression";

module.exports = defineConfig({
  viewportWidth: 1000,
  viewportHeight: 660,
  trashAssetsBeforeRuns: true,
  env: {
    failSilently: false,
  },

  e2e: {
    screenshotsFolder: "./cypress/snapshots/actual",
    supportFile: "./cypress/support/index.ts",
    specPattern: "**/*.*cy.*",
    setupNodeEvents(on, config) {
      on("before:browser:launch", (browser, launchOptions) => {
        // https://on.cypress.io/browser-launch-api

        // the browser width and height we want to get
        if (browser.family === 'chromium' && browser.name !== 'electron') {
          launchOptions.args.push('--force-device-scale-factor=1')

          launchOptions.args.push("--window-size=1000,660");
          launchOptions.args.push("--force-color-profile=srgb");
          launchOptions.args.push("--font-render-hinting=none");
        }

        return launchOptions;
      });

      configureVisualRegression(on);

      return config;
    },
  },
});
