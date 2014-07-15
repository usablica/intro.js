---
layout: doc
title: API
categories: intro
permalink: /intro/api/
---

##### introJs([targetElm])

Creating an introJs object.

**Available since**: v0.1.0

**Parameters:**

 - targetElm : String (optional) Should be defined to start introduction for specific element, for example: `#intro-farm`.

**Returns:**

 - introJs object.

**Example:**

```javascript
introJs() //without selector, start introduction for whole page
introJs("#intro-farm") //start introduction for element id='intro-farm'
````

-----

##### introJs.start()

Start the introduction for defined element(s).

**Available since**: v0.1.0

**Returns:**

 - introJs object.

**Example:**

```javascript
introJs().start()
````
-----

##### introJs.goToStep(step)

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

###introJs.goToStepNumber(step)

Go to specific step of introduction with the concrete step.
This differs from `goToStep` in the way that `data-step`
does not have be continuous to pick the desired element.

**Available since**: v2.x

**Parameters:**

 - step : Number

**Returns:**

 - introJs object.

**Example:**

```html
<div id="first" data-step='5'></div>
<div id="second" data-step='9'></div>
````

```javascript
//start introduction from step with data-step='9'
introJs().goToStepNumber(9).start();
````

-----

##### introJs.addStep(options)

Add a new step to introJs.

**Example:**

```javascript
introJs().addStep({
    element: document.querySelectorAll('#step2')[0],
    intro: "Ok, wasn't that fun?",
    position: 'right'
});
```

-----

##### introJs.addSteps(steps)

Add a new step to introJs.

**Example:**

```javascript
introJs().addSteps([{
    element: document.querySelectorAll('#step2')[0],
    intro: "Ok, wasn't that fun?",
    position: 'right'
}]);
```

-----

##### introJs.nextStep()

Go to next step of introduction.

**Available since**: v0.7.0

**Returns:**

 - introJs object.

**Example:**

```javascript
introJs().start().nextStep();
````

-----

##### introJs.previousStep()

Go to previous step of introduction.

**Available since**: v0.7.0

**Returns:**

 - introJs object.

**Example:**

```javascript
introJs().goToStep(3).start().previousStep(); //starts introduction from step 2
````

-----

##### introJs.exit()

Exit the introduction.

**Available since**: v0.3.0

**Returns:**

 - introJs object.

**Example:**

```javascript
introJs().exit()
````

-----

##### introJs.setOption(option, value)

Set a single option to introJs object.

**Available since**: v0.3.0

**Parameters:**

 - option : String Option - key name.
 - value : String/Number - Value of the option.

**Returns:**

 - introJs object.

**Example:**

```javascript
introJs().setOption("skipLabel", "Exit");
````

----

##### introJs.setOptions(options)

Set a group of options to the introJs object.

**Available since**: v0.3.0

**Parameters:**

 - options : Object - Object that contains option keys with values.

**Returns:**

 - introJs object.

**Example:**

```javascript
introJs().setOptions({ 'skipLabel': 'Exit', 'tooltipPosition': 'right' });
````

----

##### introJs.refresh()

To refresh and order layers manually. This function rearranges all hints as well.

**Available since**: v0.5.0

**Last update**: v2.1.0

**Returns:**

 - introJs object.

**Example:**

```javascript
introJs().refresh();
````

----

##### introJs.oncomplete(providedCallback)

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

##### introJs.onexit(providedCallback)

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

##### introJs.onchange(providedCallback)

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

##### introJs.onbeforechange(providedCallback)

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

##### introJs.onafterchange(providedCallback)

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
