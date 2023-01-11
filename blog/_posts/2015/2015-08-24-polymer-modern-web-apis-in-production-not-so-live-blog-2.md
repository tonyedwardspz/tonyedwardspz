---
title: 'Polymer &#038; Modern Web APIs: In production &#8211; (not so) Live Blog'
date: 2015-08-24 21:20
  
description: This is another live blog in preparation for an upcoming event. Polymer 1.0 was released during Google I/O 15, this was the talk that announced it to the world.
 
tag:
  - Google I/O
  - Polymer
  - Web App
---
### [Matt McNulty](https://twitter.com/mattsmcnulty) opens the keynote

Polymer is part of the web platform team, with the aim of making apps more awesome by bringing immersive environments to web apps. This is the first time it released as production ready, rewritten from scratch to be smaller, simpler and faster.

Polymer is not like things that came before. It&#8217;s new. The mission was to change web development on the bleeding edge of standards.

Shipping containers are interesting. They were standardised to allow all ships, planes and trucks to all shift the same package without the need for unpacking. Web development isn&#8217;t any different with web components promising to be the standard to follow. Frameworks are silos and web components promises to be the standard the future will follow.

HTML buttons work everywhere but angular buttons only work in angular. Polymer allows standard HTML elements to be extended into something more awesome. It unlocks the future of web development. It&#8217;s a library to build custom HTML elements, it definitely not a framework.

1.0 has been rewritten to be faster, less complex, lighter (42k!). It sugars the web component syntax to allow easier writing of components. The shadowdom shim has ben replace by shadydom, using shadowdom on browser that natively support web components. This was the biggest complaint from developers.

[resp_image id=&#8217;338&#8242;]

Polymer builds upon the existing web platform, allowing the use of other frameworks on top. It encourages sharing and collaboration. It&#8217;s not a case of Polymer vs something else, it works with everything else.

### [Taylor Savage](https://twitter.com/taylorthesavage) discusses elements

Any developer should be able to make a high quality web application, thats the ethos of Polymer. It allows developer to concentrate on making an app awesome.

1.0 renamed components from earlier versions, as well as adding many more.

One of the new families is the Google Web Components, acting as a wrapper for most of the Google API&#8217;s. This of it as a Google SDK.

Platinum elements offer new web features such as offline caching and push notifications. From experience, both of these are a pain in the backside to get working without Polymer.

Gold Elements offers E-commerce solutions including many fancy Credit card niceties.

You can view more details of the elements at [elements.polymer-project.org](http://elements.polymer-project.org).

Google uses polymer, some of the applications include:

  * Translate Community
  * Play Music
  * YouTube (Internal beta mobile app)
  * Google Santa Tracker

### [Eric Bidelman](https://twitter.com/ebidel) talks about taking Polymer into production

He is always asked &#8216;how do I do&#8230;.?&#8217;

The answer &#8216;There&#8217;s an element for that!&#8217;

Its easy to port to 1.0 as each element can be done individually.

The Santa tracker is used to demo the capabilities of Polymer. Check it out by looking for the Santa-app component.

The google I/O web app is the main example. The site is smooth, highly interactive, offline first and uses bleeding edge standards when available on device. It even has page transitions!

[resp_image id=&#8217;340&#8242;]

[resp_image id=&#8217;341&#8242;]

The site was built by the Google developer relations teams. It was only possible because of the great library that comes as standard along with Polymer. The server responds with markup, not javascript (unlike ReactJS or Angular). This means its very SEO friendly.

The site had zero Jank. It uses promises and web animations to give the illusion of seamlessness along with HTML imports to preload content that is needed next. This allowed a logically synchronised app that is offline firs with push notification.

Network requests are stashed when offline, great for analytics. Users are notified that the site will work offline once everything is pre-cached.

[resp_image id=&#8217;342&#8242;]

Notifications are awesome, integrated at the OS level meaning the site does not need to be open in a browser. Users need to be notified and accept push notifications.

### [Addy Osmani](https://twitter.com/addyosmani) discusses tooling

Polymer Starter Kit is an opinionated starting point for using Polymer, with common items all included from the start.

Css custom properties allow changes to the theme with as little as 4 additions. It encourages installing of the app to desktop and comes with implemented Material Design Patterns. Its responsive from the start with a logical set of breakpoints that can be easily changed.

1.0 includes a set of templates of common design patterns.

  * Off canvas menus
  * Navigation bars
  * Cards

&#8220;If your app doesn&#8217;t work offline, you don&#8217;t have a good web app&#8221;. The starter kit is offline first as standard. It eliminates the complexity of offline first because&#8230;&#8230;.theres an element for that.

The build process ensures responsible web development by giving developers some awesome tools out the box:

  * Gulp
  * Unit Testing
  * JsHint
  * Minification
  * Browser Sync

He demos the Paper reader, which is an offline RSS reader that uses firebase elements. This uses the Polymer starter kit and looks great when you consider the time needed for these features to be built using vanilla web technologies.

### [Matt McNulty](https://twitter.com/mattsmcnulty) closes the keynote.

For two years web components have been promises of many things. Polymer is the delivery of those promises.

It seems development will be rapid, bringing the future of the web to today.

Thanks to the Polymer team&#8230;.you&#8217;re all awesome!

[resp_image id=&#8217;345&#8242;]
