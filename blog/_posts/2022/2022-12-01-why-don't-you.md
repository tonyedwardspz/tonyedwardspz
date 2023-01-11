---
title: Why don't you. . . 
date: 2022-12-01 00:00:00+0000
headerImage: false
affiliate: true
tag:
- Analytics
- Comments
- Jekyll

---

## . . . have a fancy looking website?

Design is overhead.

Well. . . it is when it comes to this blog at least. Reading [The Design of Everyday Things](https://amzn.to/3UoJWHp) by Don Norman and diving into the usability wisdom of [Jakob Nielsen](https://amzn.to/3GYCdN9) was a good choice at uni. You come to appreciate that the simplest designs often conveyed the necessary information. Everything else is built upon those first principles, and at best is a distraction from simplicity.

That and I'm used to looking at RSS readers.

## . . . have any analytics on you blog?

For three main reasons.

1. The amount of people reading this blog has no consequence to anything. I post what I want, when I want.
2. I care about the privacy of whoever reads the things I make more than I care about any numbers.
3. In the eight years prior to their recent removal, I’d probably looked at the analytics twice. Three times at a stretch. In all cases, it was an accident.

For similar reasons, there's no Meta Pixel.

## . . . have comments on your blog?

I don't want comments on the blog. There's a contact form that people can use that drops submissions into a well designed email workflow. 

Comments received this way have resulted in some interesting conversations over the years. Any received via Disqus weren't even noticed.

Chances are that we’ll talk about a content piece one way or another if fortune so wishes..

## . . . have this site broken up into partials?

The Jekyll theme this site is built upon was highly atomic. The includes folder was chock full of partials. . . however. . . many of them were only used once. Knowing that premature optimisation is the root of all evil and that I touch the theme files very infrequently, I decided to lump them together into the main template files. Unless the code is used more than once of course.

Apart from the reduction in cognitive load when making tweaks every few months, it’s also reduced the build time. Only by a couple of seconds, but every second counts! Given this is a blog, the rebuild time when writing is more important that when developing, and with the reduction in `includes` across the theme, the writing rebuild is now under a second 💪
