# Intro.js v2.3.0

> Better introductions for websites and features with a step-by-step guide for your projects.

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

See all attributes [here](https://github.com/usablica/intro.js/wiki/Documentation/#attributes).

**3)** Call this JavaScript function:
```javascript
introJs().start();
````

Optionally, pass one parameter to `introJs` function to limit the presentation section.

**For example** `introJs(".introduction-farm").start();` runs the introduction only for elements with `class='introduction-farm'`.

<p align="center"><img src="https://raw.githubusercontent.com/usablica/intro.js/gh-pages/img/introjs-demo.png"></p>

## Using templates

IntroJS provides awesome templates and we are trying to update and add more templates for next versions. You can browse all templates here: https://github.com/usablica/intro.js/wiki/templates

In order to use templates, all you need to do is appending the template stylesheet to your page, *after* IntroJS CSS file:

```html
<!-- Add IntroJs styles -->
<link href="../../introjs.css" rel="stylesheet">

<!-- Add Nazanin template -->
<link href="../../themes/introjs-nazanin.css" rel="stylesheet">
```

## Documentation

Please visit [Documentation](https://github.com/usablica/intro.js/wiki/Documentation) page on the Wiki.

## Using with:

### Rails
If you are using the rails asset pipeline you can use the [introjs-rails](https://github.com/heelhook/intro.js-rails) gem.

### Yii framework
You can simply use this project for Yii framework: https://github.com/moein7tl/Yii-IntroJS

### Drupal
Here you can find an IntroJs integration for Drupal: https://drupal.org/sandbox/alexanderfb/2061829

### AngularJS
For AngularJS, you can use the directives in [angular-intro.js](http://code.mendhak.com/angular-intro.js/).

### Ember
Ember IntroJS wraps introjs in an Ember Component to guide users through your app.

https://github.com/thefrontside/ember-introjs

### Wordpress
You can use IntroJS inside your Wordpress, here is a good article by SitePoint: http://www.sitepoint.com/creating-intro-js-powered-tours-wordpress/

Here is a under construction plugin for Wordpress: https://github.com/newoldmedia/intro.js-wordpress

### GWT Wrapper
GWT wrapper on top of Intro.js

Github: https://github.com/Agnie-Software/gwt-introjs

## Build

First you should install `nodejs` and `npm`, then first run this command: `npm install` to install all dependencies.

Now you can run this command to minify all static resources:

    make build

## Instant IntroJs

Want to learn faster and easier? Here we have **Instant IntroJs**, Packt Publishing.

<p align="center">
  <a target='_blank' href="http://www.packtpub.com/create-useful-introductions-for-websites-and-applications-with-introjs-library/book"><img src='http://dgdsbygo8mp3h.cloudfront.net/sites/default/files/imagecache/productview_larger/2517OS_Instant%20IntroJS%20Starter.jpg' /></a>
</p>

<p align="center">
  <a target='_blank' href="http://www.packtpub.com/create-useful-introductions-for-websites-and-applications-with-introjs-library/book">Buy and Download</a>
</p>

## <a href="https://github.com/usablica/intro.js/blob/master/changelog.md">Release History</a>

## Author
**Afshin Mehrabani**

- [Twitter](https://twitter.com/afshinmeh)
- [Github](https://github.com/afshinm)
- [Personal page](http://afshinm.name/)

[Other contributors](https://github.com/usablica/intro.js/graphs/contributors)


## Support/Discussion
- [Google Group](https://groups.google.com/d/forum/introjs)
- [Stackoverflow](http://stackoverflow.com/questions/tagged/intro.js)

## License

### Commercial license

If you want to use Intro.js for a commercial application, theme or plugin the commercial license is the appropriate license. With this option, your source code is kept proprietary. Purchase a commercial license at [introjs.com](http://introjs.com/#commercial)

### Open-source license

GNU AGPLv3
