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
