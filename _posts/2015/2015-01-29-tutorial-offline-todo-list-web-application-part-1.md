---
title: 'Tutorial: Javascript ToDo list web application'
layout: post
date: 2015-01-29 17:38
tag:
  - CSS
  - HTML
  - JavaScript
  - Tutorial
  - Web App
category: blog
author: tonyedwardspz
description: Markdown summary with different options
---
The Todo app has become the hello world of web applications. In this three part tutorial we&#8217;re going to create a simple web&nbsp;app using HTML5, CSS3 and JavaScript.&nbsp;&nbsp;We&#8217;re will utilise LocalStorage and AppCache&nbsp;to create an installable hosted web app that remembers the state of the users list and works offline. As you can probably guess, our app is aimed at mobile devices.

You can develop this app in any text editor and debug in any browser. I&#8217;m using sublime text and Firefox developer edition, testing it using&nbsp;the Firefox OS emulator.

For reference I&#8217;ve created a Gist of the the [code we will produce](https://gist.github.com/tonyedwardspz/879d5ecff0efd466e79f "Firefox os hosted application code") throughout this tutorial.

Lets get started.

## Project setup

First things first, we need to set up our project. Create a folder called todo and open this within your text editor. We need three files for this application, index.html, style.css and script.js. Go ahead and create those, open `index.html` and add the following code.

<pre data-language="html"><code>&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;
    &lt;meta charset="utf-8" /&gt;
    &lt;title&gt;My todo app&lt;/title&gt;

    &lt;meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1"&gt;
    &lt;link rel='stylesheet' href="style.css" type='text/css' media='all' /&gt;
&lt;/head&gt;
&lt;body&gt;
    &lt;header&gt;
        &lt;h1&gt;ToDo List&lt;/h1&gt;
    &lt;/header&gt;
    &lt;main&gt;
        &lt;p&gt;Add things to do below&lt;/p&gt;

        &lt;form&gt;
            &lt;label for="inputItem" id="inputLabel"&gt;&lt;/label&gt;
            &lt;input id="inputItem"&gt;
            &lt;button id="addItem"&gt;Submit&lt;/button&gt;
        &lt;/form&gt;

        &lt;ul id="theList"&gt;&lt;/ul&gt;

    &lt;/main&gt;
    &lt;script src="script.js"&gt;&lt;/script&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>

Nothing to fancy here. We have a form with an input area and a button as well as a empty list to insert out items. As were creating a mobile web app we&#8217;ve included the `viewport` meta tag to make sure the app expands too, and stays at full screen on mobile devices. We&#8217;ve also included reference to the CSS and Javascript files. We will come to the JavaScript later, but for now lets add the&nbsp;basic styles to the `style.css`&nbsp;file. Open that file and add the following.

<pre data-language="css"><code>*{
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}
h1,
main,
footer{
    margin: 0 10px;    
    margin: 0 10px;
}
main,
footer{
    margin: 0 10px;
}
html,
button{
    font-family:'Verdana',Arial,sans-serif;
    font-size:16px;
}
header{
    height: 38px;
    border-bottom: 2px solid #ccc;
    margin-bottom: 10px;
}
p{
    padding: 10px 0;
}
ul{
    margin: 20px 0;
    list-style: none;
}
li{
    padding: 5px;
    margin: 3px 0;
    border-bottom: 2px solid #7cceee;
}
input{
    padding:6px;
    width: 100%;
    border-radius: 5px;
    margin-bottom: 10px;
    font-size: 16px;
}
button{
    box-shadow:rgba(0,0,0,0.2) 0 1px 0 0;
    border-bottom-color:#333;
    border:1px solid #61c4ea;
    background-color:#7cceee;
    border-radius:5px;
    color:#333;
    text-shadow:#b2e2f5 0 1px 0;
    padding:5px 15px;
    transition: 0.3s ease-in-out;
    cursor:pointer;
}
button:hover{
    transition: 0.7s ease-in-out;
    background-color:#7cce00;
}</code></pre>

Again, nothing too fancy here. We&#8217;ve added some `padding` and `margin` to space things out and provided a full width input area. Transitions give simple&nbsp;feedback to the user when the button is pressed.

In practice you would&nbsp;need to provide better cross browser support than we have here. Transitions, for example, require prefixing in&nbsp;some older browsers. Using [autoprefixer](http://css-tricks.com/autoprefixer/ "Autoprefixer") in your workflow can completely eliminate the need to ever think about prefixes. HTML elements such as main and header don&#8217;t work in IE8 and below. You can check what works where on the excellent [caniuse.com](http://caniuse.com/ "Can I Use").

Now for the fun stuff.

## Adding items to the list

Before writing any JavaScript, we need to settle on&nbsp;some requirements for our application. I&#8217;ve&nbsp;identified&nbsp;four&nbsp;main requirements for the app which are:

  * A user can add an item to the list.
  * When an item from the list is clicked it will be marked as done.
  * When a done item is clicked it will be removed.
  * When a user leaves and returns to the app, it will resume in the same state.

Lets&nbsp;start on the functionality by&nbsp;getting reference to the dom items.

<pre data-language="javascript"><code>var theList = document.getElementById('theList'),
    form = document.querySelector('form'),
    input = form.querySelector('input');</code></pre>

We retrieved the elements by using either `querySelector` or ID. `<a title="query selector mdn article" href="https://developer.mozilla.org/en-US/docs/Web/API/document.querySelector">document.querySelector()</a>` returns the first element from the&nbsp;document that matches the specified selector. Now we have reference to the form we can attach an [event listener](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget.addEventListener "event listener mdn article"), which&nbsp;will sit quietly in the background waiting for the forms submit action.

Below your variable declarations add the following.

<pre data-language="javascript"><code>form.addEventListener('submit', function(ev){
    "use strict";
    ev.preventDefault();

});</code></pre>

The line `"use strict"` forces us to write ECMAScript version 5&nbsp;compliant JavaScript. You can read more about strict mode [here](http://www.w3schools.com/js/js_strict.asp "JavaScript strict mode"). Use of strict is a personal preference. There are consequences to using it in general, so feel free to omit it if necessary. The line `ev.preventDefault()` stops the browser from performing its default action, in this case refreshing with every submission.

It&#8217;s time to get some input from the user. On the next free line add:

    var value = input.value;

Pretty self explanatory. Get the value from the input box and store it in a variable called `value`. Now we can add it to the list.&nbsp;Using our reference to the list we can inject this input into the page. On the next free line add this.

<pre data-language="javascript"><code>theList.innerHTML += '&lt;li&gt;' + value + '&lt;/li&gt;';</code></pre>

Here were building a string, sandwiching the user input into a list item. That list item is added inside of our on page list. We now have &nbsp;user input that is added to the list when the user presses submit.

<p style="text-align: left;">
  One small issue we have is that the user is able to add duplicate items to the list, e.g &#8216;wash&#8217; followed by another &#8216;wash&#8217;. To prevent this we can use a simple cache mechanism that will prevent a duplicate item being added within each visit. Alter your variable declarations at the top of the page to look like this.
</p>

<pre style="text-align: left;" data-language="javascript"><code>var theList = document.getElementById('theList'),
    form = document.querySelector('form'),
    input = form.querySelector('input'),
    cache = {};</code></pre>

<p style="text-align: left;">
  We have added a <code>cache</code> variable and instantiated it to an empty object. Each time a user adds a new item we will add this as a key within the object which can be checked for each time a new item is added, without iteration. This is slightly hacky but suits our purpose. Modify the your list item injection code to look like this.
</p>

<pre><code class="javascript">if (!cache[value]) {
    cache[value] = true;
    theList.innerHTML += '&lt;li&gt;' + value + '&lt;/li&gt;';
}</code></pre>

<p style="text-align: left;">
  We&#8217;ve tested to see if the value the user has added currently exists within the <code>cache</code>. If not we store that value, as a key, within the object and inject the item as before.
</p>

<p style="text-align: left;">
  There&#8217;s one last thing to do before we move on. As it stands the user can press submit and insert a blank entry. We can prevent this by including a test for an empty string within our <code>if</code> statement. Modify your <code>if</code> to the following.
</p>

<pre style="text-align: left;" data-language="javascript"><code>if (!cache[value] && !(value == ""))</code></pre>

Our ToDo list can add users input to the list, stop duplicate entries and prevent blank tasks being entered. Not bad eh? Give it a try to test it&#8217;s all working before moving on.

Now we can move onto the next couple requirements, allowing items to be marked as done and removing them completely.

## Acting on clicked items

To mark items as done we will again be using an `eventListener`, except this time its on out list. When an item is clicked we will be applying a css class in order to style it. Open up the `style.css` file and add this class.

<pre data-language="css"><code>li.done{
    background: #eee;
    transition: 0.3s ease-in;
}</code></pre>

This applies a background&nbsp;with a simple&nbsp;transition to any list item with the class of done. Now we can start building the JavaScript that applies this class.

Open up the `script.js` file. Underneath all the code so far add another event listener, this time on our actual list

<pre data-language="javascript"><code>theList.addEventListener('click', function(ev){
    "use strict";
    var t = ev.target;

});</code></pre>

This is similar to the last event listener, except this time we have stored the event target as the variable `t` because we will be using it a few times. With this we can test for the class `.done` on the event target.

On the free line add the following `if` statement.

<pre data-language="javascript"><code>if (!t.classList.contains('done')) {
     t.classList.add('done');
}</code></pre>

This says if the target does not have the class of done, add the class of done. The style we added previously has been applied to a clicked list item. Go ahead and try it out.

To remove the item from the list we can add an else statement to our if.

<pre data-language="javascript"><code>if (!t.classList.contains('done')) {
    // other code
} else {
    t.parentNode.removeChild(t);
}</code></pre>

By adding this else we&#8217;re saying&nbsp;if the list item does have the class done it&#8217;s safe to remove. This is done by removing the child (the target) from the [parentNode](https://developer.mozilla.org/en/docs/Web/API/Node.parentNode "Parent node mdn documentation") (theList).

You should now be able to remove an item from the list by clicking it twice. Seeing as we&#8217;re on a roll, lets add some more style to the done items. Alter the li.done css class to include the following line.

<pre data-language="css"><code>border-right: 30px solid #7cceee;</code></pre>

We have a nice fat border that is asking for something to be put into it. We can use the `after` pseudo selector to add content after and list item with the class `.done` applied to it. Add the following class to you style.css file.

<pre data-language="css"><code>li.done:after{
    content: "\2713";
    float:right;
    margin-right: -25px;
}</code></pre>

The string &#8220;\2713&#8221; is the unicode declaration for a tick (check mark). By floating it to the right and applying a negative margin of -25px we position it above the thick blue border of the `li.done` style. Simple but effective.

Our app is shaping up nicely. It&#8217;s time to move on and store the users list in case they leave and return later on. Once again, make sure everything is working as expected before moving on.

## Adding LocalStorage

[LocalStorage](https://developer.mozilla.org/en-US/docs/Web/API/localStorage "Local Storage mdn documentation") is a simple way to store small amounts of persistent data on a users device&nbsp;which&nbsp;works pretty much everywhere with the exception of Opera Mini.

To implement, the first thing we need to do is add any new items the user inputs into `localStorage`. Modify&nbsp;the code within the `form.addEventListener()` if statement in the to include&nbsp;the following line.

<pre data-language="javascript"><code>if (!cache[value] && !(value == "")) {
    // other code
    localStorage.myToDo = theList.innerHTML;
}</code></pre>

Here we&#8217;re creating an item in local storage called `myToDo` and inserting the whole list in one hit. Not very elegant I&#8217;ll admit, but very effective. Every time an item is added the whole list will be saved again. Perfect.

To store the state of the list (if an item is done or removed), copy that line of code and insert it after the if statement within the `theList.addEventListener()`.

<pre data-language="javascript"><code>if (!t.classList.contains('done')) {
    // other code
} else {
    // other code
}
localStorage.myToDo = theList.innerHTML;</code></pre>

As before, we&#8217;re dumping the entire list into the `myToDo` localStorage variable any time a change is made to the list. With that there is one last thing to do, populate the list when the user returns to the page. To do this we need to check that the `myToDo` variable exists with an `if` statement.

At the bottom of your `script.js` file add this.

<pre data-language="javascript"><code>if (localStorage.myToDo !== undefined) {
    // insert code here
}</code></pre>

This is checking to see if `myToDo` is not equal to undefined. If it does, the internal code will run. Now we have to do the opposite of before, intect our `localStorage` into the on page list. Within the previous if statement add the following line of code.

<pre data-language="javascript"><code>theList.innerHTML = localStorage.myToDo;</code></pre>

Now the list is populated with the previous visits state.

## Summary

Thats it. We have a working todo list with with minimal styling primed for you to extend. I&#8217;ve created a Gist of the [full working app](https://gist.github.com/tonyedwardspz/879d5ecff0efd466e79f "Chrome installable app code") so far for reference.

This tutorial heavily influenced by&nbsp;a [workshop](https://www.youtube.com/watch?v=x1__Q9iE2RQ) given by Christian Heilmann.

Here&#8217;s a few things you can try for yourself:

  * Add animation to the list item when they are removed.
  * Add menu to house multiple lists.
  * Store removed items in a separate completed list.
