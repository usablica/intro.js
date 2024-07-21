module.exports = (on, config) => {
  const getCompareSnapshotsPlugin = require("cypress-visual-regression/dist/plugin");
  getCompareSnapshotsPlugin(on, config);
};
