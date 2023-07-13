---
title: Updating mounted external drive permissions to allow sshd and rsync
tag:
    - Adventures in FOSS
    - Self-hosting
image: /assets/images/2023/fstab-before.jpg
---

When trying to copy files via SCP or rsync to a mounted external drive connected to our Raspberry Pi server, I keep getting a `permission denied (13)` error. In neither instance did the verbose flag provide anything of use. Both options use SSH under the hood, but this likely is fine, given that files have successfully been copied elsewhere. 

This error is due to the read/write/execute permissions associated with the drive in some way. Perfect, lets `chmod` our way out of it.

`sudo chmod ug+rwx /mnt/media/Ebooks`

Nope. The permissions remained the same, despite requesting appropriate access to the folder and receiving no error messages.

This error could also be caused by improper owner:group privileges setup. Let's try a little `chown` magic.

`sudo chown -R our-pi:our-pi /mnt/media/Ebooks`

Still nope. The ownership didn't change either. Hmmm. The permissions must be enforced from somewhere else in the system. As this is an external drive, we opted to auto-mount the HDD at boot time using fstab. Doing so gave us a consistent location to reach into from our apps and containers.

Bingo.

Digging into the docs, it's discovered that the settings were perfect for streaming over the network from the drive and writing to it from the pi itself. Adding more config to the fstab file allows us to be more prescriptive with permissions. Return to the command line and enter the following:

`sudo nano /etc/fstab`

You should see something like this. The final entry in the list is the drive in question.

![Fstab on raspberry pi](/assets/images/2023/fstab-before.jpg "Screenshot of fstab file on linux"){:loading="lazy"}

Adding the following settings to the [permissions column](https://linuxroutes.com/linux-fstab/) for the drive in question should do the trick!

`fmask=133,dmask=022,uid=1000,gid=1000`

![Fstab on raspberry pi](/assets/images/2023/fstab-after.jpg "Screenshot of fstab file on linux"){:loading="lazy"}

Boom. It does. Let's break that down.

The fmask option sets the permissions for files. It's an octal value which is subtracted from the full access permissions. 133 in octal corresponds to the permissions 644, which translates to rw-r--r--. This means that files will be readable and writable by the owner but only readable by the group and others.

The dmask option sets the permissions for directories. Like fmask, it's an octal value subtracted from the full access permissions. 022 converts to 755, which translates to rwxr-xr-x. This means that directories will be readable, writable, and accessible by the owner but only readable and accessible by the group and others.

The uid and gid options set the owner and group for the files and directories in the mounted filesystem. In both cases, 1000 corresponds to the user and group used to SSH in with.

After adding them, you should end up with something like this in your fstab file.
