---
layout: doc
title: Options
categories: intro
permalink: /intro/options/
---

 - `steps`: For defining steps using JSON configuration (see [this](https://github.com/usablica/intro.js/blob/master/example/programmatic/index.html) example)
 - `nextLabel`: Next button label
 - `prevLabel`: Previous button label
 - `skipLabel`: Skip button label
 - `doneLabel`: Done button label
 - `hidePrev`: Hide previous button in the first step? Otherwise, it will be disabled button.
 - `hideNext`: Hide next button in the last step? Otherwise, it will be disabled button.
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
 - `overlayOpacity`: Adjust the overlay opacity, `Number` between `0` and `1`
 - `disableInteraction`: Disable an interaction inside element or not, `true` or `false`

##### Adding options

An example of adding an option:

```javascript
introJs().setOption("nextLabel", " > ");
```
