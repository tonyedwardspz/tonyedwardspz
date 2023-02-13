---
title: Does it need to improve?
tag:
    - Web Development
    - Jekyll
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

Jekyll's build times are orders of magnitude larger than other comparable tools. This site (which is Jekyll based) takes ~12 seconds to build from a cold start. Build time is about a quarter that during a dev session. [Another site I've been building recently](https://tonyedwardspz.co.uk/blog/hugo-is-nice/), based on Hugo, is comparable in size and complexity. It builds in 25ms. Which is astonishingly fast. 

But is a handful of seconds longer really that much of an issue? Does it even matter? How many 3 second re-builds need to be endured before it's worth spending days converting a site?

If you build lot's of SSG sites, that time might be well spent. Same if you want to learn some new skills. But if you just want to bang out projects quickly, developer efficiency will always trump build efficiency. . . at the scale we're discussing here.

## Biases

Developers who use Jekyll, generally speaking, love it. This includes the developer I had a conversation with about SSGs. The fallow period caused them to look at other alternatives. And rightly so. But the opinions developed during that time don't automatically stack up, and they may even be falling fowl of a few biases.

These biases might not fit perfectly at a glance, but I'd argue there is at least a hint of them present (on both sides of the conversation), along with a handful of others not mentioned here.

- [Confirmation bias](https://en.wikipedia.org/wiki/Confirmation_bias)
- [Sammelweis reflex](https://en.wikipedia.org/wiki/Semmelweis_reflex) Very similar to the above, but from a different perspective.
- [Pro-innovation](https://en.wikipedia.org/wiki/Pro-innovation_bias)

Of course, biases go both ways. I'm well aware that my opinion around this is shaped by more than a few of my own, including those mentioned above.

The difference?

I'm actively pushing back against the biases that shape my opinion. 

I feel it's important to do so. Dismissing others opinions without proper evaluation of your own is easy to do. Particularly when there are new minds to the tech industry listening in on the conversation.

Of course, I may just be an SSG [laggard](https://www.interaction-design.org/literature/article/understanding-early-adopters-and-customer-adoption-patterns)!
