---
title: Home server power consumption
tag:
    - Self Hosted
    - FOSS
image: /assets/images/2023/power-plug.jpg
---


Reducing the number of subscriptions the household uses has been one of the drivers of moving to a self-hosted media server. I touched on the potential savings in the [opening post](https://tonyedwardspz.co.uk/blog/adventures-in-foss-the-journey-begins) and promised to [loop back in the review](https://tonyedwardspz.co.uk/blog/post-foss-switch).

The results are in, and it’s time to do the math. For a baseline, I measured the 24hr power consumption over five days.

| Day    | Consumption (kWh) |
|———|———|
| Day 1 | 0.219 |
| Day 2 | 0.200 |
| Day 3 | 0.133 |
| Day 4 | 0.222 |
| Day 5 | 0.187 |
| Total  | 0.916 |

These days were pretty typical usage-wise. After adding a few new audiobooks and albums, plus backing up photos from my phone, there was some light indexing. Beyond that. . . usual consumption patterns. The server was completely switched off as we were out of the house for a couple of days. There is no point in running a local-only server when no one is on the network.

This gives an average daily power usage of 0.1922kWh

Our energy provider charges 28.149p per kWh.

Over a week, the home server will cost 37.87p. Per month, this equates to £1.64. . . which is significantly less than the [£2.50 initially predicted](https://tonyedwardspz.co.uk/blog/adventures-in-foss-the-journey-begins/#the-hardware).

## Potential savings

Looking at the setup, far more power is being drawn than might be otherwise. We’re using a powered dock to accommodate older platter-based drives. I suspected this would consume a more significant chunk of power than the pi itself.

So I also measured that, clocking the HDD as using 0.143  24 hours. That’s more than half of the power consumed!

The Pi clocked in using .073 kWh over a 24hr period, which pairs up with the HDD drives.

None of these figures are ridiculous, but they are worth considering. For the sake of argument, our platter-based drive is responsible for 80p a month of electricity. Even if that drops to zero by swapping in an SSD drive, it’ll take decades to recoup the hardware cost.