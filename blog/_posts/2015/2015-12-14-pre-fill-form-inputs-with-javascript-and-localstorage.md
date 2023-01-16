---
title: Pre fill form inputs with JavaScript from LocalStorage
image: /assets/images/import/2015/12/localstorage.jpg
tag:
  - JavaScript
  - Tutorial
  - User Experience
---
One of my long-term side projects is a community event website for&nbsp;my hometown of Penzance, called&nbsp;[West Cornwall Events](http://westcornwallevents.co.uk). At the time of writing it&#8217;s been online for almost six years, and over that time has had many regular event submissions&nbsp;from people in the local community. The latest developments on the site have been to the back-end,&nbsp;in an effort&nbsp;to automate as much of the day-to-day administration as possible. This required a ground up redevelopment of the event submission flow.

In recent months I&#8217;ve read allot about the [usability and effectiveness of forms](http://www.amazon.co.uk/gp/product/B004VFUP2I/ref=as_li_tl?ie=UTF8&camp=1634&creative=19450&creativeASIN=B004VFUP2I&linkCode=as2&tag=aandeuk-21). One of the recurring themes is that the user should only have to fill in what is necessary and, if possible, fields should be prefilled. For this site I started by adding a drop down for existing venues, date and time pickers and visual prompts via placeholders and field highlighting upon error. After these early optimizations, and a look through stats related to past submissions, I found the following two things to be true.

  * 70% of users&nbsp;made 2 or more submissions
  * 37% of submissions came from just 5 people

I realised that I could quite easily speed up event submissions for these key people by pre-populating the users details fields. Whilst the application does track who submits which event, there are no user accounts as I didn&#8217;t want to [put people off](http://www.smashingmagazine.com/2009/02/9-common-usability-blunders/#9-long-registration-forms) from submitting by increasing the time they needed to invest.

## The Solution &#8211; LocalStorage & JavaScript

I decided on a simple solution using JavaScript and the LocalStorage API for storing the relevant information within the end users browser. The app I added this too uses jQuery, as does this tutorial.

Before we use the LocalStorage API we first need to test that it&#8217;s available. Following the principles of progressive enhancements, this form should function without the need for JavaScript or modern&nbsp;API&#8217;s. After getting inspiration (ahem) from the [feature detection in&nbsp;Modenizr](https://github.com/Modernizr/Modernizr/blob/a23193bf25387ccca63a05e8c74d54ec1b458c5c/feature-detects/storage/localstorage.js) I used&nbsp;this function, which will return a boolean for use in an if statement later on.

Open up your JavaScript file and add the following function.

<pre data-language="javascript"><code>function lsTest(){
  var test = 'test';
  try {
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch(e) {
    return false;
  }
}</code></pre>

Here we&#8217;re trying to write and remove an item from LocalStorage. The function will return true if the catch block is not entered. Next we need to write a function to save the user&#8217;s details into LocalStorage. Add the following function to your js file.

<pre data-language="javascript"><code>function saveUserDetails() {
  var user = {
    'first': $('#user_event_first_name').val(),
    'last': $('#user_event_last_name').val(),
    'email': $('#user_event_user_email').val()
  };
  localStorage.setItem('wceUser', JSON.stringify(user));
}</code></pre>

The first few lines creates an object&nbsp;of the values the user entered into the appropriate inputs before saving the object to LocalStorage. As the object is a fairly simple one, I&#8217;ve used `JSON.stringify` to convert the details to a string to allow easy conversion when retrieving back from storage.

Speaking of which we need another function to retrieve the users details and placing them back into the form.

<pre data-language="javascript"><code>function fetchUserDetails() {
  var lsUser = localStorage.getItem('wceUser');
  var user = JSON.parse(lsUser);

  if (isRealValue(user)){
    $('#user_event_first_name').val(user.first);
    $('#user_event_last_name').val(user.last);
    $('#user_event_user_email').val(user.email);
  }
}</code></pre>

Here we fetch the item from storage, using&nbsp;the same key, and parse it back into a user object. &nbsp;The if statement checks that the stored values&nbsp;have successfully been converted back into an object (we&#8217;ll get to that). If it has we then insert&nbsp;the retrieved values back into the form. The following function is how we check that an object is actually an object, not undefined, by returning true or false.

<pre data-language="javascript"><code>function isRealValue(obj){
  return obj && obj !== "null" && obj!== "undefined";
}</code></pre>

Simples. Now it&#8217;s time to put it all together. Within your document ready function add the following.

<pre data-language="javascript"><code>if(lsTest() === true){
  if (localStorage.getItem("wceUser") !== null){
    fetchUserDetails();
  }
  $("#submission-btn").hover(saveUserDetails);
}</code></pre>

We first&nbsp;wrap everything in our test of LocalStorage availability. If&nbsp;we have the power, the code will check that the appropriate key is stored locally, calling `fetchUserDetails()` if it is. We then set up a listener on the submit button for the hover action. Whilst this does not give much time to perform the actual saving of user details (300ms ish on most devices), it should be enough. It&#8217;s also worth noting that there is no hover action on touch devices, although [some will trigger the action](http://www.prowebdesign.ro/how-to-deal-with-hover-on-touch-screen-devices/) before the click event. As this is an enhancement to the form, in this situation these two drawbacks do not present an issue.

## Summary

That&#8217;s it. We&#8217;ve just saved form data to LocalStorage with appropriate checking of availability and parse success. Simple enhancements like this can greatly reduce drop off experienced during the completion of forms as part of your application.

If you liked this tutorial, can suggest improvements or just want to say thanks, get in touch on twitter at [tonyedwardspz](https://twitter.com/tonyedwardspz).
