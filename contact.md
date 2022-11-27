---
title: Contact Me
layout: page
---


<div class="side-by-side"> 
    <div class="toleft"> 
        <p>It's good to talk, and I'd love to hear from you.</p> 
        <p>Say hi by sending a message via the form. If you want a call back, please include your number.</p>
        <p>I promise to consider replying if your message survives its trip through the filters. Nothing more.</p>

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


