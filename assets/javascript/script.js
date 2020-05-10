'use strict';

function iframeResize() {
    let height = Math.floor(event.target.offsetWidth / (16/9));
    event.target.height = height;
}

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
    
    event.target.classList.add('active');
}
