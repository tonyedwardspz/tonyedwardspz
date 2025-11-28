# My blog

The project files for my little corner of the internet.


## Run

bundle exec jekyll serve --config _config.yml,_config-dev.yml

## Setup

1. :star: to the project. :metal:
2. Fork the project
3. Edit `_config.yml` with your data
4. Write some posts :bowtie:

If you want to test locally on your machine, do the following steps also:

1. Install [Jekyll](http://jekyllrb.com), [NodeJS](https://nodejs.org/) and [Bundler](http://bundler.io/).
2. Clone the forked repo on your machine
3. Enter the cloned folder via terminal and run `bundle install`
4. Then run `bundle exec jekyll serve --config _config.yml,_config-dev.yml`
5. Open it in your browser: `http://localhost:4000`
6. Test your app with `bundle exec htmlproofer ./_site`

## Settings

Play around with `_config.yml`.

## Blog Post Frontmatter Reference

This section documents the frontmatter fields used in blog posts. This is helpful for agentic development.

### Frontmatter Fields

- `title:` - Required. The title of the blog post.
- `tag:` - Required. Can be a single tag or a list of tags (YAML list format).
- `image:` - Optional. Path to a featured image for the post.
- `youtube:` - Optional. YouTube video ID or full URL for embedded videos.
- `linkedin:` - Optional. LinkedIn post URL for cross-posting references.
- `reddit:` - Optional. Reddit post URL for cross-posting references.

### Example Frontmatter

```yaml
---
title: Sample Post - Frontmatter Reference
tag:
    - Example
    - Reference
    - Documentation
image: /assets/images/2025/sample.jpg
youtube: dQw4w9WgXcQ
linkedin: https://www.linkedin.com/posts/example
reddit: https://www.reddit.com/r/example/comments/example
---
```

**Note:** Jekyll takes the post date from the filename (format: `YYYY-MM-DD-title.md`).

---

Original Theme built by [Sérgio Kopplin](https://github.com/sergiokopplin/indigo).

[MIT](http://kopplin.mit-license.org/) License © Sérgio Kopplin
