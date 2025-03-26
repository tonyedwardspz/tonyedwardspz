---
title: Agent vibes
tag:
    - Software Development
    - dotnet MAUI
---

The [vibe coding](https://en.wikipedia.org/wiki/Vibe_coding) hysteria is sweeping the software development work. Proponents posit that anyone can throw together quality software and ship it. Whilst partially true, you don't have to skim socials for too long before you see examples of it going wrong. It's just too easy to screw something serious up, landing with a huge cloud bill.

Whilst hesitant to be absorbed by the hype, I am fond of my co-pilot buddy and upwards nudge in productivity that comes along with it. It's not always enabled, partially due to the framework I work with day to day, but it is most of the time. There's also a bunch of people who I've met on the speaking circuit whose opinions I take seriously and talk very positively about this way of approaching development.

So I gave it a go.

For the project underneath my MIDI Birds talk, I came up against a showstopper. A few years ago, Apple's CoreMIDI api was updated but has not yet made it into the wrapper around platform apis that MAUI uses. This meant that the app could receive midi signals, allowing the games to be played but sending messages silently fails.

The result was that the pad lights used to help me press the right buttons to control the games wouldn't light up. Given I'll be delivering this talk in a dark cinema in a few months, this is less than ideal. Thankfully, MAUI provides half a solution.

[Native Library Interop](https://devblogs.microsoft.com/dotnet/native-library-interop-dotnet-maui/) offers a way to bridge the gap between native code and MAUI code. You write native code to do a thing, write a c# interface, and then interact with that interface from MAUI code. They’re quite tricky to get up and running, so it felt like the perfect thing to pit against the agent.

Starting with [the template](https://github.com/CommunityToolkit/Maui.NativeLibraryInterop/tree/main/template), and with minimal prompting, the agent mode within Cursor wrote the native code and c# interface in a few minutes. It got a couple things wrong, or rather against my intentions. . . but that's where my dev skills come in to tweak. It worked, and I managed to get the lights to come on.

It took longer to get the Interop package integrated into the app, than to write the code.

I then got the agent to extend the package to cover the needed apis for the whole app, which took another couple minutes to get right. Then to refactor the app so that it used the new library instead of the nuget I had been using.

All in all, this took a four prompts and a couple of hours to get up and running from start to finish. Sure , the structure I put in place made the refactor easy. . . even if I had done it myself.

But that's not the point.

This took a couple hours on a Sunday morning rather than a day or two. Sure, the library [I've ended up with](https://github.com/tonyedwardspz/MAUI-MIDI-Native-library-interop) is a bit of a hodgepodge, but that's due to my prompting and changing requirements.

Software development has changed, and I stand by a statement [from a post last year](https://tonyedwardspz.co.uk/blog/cursor-editor/).

> Anyone who isn’t getting really good at describing software problems in natural language today, is going to lose out tomorrow.

Patterns, architectural knowledge, and knowing how to do the critical security related setup is very soon going to be more important than deep knowledge of a language, fancy algorithms, and esoteric programming trivia. Whilst I'm not sold on the idea that anyone can build quality software, anyone can build software today.

I wouldn't be comfortable letting this style of coding loose on a client project, I am impressed enough to investigate how I can utilise agent mode in my day to day work. On focused tasks. With very close over sight.

One thing I am sure of, anyone who is starting or already in the progress of learning programming should be leveraging this type of tool and focusing on the core principles of software engineering.
