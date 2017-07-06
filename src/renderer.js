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


let activeButton = button => {
  document.querySelector('#gifs').innerHTML = '';
  if(document.querySelector('.active')){
    document.querySelector('.active').classList.remove('active');
  }
  if(button){
    document.querySelector(`#${button}`).classList.add('active');
  }
};


let showGifs = json => {
  Object.keys(json.data).map(function(key, index){
    let img = document.createElement('img');
    img.src = json.data[index].images.original.url;
    document.querySelector('#gifs').appendChild(img);
    img.addEventListener('click', event => clipboard.writeText(event.target.src));
  });
};


let random = max => {
  activeButton('rand');
  for(let i = 0; i < max; i++){
    getGif(`/random?`)
      .then(json => {
        let img = document.createElement('img');
        img.src = json.data.image_url;
        document.querySelector('#gifs').appendChild(img);
        img.addEventListener('click', event => clipboard.writeText(event.target.src));
      });
  }
};


let trend = () => {
  activeButton('trend');
  getGif(`/trending?`)
    .then(json => showGifs(json));
};


let search = word => {
  activeButton('search');
  getGif(`/search?q='${word}&`)
    .then(json => showGifs(json));
};



document.addEventListener('DOMContentLoaded', () => {
  const {ipcRenderer} = require('electron');
  ipcRenderer.send('viewActive', 'hello world!');
  trend();
});
document.querySelector('#rand').addEventListener('click', () => random(10));
document.querySelector('#trend').addEventListener('click', () => trend());
document.querySelector('input').addEventListener('keyup', function(event){
  if(event.key === 'Enter'){
    search(this.value);
  }
});
document.querySelector('#quit').addEventListener('click', () => {
  const app = require('electron').remote.app;
  app.quit();
});
