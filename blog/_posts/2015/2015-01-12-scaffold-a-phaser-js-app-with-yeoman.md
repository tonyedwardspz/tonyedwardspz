---
title: Scaffold a phaser.js app with Yeoman
date: 2015-01-12 22:14
  
 
tag:
  - Bower
  - Grunt
  - npm
  - Phaser.js
  - Tutorial
  - Yeoman
---
[Yeoman](http://yeoman.io/ "Yeoman web app scaffolder") is a scaffolding tool for creating modern web apps that uses the [npm package manager](https://www.npmjs.com/ "npm package manager"). At the time of writing there are over 1300 [generators](http://yeoman.io/generators/ "Yeoman generators") for various web application stacks. I&#8217;d read allot about it in .Net magazine and in various blog posts, but never felt the need to include it in my workflow.

Until now.

On my first day back at University after the Christmas break I started a new module titled &#8216;The Design Process&#8217;. The core of the module is creating a mobile game using [Phaser.js](http://phaser.io/ "Phaser.js browser games"). This rang a bell in my head as one of the libraries I&#8217;d read about where Yeoman was mentioned. I thought this was a great opportunity&nbsp;to try it out.

To use&nbsp;Yeoman&nbsp;you need to have [Node.js](http://nodejs.org/ "Node.js") and the npm package manager on your system. If you don&#8217;t have them already, go ahead and install them now.

## Installing Yeoman

As you can probably guess, Yeoman is a command line tool. Fire up the node.js command prompt (or the command line tool of choice) and enter the following.

<pre data-language="shell" data-line="-1"><code>npm install -g yo bower grunt-cli gulp</code></pre>

This installs four&nbsp;things.

  * Yeoman
  * [Bower](https://www.npmjs.com/package/bower "Bower") &#8211; package management&nbsp;for dependencies
  * [Grunt](http://gruntjs.com/ "Grunt task runner") &#8211; a task-based command-line tool for JavaScript projects
  * [Gulp](http://gulpjs.com/) &#8211;&nbsp; a task-based command-line tool for JavaScript projects

You can find out more about these by following the links above.

## Installing Phaser

Now that Yeoman is installed, it&#8217;s time to install the Phaser.js generator. There are several variations&nbsp;depending on how you want to code your web app. We&#8217;re going to use the vanilla generator for the purposes of this tutorial. In the command prompt&nbsp;enter the following.

<pre data-language="shell" data-line="-1"><code>npm install -g generator-phaser-official</code></pre>

This pulls the Phaser.js generator onto your system and registers it with Yeoman. We&#8217;re now ready to scaffold our web app.

## Scaffolding the application

It&#8217;s time to create the directory our application is going to live in. In the command prompt&nbsp;navigate to the desired parent directory then&nbsp;create a new one for the application with the following commands.

<pre data-language="shell" data-line="-1"><code>mkdir my-phaser-project cd my-phaser-project</code></pre>

Now we&#8217;re in the new directory and ready to rock. Now we scaffold the project using Yeoman. Within the command prompt type the following.

<pre data-language="shell" data-line="-1"><code>yo phaser-official</code></pre>

That&#8217;s it! You will be asked some questions during setup for various setting within the project. Bower will run to download any dependencies the project may have.

Your now ready to create your game. Have fun!

## Final thoughts

We&#8217;ve just seen how easy it is to create modern web app using Yeoman. From here I&#8217;d suggest you have a look through the generator directory to get an idea of what&#8217;s possible. If you can&#8217;t find something suitable why not create your own and add it to the directory. Open source FTW!

For&nbsp;your next web app project you just need to install the required generator and scaffold the project. Simple.
