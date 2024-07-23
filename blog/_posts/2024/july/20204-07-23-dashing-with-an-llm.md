---
title: Dashing with an LLM
tag:
    - Tech Cornwall
    - Open Source
---

Last weekend, I rebuilt [Tech Cornwall's Mission to Mars](https://techcornwall.co.uk/mission-to-mars/) [dashboard](https://github.com/tonyedwardspz/mission-to-mars-dashboard). It's the web application used as part of the multi award winning work experience program to track the teams progress towards building a software application to control the robots.

As the former organiser of the Missions, as well as code gardener for this project, I get plenty of warm fuzzies when mentoring. This time out, the ancient (Bootstrap 2, jQuery 1.2 ancient) dashboard was no longer working, with a huge impact on the program. Not only because this would have an impact on the students, but it also presented an opportunity to revamp the application and try an experiment.

Co-Pilot, ChatGPT, and similar tools have become a part of my development workflow. They work ok in most instances, however I've not had the chance to properly test it out on a meaningful greenfield project. In particular, one where a client isn't paying for well engineered software, or using a framework that's either new or dramatically changed overtime. In my experience, the latter is a huge contributor to erroneous answers. A solution to a problem using React has almost certainly changed over the years, but the JavaScript solution will be the same.

The hacked together app uses long standing web tech. Nothing exciting, but everything is stable. The site uses Bootstrap and jQuery for layout and UI updates. The code to make the app work is written in vanilla JS, with no server or database sitting behind so the project can be used offline. For basic developer niceties, the website is wrapped in Jekyll. Old school web tech. . . sure. . . but it's all well documented, which gives LLMs the best chance of working well.

Importantly for the experiment, I know more than enough to build this application without an LLMs help. It's been a while since last turning to Bootstrap and jQuery in anger, and it's not my preference, but the stability (up until Bootstrap 5's release) means the knowledge accrued years ago still apply. More importantly, this knowledge means that hallucinations can be picked up via spidey-sense. Most importantly, it means the wider team can pick the project up without needing to learn a fancy framework, something that's been a limitation in previous years.

How did it go?

It was definitely quicker. 

Over two days I managed to rebuild the entire dashboard from the ground up, improve UI interactions, and extend the app with new features. I wouldn't have got this done as quickly without the help. It was certainly more flow inducing, with the hours flying by when my nose was in the editor. . . but that's often the case. It did struggle with writing the algorithm to process the data for a chart, but I suspect this was as much a problem with my prompt as it was a limitation of ChatGPT. Even then, it did help a huge amount.

Suitably impressed!

It was also nice to make [another contribution to the open source(ish) eco-system](https://tonyedwardspz.co.uk/blog/implementing-good-advice/), and to help keep the Tech Cornwall Mission to Mars education program ticking over.
