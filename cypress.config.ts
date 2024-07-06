import { defineConfig } from "cypress";
import { configureVisualRegression } from "cypress-visual-regression";

module.exports = defineConfig({
  screenshotsFolder: "./cypress/snapshots/actual",
  trashAssetsBeforeRuns: true,
  env: {
    failSilently: false,
  },
  e2e: {
    supportFile: "./cypress/support/index.ts",
    specPattern: "**/*.*cy.*",
    setupNodeEvents(on, config) {
      configureVisualRegression(on);
    },
  },
});
