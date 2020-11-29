module.exports = {
  "presets": [
    [
      "@babel/env",
      {
        targets: {
          browsers: "> 0.5%, ie >= 11"
        },
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
