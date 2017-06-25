#!/usr/bin/env node

var fs = require("fs");
var compressor = require("node-minify");

compressor.minify({
  compressor: "gcc",
  input: "../intro.js",
  output: "../minified/intro.min.js",
  callback: function(err) {
    if (err) {
      console.log(err)
    } else {
      console.log("JS minified successfully.")
    }
  }
})

compressor.minify({
  compressor: "yui-css",
  input: "../introjs.css",
  output: "../minified/introjs.min.css",
  callback: function(err) {
    if (err) {
      console.log(err)
    } else {
      console.log("Main CSS minified successfully.")
    }
  }
})

compressor.minify({
  compressor: "yui-css",
  input: "../introjs-rtl.css",
  output: "../minified/introjs-rtl.min.css",
  callback: function(err) {
    if (err) {
      console.log(err)
    } else {
      console.log("RTL CSS minified successfully.")
    }
  }
})
