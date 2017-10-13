---
title: 'How users perceive speed of the web &#8211; (not so) live blog'
date: 2015-08-28 12:53
author: tonyedwardspz
layout: post
category: blog
tag:
  - Dev Tools
  - Mobile Performance
  - Page Speed
---
This is a (not so) live blog of a talk given by Paul Irish at the O&#8217;Reilly Fluent 2015. The talk is about how users perceive speed when browsing the web and a brief look at the new chrome tools we have at our disposal. You can watch the video on [YouTube](https://www.youtube.com/watch?v=2ksXo2_Lfl0) as well as catch up with Paul at his [website](http://www.paulirish.com/) and on [Twitter](https://twitter.com/paul_irish).

* * *

Performance, speed and user perception is a (almost) unquantifiable. Slow as a term is used to describe a variety of conditions but is a very imprecise term.

<span style="font-weight: 400;">10ms. Would 10 ms affect a user on an e-commerce site? Probably not, but how about a game?</span>

<span style="font-weight: 400;">We need metrics. But which one?</span>

<li style="font-weight: 400;">
  <span style="font-weight: 400;">DOMContentLoaded?</span>
</li>
<li style="font-weight: 400;">
  <span style="font-weight: 400;">FPS?</span>
</li>
<li style="font-weight: 400;">
  <span style="font-weight: 400;">Jank?</span>
</li>
<li style="font-weight: 400;">
  <span style="font-weight: 400;">First Paint?</span>
</li>
<li style="font-weight: 400;">
  <span style="font-weight: 400;">Second Visit?</span>
</li>

<span style="font-weight: 400;">Its important that the benchmarks are relevant to the web. Google guiding philosophy is to follow the user, everything else will follow. Therefore the question should be “What does the user feel”.</span>

<span style="font-weight: 400;">Neilson, based on research made the following points about user perceived speed in relation to user interface.</span>

<li style="font-weight: 400;">
  <span style="font-weight: 400;">100ms &#8211; Instant response</span>
</li>
<li style="font-weight: 400;">
  <span style="font-weight: 400;">1000ms &#8211; Keeps the users flow of thought</span>
</li>
<li style="font-weight: 400;">
  <span style="font-weight: 400;">10s &#8211; Lost the users attention</span>
</li>

<span style="font-weight: 400;">Paul shows a video of himself browsing a website with the interaction being relatively snappy. This interaction is broken down into the four phases of user interaction.</span>

[resp_image id=&#8217;366&#8242;]

<span style="font-weight: 400;">User expectation is that the time between between input and paint should be as short as possible to feel immediate.</span>

<span style="font-weight: 400;">For animations to appear fluid they need to be 60fps.</span>

<span style="font-weight: 400;">When a page is idle, the user expects that the interface is ready for interaction, and will respond quickly.</span>

<span style="font-weight: 400;">Load times should be short. During a load there is allot happening which can conflict with the ability of the user to interact. Once the page appears loaded is should be ready to be interacted with.</span>

<span style="font-weight: 400;">The Chrome team call this the ‘RAIL performance model’</span>

[resp_image id=&#8217;367&#8242;]

<span style="font-weight: 400;">What are the target goals?</span>

[resp_image id=&#8217;368&#8242;]

<span style="font-weight: 400;">Paul demos some new performance tools in the latest Chrome Canary. It takes ages for the page to load and he bails on the demo.</span>

<span style="font-weight: 400;">Dev tools’s new feature measures the RAIL performance, with the screenshots of the page captured during load. This allows devs to visualise what is holding up the interaction. Its a great way to measure the impact of an added library on page performance.</span>

<span style="font-weight: 400;">RAIL is a work in progress and the Chrome team wants our feedback.</span>
