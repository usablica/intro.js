---
layout: doc
title: Configuration
categories: site
permalink: /site/configuration/
---

<p>Doc42 has several options in the <code>_config.yml</code> and you can customize them for your own system.</p>

<p>
Here is a sample of the config file:
</p>

<pre class="code-example">
<code class="language-yml">
# Site settings
title: Doc42
email: afshin.meh@gmail.com
author: "Afshin Mehrabani"
description: "Doc42 - an easy to use documentation tool"
keywords: "doc42, documentation, doc, usablica, jekyll"

baseurl: "" # the subpath of your doc, e.g. /doc
url: "http://doc42.io" # the base hostname & protocol for your site
twitter_username: usablica
github_username:  usablica

# use this to define the categories of your documentation
category-list: [getting-started, basics, extra]
# optionally you can define icon for each category (for the sidebar)
# Doc42 uses Font Awesome
category-icons: [gear, cube, expand]

# Build settings
markdown: kramdown
</code>
