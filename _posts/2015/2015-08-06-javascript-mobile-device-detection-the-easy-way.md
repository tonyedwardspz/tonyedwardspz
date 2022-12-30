---
title: 'JavaScript &#8211; Mobile device detection the easy way'
date: 2015-08-06 11:37
author: tonyedwardspz
layout: post
category: blog
tag:
  - JavaScript
  - Mobile Device Detection
  - Tutorial
description: Detecting if the user is on a mobile device
---
For a recent project I needed to detect if the device currently viewing the website is of the mobile persuasion. The project is for a friends band who wished to use large imagery as a backdrop to the sites content. If the device is mobile, following further tests, we select an appropriate image for the current orientation.

Mobile devices come in all shapes and sizes. As such my first thought was to test the size of the screen, but with this method I couldn&#8217;t get a reliable result. After thinking about the issue a bit more I realised that all mobile devices (that I&#8217;m concerned with) all have a touch screen, something I&#8217;m sure you would be able to test for.

The following method returns true / false dependent on the devices support for touch events (or the MS equivalent). Simply drop it into your script file and use it as a condition.

<pre data-language="javascript"><code>var isTouchDevice = function() {
   return 'ontouchstart' in window || 'onmsgesturechange' in window;
}

if (isTouchDevice()){
    // Do some fancy mobile stuff
}</code></pre>

Looking at the Modernizr library, this solution is similar to theirs. It is however less involved as I do not need a long history of browser support. I think this tradeoff is fine considering the (admittedly small) overhead that comes along with including a full library.

It should be noted that support of touch events does not necessarily mean the device has a touch screen.
