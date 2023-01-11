---
title: Build time gains from upgrading Jekyll to 4.2.0
date: 2021-08-19 16:00:00 +00:00
 
headerImage: false
tag:
- Jekyll
- Coding

---
We’ve all done it. Be honest. It’s really easy to leave a personal project on a version of its dependencies that works for an easy life. We also know that this is ultimately a recipe for disaster. Security vulnerabilities and broken deployments are sure to rear their head at some point.

Over the last couple of months, I’ve added a few new posts to this website. Poking through the codebase, I noted that it was running on an outdated version of Jekyll. The version in use was itself only updated after the project refused to build a few years ago whilst making a spelling correction in a post. Remembering the pain I went through at the time, I thought it’s probably best to update before getting to that point.

[Jekyll](https://jekyllrb.com/) is my go to for static sites. Last year, another project that uses the platform was updated and saw huge build time gains following an update. But that was a much more involved build. MUCH much more. This site is far simpler and probably a better judge of the buildtime gains that 4.x.x brings to the average blog. It should also be a much easier update. So let’s see what we get.


## Starting point

Running the build command gives us the following results.

![Pre update terminal results](/assets/images/2021/jekyll-build-1.png "Screenshot of the terminal showing a 35 second build"){:loading="lazy"}

Using ruby 2.4.5 & Jekyll 3.8.6 gives us a build time of 35.86 seconds. Not the end of the world, but not great for such a simple project.


## Update all the things

Make sure you are in the project's root directory on the command line.

Looking at the [upgrade instructions](https://jekyllrb.com/docs/upgrading/3-to-4/), Jekyll 4.x.x requires Ruby >= 2.5.0. Since I have 2.7.1 installed for another project, I updated the <code>.ruby-version</code> file to use this. I wasn’t feeling brave enough for a Ruby bump aswell!

To update theJekyll gem, run:

`gem update jekyll`

Then run a bundle update

`bundle update`

In theory, this should update your project to the latest version and running the build command will give you the results you need. Not for this project.

I found that because Jekyll was not defined in the gemfile, it would only update to the latest 3.x.x version. To fix this, I deleted the gemfile.lock file, added <code>gem "jekyll", "~> 4.2.0"</code> to the gemfile and deleted any stipulated gem version elsewhere in the file. I ran the above commands again to update everything to the latest, before adding back in the various gem version stipulations taking cues from the versions just installed. If the way gemfile works is a mystery, I recommend checking out [this blog post](https://www.moncefbelyamani.com/how-to-update-gems-in-your-gemfile/) by Moncef Belyamani.

Once everything is updated, we can rebuild the project to get some results.


## The results

Running the build command once again gives us a fresh build time:

![Post update terminal results](/assets/images/2021/jekyll-build-2.png "Screenshot of the terminal showing a 5 second build"){:loading="lazy"}

5.43 seconds! That gives a saving of a smidge over 30 seconds each time! Well worth the 30 minutes to update… I’d have saved a whole minute and a half if I'd upgraded 9 months ago when it was released!

As a side note, Jekyll 4.x.x introduces some fancy caching to save time during build. Don’t forget to add the .jekyll-cache folder to your .gitignore file.
