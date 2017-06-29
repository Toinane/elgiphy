'use strict';

const {clipboard} = require('electron');

let getGif = link => (
  new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest();
    xhr.open("get", `http://api.giphy.com/v1/gifs${link}api_key=dc6zaTOxFJmzC`);
    xhr.setRequestHeader("accept", "application/json");
    xhr.onload = () => resolve(JSON.parse(xhr.responseText));
    xhr.send();
  })
);

let showGifs = json => {
  Object.keys(json.data).map(function(key, index){
    let img = document.createElement('img');
    img.src = json.data[index].images.original.url;
    document.querySelector('#gifs').appendChild(img);
    img.addEventListener('click', event => clipboard.writeText(event.target.src));
  });
}

let random = max => {
  document.querySelector('#gifs').innerHTML = '';
  for(let i = 0; i < max; i++){
    getGif(`/random?`)
      .then(json => {
        let img = document.createElement('img');
        img.src = json.data.image_url;
        document.querySelector('#gifs').appendChild(img);
        img.addEventListener('click', event => clipboard.writeText(event.target.src));
      });
  }
}

let trend = () => {
  document.querySelector('#gifs').innerHTML = '';
  getGif(`/trending?`)
    .then(json => showGifs(json));
}

let search = word => {
  document.querySelector('#gifs').innerHTML = '';
  getGif(`/search?q='${word}&`)
    .then(json => showGifs(json));
}

document.addEventListener('DOMContentLoaded', () => trend());
document.querySelector('#rand').addEventListener('click', () => random(10));
document.querySelector('#trend').addEventListener('click', () => trend());
document.querySelector('input').addEventListener('keyup', function(event){
  if(event.key === 'Enter'){
    search(this.value);
  }
});
