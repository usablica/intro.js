# Intro.js

> Better introductions for websites and features with a step-by-step guide for your projects.


## How to use
Intro.js can be added to your site in three simple steps:

**1)** Include `intro.js` and `introjs.css` (or the minified version for production) in your page. 

**2)** Add `data-intro` and `data-step` to your HTML elements.  

For example: 

```html
<a href='http://google.com/' data-intro='Hello step one!' data-step='1'></a>
````

Optionally you can define `data-position` attribute to define the position of tooltip with values `top`, `right`, `left` and `bottom`. Default value is `bottom`.
  
**3)** Call this JavaScript function:
```javascript
introJs().start();
````
 
Optionally, pass one parameter to `introJs` function to limit the presentation section.

**For example** `introJs(".introduction-farm").start();` runs the introduction only for elements with `class='introduction-farm'`.

<p align="center"><img src="http://usablica.github.com/intro.js/img/introjs-demo.png"></p>  

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
introJs().setOptions({ skipLabel: "Exit", tooltipPosition: "right" });
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

###Options:

 - `steps`: For defining steps using JSON configuration (see [this](https://github.com/usablica/intro.js/blob/master/example/programmatic/index.html) example)
 - `nextLabel`: Next button label
 - `prevLabel`: Previous button label
 - `skipLabel`: Skip button label
 - `doneLabel`: Done button label
 - `tooltipPosition`: Default tooltip position
 - `exitOnEsc`: Exit introduction when pressing Escape button, `true` or `false`
 - `exitOnOverlayClick`: Exit introduction when clicking on overlay layer, `true` or `false`
 - `showStepNumbers`: Show steps number in the red circle or not, `true` of `false`

See [setOption](https://github.com/usablica/intro.js/edit/master/README.md#introjssetoptionoption-value) to see an example.

## Using with:

### Rails
If you are using the rails asset pipeline you can use the [introjs-rails](https://github.com/heelhook/intro.js-rails) gem.

### Yii framework
You can simply use this project for Yii framework: https://github.com/moein7tl/Yii-IntroJS


## Build

First you should install `nodejs` and `npm`, then first run this command: `npm install` to install all dependencies.

Now you can run this command to minify all static resources:

    make build


## Roadmap
- More browser compatibility
- Provide more examples

## Release History

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
