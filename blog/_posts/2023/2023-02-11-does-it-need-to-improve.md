---
title: Does it need to improve?
tag:
    - Web Development
    - Jekyll
---

A recent conversation about static site generators (SSG) left me pondering. Do things always need to improve?

For reasons I won't go into here, Jekyll had a few fallow years before the community took up the task of developing it more recently. But today, development is slowly but surely picking up. Commits to the project are happening regularly, and the plans for the next minor version have been released, with talk already on going about the versions beyond.

The argument presented to me was, "Jekyll's not going anywhere. Might as well work with something that is."

A sound argument on the face of it. Taking the value of skill acquisition and employability out of the equation, I'm not entirely sure it stacks up for several reasons.

## Security

Security is one of the main reasons to constantly update a development toolchain. Issues are found, patches are developed, and a new version is released. Jekyll is the same in this regard. . . to some extent.

But Jekyll is a static site generator. The end user is served HTML, CSS and JS. Apart from a few browser-based vulnerabilities which apply to any website, there is not a lot a hacker could take advantage of. . . even if you left the tool to get out of date.

Netlify builds the site and deploys the generated pages. Nothing is running on the server to be hacked, and Netlify will keep NGINX up to date on my behalf.

## Feature completeness

For the most part, Jekyll is feature complete. It produces websites with everything one needs, assuming SSGs are the right way to go for the project in hand. The plugin ecosystem has everything you need covered. The documentation is well refined and easy for newbies and oldies alike to get what they need.

Seriously. What needs to change? Where is there for it to go?

## Speed

Jekyll's build times are orders of magnitude larger than other comparable tools. This site (which is Jekyll based) takes ~12 seconds to build from a cold start. Build time is about a quarter of that during a dev session. [Another site I've been creating recently](https://tonyedwardspz.co.uk/blog/hugo-is-nice/) is comparable in size and complexity, based on Hugo. It builds in 25ms. Which is astonishingly fast. 

But is a handful of seconds longer really that much of an issue? Does it even matter? How many 3-second re-builds need to be endured before it's worth spending days converting a site?

If you build lots of SSG sites, that time might be well spent. Same if you want to learn some new skills. But if you're going to bang out projects quickly, developer efficiency will always trump build efficiency. . . at the scale we're discussing here.

## Biases

Developers who use Jekyll, generally speaking, love it. This includes the developer I had a conversation with about SSGs. The fallow period caused them to look at other alternatives. And rightly so. But the opinions developed during that time don't automatically stack up, and they may even be falling fowl of a few biases.

These biases might not fit perfectly at a glance, but at least a hint is present (on both sides of the conversation), along with a handful of others not mentioned here.

- [Confirmation bias](https://en.wikipedia.org/wiki/Confirmation_bias)
- [Sammelweis reflex](https://en.wikipedia.org/wiki/Semmelweis_reflex) Very similar to the above, but from a different perspective.
- [Pro-innovation](https://en.wikipedia.org/wiki/Pro-innovation_bias)

Of course, biases go both ways. My opinion around this is shaped by more than a few of my own, including those mentioned above.

The difference?

I'm actively pushing back against the biases that shape my opinion. 

It's essential to do so. Dismissing others' opinions without proper evaluation of your own is easy to do. Particularly when new minds in the tech industry are listening in on the conversation.

Of course, I may just be an SSG [laggard](https://www.interaction-design.org/literature/article/understanding-early-adopters-and-customer-adoption-patterns)!
