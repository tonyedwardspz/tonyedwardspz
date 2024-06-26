---
title: Pre-heating the Pi
image: /assets/images/2023/raspberry-pi-in-argon-one-case.jpg
tag:
    - Adventures in FOSS
    - Self Hosted
affiliate: true
---

To host [all of the FOSS things](https://tonyedwardspz.co.uk/blog/adventures-in-foss-the-journey-begins/), this little Pi is going to be sitting quietly in the corner of the living room for the foreseeable. To do that, we need to tinker with getting the software setup.

The following setup is working well on a Pi 4 well as a foundation for an internal network facing server with an internet connection. Be sure to do a full update, backup and cross your fingers before starting. This is also a good moment to check the settings on your router. Be sure your firewall is switched on. Many would recommend [switching off UPnP](https://nordvpn.com/blog/what-is-upnp/) to make your network a tad bit more secure, however prepare for the potential inconvenience.

## Use the 64bit OS

If you haven't already, go back and install the 64-bit OS variant onto your SD card rather than the 32-bit option. As soon as you need anything machine learning related (i.e. tagging faces in photos), you'll wish you did.

## Change the default username and password

Default usernames and passwords are never, ever a good idea. [Here's](https://thepihut.com/blogs/raspberry-pi-tutorials/how-to-change-the-default-account-username-and-password) how to change your default user credentials if it still exists after setup.

## Boot into the command line.

For this project, my preference is to do as much as possible via the command line. [Changing a few settings](https://www.digikey.co.uk/en/maker/blogs/2018/how-to-boot-to-command-line-and-ssh-on-raspberry-pi) in the boot config will make device launch directly into the command line.

You can always run the command `startx` to load the GUI interface.

## Disable bluetooth and wifi

You might want to skip this one. For our setup, WiFi and Bluetooth aren't used and disabling them will reduce power draw by ~45mA. Disabling LAN would save double that, but not having the extra radio waves bouncing around can't be a bad idea.

In the terminal, run

```bash
sudo nano /boot/config.txt
```

and add the following to the bottom of the file.

```bash
##turn on/ off bluetooth
dtoverlay=disable-bt

##turn on/off wifi
dtoverlay=disable-wifi
```

While you're there, you might as well turn off the onboard LEDs.

```bash
# Turn off onboard LED's
dtparam=act_led_trigger=none
dtparam=act_led_activelow=on
```

## Overclock the processor

The processor is going to be idling a lot of the time, but a snappy response would be nice in the heat of the moment. Because the [Argon ONE](https://amzn.to/3JKj8yP) case both actively and passively cools the CPU, a healthy dose of overclocking is achievable.

```bash
sudo nano /boot/config
```

and add the following lines.

```bash
#uncomment to overclock the arm. 700 MHz is the default.
arm_freq=2000
over_voltage=6
```

This gives a noticeable 30% boost in peek processing power, without pushing too far and compromising stability. If your Pi is not properly cooled, do not overclock. You can easily brick your device.

## Reduce writes to the SD card

SD cards are not designed for the intensity of usage generated by a Raspberry Pi setup. With this configuration intended to run day in and day out, anything above a year's use from a decent SD card is gifted time. Longer term, the plan is to boot from a small-capacity SSD.

In the meantime, we can reduce the number of writes to the card by logging to RAM rather than directly to the SD card, dumping to disk a few times a day rather than every few seconds.

The instructions are straight forward and [available here](https://pimylifeup.com/raspberry-pi-log2ram/).

## Auto mount the hard drive

By default, external hard drives aren't automatically mounted when using the Pi OS. Controlling mounting will allow our docker containers (more on that in future posts) to reach our filesystem to find media. [Here's some instructions](https://pimylifeup.com/raspberry-pi-mount-usb-drive/).

### Set a static IP for the Pi

This will make so many things so much easier by allowing you to always find the server at the same IP address. [Here's the instructions](https://www.makeuseof.com/raspberry-pi-set-static-ip/).

## Setup the Firewall

If your device is connected to the internet, you'll need a firewall. [UFW] is a straightforward option, but there are plenty of others. Install it via

```bash
sudo apt install ufw
```

Let's set up our firewall to have sensible, secure defaults to begin with.

```bash
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw limit ssh
sudo ufw allow HTTP
sudo ufw allow https
sudo ufw logging on
```

We can then layer application specific rules on top. If you want to access the web, you'll probably want to allow a couple of ports.

```bash
sudo ufw allow 80
sudo ufw allow 443
```

There is some duplication in the rules above, but UFW will sort that out. Then we can enable the application

```bash
sudo ufw enable
```

We'll add some more shas we setup other software, but there's plenty of options to play with [in the docs](https://help.ubuntu.com/community/UFW) if you want to get ahead of class.

## Install Fail2ban

Fail2ban complements UFW almost as an extension of its `limit` rules. Fail2Ban "scans log files and bans IPs showing potentially malicious behaviour, e.g. too many password failures, seeking exploits and similar". It comes with sensible defaults, although I opted to decrease the number of failed attempts before a ban is implemented and increase the length of the ban.

You'll find the instructions [here](https://pimylifeup.com/raspberry-pi-fail2ban/).

## IP4 filtering

Buried in the Raspberry Pi system config are settings that enhance security at a relatively low level. Switching on this filtering improves the robustness of the Pi to attack and is one of the simplest ways to enhance the network security of the device.

To enable this functionality, open up the `sysctl.conf file:

`sudo nano /etc/sysctl.conf`

and uncomment the following lines in the file:

```bash
net.ipv4.conf.all.rp_filter=1
net.ipv4.conf.all.accept_redirects = 0
net.ipv6.conf.all.accept_redirects = 0
net.ipv4.conf.all.send_redirects = 0
net.ipv4.conf.all.accept_source_route = 0
net.ipv6.conf.all.accept_source_route = 0
```

## Setup SSH

For the moment, the intention is to keep this as an internal facing service. This means SSH access can be limited to the home network. Edit / create a local ssh config file via:

```bash
sudo nano /etc/ssh/sshd_config.d/local_network_only.conf
```

The separate file to the rest of the config prevents conflicts when upgrading your Pi. If you're on a fresh installation, it will likely be a new file. Add the following to the file. 

```bash
# Disable all auth by default
PasswordAuthentication no
PubkeyAuthentication no

# Allow auth from local network
Match Address  192.168.1.*
    PubkeyAuthentication yes
    PasswordAuthentication yes
    AllowUsers tony
```

This disables authentication completely, then re-enabling it for a specific user on the internal network only. Note that the password authentication will get switched off totally once the server is operating as intended.

We should now grant access to SSH to specific IP addresses.

```
sudo ufw allow from 192.168.1.71 to any port 22
```

You'll need to repeat this with any device / app you want to SSH in via, once you've enabled SSH.

```bash
sudo systemctl enable ssh
sudo systemctl start ssh
```

Terminal is perfectly adequate from a Mac, and [Termius](https://play.google.com/store/apps/details?id=com.server.auditor.ssh.client&hl=en&gl=US) is a nice option for Android.

## Use a European time server

As a European, I like to get my time from somewhere in Europe. By default, it's only a tiny transatlantic request, but it does not need to be made. Plus, we get dates right on this side of the pond.

Open up the relevant config file:

`sudo nano /etc/systemd/timesyncd.conf`

Change (or add) the lines below:

```bash
[Time]
NTP=0.europe.pool.ntp.org 1.europe.pool.ntp.org 2.europe.pool.ntp.org 3.europe.pool.ntp.org
#FallbackNTP=0.debian.pool.ntp.org 1.debian.pool.ntp.org 2.debian.pool.ntp.org 3.debian.pool.ntp.org
```

Done.
