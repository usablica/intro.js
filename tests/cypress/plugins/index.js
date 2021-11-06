const getCompareSnapshotsPlugin = require("cypress-visual-regression/dist/plugin");

module.exports = (on, config) => {
  getCompareSnapshotsPlugin(on, config);
};
