---
title: Pre-heating the Pi
image: /assets/images/2023/raspberry-pi-in-argon-one-case.jpg
tag:
    - Adventures in FOSS
    - Self-hosting
affiliate: true
---

To host all of the FOSS things, this little Pi is going to be sitting quietly in the corner of the living room for the foreseeable. To do that, we need to tinker with getting the software setup.

The following setup is working in a Pi 4 well for an internal network facing server. Be sure to do a full update, backup and cross your fingers before starting. This is also a good moment to check the settings on your router. Be sure your firewall is switched on. Many would recommend [switching off UPnP](https://nordvpn.com/blog/what-is-upnp/) to make your network a tad bit more secure, however prepare for the potential inconvenience.

## Change the default password

If you've not yet done so, [change the default password](https://www.raspberrypi-spy.co.uk/2012/10/how-to-change-raspberry-pi-password/).

## Boot into the command line.

For this project, my preference is to do as much as possible via the command line. [Changing a few settings](https://www.digikey.co.uk/en/maker/blogs/2018/how-to-boot-to-command-line-and-ssh-on-raspberry-pi) in the boot config will make device launch directly into the command line.

You can always run the command `startx` to load the GUI interface.

## Disable bluetooth and wifi

You might want to skip this one. For our setup, wifi and bluetooth aren't used and disabling them will reduce power draw by ~45mA. Disabling LAN would save double that, but not having the extra radio waves bouncing around can't be a bad idea.

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

The processor is going to be idling a lot of the time, but a snappy response would be nice in the heat of the moment. Because the [Argon ONE] case both actively and passively cools the CPU, a healthy dose of overclocking is achievable.

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

## Auto mount the hard drive

By default, hard drives aren't always automatically mounted when using the Pi OS. Controlling mounting will allow our docker containers (more on that in future posts) to reach our filesystem to find media. [Here's some instructions](https://pimylifeup.com/raspberry-pi-mount-usb-drive/).

### Set a static IP for the Pi

This will make so many things so much easier by allowing you to always find the server at the same IP address. [Here's the instructions](https://www.makeuseof.com/raspberry-pi-set-static-ip/).

## Setup the Firewall

If your device is connected to the internet, you'll need a firewall. [UFW] is a straightforward option, but there are plenty of others. Install it via

```bash
sudo apt install ufw
```

If you want to access the web, you'll probably want to allow a couple of ports.

```bash
sudo ufw allow 80
sudo ufw allow 443
```

Then enable the application

```bash
sudo ufw enable
```

We'll add some more shortly, but there's plenty of options to play with [in the docs.](https://help.ubuntu.com/community/UFW)

## Setup SSH

For the moment, the intention is to keep this as an internal facing service. This means SSH access can be limited to the home network.. Edit / create a local ssh config file via:

```bash
sudo nano /etc/ssh/sshd_config.d/local_network_only.conf
```

The separate file to the rest of the config prevents conflicts when upgrading your pi. Add the following to the file. If you're on a fresh installation, it will likely be a new file.

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

This disables authentication completely, then re-enabling it for a specific user on the internal network only.

We should now grant access to SSH to specific IP addresses.

```
sudo ufw allow from 192.168.1.71 to any port 22
```

You'll need to repeat this with any device / app you want to SSH in via, once you've enabled SSH.

```bash
sudo systemctl enable ssh
sudo systemctl start ssh
```

Terminal is perfectly adequate from a Mac, and [Termius](https://play.google.com/store/apps/details?id=com.server.auditor.ssh.client&hl=en&gl=US) is nice for Android.

Done.
