---
title: Contact Me
layout: page
---

<div class="side-by-side"> 
    <div class="toleft"> 
        <h1>Contact me</h1>
        <p>It's good to talk, and I'd love to hear from you.</p> 
        <p>Say hi by sending a quick message via the form. If you want a call back. . . be sure to include your number.</p>

    </div> 
    <div class="toright">
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
    </div> 
</div>


