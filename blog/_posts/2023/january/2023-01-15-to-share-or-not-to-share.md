---
title: To share or not to share
image: /assets/images/2023/share-buttons.jpg
tag:
    - Jekyll
    - Social Media
    - Optimisation
    - Web Development
---

At the moment of writing, this post would have share buttons immediately after the main body of text, as you can see in the image above.

They’re implemented in a non creepy, privacy mindful way and provide and quick way to share content. Looking back at the analytics from the previous iteration of the site, I’m not sure they were used a whole lot, so their worth is debatable. 

The buttons also raise a couple of flags on [Google’s Page Speed Insights dashboard](https://pagespeed.web.dev/report?url=https%3A%2F%2Ftonyedwardspz.co.uk%2Fblog%2Fto-share-or-not-to-share%2F), acting as the main barrier to getting the perfect score.

![Google Page Speed Insights Start Score](/assets/images/2023/page-speed-share-start.jpg "Google page speed insights start score"){:loading="lazy"}

One related to the crawlability of the social share links, and another to do with the contrast of the button text and the background.

I’d been pondering whether to keep these links as part of the sites recent rejig. This was an excuse to stop and think about them. 

As I move away from using day-to-day the very platforms encouraged here, it fells a bit contradictory to ask people to share my posts specifically to them. Getting a perfect score on Page Speed would be nice also.

Asking my girlfriend for an opinion brought forth the usual wisdom filled insights:

> I use the built in share functionality, not any buttons on any website.

Genius.

Me too now I come to think about it. Checking the RSS app, it has a share functionality built in that ultimately uses the Android platforms built in features. Whilst there, I checked the feed for new posts:

> We shouldn’t be here to feed the platform. The platform needs to be here for us. - [Seth Godin](https://seths.blog/2023/01/the-platform-and-the-curator/)

Encouraging others to post on these platforms Definitely counts as feeding them. What other reasons for removing them are there?

- People posting links onto social isn’t the “conversion goal” come the end of a post. Reading another post is.
- It’d offload functionality onto the browser (which is well handled on Firefox) as good web sites / apps do.
- Improved the accessibility of the site.
- Gives search engines one less reason to grumble.

Best remove them for now. I can always implement the browsers own [Web Share API](https://tonyedwardspz.co.uk/blog/upgrading-social-sharing-via-the-web-share-api/) if this kind of functionality is needed in the future. Again, this offloads work goto the browser. 

Doing so chops some liquid / HTML from the theme:

![Screenshot of deleted code](/assets/images/2023/deleted-share-code.jpg "Screenshot of deleted code"){:loading="lazy"}

As well as an [entire file](https://github.com/tonyedwardspz/tonyedwardspz/blob/8743e82671a3e00f3e84e75d8db436260d8d667f/_sass/components/share.sass) filled with SCSS.

After all that, it’s moved the Page Speed Scores up a touch.

![Google page speed final score](/assets/images/2023/page-speed-share-end.jpg "Google page speed final score"){:loading="lazy"}

Fab.

