---
layout: doc
title: Quick Start
weight: 2
categories: getting-started
permalink: /getting-started/start
---

Here you can find a simple way to add a basic introduction and hints to your page.

#### Requirements

Before you start, make sure you have Introjs installed. Read [here]({{site.baseurl}}/getting-started/install) for a quick installation.

#### Adding intro

After installing Introjs, add `data-intro` and `data-step` to your HTML elements..

For example:

```html
<a href='http://example.com/' data-intro='Hello step one!'></a>
````

See all attributes [here](https://github.com/usablica/intro.js/wiki/Documentation/#attributes).

Finally, call this JavaScript function:

```javascript
introJs().start();
````

Optionally, pass one parameter to `introJs` function to limit the presentation section.

**Example:**

```javascript
introJs(".introduction-farm").start();
```

runs the introduction only for elements with `class='introduction-farm'`.

<img style="width: 100%; max-width: 100%" src="https://raw.githubusercontent.com/usablica/intro.js/gh-pages/img/introjs-demo.png">


#### Adding hints

 To add hints you should use `data-hint` attribute on elements.

For example:

```html
<a href='http://example.com/' data-hint='Hello step one!'></a>
````


Then call this JavaScript function to add the hints to the page:

```javascript
introJs().addHints();
```
