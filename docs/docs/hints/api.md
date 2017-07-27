---
layout: doc
title: API
categories: hints
permalink: /hints/api/
---

##### introJs([targetElm])

Creating an introJs object.

**Available since**: v0.1.0

**Parameters:**

 - targetElm : String (optional) - Should be defined to start introduction for specific element, for example: `#intro-farm`.

**Returns:**

 - introJs object.

**Example:**

```javascript
introJs() //without selector, start introduction for whole page
introJs("#intro-farm") //start introduction for element id='intro-farm'
````

-----

##### introJs.setOption(option, value)

Set a single option to introJs object.

**Available since**: v0.3.0

**Parameters:**

 - option : String - Option key name.

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

 - options : Object
   Object that contains option keys with values.

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

Show a specific hint.

##### introJs.addHints()

To add available hints to the page (using `data-hint` or JSON)

**Available since**: v2.0

**Returns:**
 - introJs object.

**Example:**
```javascript
introJs().addHints();
````

-----

##### introJs.showHint(hintId)

Show the hint with given `hintId`.

**Available since**: v2.4.0

**Example:**
```javascript
introJs().showHint(1);
````

-----

##### introJs.showHints()

Show all hints.

**Available since**: v2.4.0

**Example:**
```javascript
introJs().showHints();
````

-----

##### introJs.hideHint(stepId)

Hides the hint with given `stepId`. The `stepId` is an `integer` and it's the value of `data-step` attribute on the hint element.

**Available since**: v2.1

**Returns:**
 - introJs object.

**Example:**
```javascript
introJs().hideHint(0); //you should pass the id of the hint (the `data-step` attribute).
````

-----

-----

##### introJs.showHintDialog(stepId)

Shows the popup dialog next to the hint with given `stepId`. The `stepId` is an `integer` and it's the value of `data-step` attribute on the hint element.

**Available since**: v2.6

**Returns:**
 - introJs object.

**Example:**
```javascript
introJs().showHintDialog(0); //you should pass the id of the hint (the `data-step` attribute).
````

-----

##### introJs.hideHints()

Hides all hints on the page.

**Available since**: v2.2

**Returns:**
 - introJs object.

**Example:**
```javascript
introJs().hideHints();
````

-----

##### introJs.onhintclick(providedCallback)

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

##### introJs.onhintsadded(providedCallback)

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

##### introJs.onhintclose(providedCallback)

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
