module.exports = {
  "env": {
    test: {
      presets: [
        [
          "@babel/env",
        ]
      ]
    }
  },
  "presets": [
    [
      "@babel/env",
      {
        modules: false,
        debug: true,
        useBuiltIns: "usage",
        forceAllTransforms: true,
        corejs: {
          version: 3,
          proposals: false
        }
      }
    ]
  ]
}
