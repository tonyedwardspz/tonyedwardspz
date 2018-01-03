---
layout: post
title: Tracking a Campaign's Inbound Traffic with Google Analytics
date: 2018-01-03 09:45 +0000
author: tonyedwardspz
category: blog
headerImage: false
tag:
  - Google Analytics
  - Inbound Traffic
  - Campaign Analytics
---

Testing assumptions is key to an effective, iterative cross platform marketing campaign. Understanding how users are navigating their way through the website and interacting with content. The starting point of the journey is often a social media or newsletter campaign, and the numbers of users coming through different platforms and campaigns is a key indicator of the success of both individual posts and the wider campaigns.

As part of the campaign Software Cornwall has planned, being able to distinguish between different social networks for the promotion of one piece of content. Thankfully, the site already uses google analytics, meaning we can plug into the UTM parameters to highlight certain incoming traffic.

```
https://www.softwarecornwall.org/falmouth-university-games-academy-visit/?utm_source=twitter&utm_medium=social&utm_campaign=digital_gurus
```

The three parameters shown here are:

* Campaign Source
* Campaign Medium
* Campaign Name

### Creating the tracking link

Head over to the [Campaign URL Builder](https://ga-dev-tools.appspot.com/campaign-url-builder/). You’ll see a screen like the one pictured below, where the details for a individual post to be shared on twitter under the digital guru campaign has been entered.

![Campaign URL Builder Screenshot ](/assets/images/2018/01/1-url-generator.jpg)

Simply copy and paste the resultant campaign url and share on the appropriate platform.

![Generated URL by Campaign URL Builder ](/assets/images/2018/01/2-generated-url.jpg)

### Viewing the results

Open up google analytics and head for the appropriate properties main dashboard. From there, navigate to Acquisition > Campaigns > All Campaigns. Keep an eye out for your campaign name.

![Campaigns in Google Analytics ](/assets/images/2018/01/4-analytics-campaign.jpg)

Clicking campaign name will allow you to view the source and campaign type in more detail.

![Sources of campaigns in Google Analytics ](/assets/images/2018/01/5-analytics-campaign-source.jpg)

Now that posts from different are grouped together, the effectiveness of different traffic sources can be determined.
