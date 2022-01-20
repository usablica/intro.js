---
layout: doc
weight: 10
title: Install
categories: getting-started
permalink: /getting-started/install
---

On this page, you can find different ways to obtain a version of Introjs and install it.

#### Requirements

Intro.js doesn't have any dependencies and you don't need to install anything else. Follow the instruction in next steps to download and install Introjs.

#### Download

Now that you’ve got everything installed, let’s get to work!

You can obtain your local copy of Intro.js from:

##### CDN

Download it from a CDN:

  - [CDNJS](https://cdnjs.com/libraries/intro.js)
  - [JSDelivr](http://www.jsdelivr.com/projects/intro.js)
  - [BootCDN](http://www.bootcdn.cn/intro.js/)

##### Bower

Using bower:

```bash
bower install intro.js --save
```

##### NPM

Using npm: 

```bash
npm install intro.js --save
```

##### Git

Download the source from our [GitHub repository](https://github.com/usablica/intro.js.git), using git clone.

*We don't recommend downloading the source from GitHub because it might have some unstable changes.*


#### Setup

After downloading the source, you need to add it to the page. Introjs has two main parts, the CSS and JS files.

You need to add the JS file (`intro.js`) before closing the body tag (`</body>`) and adding the CSS file (`introjs.css`) to the header (`<head>`).

That's it! Now follow the next steps or go to [Quick Start]({{ site.baseurl }}/getting-started/start) page.

##### RTL

You can use Introjs for RTL websites as well (e.g. Farsi). What you need to do is add the `introjs-rtl.css` file after the main CSS file (`introjs.css`)
