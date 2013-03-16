Intro.js
========

Better introductions for websites and features with a step-by-step guide for your projects.

##How to use
Intro.js can be added to your site in three simple steps:

**1)** Include `intro.js` and `introjs.css` (or the minified version for production) in your page.

**Rails**

If you are using the rails asset pipeline you can use the [introjs-rails](https://github.com/heelhook/intro.js-rails) gem.

**2)** Add `data-intro` and `data-step` to your HTML elements.  
For example: 
```html
<a href='http://google.com/' data-intro='Hello step one!' data-step='1'></a>
````
  
**3)** Call this JavaScript function:
```javascript
introJs().start();
````
 
Optionally, pass one parameter to `introJs` function to limit the presentation section, for example `introJs(".introduction-farm").start();` runs the introduction only for elements with `class='introduction-farm'`.

##Roadmap
- More browser compatibility

##Main Contributors
- [Afshin Mehrabani](http://afshinm.name/)  

other contributors: https://github.com/usablica/intro.js/contributors

##License

    Copyright (C) 2012 Afshin Mehrabani (afshin.meh@gmail.com)
    
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
