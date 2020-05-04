---
layout: post
title: Upgrading social sharing via the Web Share API
date: 2020-05-03 01:00 +0000
author: tonyedwardspz
category: blog
headerImage: true
image: /assets/images/2020/current-share-functionality.jpg
tag:
  - JavaScript
  - Progressive Enhancement
  - South West Communities
---
One of the projects I’ve released into the world is the [South West Communities](https://southwestcommunities.co.uk/) website, a shared events calendar for grassroots tech communities in the region. The past six months working on the [Future Sync Conference](https://futuresync.co.uk/) has resulted in very little development on the project, which I was reminded of when the todo item regarding a beta list update appeared on my schedule. Now the event is over, I’ve got a little more time to spend on this side project.

One of the main ways people find the site is through the sharing of it’s pages, both publicly online and via email / Whatsapp etc. The only share functionality on the site was based around Twitter, where the user could click a link to populate a pre-written tweet.

![Screenshot showing share button](/assets/images/2020/current-share-functionality.jpg "Existing share functionality"){:loading="lazy"}


![Screenshot showing pre-populated tweet](/assets/images/2020/pre-populated-tweet.jpg "image_tooltip"){:loading="lazy"}

Thanks to the relatively new Web Share API, which has now been added to popular mobile browsers, we can extend this functionality progressively. The goal here is to replace the existing button if the browser currently in use has this capability.

There have been tons of articles on the ins and outs of how to use this feature. For this, I used this [Log Rocket](https://blog.logrocket.com/how-to-improve-social-engagement-with-the-web-share-api/ "In depth Web share api tutorial") post by [Craig Buckler](https://twitter.com/craigbuckler "Craig buckler on Twitter") as a starting point. Craig's post walks through creating a suite of share buttons which are progressively enhanced. Due to this project's existing functionality, we’re layering it upon the current website rather than building from scratch.

The code below shows the function written to update the share button. 

```javascript
function socialShare() {

   // Can we use web share?
   if (navigator.share){

       // get page information
       const description = document.getElementsByName('description');
       const pageInfo = {
           url: location.href,
           title: document.title || '',
           text: window.shareDescription ? window.shareDescription : description[0].content
       };

       const shareButton = document.querySelector(".share");

       shareButton.innerHTML = 'Share this';

       shareButton.addEventListener('click', (e) => {
           e.preventDefault();
           navigator.share(pageInfo);
       }); 
   }
};
```

After checking if the Web Share API is available, we build the sharing option using some of the meta tags as data sources, plus a mysterious `window.shareDescription` variable. We then proceed to update the buttons text and set an event listener for user interaction with the button.

Fairly straight forward.

This function is then called once the document is loaded. Despite having jQuery available, it’s set to be removed in the near future so has not been used in the above function.

```javascript
$( document ).ready( function() {
   socialShare();
} );
```

Back to that mysterious `window.shareDescription`.

This project is a [Jekyll website](https://jekyllrb.com/ "Jekyll homepage") with all content being generated dynamically at the time of deployment each night. This enables the site to update reflecting and changes organisers make to listings on other event platforms.

The `shareDescription` variable is added to the window during the page load cycle via a short inline script. Whilst this is not really best practice, it does offer a simple solution. In the template file used for individual event listing, I added the following snippet.

````javascript
<script>{% raw %}
    var shareDescription = `Check out this event by {{page.organiserName}} on the South West Communities calendar. {{page.title}} - https://southwestcommunities.co.uk/{{page.url}}`{% endraw %}
</script>
````

A dreaded var has been used so that the variable gets hoisted and is available in a different scope, which in this case is in a different file.

The end result, an progressively enhanced share button on some mobile devices.

![Screenshot of new share button on a mobile device](/assets/images/2020/website-share-screenshot.jpg "Upgraded share button"){:loading="lazy"}

![Screenshot of Android share screen](/assets/images/2020/share-screen.jpg "Native Android share screen"){:loading="lazy"}

There you have it. A simple upgrade of the sharing functionality.
