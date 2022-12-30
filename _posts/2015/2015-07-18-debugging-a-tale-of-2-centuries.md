---
title: 'Debugging &#8211; A tale of 2 centuries'
date: 2015-07-18 14:44
author: tonyedwardspz
layout: post
category: blog
tag:
  - debugging
  - books
description: Love it or loathe it, debugging is a large part of software development.
---
<p class="graf--h3">
  Love it or loathe it, debugging is a large part of software development. Plan code, write code, test, debug code, refactor code, test, debug code, write code…… You get the picture.
</p>

<p class="graf--p">
  It’s safe to say that debugging is important, especially when learning a new language or framework. In recent months I’ve been creating apps with Ruby (Rails) and Swift (iOS), two languages and frameworks that are new to me. Both have had their issues, but after many hours of debugging and rewriting code, things are starting to fall into place.
</p>

<p class="graf--p">
  In <a class="markup--anchor markup--p-anchor" href="http://www.amazon.co.uk/gp/product/0141036257/ref=as_li_tl?ie=UTF8&camp=1634&creative=6738&creativeASIN=0141036257&linkCode=as2&tag=aandeuk-21" data-href="http://www.amazon.co.uk/gp/product/0141036257/ref=as_li_tl?ie=UTF8&camp=1634&creative=6738&creativeASIN=0141036257&linkCode=as2&tag=aandeuk-21">Malcolm Gladwell’s ‘Outliers’</a>, the story of how <a class="markup--anchor markup--p-anchor" href="https://en.wikipedia.org/wiki/Bill_Joy" data-href="https://en.wikipedia.org/wiki/Bill_Joy">Bill Joy</a> became a computer genius is touched upon within the context of the 10,000 hour rule. He attended the University of Michigan in the early 70’s before going on to help create UNIX and vi before becoming a founder of Sun Microsystems.
</p>

<p class="graf--p">
  Bill Joy studied during a period of time when computing was changing rapidly, moving from <a class="markup--anchor markup--p-anchor" href="http://www.columbia.edu/cu/computinghistory/fisk.pdf" data-href="http://www.columbia.edu/cu/computinghistory/fisk.pdf">Punch card programming</a> of the previous years to a screen based system that we would recognise today. No longer would computer scientists need to punch holes in a piece of cardboard, before waiting a week before the results came back from the lab. As part of the story, debugging was covered.
</p>

<p class="graf--p graf--startsWithDoubleQuote">
  “Programming with cards did not teach you programming. It taught you patience and proofreading”.
</p>

<p class="graf--p">
  I’m youthful enough to not remember that far back. Development has always been within a text editor of some kind and results have always been near-instantaneous compared to the sixties. The worst it’s ever got for me was having to use <a class="markup--anchor markup--p-anchor" href="https://en.wikipedia.org/wiki/Microsoft_FrontPage" data-href="https://en.wikipedia.org/wiki/Microsoft_FrontPage">FrontPage</a> for creating web pages (I’m claiming that as a badge of honour).
</p>

<p class="graf--p">
  Whilst reading <a class="markup--anchor markup--p-anchor" href="http://www.amazon.co.uk/gp/product/0141036257/ref=as_li_tl?ie=UTF8&camp=1634&creative=6738&creativeASIN=0141036257&linkCode=as2&tag=aandeuk-21" data-href="http://www.amazon.co.uk/gp/product/0141036257/ref=as_li_tl?ie=UTF8&camp=1634&creative=6738&creativeASIN=0141036257&linkCode=as2&tag=aandeuk-21">‘Outliers’ </a>my mind was thrown back to early in the week, specifically a long and tedious debugging session. After picking through the code, placing debug statements and inspecting variables, I found the solution after an hour or so. At the time I felt this was a really slow process, but in comparison to the punch cards I was moving at light speed. All of a sudden that hour plus the 10 seconds to compile the application was not so bad. The thought of having to wait a week to find out if changes had worked as expected sounds awful.
</p>

<p class="graf--p">
  Today, programming is a combination of memory, intuition, Google fu (or should that be Alphabet fu) and banging your head against a wall. Whilst we no longer have a <em class="markup--em markup--p-em">really</em> long compile time, complexity has increased exponentially. During the punch card era a program would be written in a single language.
</p>

<p class="graf--p">
  A recent project required me to use Ruby (on rails), JavaScript, SASS, HTML as well as a whole host of gems that helped to lubricate the rails magicness. Whilst that is not an especially long or complex list, the cognitive load that comes with context switching is very likely to be higher. That being said we now have Google and StackOverflow for finding solutions. Octa-core processors and huge amounts of RAM make compile time nice and nippy.
</p>

<p class="graf--p">
  Next time you find yourself stressing about debugging and compile time, just be thankful that you’re not programming in the 60’s.
</p>
