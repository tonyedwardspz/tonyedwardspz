---
title: PhotoPrism - Open source image gallery
tag:
    - Adventures in FOSS
    - Self Hosted
---

There are plenty of image gallery options in the FOSS world. Searching around, two names keep cropping up. PhotoPrism and Immich. They're both performant galleries with a bunch of features that, by rights, have no place on a Raspberry Pi. But they are, nonetheless, and one of them will be put to good use on our FOSS server setup.

Post-testing, I opted to use PhotoPrism over Immich for one reason. Stability. Immich is, in many ways, the better piece of software (or rather more feature complete). Still, its implementation of ML-based fanciness causes the Pi to grind to a halt (unsurprisingly). Tuning the resources assigned to the containers was brittle and caused crashes, whereas PhotoPrism offered stability. If you're using anything with more grunt than a Raspberry as your server, I'd suggest you start with Immich.

## What is PhotoPrism

PhotoPrism is a self-hosted gallery suitable for managing an extensive image library. It looks and feels a lot like a Google Photos competitor. . . albeit without the billion dollar budget or any editing functionality. When browsing, the gallery loads snappily enough so you don't notice that the photos are served from a platter-based network device.

![PhotoPrism Screenshot](/assets/images/2023/photoprism-screenshot.jpg "PhotoPrism Screenshot"){:loading="lazy"}

## The Apps

To get a Google Photos-like experience, adding a couple of open-source apps to your pocket rectangle allows for an almost seamless integration into your digital life through additional features such as image sharing from your gallery. The three apps used in this setup are:

- [PhotoPrism](https://www.photoprism.app/)
- [PhotoPrism Gallery](https://play.google.com/store/apps/details?id=ua.com.radiokot.photoprism)
- [PhotoPrism Uploader](https://play.google.com/store/apps/details?id=com.smka.prismuploader)

## Setup

Setting up the application is straightforward, with [the documentation](https://docs.photoprism.app/) covering essential steps. The `docker-compose` method makes installation and running a breeze if that's your thing. You should be up and running in no time. 

If you want the app to automatically load on system startup, add the following to your `docker-compose.yml` file:

```bash
restart: always
```

It's best to get your library set up before enabling automatic restarts. Otherwise, you might end up in an eternal looping crash. Of course, you can choose another restart condition:

```bash
restart: "no"
restart: always
restart: on-failure
restart: unless-stopped
```

See the [docs](https://github.com/compose-spec/compose-spec/blob/master/spec.md#restart) for details.

The default configuration works well out of the box. After importing, indexing and organising your images, snaps will be cued up for ML tagging and videos for conversion in the background. Whilst this happens, there are still enough spare resources to serve other media from the Pi.

## Loading the Library

With the app installed, it's time to load up our library. The default setup comes with a two-pronged approach to managing folders.

```
- Photos
    - Tony Photos (Originals in the docs)
    - Tony Import (Import in the docs)
```

Naturally, you may want to opt for different folder names. Regardless, if you have a set of organised images in a sensible folder structure, plonk them straight into the Photos folder for indexing.

If they're not, you can use the import functionality. Add any unsorted images to your import folder and trigger an import through the library tab of the web interface. You can have separate sources in their own folder, allowing for a controlled import of photos.

![PhotoPrism Import Images Screenshot](/assets/images/2023/photoprism-facial-recognition-screenshot.jpg "PhotoPrism Import Images Screenshot."){:loading="lazy"}

During the process, images are organised into folders by year and month and deduped using dates. It takes information from any EXIF data before resorting to the creation and modification dates and finally filenames (I think).

For best results, you should ensure the EXIF data is as accurate as possible before importing. I had reasonably good results from throwing 25,000 images at the platform, but have since moved to do better. Some scripting can help get the correct date into the right field, but I'll touch on that in a separate post. 

The order of importing will make a difference. If you're anything like me, you have many original photos on a hard drive, mirroring some of the content on Google Photos. Ideally, you'd import the originals into PhotoPrism before layering on a Google Takeout or similar. Regardless of backup settings, Google Photos will destructively process your files. By adding the originals first, altered versions will be deduped against the highest quality version available. For example, you can upload your camera roll directly from your device rather than relying on the same images via Google Photos.

That said, PhotoPrism processes a Google Photos Takeout remarkably well. Like any other import, it will sort your images into sensible folders with the added benefit of the accompanying JSON data. It could have been better in my experience. Still, the problem of images being shown against the wrong date was mirrored in a later import from the originals, pointing to a problem with the underlying data rather than with PhotoPrism.

If you move files around your network using rsync, you should be aware of one gotcha in particular. The archive flag. Without it being added, a transfer using rsync will set the creation and modification time to now, not the actual values. Without this flag, you'll find that PhotoPrism will think you took a lot of photos today.

```bash
rsync -rlptD /path/to/source /path/to/destination
```

This will preserve the relevant details during transfer, apart from the file owner. Setting the owner can cause failed transfers, depending on the source drive file system.

## Image tagging and facial recognition

The image tagging functionality in PhotoPrism is. . . well. . . underwhelming compared to Google's equivalent. Searching for specific items is never going to work as well without you spending hours manually tagging photos. For example, searching for "bird" will bring back results, but "robin" won't. Ultimately, this is why I keep having to open Google Photos in search of a specific image.

![PhotoPrism Facial Recognition Screenshot](/assets/images/2023/photoprism-facial-recognition-screenshot.jpg "PhotoPrism Facial Recognition Screenshot."){:loading="lazy"}

The facial recognition is similarly underwhelming but good enough to be helpful. It seems to group faces well after a bit of training and tagging. The problem is with its ability to pick out faces from images when there is more than none. A well-lit, well-staged selfie photo of me and my partner will often only pick on one face or the other. Not both.

This is a big area that PhotoPrism can work on in the years ahead. Additional functionality to mark an image, or an area of an image, as having a face would improve the usefulness of this aspect of the app. Tweaks to the flow for tagging photos could exponentially decrease the time per tag. Given its open-source software, I'm sure a pull request would be welcomed and encouraged.

I suspect there is a whole world of AI tweaking I could dive into. The parameters the underlying TensorFlow model uses [are modifiable](https://docs.photoprism.app/getting-started/config-options/#face-recognition), and some online have had great results in tweaking them. With ML enthusiasts a part of the core team, this is an area to expect improvements over the coming years. With machine learning 101 on my horizon, this could be the perfect outlet for newly accrued knowledge.

## Summary

Overall, PhotoPrism is an excellent choice of self-hosted photo gallery software. It's straightforward to set up and configure, with tons of further tinkering to be had via the command line interface. The image import functionality has helped to sort ~40,000 scattered images and videos into a de-duped library of ~25,000 easily browsable items at home.

The AI-backed features, whilst present and working, are a shadow of what's available through a service like Google Photos. Face tagging isn't reliable enough to bring up all images of a person, but is good enough to add value to the setup.

If you're looking for a solid self-hosted gallery for a Raspberry Pi that does some of the heavy lifting for you, look no further. It balances performance and capabilities well as a portal into your archive of visual memories.
