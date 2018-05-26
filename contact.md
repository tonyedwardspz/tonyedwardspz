---
title: Contact Me
layout: page
---

It's good to talk, and I'd love to hear from you. Reach out by sending a quick
message via the form below. If you want a call back..... be sure to include your number.

<form name="contact" method="post" action="/thank-you" netlify>

    <label for="name">Your Name</label>
    <input type="text" name="name" required/>

    <label for="email">Your Email</label>
    <input type="email" name="email" required>

    <label for="message">Your Message</label>
    <textarea rows="10" cols="80" name="message"></textarea>

    <div data-netlify-recaptcha></div>

    <button type="submit">Send</button>

</form>
