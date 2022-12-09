---
layout: post
title: Render > Heroku
date: 2022-12-03T00:00:00 +0000
author: tonyedwardspz
category: blog
headerImage: true
image: /assets/images/2022/render-homepage.jpg
tag:
- South West Communities
- Devops
- Software Development

---

[Heroku](https://www.heroku.com/) ended their free tier last month. Whilst I had a few legacy projects hosted on their dynos, one of them needed to live on. 

It's the internal API the powers the [South West Communities](https://southwestcommunities.co.uk) ecosystem. The app that was running on Heroku was the last slither of the original project still standing from the initial launch. It was the perfect platform decision for the time, one borne from my time on placement under the watchful eye of a wise software craftsman.

 The website started as a [technical exercise in progressive web apps](https://github.com/tonyedwardspz/community-events-pwa) for my final year project at Plymouth University. Whilst the JS heavy client application was swapped out for a static Jekyll site a few years ago, the express server that sat behind it is still in use.

With a quick message asking for a suggested replacement for Heroku dropped into a local developer slack group, I quickly settled on [Render](https://render.com/) as the APIs new home. Their website was prettiest from the suggestions, and it wouldn't require anything to change in the app and workflow around it. A drop in solution if you will.

Seeing as the project was open in the editor anyway, I gave it a quick `npm update`, tweaked the event processing to account for a slightly outdated dataset and deployed the application. Lastly, I passed the new endpoint URL through the four applications. 

![Render platform screenshot](/assets/images/2022/render-deploy.jpg "Render platform screenshot"){:loading="lazy"}

All in all, I was impressed with the straightforwardness of making a switch to Render. It felt like the Netlify team had worked on a Heroku competitor. Which is fab.

9 out of 10. Would recommend.
