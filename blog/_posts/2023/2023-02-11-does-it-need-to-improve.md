---
title: Does it need to improve?
tag:
    - Web Development
---

A recent conversation about static site generators (SSG) left me pondering. Do things always need to improve?

Jekyll, for reasons I won't go into here, had a few fallow years before the community started to take up the task of developing it. But today, development is slowly but surely picking up. Commits to the project are happening relatively regularly, and the plans for the next minor version have been released with talk already on going about the versions beyond.

The argument presented to me was "Jekyll's not going anywhere. Might as well work with something that is."

A sound argument on the face of it. Taking the value of skill acquisition and employability out of the equation, I'm not entirely sure it stacks up for a handful of reasons.

## Security

One of the main reasons to always be updating a development tool chain is security. Issues are found, patches are developed and a new version released. Jekyll is no different in this regard to some extent.

But Jekyll is a static site generator. The end user is served HTML, CSS and JS. Apart from a few browser based vulnerabilities which applies to any website, there is not a lot a hacker could take advantage of. . . even if you left the tool to get out of date.

Netlify builds the site and deploys the generated pages. There's nothing running on the server to be hacked, and I'm fairly sure Netlify keep nginx up to date on my behalf.

## Feature completeness

For the most part, Jekyll is feature complete. It produces websites with everything one needs, assuming SSGs are the right way to go for the project in hand. The plugin ecosystem has pretty much anything you might need covered. The documentation is well refined and easy for newbies and oldies alike to get what they need from it.

Seriously. What needs to change? Where is there for it to go?

## Speed

Jekyll's build times are orders of magnitude larger than other comparable tools. This site (which is Jekyll based) takes ~12 seconds to build from a cold start. Build time is about a quarter that during a dev session. Another site I've been building recently, based on Hugo, is comparable in size and complexity. It builds in 25ms. Which is astonishingly fast. 

But is a handful of seconds longer really that much of an issue? Does it even matter? How many 3 second re-builds need to be endured before it's worth spending days converting a site?

If you build lot's of SSG sites, that time might be well spent. Same if you want to learn some new skills. But if you just want to bang out projects quickly, developer efficiency will always trump build efficiency. . . at the scale we're discussing here.

## Biases

Developers who use Jekyll, generally speaking, love it. This includes the developer I had a conversation with about SSGs. The fallow period caused them to look at other alternatives. And rightly so. But the opinions developed during that time don't automatically stack up, and they may even be falling fowl of a few biases.

These biases might not fit perfectly at a glance, but I'd argue there is at least a hint of them present (on both sides of the conversation), along with a handful of others not mentioned here.

### Confirmation Bias

> Confirmation bias is the tendency to search for, interpret, favour, and recall information in a way that confirms or supports one's prior beliefs or values.
- [source](https://en.wikipedia.org/wiki/Confirmation_bias)

In this instance, we could say:

"I've already decided Jekyll is dead. Despite new evidence to the contrary, I'm only interested in information that supports my existing opinion, so I'll dismiss the new evidence out of hand without realising I'm doing so."

Somehow, they forget to recall the new information when stating their opinion. We all fall prey to this one (and all the others) on a nearly day-to-day basis.

### Sammelweis reflex

> The Semmelweis reflex or "Semmelweis effect" is a metaphor for the reflex-like tendency to reject new evidence or new knowledge because it contradicts established norms, beliefs, or paradigms.
- [source](https://en.wikipedia.org/wiki/Semmelweis_reflex)

The new evidence, in this instance, is the community drive to improve Jekyll that is ongoing, including improvements that have vastly improved development build times. This "evidence" has been rejected without much thought or investigation, primarily because they have an existing belief.

### Pro-innovation

> Pro-innovation bias is the belief that an innovation should be adopted by whole society. The innovation's "champion" has such strong bias in favour of the innovation, that they may not see its limitations or weaknesses and continue to promote it nonetheless.
- [source](https://en.wikipedia.org/wiki/Pro-innovation_bias)

AKA, there is a shiny new thing that everyone should use for everything. Society, in this instance, is the developer community.

We see it time and time again, particularly in the front end developer world, and are currently living through the AI version of the same. ChatGPT can be used for everything!

## My biases

Of course, biases go both ways. I'm well aware that my opinion around this is shaped by more than a few of my own.

The difference?

I'm actively pushing back against the biases that shape my opinion. 

I feel it's important to do so. Dismissing others opinions without proper evaluation of your own is easy to do. Particularly, when there are new minds to the tech industry listening in on the conversation.
