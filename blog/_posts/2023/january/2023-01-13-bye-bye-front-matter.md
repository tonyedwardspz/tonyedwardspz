---
title: Bye bye front matter
tag:
    - Jekyll
    - Web Development
    - Optimisation
    - Low Distraction Life
    - Tutorial
---

One of the things I love about the Ruby on Rails framework is its reliance on convention over configuration. Rather than having to find perfect combination of config options, following a handful of conventions will often be enough to ensure fairly smooth running.

Jekyll (the framework this blog uses) relies on a mixture of both. There are plenty of conventions to follow, but by default there is a chunk of config needed to make things work.

When creating posts, a lot of the front matter used is redundant from the point of view of an author, but are needed to get things running. The platform is setup to make adding additional post types, pages and categories as simple as possible. As a relatively simple website, none of this is really needed for this personal blog.

To make writing simpler, it was decided to trim down the required front matter by switching to a convention based mindset. At the start of this process, a new post started life as a duplicate of the most recent entry in order to have the necessary config present in each file. The front matter looked something like:

```---

layout: post
title: Writing 9 to 5
date: 2022-06-23 00:00:00 +0000
author: tonyedwardspz
category: blog
headerImage: true
image: /assets/images/2022/dexter-stare.jpg
affiliate: false
linkedin: https://www.linkedin.com/posts/tonyedwardspz_training-nationalwritingday-activity-6945720729543839744-gXCK
tag:
- Writing

---
```

In almost all instances, the following remain the same for each post:

- Layout
- Author
- Category
- headerImage

With a few items being tweaked per post:

- Title
- Date
- Tag

And some are updated/removed depending on each post:

- Image
- Affiliate
- LinkedIn

## Trimming the fat
There are five items that can be removed if we rely more heavily on convention.

### Layout
Adding the [jekyll-default-layout](https://github.com/tonyedwardspz/tonyedwardspz/commit/c294e2f8321792aab822c5a49135ebe68e2fec31) gem allows the site to use sensible defaults for layout selection, based upon the location of the post.

### Author
As a single author site, this was completely redundant. Tweaking the [post layout file](https://github.com/tonyedwardspz/tonyedwardspz/commit/26f0d45b1176e4b059935e2e96dca9481dfbd2c1) to use the site defaults allowed this to be removed, along with some duplicate content in the sites config file.

### Category
Placing the `_posts` folder [within the](https://github.com/tonyedwardspz/tonyedwardspz/commit/26f0d45b1176e4b059935e2e96dca9481dfbd2c1) `blog` folder allows Jekyll to infer the category from the folder structure.

### Header Image
This was used to check wether a header image is needed on the individual post page. When an image url string is present, the header image is always used. Changing the layout logic to depend on the presence of the string means we can remove this item.

### Date
Jekyll requires the filename for new posts to start with a date string. Whilst not necessarily true for content outside of the blog roll, moving away from that convention introduces new configuration. Dates in front matter exist to allow a more complex display of posts based on the time of posting.

[Removing date completely](https://github.com/tonyedwardspz/tonyedwardspz/commit/f5165d8be117b496040605f072ee0d8478c25a08) pushes Jekyll to use the one found in the filename. . . which is fine when there’s only one new post a day

## The outcome
With these tweaks made, the front matter for the above example gets slimmed down to:

```---

title: Writing 9 to 5
image: /assets/images/2022/dexter-stare.jpg
affiliate: false
linkedin: https://www.linkedin.com/posts/tonyedwardspz_training-nationalwritingday-activity-6945720729543839744-gXCK
tag:
    - Writing

---
```

If the post didn’t have an image, affiliate links, or started life on LinkedIn, it’d look something like:

```---
title: Writing 9 to 5
tag:
    - Writing

---
```

This is few enough items for me to be able to create a blank file each time, typing out just the couple of needed front matter entries rather than copy and pasting. This process has also created a cleaner set of markdown files, which is a very welcome bonus. Writing in markdown creates a set of portable files. Arguably, the more trim posts are, the more portable the content is.
