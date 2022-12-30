---
title: 'Add flip ahead browsing to WordPress theme &#8211; Tutorial'
date: 2015-11-23 05:26
author: tonyedwardspz
headerImage: true
image: /assets/images/import/2015/11/edge.jpg
layout: post
category: blog
tag:
  - Flip Ahead Browsing
  - Internet Explorer
  - Tutorial
  - WordPress
---
Flip ahead browsing is a new(ish) feature of&nbsp;Internet Explorer (10+), available in the new Windows UI browser. It allows users to navigate through you website without clicking the previous or next buttons. The MSDN&nbsp;says:

> _Flip ahead_ allows you to explore favourite websites like you would a magazine. By implementing flip ahead, you enable your users to flip through a news article or an online catalog, regardless of their actual location on the page.<cite>&#8211; <a title="Flip ahead browsing" href="https://msdn.microsoft.com/en-us/library/jj883726(v=vs.85).aspx">MSDN</a></cite>


Whilst the Windows mobile device market share&nbsp;is relatively small, there is a growing user base who are enthusiastic about Windows devices.

At the recent&nbsp;[Half Stack Conference](http://halfstackconf.com/ "Half Stack"), [Christian Heilmann](https://twitter.com/codepo8 "Christian Heilmann Twitter") pointed out the [Site Scan](https://dev.windows.com/en-us/microsoft-edge/tools/staticscan/ "Site Scan") tool. It checks a whole host&nbsp;of things on your website, one of which is the use of Flip Ahead browsing.

## Implementing in WordPress

Implementing &#8216;Flip Ahead&#8217; browsing in WordPress could not be simpler thanks to a couple of built in functions.&nbsp;To include support&nbsp;for this feature in your WordPress theme add the following snippet to the `head` of your themes `header.php` file.

<script src="https://gist.github.com/tonyedwardspz/974331e00da41f510c6d.js"></script>

Line 2 & 3 determines if the current webpage is a single post of any type (excluding pages & archives). If it is, lines 4 & 8 fetch the appropriate post object before outputting the correct link. It&#8217;s the links `rel` attribute that makes the magic happen.

If the current browser does not support this feature, these tags will simply be ignored.

To find out more about this feature, be sure to check out the [MSDN docs flip ahead page](https://msdn.microsoft.com/en-us/library/jj883726(v=vs.85).aspx "Flip Ahead").

That&#8217;s it for page flipping. If you have any problems or questions about this short tutorial, feel free to get in touch with me on [Twitter](https://twitter.com/tonyedwardspz "Tony Edwards Software Cornwall").
