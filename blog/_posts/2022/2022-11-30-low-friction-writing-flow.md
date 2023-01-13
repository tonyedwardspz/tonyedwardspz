---
title: Low friction writing flow
image: /assets/images/2022/nvalt-writing-pane.jpg
tag:
    - Writing Tools
    - Writing

---

Making writing as frictionless as possible is key to making it an ongoing habit for myself. Past experience shows this, especially for the early days of a new routine. To make this happen with the existing website structure in place, I’ve settled on a nice workflow. . . for me and the moment at least.

## Current workflow

### nvALT - Main editor
[nvALT Website](https://brettterpstra.com/projects/nvalt/)

I’m a distraction free kinda guy. nvALT is a distraction free writing app. It’s a mac text editor that is VERY basic. A writing pane and a things written pane. Nothing more. The entire app is driven from the search bar, which is comforting to the command line geek in us all.

There are two things I especially like about the app:

1. It does one thing. Exceptionally well.
2. It quick and responsive.

For the longest time, my favourite software has been the ones that focus on solving just one problem really well. The super quick start up time and responsiveness of the editor are second to none. . . which reminds me. . . I need to check out the Sublime Editor again. Word has an annoying lag between typing a character and it appearing on screen. Plus fonts. Who needs fonts anyway.

Importantly, its markdown first. Very handy for a JAM stack loving developer.

The only downside is that it’s Mac only. . . but that’s where our next app comes in.

### Simplenote - Secondary editor
[Simplenote website](https://simplenote.com/)

Simplenote is a similarly basic editor, but available across platforms and on the web. It also syncs with nvALT.

Simplenote is the app that I brain dump into when an idea passes by. It might be a few words, maybe a sentence of two, perhaps a point, or it could be a full blown post whilst waiting for a train. The main thing is to have an option to capture these ideas without the friction that comes with creating it in keep, copying it to docs to write up before converting it to markdown.

The quick notes I make appear in the editor in the right context when needed, and can be built upon over time.

The other benefit is it syncs. . . meaning if this Mac dies, I don’t loose everything. Two is one folks.

### VSCode

This is the next step. Copy and paste it into the VSCode workspace, after creating a new markdown post for the file.

### Push to GitHub
If you know what GitHub is, you know what I mean. If you don’t, this probably isn’t the writing workflow for you.

### Deploy to Netlify
As soon as the article is in the repository, Netlify pulls the changes, rebuilds the site and deploys the update.

### Content tweaks
Typically, I notice errors when I read them back after popping up on my RSS feed. From there, I jump straight onto github and edit the files from there.

## Future upgrades
I’d really like to add some short form posts to my site. Think twitter crossed with pocket. The flow described above is not really suitable for quick posts. I’d also like to avoid simply sucking my Mastodon posts into the website.

Tumbler on the other hand has:

- A nice app
- An accessible feed
- A platform that can be used to build an audience

In an idea world, I’d post random brain farts to tumbler which would then be pulled into the website during build. The builds can be scheduled to run a couple times a day, which would be enough for me.
