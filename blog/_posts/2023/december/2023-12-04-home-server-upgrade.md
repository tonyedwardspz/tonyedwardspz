---
title: Upgrading the home server
tag:
    - Adventures in FOSS
    - Self Hosted
---

Building upon my previous adventures in FOSS, I've finally outgrown the [Raspberry Pi based system](https://tonyedwardspz.co.uk/blog/adventures-in-foss-the-journey-begins/) currently sitting in the corner of the living room. It's served us well (get it?), but the limitations of the platform (both horsepower and CPU architecture) are have been increasingly holding me back. 

To solve this, I've picked up a Dell Optiplex 5070 Small Form Factor (SFF) PC for a bargain price. 

This line of machine are a popular choice amongst home server enthusiasts. For good reason. The case is really well built with a screw-less design for swapping out components, parts are easy to pick up, and the machines can be upgraded with common components.

Spec wise, it trounces the Pi as is expected:

- Intel i7 9700 (8 Core, upto 4.7Ghz)
- 256GB NvMe dive
- 16 GB DDR4 ram
- DVD Writer
- A soundcard that doesn't butcher audio quality
- Loads of ports

The only thing I wish it has was hyper threading on the processor. This would make a decent difference in performance for some tasks. . . but these will be few and far between. If it's that much of a drawback, the i9 of the same gen will tick the hyperthreading box. The benefit of a 12M cache should outweigh the lack of hyperthreading in day to day use, when compared to the Pi..

Naturally, I'm already planning the first batch of upgrades:

- RAM: 16Gb > 64GB (I'll be running AI models 24/7)
- GFX: Onboard > dedicated card (I'll be running AI models 24/7)
- HDD: 4TB HDD > 4TB SDD

It's been weird stepping back into the world of Windows. Different but oddly familiar in a warm blanket way. Given I code within the Microsoft dotnet ecosystem, I'm fed up of battling tooling to create a nice dev environment on Mac. . . something that's especially difficult to do with Maui.

It does feel wrong using windows 🤮
