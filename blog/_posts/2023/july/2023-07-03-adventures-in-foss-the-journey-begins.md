---
title: Adventures in FOSS - The Journey Begins
image: /assets/images/2023/raspberry-pi-in-argon-one-case.jpg
tag:
    - Adventures in FOSS
    - Self-hosting
---

The jump is about to happen.

After years of using other people's proprietary platforms, I'm finally moving over to the self-hosted FOSS world. With so many tech services going up in price, disappearing or moving behind a paywall, it feels like an appropriate time to move away where it makes sense to invest effort.

FOSS stands for "[Free and Open Source Software](https://en.wikipedia.org/wiki/Free_and_open-source_software)". It describes software that is free to use and open in the sense that its source code is made available to the public. This allows users to view, modify, and distribute the software under certain conditions. In this instance, I'm looking for software that will enable the self-hosting of alternatives to some of the web-based services used within the household. I am happy to ignore the free caveat if necessary.

Self-hosting is something I've been putting off for years. When you buy a subscription (or service outright), you're actually paying for your own time. The time it takes to set up. The time it takes to keep things running. The time to manage a library of content. The time to back everything up appropriately. The cost of hardware. For a few quid a month, you can save all this time. If the past few days of tinkering are anything to go by, this is well-spent money.

Nonetheless. . . here we are.

## Principles

Along this journey, where possible, I hereby swear to:

* Use free and open-source software
* Choose software that doesn't share my life story with an advertising company
* Host at home if possible, and on a personal server if not
* Store data in a portable format
* Setup for an offline first consumption pattern
* Backup things as automatically as possible
* Keep the hardware BOM to a minimum
* Expand my software developer personal skillset
* Have fun on this adventure

## The primary goal

The first phase of this self-hosting journey is to create an ecosystem that replicates the core of the household's entertainment services, comprised of three pillars of consumption:

* Music
* Videos
* Audio Books

Music comes vis YouTube Music, part of a wider subscription. For the most part, we both listen to a small collection of artists, sometime jaunting off into the land of recommendations. The service is great, but buying the handful of albums we listen to the most would have been cheaper.

Whilst we don't consistently subscribe to any video services, we grab the occasional month of Netflix, Disney or other similar services over the year. When we have Prime, we'll use the video offering that comes with it. Beyond that, I watch YouTube, and my partner watches shows from terrestrial TV. This is a hard one to put a cost against.

Audiobooks are much simpler to compute. Pay Amazon money, and they host a library of audiobooks. Once a year, I buy the 24-book bundle for the optimum cost per book plus a few extra credits and the odd sale purchase. Audible will be staying, for the moment at least, only on a lower tier.

<table>
  <tr>
   <td><strong>Service</strong>
   </td>
   <td><strong>Monthly Cost</strong>
   </td>
   <td><strong>Annual Cost</strong>
   </td>
   <td><strong>New Cost</strong>
   </td>
  </tr>
  <tr>
   <td>YouTube Music
   </td>
   <td>£20
   </td>
   <td>£240
   </td>
   <td>£0
   </td>
  </tr>
  <tr>
   <td>Video Streaming
   </td>
   <td>~£5
   </td>
   <td>~£60
   </td>
   <td>£0
   </td>
  </tr>
  <tr>
   <td>Audio Books
   </td>
   <td>
   </td>
   <td>£119
   </td>
   <td>£69
   </td>
  </tr>
  <tr>
   <td>
   </td>
   <td>
   </td>
   <td>£419
   </td>
   <td>£69
   </td>
  </tr>
</table>

Don't get me wrong, there's great value to be had from spending this money. I'd rather spend it differently. Instead of £240 going to Google, it feels nicer to give money to the artists whose albums I want to listen to, using streaming services to try before I buy. When you add it up over the years, it's not an inconsiderable amount that's been syphoned away from the independent artists I listen to.

## The Solution

I've been researching and tinkering with different solutions for a few days. Many have been installed and set up with a small subset of the media library, intending to wipe the OS and start from scratch. From this, I've understood what lies ahead, the software to begin with, and where this sits within my skill set. Comfortably, as it turns out. . . even if docker is getting reintroduced into my technical life.

This time proved fruitful. Naming conventions and folder structures are important to all self-hosted solutions, which I didn't consider. Audiobooks are particularly picky, as it turns out. ChatGPT's scripting genius will hopefully perform some leg work here. Thankfully, the music collection was rescued from a well-groomed Windows Media Player setup with additions over the years building upon good habits.

Below is a summary of the initial setup will run with. I'll dive more into elements as the adventure continues.

### The Hardware

Whilst experiments like this are in their early phases, it's wise to not splash the cash. To that end, I've decided to use as much equipment as possible that's kicking around the house, building the system around a [Raspberry Pi 4](https://thepihut.com/products/raspberry-pi-4-model-b) (8 GB).

As the server will be under significant load at times, it's key to keep it cool. [Argon ONE](https://amzn.to/46xbrWA) is an attractive, actively cooled metal case that packages the Pi's ports much more conveniently. Two useful additions are:

* a power button to perform soft shutdowns and restart
* an IR receiver for a media remote control

To store everything, I have a bunch of large-capacity hard drives left over from my time running a video company. They're platter-based, so they consume more energy and are slower than modern storage devices, but they'll do fine for now. Given how little they've been used, they're essentially brand new and can be upgraded as they show signs of wear. Longer term, SSDs will be used, with the current ones acting as backup media.

Something to consider is the cost of electricity the setup will devour. Back-of-a-napkin maths brings me to a top-end estimate of £2.50 a month at current UK rates. It's not a huge amount, but it represents a shifted cost. It'd be unfair to measure this during the setup phase as there will be a lot of one-time tasks the software will perform in setting up the libraries. Much of this predicted energy cost comes from the HDD setup, which is less than optimal at this point.

![HDD Setup](/assets/images/2023/hdd-caddy.jpg "A photo of a hard drive bay"){:loading="lazy"}

### The Software

The number one bottleneck in selecting software is my partner. She likes the simple life that comes with living within a tech ecosystem. If we're honest, this simplicity is one of the key features of being my partner. After a lifetime of tech tinkering, what's quick and easy for me is a hassle for her. She is not interested in being inconvenienced to remove our reliance on big tech. It's a non-issue. 

We are currently all-in with the Google ecosystem. From hardware to software, with a liberal dash of cloud services, if Google offers it, we take it. Admittedly, when it works, it works really well. However, I pay for everything and have to keep them working. Whilst the goal is not to remove Google entirely (the speakers are awesome and in every room), moving away from their subscription ecosystem is a big motivator.

Previously, I played with a [Plex](https://www.plex.tv/)-based setup for an afternoon. While it was futile for that use case, I was impressed enough to begin there. The problem. . . many of the features we need are behind a one-off £120 payment. Whilst I'm not against handing over that amount, when looking into the [state of the company](https://techcrunch.com/2023/06/29/plex-layoffs-advertising-slowdown), I'm not confident they'll be around for decades to come. Plus, there are tons of adverts to [fund its investors](https://www.crunchbase.com/organization/plex), and where there are adverts, there's usually surveillance tech and data selling.

I have a far more pessimistic view of [Emby](https://emby.media/) and even suspect this is what I'll use further down the road. It's transparent, well-maintained, and boasts a very polished interface. Again, the £120 payment is putting me off, given I can't have a local play first, plus it's not fully open-source software.

[Jellyfin](https://jellyfin.org/) ticks the media server box for music and video. Paired with the web app and other open-source software, it puts media into our pockets and onto our Chromecast-based household. It copes with Audiobooks at a stretch, but not sufficiently enough for our needs.

[AudioBookShelf](https://www.audiobookshelf.org/) does. It serves audiobooks from a central point like any media server and has a nice Android app. It's open source, vigorously developed and simple to use.

At the moment, I'm not concerned with making these services available to the outside of the home network. When that day comes, nginx reverse proxying will save the day,

## Stretch goals

Beyond entertainment, there are other services I'd like to implement:

* Network-wide ad blocking
* VPN
* Photos
* Tasks & Shopping Lists
* Notes

These, though, are for future Tony to consider.

## The next task

Get backups and libraries from various places onto one hard drive, implementing a solid folder structure and naming convention.

Fun.
