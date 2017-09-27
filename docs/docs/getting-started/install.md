---
layout: doc
weight: 10
title: Install
categories: getting-started
permalink: /getting-started/install
---

In this page you can find different ways to obtain an Introjs version and install it.

#### Requirements

Intro.js doesn't have any dependencies and you don't need to install anything else. Follow the instruction in next steps to download and install Introjs.

#### Download

Now that you’ve got everything installed, let’s get to work!

You can obtain your local copy of Intro.js from:

##### CDN

Download it from CDN:

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

Download the source from git repository, using git clone [Git repo](https://github.com/usablica/intro.js.git)

*We don't recommend to download the source from the Git because it might have some unstable changes.*


#### Setup

After download the source, you need to add it to the page. Introjs has two main parts, the css and js files.

You need to add the `JS` file (`intro.js`) before closing the body tag (`</body>`) and adding the CSS file (`introjs.css`) to the header (`<head>`).

That's it! Now follow next steps or go to [Quick Start]({{ site.baseurl }}/getting-started/start) page.

##### RTL

You can use Introjs for RTL websites as well (e.g. Farsi). What you need to do is adding `introjs-rtl.css` file after the main CSS file (`introjs.css`)
