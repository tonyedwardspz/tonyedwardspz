---
title: 'One line device orientation detection &#8211; JavaScript'
tag:
  - JavaScript
  - Tutorial
---
Following on from last weeks one line <a href="http://tonyedwardspz.co.uk/blog/javascript-mobile-device-detection-the-easy-way/" target="_blank">mobile detection method</a>, here&#8217;s another useful one line method. This time, the method detects the devices orientation. I&#8217;m using this method to swap out images for each orientation.

<pre data-language="javascript"><code>var isPortrait = function() {
    return window.matchMedia("(orientation: portrait)").matches;
}</code></pre>

This method returns true if the device has an orientation of portrait. You can use this within a conditional statement like so:

<pre data-language="javascript"><code>if (isPortrait()){
    // Do some fancy upright stuff
}</code></pre>

Whilst this theoretically works in any browser that <a href="http://caniuse.com/#feat=matchmedia" target="_blank">supports match media</a>, there are some edge cases where unexpected results are returned.

If&nbsp;know any useful one line JS methods, let me know by <a href="https://twitter.com/tonyedwardspz" target="_blank">dropping me a tweet</a>.
