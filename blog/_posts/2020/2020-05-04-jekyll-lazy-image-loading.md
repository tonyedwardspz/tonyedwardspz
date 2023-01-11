---
title: Adding lazy loading to images in Jekyll
date: 2020-05-04 00:00:00 +0000
 
headerImage: false
tag:
- Jekyll
- Web Performance
- Lazy Loading Images

---
Lazy loading images is a quick and simple way to add a little extra performance to your sites by reducing the amount of data sent of the wire to the user. Many browsers now include basic lazy loading out of the box, meaning you no longer need to include any Javascript to do this.

To achieve this, you simple add the relevant attribute to your image tags. Adding the height and width helps to prevent any reflow as a result of loading images at a later date.

```html
<img src="image.png" loading="lazy" alt="…" width="200" height="200">
```

I've been slowly adding this to projects as they've been updated in recent months. The most recent of which is a Jekyll blog. Jekyll uses markdown files as the source for individual posts. To add lazy loading to a markdown image, assuming you are using kramdown:

```markdown
![image-title](/path/to/your/image.jpg){:loading="lazy"}
```

The only downside here is that you need to add this extra snippet each time you add a new image.

There are three options when using this method to lazy load images. To quote [this article on web.dev](https://web.dev/native-lazy-loading/ "Web.Dev article on Lazy Loading"):

> Here are the supported values for the loading attribute:
>
> * _auto_: Default lazy-loading behavior of the browser, which is the same as not including the attribute.
> * _lazy_: Defer loading of the resource until it reaches a calculated distance from the viewport.
> * _eager_: Load the resource immediately, regardless of where it's located on the page.

There you have it. A simple and straight forward way to include lazy loading on a Jekyll website.
