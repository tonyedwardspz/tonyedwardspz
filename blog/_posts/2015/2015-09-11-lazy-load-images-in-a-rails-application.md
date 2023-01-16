---
title: Lazy load images in a Rails application
tag:
  - Tutorial
  - Ruby on Rails
---
For a recent project I decided to add lazy loading images to improve page load time on mobile devices. It also has the added benefit of reducing calls to the server if the user navigates to another page before all images are loaded. Here&#8217;s a quick guide to adding this feature to a Ruby on Rails application.

We&#8217;re&nbsp;going to use the [Lazyload-Rails](https://github.com/jassa/lazyload-rails) gem to benefit from Rail&#8217;s developer friendliness. Open up your gem file and add:

<pre data-language="shell"><code>gem 'lazyload-rails'</code></pre>

and run

<pre data-language="shell"><code>bundle install</code></pre>

Next we need to include the jQuery plugin. Head over to the [project repo](https://github.com/tuupola/jquery_lazyload), grab the `lazyload.js` plugin. Place this in the `javascripts` folder of your project and add the following require to the `application.js` file like so.

<pre data-language="shell"><code>// = require lazyload.js</code></pre>

This adds the file to the asset pipeline, preventing an extra request. Next, add the parameter&nbsp;`lazy: true` to any image tag that you&#8217;d like to lazy load. You will end up with an image tag like this:

<pre data-language="shell"><code>image_tag "image.png", alt: "It's an image", lazy: true</code></pre>

With every thing in place its time to fire the jQuery method. Open up script.js, or the equivalent for your project, and add&nbsp;this within the document ready call.

<pre data-language="javascript"><code>$("img").lazyload</code></pre>

This is our minimum viable implementation. It will apply lazy loading to every image on the site. Go ahead and try it out to see if its working. Bear in mind that if you are running the project locally the images will load super quickly. To test it properly, I&#8217;d suggest throttling to your connection to simulate a mobile device. Open up Chrome dev tools and click on the mobile phone icon. Select a device (in this case iPhone 6) and change the network drop down to &#8216;Regular 3G&#8217;.

[resp_image id=&#8217;388&#8242;]

This is great for an MVP, but I&#8217;d like to have less of a delay before the image is loaded. Thankfully Lazyload.js has a bunch of helpful parameters that we can use. We&#8217;re going to use fadein and threshold. Alter the call from script.js to the following.

<pre data-language="javascript"><code>$("img").lazyload({
&nbsp; &nbsp; threshold : 500,
&nbsp; &nbsp; effect : "fadeIn"
 });</code></pre>

This will trigger the loading of the image when the img tag is 500px below the bottom of the screen and trigger the jQuery fade effect once loaded. Fancy eh? You can look at the Lazyload.js documentation for more details on the available parameters.

Thats it. We now have lazy loading images in our project, a much faster load time and a slightly less stressed sever.

If you need any help with this tutorial, drop me a message on <a href="http://twitter.com/tonyedwardspz" target="_blank">Twitter</a>, I&#8217;d be glad to help.
