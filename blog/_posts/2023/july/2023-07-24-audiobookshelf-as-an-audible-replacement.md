---
title:
tag:
    - Adventures in FOSS
---

[Audiobookshelf](https://www.audiobookshelf.org) is a self-hosted server for your audio book library, perfect for the everyday FOSS fan. As an avid Audible listener, I have quite a collection of purchased books. A few even make it into my daily routines. As a result, Audible is one of my most used cloud services for entertainment purposes. 

Audiobookshelf is the perfect self-hosted alternative to Audible. You can listen to and manage your owned audio book collection through a web interface and accompanying mobile apps. It can also serve up your Ebooks and (presumably) any podcast you might want, with simple archiving capabilities. If you're happy to buy your books elsewhere, this could be the perfect choice for hosting your personal book collection.

## Getting your books

Before we can set up and populate a server, we need to get hold of our library. To do this, [Open Audible](https://openaudible.org/) provides a straightforward GUI for managing the download of books, costing < £20. There are free, open-source alternatives, but many are a couple years old and, in some cases, only available on Windows.

Regardless of your chosen method, you'll eventually have one big folder of m4b files with any accompanying pdf files. Unfortunately, Audiobookshelf will treat these as separate books when imported into your library. We can [use a script](https://gist.github.com/tonyedwardspz/683b58555555724912759e3b6a560fc0) to collate these files into their own dedicated folders.

```bash
#!/bin/bash

# Loop through all .m4b files in the current directory
for m4b_file in *.m4b; do
    # Check if the file exists (in case there are no .m4b files)
    if [[ -f "$m4b_file" ]]; then
        # Get the filename without the extension
        base_name="${m4b_file%.*}"

        # Check if the corresponding .pdf file exists
        pdf_file="${base_name}.pdf"
        if [[ -f "$pdf_file" ]]; then
            # If it does, create a new directory with the base name
            mkdir -p "$base_name"

            # Move the .m4b and .pdf files to the new directory
            mv "$m4b_file" "${base_name}/"
            mv "$pdf_file" "${base_name}/"

            echo "Moved ${m4b_file} and ${pdf_file} into ${base_name}/"
        fi
    fi
done
```

You could [go further](https://www.audiobookshelf.org/docs#book-directory-structure) in organising your collection, but this is enough to be getting on with. Premature optimisation is the root of all evil after all.

# Installing Audiobookshelf

The [documentation is pretty solid](https://www.audiobookshelf.org/docs#docker-compose-install), so I won't repeat it here, only for it to go out of date. `docker-compose` is the method of choice for installation and managing the running of the app on a Raspberry Pi. . . with silky smooth results. If you're familiar with docker, you'll be up and running quickly.

I would, however, recommend a few tweaks to the app's `docker-compose.yml` config. Firstly, you'll likely want the app to load at boot time. Adding `restart: always` will ensure that this container is loaded after docker has booted up at the system start, assuming the container was running before the system shutdown. 

Secondly, you'll need to map some folders on the physical device to the container. If you have a similar setup to mine, that'll be on an external drive. In this instance, I have a few separate folders for different media types.

When you're ready, the `docker-compose.yml` file should look something like this.

```bash
version: "3.7"
services:
  audiobookshelf:
    image: ghcr.io/advplyr/audiobookshelf:latest
    ports:
      - 13378:80
    volumes:
      - /mnt/media/Audio Books/books:/audiobooks
      - /mnt/media/Podcasts:/podcasts
      - /mnt/media/Audio Books/abs-config:/config
      - /mnt/media/Audio Books/abs-metadata:/metadata
      - /mnt/media/Ebooks:/Ebooks
    restart: always
```

A separate library for Podcasts is necessary if you want to listen to them from Audiobookshelf. Having ebooks in a dedicated folder, away from the audio book collection, keeps the library tidy. Longer term, this collection may itself need to be split apart if future scripting can't get me out of a metadata hole soon.

With everything in place, we can start the container.

`docker-compose up -d`

Navigate to your servers ip in a web browser, appending the port for Audiobookshelf. For our local setup, I go to `http://192.168.1.80:13378`.

## Configuring Audiobookself

On the first run, you'll be asked to create a login for the admin account before setting up your library. Once created, you can tune the library management, the views, and a host of other fine-grain options. Your selection is a personal preference, and each option is accompanied by a good description of what the config item actually does. Sadly, this is a rarity in modern software. . . so I won't spoil the fun of exploring.

You will need to create a new library for your book collection from the libraries tab in the settings. Selecting the folder that you filled with audio books and added to `docker-compose.yml` will begin the process of scanning the folder and building your library. This may take some time to complete, depending on the size of your library.

![Setup a new Audiobookshelf library](/assets/images/2023/audiobookshelf-new-library-settings.jpg "Audiobookshelf settings for a new library"){:loading="lazy"}

Once the indexing has completed, you'll be able to browse your personal audio book collection.

![Audiobookshelf settings for archiving a whole podcast series](/assets/images/2023/demo-library.jpg "Audiobookshelf settings for downloading entire podcast"){:loading="lazy"}
[Screenshot Source](https://www.audiobookshelf.org/showcase/)

[The Android app](https://play.google.com/store/apps/details?id=com.audiobookshelf.app) is the perfect companion for the platform. It's proven simple to use and well-suited to offline consumption. When online, it's much easier to navigate around your collection to find books compared to Audible. This is particularly true through the web interface on the desktop.

![Audiobookshelf android app for self hosted audio books](/assets/images/2023/audiobookshelf-android-app.jpg "Audiobookshelf google play store app listing"){:loading="lazy"}

Assuming your mobile is on the same network as your server, connecting the app to you library will require:

- Your server ip and port
- Your username
- Your password

Casting usually works well, but only available when connected to the server. Given the smart speakers run on the same network as the Pi, this shouldn't be a problem. The app does not collect any un-justifiable data, which is super nice 🎉

## The end result

Overall, I'm pleased with this app. A collection of audio books and ebooks are being served on the home network to both myself and my partner. I find it much better to use than Audible in almost every way. Finding new places to buy books will be interesting when the subscription stops delivering value.

## The true test

It's working 😀

![Audiobookshelf listening stats for my partner](/assets/images/2023/sophie-listening-stats.jpg "User listening stats on audiobookshel"){:loading="lazy"}
