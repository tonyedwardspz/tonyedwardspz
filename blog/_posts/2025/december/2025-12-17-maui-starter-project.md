---
title: A MAUI example starter project
tag:
    - dotnet maui
    - software development
---

Setting a project up in the right way from day one is key to long term success. But with a myriad of different ways to achieve the same goal, it's fairly easy to go down the wrong path. Especially as a learner. This is even more true with MAUI, given how much it's changed in recent years.

Quite often example projects are created by experts in software engineering, who've internalised abstractions and know the APIs inside out. These abstractions and helper libraries might make complete sense to someone with years of experience in a field, but to a learner, they're can be plain confusing.

To AI as well.

By setting up the basics of a project, and then handing off to AI to fill in the gaps, the end result is much better and quicker to get to. With a little prompting, an AI coding assistant will scan a project and pattern match what exists already, making the right setup even more foundational and key.

At the outset of a recent vibe Mac app, I created [a boilerplate project](https://github.com/tonyedwardspz/maui-di-vm-settings-example) to act as an example of a good starting point for a .NET MAUI app to grow from. It:

- Uses view models via the community toolkit to allow for a clean separation of UI and business logic
- Sets up dependency injection for services, and consumes them in the view models
- Uses app settings to pull config from

It achieves these things in the simplest way possible, without abstracting the reader of the code from how it fits together. It also offers a great starting point to experiment with using something more fancy to achieve the same goals, and will work on any platform if you alter the platform identifiers.

Hopefully you'll find it useful on your MAUI journey.

[https://github.com/tonyedwardspz/maui-di-vm-settings-example](https://github.com/tonyedwardspz/maui-di-vm-settings-example)
