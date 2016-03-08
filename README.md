# Intro.js v2.0

> Better introductions for websites and features with a step-by-step guide for your projects.

## Where to get
You can obtain your local copy of Intro.js from:

**1)** This github repository, using ```git clone https://github.com/usablica/intro.js.git```

**2)** Using bower ```bower install intro.js --save```

**3)** Using npm ```npm install intro.js --save```

**4)** Download it from CDN ([1](http://www.jsdelivr.com/#!intro.js), [2](http://cdnjs.com/#introjs))


## How to use
Intro.js can be added to your site in three simple steps:

**1)** Include `intro.js` and `introjs.css` (or the minified version for production) in your page. Use `introjs-rtl.min.css` for Right-to-Left language support.

> CDN hosted files are available at [jsDelivr](http://www.jsdelivr.com/#!intro.js) (click Show More) & [cdnjs](http://cdnjs.com/#introjs).

**2)** Add `data-intro` and `data-step` to your HTML elements. To add hints you should use `data-hint` attribute.

For example:

```html
<a href='http://google.com/' data-intro='Hello step one!'></a>
````

See all attributes [here](https://github.com/usablica/intro.js/#attributes).

**3)** Call this JavaScript function:
```javascript
introJs().start();
````

Optionally, pass one parameter to `introJs` function to limit the presentation section.

**For example** `introJs(".introduction-farm").start();` runs the introduction only for elements with `class='introduction-farm'`.

<p align="center"><img src="http://usablica.github.com/intro.js/img/introjs-demo.png"></p>

## Using templates

IntroJS provides awesome templates and we are trying to update and add more templates for next versions. You can browse all templates here: https://github.com/usablica/intro.js/wiki/IntroJs-templates

In order to use templates, all you need to do is appending the template stylesheet to your page, *after* IntroJS CSS file:

```html
<!-- Add IntroJs styles -->
<link href="../../introjs.css" rel="stylesheet">

<!-- Add Nazanin template -->
<link href="../../themes/introjs-nazanin.css" rel="stylesheet">
```

## API

###introJs([targetElm])

Creating an introJs object.

**Available since**: v0.1.0

**Parameters:**
 - targetElm : String (optional)
   Should be defined to start introduction for specific element, for example: `#intro-farm`.

**Returns:**
 - introJs object.

**Example:**
```javascript
introJs() //without selector, start introduction for whole page
introJs("#intro-farm") //start introduction for element id='intro-farm'
````

-----

###introJs.start()

Start the introduction for defined element(s).

**Available since**: v0.1.0

**Returns:**
 - introJs object.

**Example:**
```javascript
introJs().start()
````
-----

###introJs.goToStep(step)

Go to specific step of introduction.

**Available since**: v0.3.0

**Parameters:**
 - step : Number

**Returns:**
 - introJs object.

**Example:**
```javascript
introJs().goToStep(2).start(); //starts introduction from step 2
````

-----

###introJs.nextStep()

Go to next step of introduction.

**Available since**: v0.7.0

**Returns:**
 - introJs object.

**Example:**
```javascript
introJs().start().nextStep();
````

-----

###introJs.previousStep()

Go to previous step of introduction.

**Available since**: v0.7.0

**Returns:**
 - introJs object.

**Example:**
```javascript
introJs().goToStep(3).start().previousStep(); //starts introduction from step 2
````

-----

###introJs.exit()

Exit the introduction.

**Available since**: v0.3.0

**Returns:**
 - introJs object.

**Example:**
```javascript
introJs().exit()
````

-----

###introJs.setOption(option, value)

Set a single option to introJs object.

**Available since**: v0.3.0

**Parameters:**
 - option : String
   Option key name.

 - value : String/Number
   Value of the option.

**Returns:**
 - introJs object.

**Example:**
```javascript
introJs().setOption("skipLabel", "Exit");
````

----

###introJs.setOptions(options)

Set a group of options to the introJs object.

**Available since**: v0.3.0

**Parameters:**
 - options : Object
   Object that contains option keys with values.

**Returns:**
 - introJs object.

**Example:**
```javascript
introJs().setOptions({ 'skipLabel': 'Exit', 'tooltipPosition': 'right' });
````

----

###introJs.refresh()

To refresh and order layers manually

**Available since**: v0.5.0

**Returns:**
 - introJs object.

**Example:**
```javascript
introJs().refresh();
````

----

###introJs.addHints()

To add available hints to the page (using `data-hint` or JSON)

**Available since**: v2.0

**Returns:**
 - introJs object.

**Example:**
```javascript
introJs().addHints();
````

-----

###introJs.onhintclick(providedCallback)

Invkoes given function when user clicks on one of hints.

**Available since**: v2.0

**Parameters:**
 - providedCallback : Function

**Returns:**
 - introJs object.

**Example:**
```javascript
introJs().onhintclick(function() {
  alert("hint clicked");
});
````

-----

###introJs.onhintsadded(providedCallback)

Invokes given callback function after adding and rendering all hints.

**Available since**: v2.0

**Parameters:**
 - providedCallback : Function

**Returns:**
 - introJs object.

**Example:**
```javascript
introJs().onhintsadded(function() {
  alert("all hints were added");
});
````

-----

###introJs.onhintclose(providedCallback)

Set callback for when a single hint removes from page (e.g. when user clicks on "Got it" button)

**Available since**: v2.0

**Parameters:**
 - providedCallback : Function

**Returns:**
 - introJs object.

**Example:**
```javascript
introJs().onhintclose(function() {
  alert("hint closed");
});
````

-----

###introJs.oncomplete(providedCallback)

Set callback for when introduction completed.

**Available since**: v0.2.0

**Parameters:**
 - providedCallback : Function

**Returns:**
 - introJs object.

**Example:**
```javascript
introJs().oncomplete(function() {
  alert("end of introduction");
});
````

-----

###introJs.onexit(providedCallback)

Set callback to exit of introduction. Exit also means pressing `ESC` key and clicking on the overlay layer by the user.

**Available since:** v0.2.0

**Parameters:**
 - providedCallback : Function

**Returns:**
 - introJs object.

**Example:**
```javascript
introJs().onexit(function() {
  alert("exit of introduction");
});
````

-----

###introJs.onchange(providedCallback)

Set callback to change of each step of introduction. Given callback function will be called after completing each step.
The callback function receives the element of the new step as an argument.

**Available since:** v0.3.0

**Parameters:**
 - providedCallback : Function

**Returns:**
 - introJs object.

**Example:**
```javascript
introJs().onchange(function(targetElement) {
  alert("new step");
});
````

-----

###introJs.onbeforechange(providedCallback)

Given callback function will be called before starting a new step of introduction. The callback function receives the element of the new step as an argument.

**Available since:** v0.4.0

**Parameters:**
 - providedCallback : Function

**Returns:**
 - introJs object.

**Example:**
```javascript
introJs().onbeforechange(function(targetElement) {
  alert("before new step");
});
````

-----

###introJs.onafterchange(providedCallback)

Given callback function will be called after starting a new step of introduction. The callback function receives the element of the new step as an argument.

**Available since:** v0.7.0

**Parameters:**
 - providedCallback : Function

**Returns:**
 - introJs object.

**Example:**
```javascript
introJs().onafterchange(function(targetElement) {
  alert("after new step");
});
````

-----
###Attributes:
 - `data-intro`: The tooltip text of step
 - `data-step`: Optionally define the number (priority) of step
 - `data-tooltipClass`: Optionally define a CSS class for tooltip
 - `data-highlightClass`: Optionally append a CSS class to the helperLayer
 - `data-position`: Optionally define the position of tooltip, `top`, `left`, `right`, `bottom`, `bottom-left-aligned` (same as `bottom`), `bottom-middle-aligned` and `bottom-right-aligned`. Default is `bottom`
 - `data-hint`: The tooltip text of hint
 - `data-hintPosition`: Optionally define the position of hint. Options: `top-middle`, `top-left`, `top-right`, `bottom-left`, `bottom-right`, `bottom-middle`. Default: `top-middle`

###Options:

 - `steps`: For defining steps using JSON configuration (see [this](https://github.com/usablica/intro.js/blob/master/example/programmatic/index.html) example)
 - `nextLabel`: Next button label
 - `prevLabel`: Previous button label
 - `skipLabel`: Skip button label
 - `doneLabel`: Done button label
 - `tooltipPosition`: Default tooltip position
 - `tooltipClass`: Adding CSS class to all tooltips
 - `highlightClass`: Additional CSS class for the helperLayer
 - `exitOnEsc`: Exit introduction when pressing Escape button, `true` or `false`
 - `exitOnOverlayClick`: Exit introduction when clicking on overlay layer, `true` or `false`
 - `showStepNumbers`: Show steps number in the red circle or not, `true` or `false`
 - `keyboardNavigation`: Navigating with keyboard or not, `true` or `false`
 - `showButtons`: Show introduction navigation buttons or not, `true` or `false`
 - `showBullets`: Show introduction bullets or not, `true` or `false`
 - `showProgress`: Show introduction progress or not, `true` or `false`
 - `scrollToElement`: Auto scroll to highlighted element if it's outside of viewport, `true` or `false`
 - `overlayOpacity`: Adjust the overlay opacity, `Number`
 - `disableInteraction`: Disable an interaction inside element or not, `true` or `false`
 - `hintPosition`: Hint position. Default: `top-middle`
 - `hintButtonLabel`: Hint button label. Default: 'Got it'


See [setOption](https://github.com/usablica/intro.js/#introjssetoptionoption-value) to see an example.

## Using with:

### Rails
If you are using the rails asset pipeline you can use the [introjs-rails](https://github.com/heelhook/intro.js-rails) gem.

### Yii framework
You can simply use this project for Yii framework: https://github.com/moein7tl/Yii-IntroJS

### Drupal
Here you can find an IntroJs integration for Drupal: https://drupal.org/sandbox/alexanderfb/2061829

### AngularJS
For AngularJS, you can use the directives in [angular-intro.js](http://code.mendhak.com/angular-intro.js/).

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
> Copyright (C) 2012-2016 Afshin Mehrabani (afshin.meh@gmail.com)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
documentation files (the "Software"), to deal in the Software without restriction, including without limitation
the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software,
and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions
of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED
TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF
CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
IN THE SOFTWARE.
