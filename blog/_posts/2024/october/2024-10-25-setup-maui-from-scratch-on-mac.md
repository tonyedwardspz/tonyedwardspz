---
title: "Setup Maui from Scratch on Mac"
tags:
    - dotnet MAUI
---

In recent weeks, I've had to nuke my MacBook and setup my MAUI developer environment from scratch. All though the individual steps aren't stepped through here, this should be enough to get you up and running with the help of a little searching.

These steps allowed me to set up a cross platform development environment, which uses the latest MAUI version. For more details, [check the docs](https://learn.microsoft.com/en-us/dotnet/maui/get-started/installation) for the most up to date required versions of everything. 

Xcode, in particular, can be a pain if it has just had an update. Speaking of which. . . 
### Xcode

Install the latest (or desired) Xcode from the app store. Alternatively, this might be the perfect moment to start using [Xcodes](https://www.xcodes.app/) to allow easy switching between versions. You'll be grateful you did one day!

Once installed, open Xcode and install the relevant platforms, plus the command line tools, from the pop up displayed on first install.

Allow Xcode to download the iOS simulator.

Turn off auto updates for the app store. Turn off auto updates for the Mac OS apart from security ones. Be sure to update as regularly as possible.
### Android Studio

Install the latest [Android Studio](https://developer.android.com/studio). Technically, you can go without the IDE and choose just the various command line tools. . . but this has proved to be nothing but a headache for me each time I've tried.

Install the Android SDK tools by clicking the "More actions" dropdown from the welcome screen. 

Optionally, install any additional Android runtimes that you need from this same screen.
### .NET

Install the latest (or desired) [.NET sdk](https://dotnet.microsoft.com/en-us/download). A lot of MAUI setup problems come from having the wrong runtime installed (x64 instead of Apple silicon). Download the right one from the website, rather than using a package manager to sidestep this potential problem.

Install the MAUI workload from the command line. From the docs:

To install .NET MAUI with Android, iOS, macOS, and all other SDKs:

```console
$ dotnet workload install maui
```

There are also targeted workload manifests for mobile and desktop only:

```console
$ dotnet workload install maui-desktop
$ dotnet workload install maui-mobile
```

Optionally, for more granular control you can install platform SDKs individually:

```console
$ dotnet workload install microsoft-android-sdk-full
$ dotnet workload install microsoft-ios-sdk-full
$ dotnet workload install microsoft-maccatalyst-sdk-full
$ dotnet workload install microsoft-macos-sdk-full
$ dotnet workload install microsoft-tvos-sdk-full
```

Install the [Microsoft build of OpenJDK](https://learn.microsoft.com/en-gb/java/openjdk/download). At the moment, version 17 is the one compatible with the .NET / MAUI combo, but [check the docs](https://learn.microsoft.com/en-us/dotnet/maui/get-started/installation) for which one to get currently.
### Development environment

Install your development tool of choice. In my case, I use both [Cursor](https://www.cursor.com/) and [Rider](https://www.jetbrains.com/lp/rider-maui/) for crafting cross platform apps using the MAUI framework. I recommend both of these wholeheartedly.
### Next steps

With all of this installed, and yes. . . that's 4 IDE's, you should be good to do some MAUI development. Chances are that both Rider and Cursor will need some setting up to get just right, but you're on your own with that!

Happy coding.