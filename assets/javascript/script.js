'use strict';

function iframeResize() {
    console.log(event);
    let height = Math.floor(event.target.offsetWidth / (16/9));
    console.log('resizing', height);
    event.target.height = height;
}

// function setupAboutMe() {
//   // var json = document.getElementById('about-json');
//   var yaml = document.getElementById('about-yaml');
//   var human = document.getElementById('about-human');
//
//   yaml.classList.add('hidden');
//   human.classList.add('hidden');
// }
//
// function showElement(el) {
//   var elm = document.getElementById(el);
//   if (elm.style.display === 'none') {
//         elm.style.display = 'block';
//     } else {
//         elm.style.display = 'none';
//     }
// }
//
// if (document.getElementById('aboutMe')) {
//   setupAboutMe();
// }
