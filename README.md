Intro.js
========

A better way for new feature introduction and step-by-step users guide for your website and project.

##How to use
Simple 3 steps.

**1)** Include `intro.js` and `introjs.css` (or minified version for production) in your page.

**2)** Add `data-intro` and `data-step` to your HTML elements.  
For example: 
```html
<a href='http://google.com/' data-intro='Hello step one!' data-step='1'></a>
````
  
**3)** Call this JavaScript function:
```javascript
introJs().start();
````
 
Also you can pass one parameter to `introJs` function to limit the presentation section, for example `introJs(".introduction-farm").start();` runs the introduction only for elements with `class='introduction-farm'`.
