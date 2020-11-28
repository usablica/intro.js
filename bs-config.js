/*
 | Browser-sync config file
 | For up-to-date information about the options:
 |   http://www.browsersync.io/docs/options/
 | */
 module.exports = {
  "ui": false,
  "files": ['dist/**', 'example/**', 'docs/**', 'themes/**'],
  "watchEvents": [
      "change"
  ],
  "ignore": ["node_modules/*"],
  "single": false,
  "watchOptions": {
      "ignoreInitial": true
  },
  "server": true,
  "port": 4000,
  "notify": false,
  "startPath": "/example"
};