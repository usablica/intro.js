import { defineConfig } from "cypress";
import { configureVisualRegression } from "cypress-visual-regression";

module.exports = defineConfig({
  viewportWidth: 1000,
  trashAssetsBeforeRuns: true,
  env: {
    visualRegressionFailSilently: false,
  },
  e2e: {
    screenshotsFolder: "./cypress/snapshots/actual",
    supportFile: "./cypress/support/index.ts",
    specPattern: "**/*.*cy.*",
    setupNodeEvents(on, config) {
      configureVisualRegression(on);

      return config;
    },
  },
});
