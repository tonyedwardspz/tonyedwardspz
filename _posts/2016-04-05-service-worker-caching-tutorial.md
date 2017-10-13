---
title: 'Caching assets using Service Workers &#8211; Tutorial'
date: 2016-04-05 13:16
author: tonyedwardspz
layout: post
category: blog
tag:
  - Caching
  - JavaScript
  - Progressive Enhancement
  - Service Worker
  - Tutorial
---
With more and more of our lives being conducted online, good connectivity to the internet has quickly become a requirement of our daily goings on. Consistent, let alone fast, connectivity is not guaranteed but there are somethings we can do as developers to make a user&#8217;s visit that bit snappier every visit. As an added bonus, we get to play with some of the newer JavaScript features including service workers, promises and fetch.

[Progressive Enhancement](https://en.wikipedia.org/wiki/Progressive_enhancement "Progressive Enhancement") is centered around the idea that every user should get a fully functional and accessible website, perfectly suited to their task. Any further enhancements are layered upon this base functionality if the device is capable of supporting the improvements. Service Workers (SW) are one such technology, becoming popular along with the [ES2015 set of standards](https://www.w3.org/TR/service-workers/ "Service Worker Specification"), allowing web sites to take advantage of persistent background processing and event hooks to enable web applications to work while offline.

Whilst it may be a lot of work to retrofit a website to work fully offline, adding a little service worker magic it not too difficult and can produce immediate results. In this quick tutorial I cover the code used to cache the CSS, JavaScript and logo of [plymouthsoftware.com](https://plymouthsoftware.com "Plymouth Web App Developer"). Whilst only 53% of browsers currently support SW, those that don&#8217;t will simply ignore anything they do not understand without (hopefully) causing the end user any issues. When those browsers catch up, all the work will be done and the improvements will be automatic. The result is that users are saved from making three trips to the server for approx 100kb of data.

Whilst this saving is not astronomical, it has the potential to shave a full second off the total render time when on an average mobile connection. In addition, the server will receive fewer requests plus the groundwork for more exciting SW&nbsp;based features, such as push notifications and background syncing, will have been completed.

The site I am working on is a [Jekyll static site](https://jekyllrb.com/ "Jekyll Blog Platform") using [Gulp](http://gulpjs.com/ "Gulp Build Tool") to help with preprocessing and optimising files. As such, both the CSS and JavaScript are concatenated and optimised as part of the deploy process, meaning I have only a couple of versioned files to cache. The build process you’re working with may be different, but the code to cache files will be largely the same.

![Service worker lifecycle](/assets/images/import/2016/04/service-worker-lifecycle.jpg)

## Service Worker Setup

If this is you first time working with SW, I’d suggest you do some background reading on both it and Promises . A good understanding of both these APIs will save much head scratching. Links to relevant documentation and tutorials are at the end of this post. Its async nature means SW can be a little painful when debugging, especially in the early days. To help with this I recommend loads of console.logs() in you development code as well as keeping a close eye on the chrome tab available under chrome://inspect/#service-workers

With that said, let’s create the service worker file that will be installed on the end-user&#8217;s device. At the root of your apps directory structure add a file called serviceWorker.js, including the following code to test that everything is hooked up correctly.

<pre data-language="javascript"><code>
self.addEventListener('install', function(event) {
 &nbsp;&nbsp;&nbsp;console.log(‘Service Worker Installing’);
});
</code></pre>

As Service Workers are scoped, placing our file at the root of the project ensures it has access, and is accessible, to all files deeper in the directory structure. To include our SW in the website, open up any existing js file and within a document.ready (or similar) block, add this.

<pre data-language="javascript"><code>
&lt;span style="font-weight: 400;">if ('serviceWorker' in navigator) {&lt;/span>
&lt;span style="font-weight: 400;">console.log('navigator available');&lt;/span>
&lt;span style="font-weight: 400;"> &nbsp;navigator.serviceWorker.register('/serviceWorker.js').then(function(reg) {&lt;/span>
&lt;span style="font-weight: 400;"> &nbsp;&nbsp;&nbsp;console.log('ServiceWorker registration successful with scope: ', reg.scope);&lt;/span>
&lt;span style="font-weight: 400;"> &nbsp;}).catch(function(err) {&lt;/span>
&lt;span style="font-weight: 400;"> &nbsp;&nbsp;&nbsp;console.log('ServiceWorker registration failed: ', err);&lt;/span>
&lt;span style="font-weight: 400;"> &nbsp;});&lt;/span>
&lt;span style="font-weight: 400;">}&lt;/span>
</code></pre>

This checks to see if the device has the capability to run a SW. If available, it then registers the file we’ve just created before printing a message to the console if successful. Open up the project in your browser (over https) and check to see if the console messages are present.&nbsp;If they are, it’s time to get caching.

Head back over to the serviceWorker.js file and add the following variables to the top of the file.

<pre data-language="javascript"><code>
&lt;span style="font-weight: 400;"> &nbsp;'use strict';&lt;/span>
&lt;span style="font-weight: 400;"> &nbsp;var CACHE_NAME = 'psw-cache-v1';&lt;/span>
&lt;span style="font-weight: 400;"> &nbsp;var urlsToCache = [&lt;/span>
&lt;span style="font-weight: 400;"> &nbsp;&nbsp;&nbsp;'/assets/site-logo.svg',&lt;/span>
&lt;span style="font-weight: 400;"> &nbsp;&nbsp;&nbsp;'/css/main.css',&lt;/span>
&lt;span style="font-weight: 400;"> &nbsp;&nbsp;&nbsp;'/javascript/application.js'&lt;/span>
&lt;span style="font-weight: 400;"> &nbsp;];&lt;/span>
</code></pre>

Here were forcing the js engine to ‘[use strict](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode "Strict Mode")’ mode, which is part of the ES2015 standard. As this file does not get concatenated it’s safe to declare outside the scope of a function. Next is the name of the cache we’ll create and the files we’d like to add. As with any form of asset caching, file versioning is highly recommended but is outside the scope of this tutorial. For this project I’m using the gulp packages ‘rev’ and ‘rev:replace’ to version files at build time which updates this array of asset strings. I’ll leave it you to decide how best to version any cached assets.

### Fetching from Cache

We now need to turn our attention back to the install event. Update your code to match the following.

<pre data-language="javascript"><code>
&lt;span style="font-weight: 400;"> &nbsp;self.addEventListener('install', function(event) {&lt;/span>
&lt;span style="font-weight: 400;"> &nbsp;&nbsp;&nbsp;event.waitUntil(&lt;/span>
&lt;span style="font-weight: 400;"> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;caches.open(CACHE_NAME).then(function(cache) {&lt;/span>
&lt;span style="font-weight: 400;"> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;return cache.addAll(urlsToCache);&lt;/span>
&lt;span style="font-weight: 400;"> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;})&lt;/span>
&lt;span style="font-weight: 400;"> &nbsp;&nbsp;&nbsp;);&lt;/span>
&lt;span style="font-weight: 400;"> &nbsp;});&lt;/span>
</code></pre>

When the install event is triggered, the event is ‘held open’ until the internal Promise resolves, which in this case is the caching of files. Within the waitUntil() block we open the cache by name and call addAll() upon it, passing in our array of asset strings. With the assets cached locally, it&#8217;s time to serve them to our user.

<pre data-language="javascript"><code>
&lt;span style="font-weight: 400;">This is done via a fetch event listener.&lt;/span>
&lt;span style="font-weight: 400;"> self.addEventListener('fetch', function(event) {&lt;/span>
&lt;span style="font-weight: 400;"> &nbsp;&lt;/span> &lt;span style="font-weight: 400;">// Intercept fetch request&lt;/span>
&lt;span style="font-weight: 400;"> &nbsp;&nbsp;&nbsp;event.respondWith(&lt;/span>
&lt;span style="font-weight: 400;"> &nbsp;&nbsp;&nbsp;&lt;/span> &lt;span style="font-weight: 400;">// match and serve cached asset if it exists&lt;/span>
&lt;span style="font-weight: 400;"> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;caches.match(event.request).then(function(response) {&lt;/span>
&lt;span style="font-weight: 400;"> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;return response || fetch(event.request);&lt;/span>
&lt;span style="font-weight: 400;"> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;})&lt;/span>
&lt;span style="font-weight: 400;"> &nbsp;&nbsp;&nbsp;);&lt;/span>
&lt;span style="font-weight: 400;"> &nbsp;});&lt;/span>
</code></pre>

Here were intercepting a fetch request and checking to see if the resource is in our cache. We then return either the resource or the original request which will head off to the network. This cache first strategy is just one of many possible methods, which Jake Archibald has excellently outlined in his ‘[offline cookbook](https://jakearchibald.com/2014/offline-cookbook/#cache-falling-back-to-network "Service Worker Offline Cookbook")’ blog post. If you’ve not come across the fetch API yet, [check it out](https://davidwalsh.name/fetch "Fetch API"). It’s an excellent replacement for AJAX via XHR and will change your life…… possibly.

Our app is now serving cached assets to users, but what about when we update the code? How do we prevent stale CSS and JS from reaching the end user? Who you going to call? Cache busters!

&nbsp;

### Cache Busting

As part of the service worker life cycle we have the activate event, which will get called every time the SW is called into action. At the bottom of serviceWorker.js add the following:

<pre data-language="javascript"><code>
&lt;span style="line-height: 1.5;">&nbsp;self.addEventListener('activate', function(event) {&lt;/span>
&lt;span style="font-weight: 400;"> &nbsp;&nbsp;&nbsp;event.waitUntil(&lt;/span>
&lt;span style="font-weight: 400;"> &nbsp;&nbsp;&nbsp;&lt;/span> &lt;span style="font-weight: 400;">// Open our apps cache and delete any old cache items&lt;/span>
&lt;span style="font-weight: 400;"> &nbsp;&nbsp;&nbsp;&lt;/span> &lt;span style="font-weight: 400;">caches.open(CACHE_NAME).then(function(cacheNames){&lt;/span>
&lt;span style="font-weight: 400;"> &nbsp;&nbsp;&nbsp;&lt;/span> &lt;span style="font-weight: 400;">cacheNames.keys().then(function(cache){&lt;/span>
&lt;span style="font-weight: 400;"> &nbsp;&nbsp;&nbsp;&lt;/span> &lt;span style="font-weight: 400;">cache.forEach(function(element, index, array) {&lt;/span>
&lt;span style="font-weight: 400;"> &nbsp;&nbsp;&nbsp;&lt;/span> &lt;span style="font-weight: 400;">if (urlsToCache.indexOf(element) === -1){&lt;/span>
&lt;span style="font-weight: 400;"> &nbsp;&nbsp;&nbsp;&lt;/span> &lt;span style="font-weight: 400;">caches.delete(element);&lt;/span>
&lt;span style="font-weight: 400;"> &nbsp;&nbsp;&nbsp;&lt;/span> &lt;span style="font-weight: 400;">}&lt;/span>
&lt;span style="font-weight: 400;"> &nbsp;&lt;/span> &lt;span style="font-weight: 400;"> &nbsp;&nbsp;&nbsp;});&lt;/span>
&lt;span style="font-weight: 400;"> &nbsp;&nbsp;&nbsp;&lt;/span> &lt;span style="font-weight: 400;">});&lt;/span>
&lt;span style="font-weight: 400;"> &nbsp;&nbsp;&nbsp;&lt;/span> &lt;span style="font-weight: 400;">})&lt;/span>
&lt;span style="font-weight: 400;"> &nbsp;&nbsp;&nbsp;);&lt;/span>
&lt;span style="font-weight: 400;"> &nbsp;});&lt;/span>
</code></pre>

Here we’ve opened our cache before cycling over the cache’s keys comparing them to the array of URLs we’re storing. If the cached item does not appear in the array it’s deleted, freeing up space on the user&#8217;s device and keeping us within our apps storage limit.

That&#8217;s it for our simple implementation of a service worker caching strategy. Hopefully this will get you up and running quickly with this exciting technology, with the added benefit of improving our users experience. Whilst there are many improvements to this code and strategy, it should give enough to give a jumping off point into the wider world of service worker loveliness. You can get hold of&nbsp;the [full code as a gist](https://gist.github.com/tonyedwardspz/cef4fe098dd2a47b5167586fbffcfd3a "GitHub Service Worker Gist").

What do you think of this method of client side caching? Are Service Workers the future. Let me know what you think by getting in touch on [Twitter](https://twitter.com/tonyedwardspz "Tony Edwards Plymouth Twitter").

#### Further reading

  * [Introduction to Service Worker](http://www.html5rocks.com/en/tutorials/service-worker/introduction/ "Service Worker Introduction") (HTML5 Rocks)
  * [Service Worker Explainer>](https://github.com/slightlyoff/ServiceWorker/blob/master/explainer.md "Service Worker Explainer") (GitHub)
  * [ServiceWorker](https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorker "Service Worker API") (MDN)
  * [ServiceWorker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API "Service Worker API") (MDN)
  * [Cache AP](https://developer.mozilla.org/en-US/docs/Web/API/Cache "Cache API")I (MDN)
  * [Promises](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Promise "Promises API") (MDN)
  * [Jake’s Offline Cookbook](https://jakearchibald.com/2014/offline-cookbook/ "Jakes Offline Cookbook")
