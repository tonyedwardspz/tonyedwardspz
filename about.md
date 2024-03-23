---
title: About
layout: page
---

<h1 id="aboutMe">Hey. I'm Tony</h1>

<a class="link" href="{{ site.url }}/about">
    <img class="selfie" alt="{{ site.name }}" height="175px" width="175px" src="{{ site.url }}/{{ site.picture }}" />
</a>

<p class="about-buttons">
  <button id="HumanReadableButton" onclick="showHideAbout('human');" class="general-button active">Human Readable Format</button>
  <button id="jsonButton" onclick="showHideAbout('json');" class="general-button">JSON Format</button>
  <button id="YAMLButton" onclick="showHideAbout('yaml');" class="general-button">YAML Format</button>
</p>

<div id="about-human" class="show-about">
  <p>I'm taking a little bit of time off work at the moment, recharging the batteries ready for my next professional adventure. That said, I head up <a href="https://thatseagullbob.co.uk">That Seagull Bob</a>. Bob specialises in making online audio and video super simple for it's clients, alongside a smattering of web development and event organising.</p>

  <p>In recent years, I've done a few different things. I was part of the education outreach team for <a href="https://techcornwall.org">Tech Cornwall</a>, a members network in the South West of England. The project I headed up, helping disadvantaged young adults into fulfilling tech careers, won multiple awards including one for being the most inspirational offering in the South West digital industry. A few years on, I'm seeing the people the team and I inspired and coached through this role entering the software industry. It makes me immensely proud!</p>

  <p> Whilst at University, I co-founded the <a href="https://futuresync.co.uk">Future Sync Conference</a>, a multi track event based at Plymouth University with an online offering during the pandemic in 2020 (we were one of the first events in the world to pivot to an online format). Through this event, we brought internationally acclaimed speakers to the South West, standing on the stage alongside established and first time local speakers alike. This event ran for the last time in 2020, but not before offering a springboard for local speakers to step onto bigger stages around the virtual (and one day physical) world.</p>

  <h2>The Back Story</h2>

  <p>I created my first website back in 2002. It was a simpler time back then. Learning
  the basics of web development was as easy as viewing source and poaching the good stuff.
  Table layouts….those were the days. Fast forwarding to University, I focused on learning
  modern JavaScript whilst creating standards compliant, cross browser web applications.</p>

  <p>There, I added to my front end experience, learning about what it takes
  to make great software. Usability, software design and database development were just some of
  the modules covered as part of my course. As you’d expect from a degree, I’ve been
  exposed to lots of languages including PHP, Java, C#, JavaScript and .NET. As a web
  developer I’ve gravitated to a web stack which includes HTML, CSS, JavaScript, Node.js,
  PHP, Ruby, Jekyll and WordPress.</p>

  <p>During the course I did a 15 month placement with <a href="https://plymouthsoftware.com">Plymouth Software</a>, building Ruby on Rails,
  iOS and Android applications. As part of my placement I was encouraged to develop my own
  side projects, the first of which was to re-develop an existing project from PHP into Rails.
  It was at Plymouth Software where I leaned that software development is all about
  choosing the right tool for the job.</p>

  <p>Before starting university I had a four year hiatus from web development whilst working
  in retail. I climbed to the dizzying heights of a store manager for a national chain. I
  learned a great deal about the hard work and commitment needed to run a successful
  business and managing a diverse team. After an especially long summer I had a moment
  of clarity and decided to throw myself what I enjoyed doing……web development.</p>

  <p>I could go on for hours, but I expect you’re a busy person. If you want to know more,
  <a href="https://tonyedwardspz.co.uk/contact/" alt="Contact Me Page">get in touch</a>. Perhaps we could grab a coffee.</p>

  <p>I’ll bring the cake.</p>
</div>

<div id="about-json" class="hide-about">
  <pre><code>{
    "vitalStatistics": {
        "name": "Tony Edwards",
        "description": "Doer of things with tech",
        "dayJob": "Web Developer, Marketer and Event Organiser",
        "sideHustle": "South West Communities"
    },
    "education": {
        "degree": "BSc Hons Web Application Development",
        "institution": "Plymouth University"
    },
    "socialNetworkHandle": {
        "allOfThem": "tonyedwardspz"
    },
    "softwareDevelopment":{
        "programmingPreference": "Full Stack JavaScript (ES6)",
        "programmingExperience": "JavaScript, Ruby, Swift, Java (Android), HTML, CSS",
        "currentlyExploring": "Speech Recognition, Conversational Interfaces",
        "gitHub": "https://github.com/tonyedwardspz"
    },
    "dependencies": {
        "drinks": "Green Tea",
        "eats": "Scones (Jam First)",
        "listensTo": "Hip-Hop, Audio Books and Podcasts"
    },
    "devDependencies": {
        "coffee": "^8oz Latte"
    }
  }
  </code></pre>
</div>


<div id="about-yaml" class="hide-about">
  <pre><code>---
vitalStatistics:
    name: 'Tony Edwards'
    description: 'Doer of things with tech'
    dayJob: 'Web Developer, Marketer and Event Organiser'
    sideHustle: 'South West Communities'
education:
    degree: 'BSc Hons Web Application Development'
    institution: 'Plymouth University'
socialNetworkHandle:
    allOfThem: tonyedwardspz
softwareDevelopment:
    programmingPreference: 'Full Stack JavaScript (ES6)'
    programmingExperience: 'JavaScript, Ruby, Swift, Java (Android), HTML, CSS'
    currentlyExploring: 'Speech Recognition, Conversational Interfaces'
    gitHub: 'https://github.com/tonyedwardspz'
dependencies:
    drinks: 'Green Tea'
    eats: 'Scones (Jam First)'
    listensTo: 'Hip-Hop, Audio Books and Podcasts'
devDependencies:
    coffee: '^8oz Latte'
---
  </code></pre>
</div>

<script>
function showHideAbout(element) {
    let yaml = document.getElementById('about-yaml');
    let json = document.getElementById('about-json');
    let human = document.getElementById('about-human');

    if (element === 'yaml'){
        human.classList.add('hide-about');
        human.classList.remove('show-about');
        json.classList.add('hide-about');
        json.classList.remove('show-about');
        yaml.classList.remove('hide-about');
        yaml.classList.add('show-about');
    } else if (element === 'json'){
        human.classList.add('hide-about');
        human.classList.remove('show-about');
        yaml.classList.add('hide-about');
        yaml.classList.remove('show-about');
        json.classList.remove('hide-about');
        json.classList.add('show-about');
    } else {
        yaml.classList.add('hide-about');
        yaml.classList.remove('show-about');
        json.classList.add('hide-about');
        json.classList.remove('show-about');
        human.classList.remove('hide-about');
        human.classList.add('show-about');
    }

    let buttons = document.querySelectorAll('.general-button');

    for(let i = 0; i < buttons.length; i++){
        buttons[i].classList.remove('active');
    }
    
    element.target.classList.add('active');
}
</script>
