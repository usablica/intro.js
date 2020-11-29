# Intro.js v3

[![Build Status](https://travis-ci.org/usablica/intro.js.svg?branch=master)](https://travis-ci.org/usablica/intro.js)
[![](https://data.jsdelivr.com/v1/package/npm/intro.js/badge)](https://www.jsdelivr.com/package/npm/intro.js)
[![npm](https://img.shields.io/npm/dm/intro.js)](https://www.jsdelivr.com/package/npm/intro.js)

> Lightweight, user-friendly onboarding tour library

## Where to get
You can obtain your local copy of Intro.js from:

**1)** This github repository, using ```git clone https://github.com/usablica/intro.js.git```

**2)** Using bower ```bower install intro.js --save```

**3)** Using npm ```npm install intro.js --save```

**4)** Download it from CDN ([1](http://www.jsdelivr.com/projects/intro.js), [2](https://cdnjs.com/libraries/intro.js))

## How to use
Intro.js can be added to your site in three simple steps:

**1)** Include `intro.js` and `introjs.css` (or the minified version for production) in your page. Use `introjs-rtl.min.css` for Right-to-Left language support.

> CDN hosted files are available at [jsDelivr](http://www.jsdelivr.com/projects/intro.js) (click Show More) & [cdnjs](https://cdnjs.com/libraries/intro.js).

**2)** Add `data-intro` and `data-step` to your HTML elements. To add hints you should use `data-hint` attribute.

For example:

```html
<a href='http://google.com/' data-intro='Hello step one!'></a>
````

See all attributes [here](https://introjs.com/docs/intro/attributes/).

**3)** Call this JavaScript function:
```javascript
introJs().start();
````

Optionally, pass one parameter to `introJs` function to limit the presentation section.

**For example** `introJs(".introduction-farm").start();` runs the introduction only for elements with `class='introduction-farm'`.

<p align="center"><img src="https://raw.githubusercontent.com/usablica/intro.js/gh-pages/img/introjs-demo.png"></p>

## Documentation

Please visit [Documentation](http://introjs.com/docs).

## Using with:

Intro.js has many wrappers for different purposes. Please visit [Documentation](http://introjs.com/docs) for more info.

## Build

First you should install `nodejs` and `npm`, then first run this command: `npm install` to install all dependencies.

Now you can run this command to minify all static resources:

    npm run build

## Contributors ✨

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="http://afshinm.name"><img src="https://avatars3.githubusercontent.com/u/314326?v=4" width="100px;" alt=""/><br /><sub><b>Afshin Mehrabani</b></sub></a><br /><a href="https://github.com/usablica/intro.js/commits?author=afshinm" title="Code">💻</a> <a href="https://github.com/usablica/intro.js/commits?author=afshinm" title="Documentation">📖</a></td>
    <td align="center"><a href="https://bozdoz.com"><img src="https://avatars0.githubusercontent.com/u/1410985?v=4" width="100px;" alt=""/><br /><sub><b>bozdoz</b></sub></a><br /><a href="https://github.com/usablica/intro.js/commits?author=bozdoz" title="Code">💻</a> <a href="https://github.com/usablica/intro.js/commits?author=bozdoz" title="Documentation">📖</a></td>
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

## Support/Discussion
- [Stackoverflow](http://stackoverflow.com/questions/tagged/intro.js)

## License

### Commercial license

If you want to use Intro.js for a commercial application, theme or plugin the commercial license is the appropriate license. With this option, your source code is kept proprietary. Purchase a commercial license at [introjs.com](http://introjs.com/#commercial)

### Open-source license

GNU AGPLv3
