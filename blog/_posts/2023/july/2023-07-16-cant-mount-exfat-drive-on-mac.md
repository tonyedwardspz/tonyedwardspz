---
title: How to mount an un-mountable exFAT drive on Mac
tag:
    - Computers
---

When moving large libraries of content around a network, it's inevitable that an external hard drive will come into use. It's almost inevitable that you'll close the lid of your laptop without unmounting the drive and then proceed to unplug it hours later without thinking.

This can put your drive in a never ending spiral of being unusable. It won't mount. It won't repair. It won't even spin down like it usually does when sitting idle for so long. 

So what's the problem?

`fsck` was holding the drive hostage from the moment it was plugged in. A quick command from the terminal will release the drive.

`sudo pkill -f fsck`

From there, you can perform 'first aid' on the drive using Macs built in Disk Utility before mounting and carrying on with the file movement mission.

Well. . . I can at least :)
