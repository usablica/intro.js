---
layout: doc
weight: 1
title: Structure
categories: pages
permalink: /pages/structure
---

<p>Pages can be added in a Markdown or HTML format. All should be added inside the <code>/docs</code> folder.</p>

<p>
Here you can see an instance of a page's content:
</p>

<pre>
<code class="language-html">&lt;!-- .container is main centered wrapper --&gt;
--- 
layout: doc 
title: Example 
weight: 1
categories: cat 
permalink: /docs/cat/example 
--- 

&lt;p&gt;This is an example page.&lt;/p&gt;
</code>
</pre>

<br />

<h4>Metadata</h4>

<p>Each page has a set of metadata:</p>

<h5>Layout</h5>
Should be <code>doc</code> but you can alter the layout and define your own layout.


<h5>Title</h5>
Title of the page. E.g. <code>Example Page</code>

<h5>Categories</h5>
Each page can have one or more than one categories.

<h5>Permalink</h5>
The address of the page. E.g. <code>/docs/cat/example</code>

<h5>Weight</h5>
Optional property to define the index of the page to be rendered in the sidebar.

<h4>Content Generator</h4>

<p>
Each page has a automatic page content generator Using Javascript. You don't need to do anything to able this feature and it is enabled
by default. 
</p>

<p>All you need to do is adding headlines (e.g. <code>h1</code>) to each section of the page and page content will be generated automatically.</p>
