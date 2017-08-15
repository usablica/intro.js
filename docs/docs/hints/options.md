---
layout: doc
title: Options
categories: hints
permalink: /hints/options/
---

 - `hintPosition`: Hint position. Default: `top-middle`
 - `hintButtonLabel`: Hint button label. Default: 'Got it'
 - `hintAnimation`: To add animation to hints or not. Default: `true`
 - `hints`: For definining hints using JSON configuration. Array of hint objects.



##### Hint format


```javascript
{
    hint: 'text for the hint',
    element: element, // string query selector or DOMElement
    hintPosition: (Optional) Hint position. Default: `top-middle`
    hintAnimation: (Optional) To add animation to hints or not. Default: `true`
}
```


##### Adding options

An example of adding an option:

```javascript
introJs().setOption("hintButtonLabel", "OK");
```

An example of adding hints programmatically through options:

```javascript
introJs().setOptions({
    hints: [
        { hint: 'First hint', element: '#new-feature' },
        { hint: 'Second hint', element: '#new-button', hintAnimation: false }
    ]
});
```
