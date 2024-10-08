---
title: MAUI - Failed to load native whisper library
tag:
    - dotnet MAUI
---

This week, I've been playing around with OpenAI's Whisper running on my local machine. The project I'm hoping to slot this into is a .NET MAUI app, but as a proof of concept I'm starting with a script. To make this a little more straightforward, I'm using [Whisper.net](https://github.com/sandrohanea/whisper.net) (1.5.0 at time of writing), a wrapper around the Whisper.cpp project.

During setup, I kept getting the error:

> Failed to load native whisper library. Error: Unknown error

Mysterious! All dependencies for Whisper were installed and the models in the right place. But something was up. As it turned out, I needed to prod whisper to produce a new model for Macs arm64 runtime, dropping it into the project. Here's how I did it on a Mac.

Install the Whisper.net, and Whisper.net.runtimes packages into your project by updating the .csproj

```XML
<PackageReference Include="Whisper.net" Version="1.5.0" />
<PackageReference Include="Whisper.net.Runtime.CoreML" Version="1.5.0" />
```

In theory, this should work at this point. Unfortunately, theory is often not right when you're rocking an Apple M-Series chip. To rebuild the required Whisper magic for the right runtime, you first need to clone the Whisper.net repository to somewhere convenient on your machine.

`git clone git@github.com:sandrohanea/whisper.net.git'

After a little poking at the make file, I noticed that the Whisper.cpp folder was empty although the repository referenced a specific commit on the main Whisper.cpp project. To fill our folder, clone the Whisper.cpp project, linked to from the whisper.net repository, into this folder. Because whisper.net releases are pegged to Whisper itself, we need to reset the repository to the correct commit.

```bash
cd whisper.net
git clone https://github.com/ggerganov/whisper.cpp.git
cd whisper.cpp
git reset hard 447d495
```

Note:  the commit (447d495 ) will be different if you're using a different version.

Cd-ing back out to the main whisper.net folder, you'll now be able to build the needed `.dylib` folder. Find and open the Makefile, and look for the Apple command. These are the series of tasks that will execute when we run:

`make apple`

If like me, you're only after one runtime (amd64 in this case), you can add another make command for just the architecture needed

` apple_arm: copy_metal macos_arm64`

With the needed .dylib created, find it within the build folder and replace the matching one within your project. With that done, you should now be able to load the whisper library in your dotnet MAUI codebase.

Happy days.
