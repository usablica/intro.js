#!/usr/bin/env node

var fs = require('fs')
  , compressor = require('node-minify')
;

new compressor.minify({
	type: 'gcc',
	fileIn: '../intro.js',
	fileOut: '../minified/intro.min.js',
	callback: function(err)
	{
		if (err)
		{
			console.log(err);
		}
		else
		{
			console.log("JS minified");
		}
	}
});

new compressor.minify({
	type: 'yui-css',
	fileIn: '../introjs.css',
	fileOut: '../minified/introjs.min.css',
	callback: function(err)
	{
		if (err)
		{
			console.log(err);
		}
		else
		{
			console.log("CSS minified");
		}
    }
});

