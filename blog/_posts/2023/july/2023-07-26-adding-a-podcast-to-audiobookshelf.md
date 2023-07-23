---
title: How to subscribe to podcasts with Audiobookshelf
tag:
    - Self-Hosting
    - Adventures in FOSS
---

Audiobookshelf is an open-source application for self-hosting an audio book collection. As well as audio books, the platform is a great podcast server and archiver. You can add your favourite podcasts via a simple search interface, opting to keep a complete archive or a rolling collection of the latest episodes. 

Here's how.

## Adding podcasts to Audiobookshelf

Create a new library to hold your podcast collection from the settings > library screen. 

![Add new library for podcasts](/assets/images/2023/audiobookshelf-1-create-podcast-library.jpg "Screenshot of Audiobookshelf library management"){:loading="lazy"}

Be sure to choose the correct media type to enable the podcast library interface.

![Create Audiobookshelf podcast library](/assets/images/2023/audiobookshelf-2-podcast-library-folder.jpg "GAudiobookshelf podcast library Screenshot"){:loading="lazy"}

Open the new library and click on the search tab from the left of the screen. Enter the title of your podcast into the search box. Alternatively, enter the RSS feed URL of the series you wish to add.

![Add podcast to Audiobookshelf library](/assets/images/2023/audiobookshelf-3-add-podcast-to-library.jpg "Audiobookshelf add podcast to library Screenshot"){:loading="lazy"}

Clicking the title of any of the results will take you to the iTunes page for the series. Clicking elsewhere on an individual search result will open a dialogue box with editable information about the series. Change the details if you wish. Check the box to download new episodes automatically. Clicking submit will add the series to your library.

"But there's no actual shows to listen to!" I hear you call. That's because Audiobookshelf only downloads new episodes by default. It's not a tool for browsing podcasts and listening to a random episode (IMO). We need to tell the app to peer into the past to load our library with content.

![Audio book shelf podcast listing page](/assets/images/2023/audiobookshelf-4-podcast-listing-page.jpg "Screenshot of a podcast on Audiobookshelf"){:loading="lazy"}

Click the edit icon and select the episodes tab. Change the date to more than cover the release dates and how many episodes you want to have on hand. A few months is usually enough for a podcast with regular releases. Change the limit to the number of the most recent episodes to hold within the library, in this case, 30.

![Audiobookshelf download settings for podcast series](/assets/images/2023/audiobookshelf-5-download-past-episodes.jpg "Screenshot of Audio book shelf settings page"){:loading="lazy"}

After clicking search, you'll see the list of episodes grow as they are downloaded and added to the library.

![Podcasts downloading onto Audiobookshelf server](/assets/images/2023/audiobookshelf-6-select-podcast-episodes.jpg "Screenshot of Audiobookshelf showing podcast episodes discovered"){:loading="lazy"}

Assuming you checked the auto download box, new episodes will be periodically fetched from the web and added to the library. We can fine-tune this process by changing some settings in the schedule tab. Click the edit icon on the podcasts page and select the schedule tab.

![Audiobookshelf scheduled podcast download settings](/assets/images/2023/audiobookshelf-7-schedule-podcast-downloads.jpg "Screenshot of podcast download settings in audio book shelf"){:loading="lazy"}

Change these settings to suit the podcast's release schedule. In this example, it's set to download the two daily releases each evening, keeping a maximum of 14 episodes in our library at a time.

![Podcast episodes listed on Audiobookshelf](/assets/images/2023/audiobookshelf-podcast-page.gif "GIF of Audiobookshelf locally hosted podcast episodes"){:loading="lazy"}

## Archive an entire series

If you wish to archive every podcast episode using Audiobookshelf, the steps are mainly the same as above. For any series you want to keep a complete archive of:

- Choose a date ridiculously far in the past on the episodes list, e.g. 1990.
- Set the limit to 0 to download all episodes.

![Audiobookshelf settings for archiving a whole podcast series](/assets/images/2023/audio-book-shelf-archive-entire-podcast-series.jpg "Audiobookshelf settings for downloading entire podcast"){:loading="lazy"}

If the series has finished releasing episodes, omit the automatic downloading of new episodes and double check nothing is scheduled on the relevant tab.

![Podcast archive served using Audiobookshelf](/assets/images/2023/self-hosted-podcast-archive.jpg "Screenshot of self-hosted podcast archive using Audiobookshelf"){:loading="lazy"}

## Summary

That's it. You can now subscribe to a podcast using Audiobookshelf, with new episodes downloaded to your local server automatically. You can use this functionality to create a complete archive of any series you wish, or to always have the most recent few episodes available. 

In either case, you'll now be able to stream your favourite podcast when connected to the local network and download them through the Android app for offline consumption.

Happy listening!
