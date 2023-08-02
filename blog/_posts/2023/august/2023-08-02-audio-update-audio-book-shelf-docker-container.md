---
title: Update Audiobookshelf Docker Container
tag:
    - Self Hosted
    - FOSS
image: /assets/images/2023/audiobookshelf-version-number.jpg
---

Audiobookshelf is very [actively maintained](https://github.com/advplyr/audiobookshelf) by the developer at the time of writing. It's great seeing new features and community contributions landing in the app regularly, even if this means more frequent updates are needed. By the developers' own admission, there may be trouble ahead if the app and server get too out of sync.

Luckily there's a reminder In the bottom left corner of the web interface (on desktop). You'll see the currently running version displayed. If the software is outdated, you'll see the latest version number displayed underneath.

Updating docker images can be managed fully automatically. Given the very active development the project is under, it's wise to stay a little behind the very bleeding edge.

## Before you start

If you last did so a while ago, create a backup of your library via the admin interface. Older backups might not work with newly updated images so it's worth having as recent one as possible. Settings and metadata should seamlessly transition with the update as they are stored on the physical drive rather than within the container. However, it pays to be prepared.

Your actual media files are separate from this backup type and should already have redundancy built in.

## Update Audiobookshelf server

Stop your running container to limit potential issues with library corruption. On the command line, navigate to the directory Audiobookshelfs `docker-compose.yml` file resides in and take it down.

`docker-compose down`

Pull the latest image from docker hub with this command.

`docker-compose pull ghcr.io/advplyr/audiobookshelf:latest`

Then you're ready to rebuild the container from the freshly updated image and relaunch.

`docker-compose up -d --remove-orphans --force-recreate --build`

You are then safe to prune any outdated images.

`docker image prune`

Once the app has been relaunched, you should see the updated version number in the bottom left-hand corner. 

## Update audio bookshelf via a script

You could combine these into a [bash script](https://gist.github.com/tonyedwardspz/f98edd13edd59b956341c03d42386968), allowing you to update with a single command. Save the following script as `update_audiobookshelf.sh` somewhere appropriate and give it executable permissions with: 

`chmod +x update_audiobookshelf.sh`.

You can then run the script using `./update_audiobookshelf.sh` from anywhere on the command line.

```bash
#!/bin/bash

# Navigate to the directory where your docker-compose.yml file resides
cd /path/to/your/docker-compose/directory

# Stop the running container
echo "Stopping running container..."
docker-compose down

# Pull the latest image from Docker Hub
echo "Pulling the latest image..."
docker pull ghcr.io/advplyr/audiobookshelf:latest

# Rebuild the container from the freshly updated image and relaunch. . . via overkill
# If you have anything more than a basic docker setup, be weary of this command.
echo "Rebuilding and relaunch the container..."
docker-compose up -d --remove-orphans --force-recreate --build

# Prune any outdated images
echo "Pruning outdated images..."
docker image prune -f

echo "Audiobookshelf update process completed."
```

Be sure to replace /path/to/your/docker-compose/directory with the path where your docker-compose.yml resides. If you want to confirm before an image is pruned, remove `-f` from the final docker command.

This script has plenty of room for improvement. Use it as inspiration rather than a solution.

## Summary

You now know two ways to update the Audiobookshelf server when using Docker. One by running the commands sequentially yourself and another via a script. Use either to keep your audiobookshelf server up to date for a stable, secure and feature-rich self-hosted audio book experience.



