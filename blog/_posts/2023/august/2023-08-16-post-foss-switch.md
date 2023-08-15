---
title: Post FOSS Switch. Was it worth it?
tag:
    - Self Hosted
    - FOSS
---

A few weeks ago, I decided to set up a [self-hosted content server](https://tonyedwardspz.co.uk/blog/adventures-in-foss-the-journey-begins/) to wrestle owned media from mega-corporations. It's been an adventure going down the Raspberry Pi rabbit hole as so many have before. At the end of [two weeks on and off tinkering](https://tonyedwardspz.co.uk/blog/pre-heating-the-pi/) I have a stable, secure, and low power set up to request my owned content from. All thanks to three different media servers.:

* [Audiobookshelf](https://tonyedwardspz.co.uk/blog/audiobookshelf-as-an-audible-replacement/) -> Audiobooks and eBooks
* [Jellyfin](https://tonyedwardspz.co.uk/blog/jellyfin-self-hosted-media-server/) -> Music, TV and films
* [Photoprism](https://tonyedwardspz.co.uk/blog/photoprism-open-source-image-gallery/) -> Photographs

If you have the time to dedicate to setting this up, it is worthwhile. If you don’t have a single owned physical backup of all of your data/media, I’d encourage you to make one and use a project like this as the excuse. That said, if the principle of having your content on someone else's server coupled with the fact you could lose access at any moment doesn't bug you, don't bother.

## Success. . . or no?

Measured against the goal of self-hosting my content collection, it has been a total success. At home, I have all of these things at my fingertips via some nifty open-source software. All of the platforms have been put to the test in offline conditions over a busy few weeks darting around the region. I’m confident that the current setup will be staying put with a little bit of evolution over time.

Regarding the true test of the project, my partner has started to embrace it. Early signs are promising, with a few books from the Audiobookshellf library casting around the house. 

![Listening stats on Audiobookself](/assets/images/2023/sophie-listening-to-books.jpg "Partners listening stars"){:loading="lazy"}

Time will tell with the other platforms. As we’ve yet to order her takeout, it's understandable that a vast collection of hip-hop doesn’t draw her into the personal ecosystem.

.### Sticking to principles

The declaration post contained a few principles and dreams that I would try to uphold.

*Use free and open-source software*

Pretty much. I happily paid for a few of the peripheral apps, but for the most part I stuck to FOSS.

*Privacy First*

Yup. There are certainly no adverts in any of the platforms and there doesn’t seem to be any untoward telemetry pinging from the Pi.

*Host at home*

All my stuff is hosted in the corner of the living room. It’s only accessible to anyone on the network.

*Store data in a portable format*

Mp3, M4A, JPG, Mp4, and PDF are ubiquitous and portable.

*Setup for an offline first consumption pattern*

By choice, the apps are only available on the home network. Anytime I’m not at home, I’m consuming offline.

*Backup things as automatically as possible*

Clicking the clone button once a week to duplicate the drive is the only form of backup at the moment. That’s ok for now, but I plan to loop back to this before the moment arises when local content is the only content. 

*Keep the hardware BOM to a minimum*

Nothing was spent purposely for the project up to this point. I plan to in the near future, but I want to be confident of the setup before I buy a more suited HDD.  

*Expand my software developer personal skillset*

Certainly. I’ve learned a whole bunch about working with linux, networks, docker, basic server security to name a few. Whilst the command line is a part of a typical daily workflow, it’s certainly not central. Living on the command line has helped me to really see the benefits of this way of interacting with computers.

*Have fun on this adventure*

Definitely fun. Geeking out and going deeper into something techie just for fun has been a nice reminder that I work with computers because I enjoy using computers.

## Peripheral benefits

Having limited content by choice eliminates a whole bunch of searching for the next thing during consumption. Now, I pick an album from the few gig of music available on my phone and get on with my day. Searching for an audiobook to enjoy during a commute is unsurprisingly quick when you only have five to choose from. Overall, this is leading towards a more mindful relationship with my pocket rectangle.

Creating and sorting a backup of your digital life is fundamentally a nice experience. Tagging everyone for AI training made me look through a huge photo library, bringing back many happy memories from the past 20 years. Revisiting my music catalogue and rediscovering artists I’ve not listened to in a decade has been another highlight.

By design, streaming services introduce you to new songs similar to the palette you consume in your initial days on the platform. If they don't present new material regularly, they aren't actually providing you with much value in return for a subscription.This is a great way to discover new artists in a genre. On reflection, this typically led my ears into a subgenre of hip-hop that was always returned to regardless of the starting point.

The power consumption stats will be posted about once I’ve done the math. That said, it’s well understood that an offline content consumption pattern generates less nasty gases than an online first one. Going one step further, It’s logical to assume that downloading from a server that isn’t always on over the local network is better than the equivalent action from a streaming platform.

With regards to my phone, battery life has improved as a result of less screen on time and reduced usage of network connectivity. Again, I have no numbers to show. . . but my battery definitely drains more slowly. Audible, YouTube Music are both gone. Google Photos is still installed and doing its thing in the background. I do miss the ability to use voice control for media, although it was often so frustratingly poor at correctly identifying requests against a weird collection of Hip-Hop artist names it was almost useless at times. Perhaps it’s no great loss.

The last peripheral benefit is that I’ve finally found a good use for a bunch of unused technology accrued during previous. Everytime I open the kit cupboard, the pesky Pi will no longer be staring back from the shelf, silently scolding me for not putting it to good use.

## Improvements

Hardware wise, there are two items that will be added to the setup pretty swiftly once I’m confident we’ll get continued use out of it. A small capacity SSD would significantly improve performance. The SD card is the current bottleneck in the system, and also the most likely part to fail.

The other is auto on and off. I’ve found there’s no need to have fingertip access to everything so we don’t leave the Pi on all of the time. That said, auto syncing is pretty cool. I plan to add some form of automated wake up in the dead of night. This will allow both my music library to update and photos to backup regularly. For this, I’ll need a real time clock (RTC) module for the Pi.

If I was starting again and was prepared to spend, a better hardware setup would be in order. This was convenient in that all of the components were littered around the house, but a Raspberry Pi quickly hits its limit when doing anything more than passing data around the network. A small form factor PC with a half decent processor would open up a world of possibilities.

Software wise, I’m pretty happy. The only thing really missing from the ecosystem is a basic photo editor. Beyond that, any features that are lacking are luxury’s rather than problems that need solving. Undoubtedly, the current software setup will evolve over time. The hardware will significantly change in the long run to accommodate that.

## Final thoughts

Don't do it. But do.

This was a total time sink. If I had billed a client for the time taken to complete this project, I’d have paid for the next decades worth of subscriptions. That would leave me in a position to lose access to all of my photos, videos, music, and audiobooks at a moment's notice. . .a position I’m happy to not be in anymore.
