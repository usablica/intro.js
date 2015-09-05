# Intro.js

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

**2)** Add `data-intro` and `data-step` to your HTML elements.

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
 - `data-position`: Optionally define the position of tooltip, `top`, `left`, `right`, `bottom`, `bottom-left-aligned` (same as 'bottom'), 'bottom-middle-aligned' and 'bottom-right-aligned'. Default is `bottom`

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

## Release History

 * **v1.1.1** - 2015-09-05
   - Fix versioning issue

 * **v1.1.0** - 2015-09-01
   - Fix no interaction bug
   - Fix recursion bug with jQuery
   - Call `onexit` on pressing Esc or clicking on the overlay layer
   - Fix helper layer positioning issue when the content changes
   - Fix transform is 'undefined' in IE 8
   - Fix coding style issues

 * **v1.0.0** - 2014-10-17
   - Auto-positioning feature for tooltip box
   - Add progress-bar to tooltip box
   - Fix `z-index` issue
   - Add dark template
   - Fix bad sizing with Bootstrap 3
   - Add disable interaction ability
   - Fix code styling issues and many minor bug fixes

 * **v0.9.0** - 2014-05-23
   - Add IntroJS templates
   - Add more tooltip positions (bottom-right, bottom-middle, bottom-left)
   - Fix table `tr` element's issue

 * **v0.8.0** - 2014-03-25
   - Ability to define introductions without focusing on elements
   - Fix Internet Explorer 8.0 issue
   - Add `_direction` property

 * **v0.7.1** - 2014-03-11
   - Fix "Too much recursion" issue with Firefox and Internet Explorer.

 * **v0.7.0** - 2014-02-07
   - Add `onafterchange` event
   - Add scrolling to element option
   - Add `nextStep` and `previousStep` functions publicly
   - Add `_cloneObject` method to prevent data overwriting
   - Fix null elements problem with programmatic definition
   - Fix issues with single-step introductions
   - Fix top margin problem on hidden elements
   - Fix stacking context problem caused by element opacity
   - Fix call exit() on null elements
   - Update documentation and add more details on CDN servers and RTL example

 * **v0.6.0** - 2013-11-13
   - Add step bullets with navigating
   - Add option to hide introduction navigating buttons
   - Make keyboard navigation optional
   - Making `data-step` optional with elements
   - Fix scroll issue when scrolling down to elements bigger than window
   - Fix Chrome version 30.0.1599.101 issue with hiding step numbers
   - Fix incorrect calling onExit callback when user clicks on overlay layer
   - Fix coding styles and improvement in performance

 * **v0.5.0** - 2013-07-19
   - Add CSS class option for tooltips (And tooltip buttons also)
   - Add RTL version
   - Ability to add HTML codes in tooltip content
   - Ability to add DOM object and CSS selector in programmatic API (So you can use jQuery selector engine)
   - Add `refresh()` method to refresh and order layers manually
   - Show tooltip buttons only when introduction steps are more than one
   - Fix `onbeforechange` event bug and pass correct object in parameters
   - Fix `Null element exception` in some browsers
   - And add more examples

 * **v0.4.0** - 2013-05-20
   - Add multi-page introduction example
   - Add programmatic introduction definition
   - Cooler introduction background!
   - Remove IE specific css file and embed IE support to main css file (property fallback)
   - Update introduction position on window resize (Also support tablet/mobile devices rotation)
   - Disable buttons on the first and start of introduction (Skip and Done button)
   - Add `onbeforechange` callback
   - Add `showStepNumbers` option to show/hide step numbers
   - Add `exitOnEsc` and `exitOnOverlayClick` options
   - Fix bad tooltip position calculating problem
   - Fix a bug when using `!important` in element css properties
   - Fix a bug in `onexit` behavior
   - Code refactoring

 * **v0.3.0** - 2013-03-28
   - Adding support for CommonJS, RequireJS AMD and Browser Globals.
   - Add `goToStep` function to go to specific step of introduction.
   - Add `onchange` callback.
   - Add `exit` function to exit from introduction.
   - Adding options with `setOption` and `setOptions` functions.
   - More IE compatibility.
   - Fix `min-width` bug with tooltip box.
   - Code cleanup + Better coding style.

 * **v0.2.1** - 2013-03-20
   - Fix keydown event unbinding bug.

 * **v0.2.0** - 2013-03-20
   - Ability to define tooltip position with `data-position` attribute
   - Add `onexit` and `oncomplete` callback
   - Better scrolling functionality
   - Redesign navigating buttons + add previous button
   - Fix overlay layer bug in wide monitors
   - Fix show element for elements with position `absolute` or `relative`
   - Add `enter` key for navigating in steps
   - Code refactoring


 * **v0.1.0** - 2013-03-16
   - First commit.

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
> Copyright (C) 2012 Afshin Mehrabani (afshin.meh@gmail.com)

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
