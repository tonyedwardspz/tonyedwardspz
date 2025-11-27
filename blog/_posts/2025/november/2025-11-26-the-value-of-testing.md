---
title: The value of user testing
tag:
    - software development
    - user experience
image: /assets/images/2025/testing-user1.jpg
---

At work, the project I head up is entering its final phase of development before release. To make sure that we're making guests life easier, I've hosted a user testing session in recent days. The results are surprisingly unsurprising. Bugs have been flagged up, paths through the app were broken, and features were not used as expected. 

It was enlightening!

Whilst we're well past the prototyping phase, the [Designing UX: Prototyping](https://www.sitepoint.com/premium/books/designing-ux-prototyping/) book by [Dan Goodwin](https://bsky.app/profile/bouncingdan.bsky.social) and Ben has been super useful in setting up this activity. It pushed me into the right mindset for testing in a high fidelity context, giving a great framework for asking the right questions and setting the right tasks for users to work though. Although some of the tooling in the book in out dated, the concepts are solid and will never not be relevant. It's also a super easy read, and pairs up well with lessons withing 'The Mum Test'. Both are highly recommended if you're about to perform this type of task.

![Designing UX: Prototyping book](/assets/images/2025/testing-book.jpg "Designing UX: Prototyping"){:loading="lazy"}

On the day, test users were provided with four groups of related tasks, the kind of things that guest will over the lifecycle of their stay. Feedback was gathered via both a form and conversation, plus observational notes to pair with screen and audio recordings. The perspective afforded by looking over a shoulder instead of testing yourself allows different elements of the product to jump out. E.g, 

- I never miss the hit box to open the account edit screen, but every single tester did.
- Users consistently look for X as part of the search interface.
- I think feature X is complete, but the people from within the brand think Y and Z are missing from it.

![Testing MAUI apps with users](/assets/images/2025/testing-user2.jpg "Testing MAUI apps with users"){:loading="lazy"}

Talking with frontline staff, those on the end of the phone during both the booking process and during the stay, uncovered a bunch of easy wins for the product.

- "20% of our calls are about X"
- "Our life would be easier if guests had Y when they called up"
- "99% of guests only have one booking at a time"

The process also threw me back to a conversation at the [Product Task meetup in Köln](https://tonyedwardspz.co.uk/blog/product-tank-cologne/). I was talking about testing with a fellow attendee, with the conversation continuing afterwards digitally. I highlighted that my test group will come from within the company. It was suggested that they'd use the product differently to actual guests due to institutional knowledge, whilst I exibited an undeserved level of hubris that they wouldn't. 

Surprise surprise. . . they did.

One of the tasks was to navigate to a booked property, effectivly the stay starting tomorrow. Everyone within the business checked to see if the textual directions were present in the app. Everyone outside of the business simply clicked the map to start navigation within their maps app. This really highlighted how institutional knowledge affects the was a user performs a task. Martin. You were right. . . but only one of us knew that at the time! To paraphrase Tim Herberg, the speaker on the night:

> Gut feeling has a place in the discovery process. It can inform the direction in the early days, but should quickly be backed up or discarded due to data.

Unfortunatly, I'd forgotten that point in the sime since and neglected to get the data to back up my assumptions.

Overall this was an enlightening process, and one that reminded me of the value that the rapid feedback loop that often comes with an agile-esque development process. Whilst some of the things that were flagged up are solid suggestions, there's not really enough time to both polish what exists and introduce the refined features before launch day. 

Lesson learned.

This was a fun and very useful process to go through as a product developer. I'm now sitting on a pile of actionable feedback, insights from different levels of the business, and even a few ideas that can help make the wider teams life easier via minimal changes to existing products or a quickly vibed prototype.

Oh. . . and biscuits. We ate a lot of biscuits.
