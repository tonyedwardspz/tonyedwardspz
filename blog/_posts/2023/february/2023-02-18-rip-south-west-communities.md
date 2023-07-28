---
title: RIP South West Communities
tag:
    - Side Project
    - Web Development
    - South West Communities
image: /assets/images/2023/south-west-communities.jpg
---

South West Communities has shut down ☹️

The website started life as my final year project at University a handful of years ago. It solved the problem of missing out on interesting networking events in the region because of the need to track the activities of 30+ separate groups across a few platforms. The app aggregated those events into a single place for easy digestion. 

Beginning as a technical exercise in progressive web applications, the site was rebuilt after graduation to comprise:

- A [static website](https://github.com/south-west-communities/website) showing aggregated results and a community directory
- A [internal API](https://github.com/south-west-communities/sw-communities-internal-api) that retrieved, processed and cached the data
- An [external API](https://github.com/south-west-communities/public-api) to allow others to build upon the same data set
- A ropey (but functional) [conversation interface](https://github.com/south-west-communities/conversational-interface)

There were also the usual social media profiles, a mailing list, and a beta tester mailing list. The app was picked up by a few larger communities in the South West and nearly became adopted by a region-wide organisation. Unfortunately, paying a nominal fee for an API that would save them tons of effort wasn't something they wanted to do ☹️

## Why is it closing now

Meetup has shut down the V2 API, which the ecosystem was built upon. In fact, they did so more than a year ago. Knowing this, I'm surprised the data was available for so long past the sunset date. I want to think a Meetup engineer was smiling down on this community project from afar, letting it limp along a tad longer than it should have. 

There is a replacement. . . but a pro account is needed. As I'm not organising events anymore, it doesn't make sense to pay for a meetup account. I considered some good old-fashioned web scraping and even looked into some fancy 3rd party services for data curation. 

Ultimately I've decided it should die.

At its peak, the catalogued up to 150 events for more than 50 communities. The ecosystem hasn't recovered after the pandemic. I guess my fellow organisers have also decided they like not organising events. Those that have restarted have generally received low turnouts.

Building an event-based ecosystem in the South West [isn't a personal goal anymore](https://tonyedwardspz.co.uk/blog/your-best-thinking/). It does not make sense to spend money (nor time) doing something that isn't in support of a single one of my priorities. Keeping it going would be an example of falling foul of the [sunk cost fallacy](https://en.wikipedia.org/wiki/Sunk_cost).

Which sucks.

I've loved tinkering with this project. The next version of the site is even half complete, with a spinoff for another region underway. It's given me the excuse to:

- Dive deeper into Google's cloud services
- Build another conversation interface
- Figure out how to host an API
- Make a few cloud functions
- Construct a reasonably complex build system to generate files dynamically

Great learnings.

## The downside

The ecosystem around South West Communities has kept my hand in the nitty gritty of software engineering for a few years. It's only been a small part of my professional mix. But it's a skill set I worked hard to build over four years, spending ~£50K on student loans to do so. I certainly don't want those skills to disappear.

On the plus side, static websites using Jekyll. . . even at the complexity that I build them. . . isn't necessarily the most in-demand skillset.

## The upside

All of this leads me to an interesting question. . . 

Where will I get my code fix from?

I've now got an excuse to start another technical project to keep my hand in the development world. It's already been built, but the edges are currently being rounded off before launch. As Marcus Aurelius once said, "the capacity for patience was given us for a reason.". You'll have to use it for just a little longer.

Watch this space.
