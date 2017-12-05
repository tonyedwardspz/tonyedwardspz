---
title: Contact Me
layout: page
---

It's good to talk, and I'd love to hear from you. Reach out by sending a quick
message via the form below. If you want a call back..... be sure to include your number.

<form action="https://formtunnel.herokuapp.com/submissions" method="post">

  <input type="hidden" name="_token" value="Nct4SuW2BsmSj5VLXZWhgE8H">
  <input type="hidden" name="_subject" value="Website Contact: ">
  <input type="hidden" name="_success_url" value="https://tonyedwardspz.co.uk/thank-you">

  <!-- use hidden fields for additional data -->
  <input type="hidden" name="source" value="tonyedwardspz_website">

    <label for="name">Your Name</label>
    <input type="text" name="name" required/>

    <label for="email">Your Email</label>
    <input type="email" name="email" required>

    <label for="message">Your Message</label>
    <textarea rows="10" cols="80" name="message"></textarea>

    <input type="submit">

</form>
