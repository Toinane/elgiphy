'use strict';

function getGif(link){
  return new Promise(function(resolve, reject){
    let xhr = new XMLHttpRequest();
    xhr.open("get", link);
    xhr.setRequestHeader("accept", "application/json");
    xhr.onload = function () {
      resolve(JSON.parse(xhr.responseText))
    }
    xhr.send();
  });
}

function random(){
  document.querySelector('#gifs').innerHTML = '';
  for(let i = 0; i < 10; i++){
    getGif('http://api.giphy.com/v1/gifs/random?api_key=dc6zaTOxFJmzC')
    .then(function(json){
      console.log(json);
      let img = document.createElement('img');
      img.src = json.data.image_url;
      document.querySelector('#gifs').appendChild(img);
      copy();
    });
  //https://github.com/Giphy/GiphyAPI#random-endpoint
  }
}

function trend(){
  document.querySelector('#gifs').innerHTML = '';
  getGif('http://api.giphy.com/v1/gifs/trending?api_key=dc6zaTOxFJmzC')
  .then(function(json){
    Object.keys(json.data).map(function(key, index){
      let img = document.createElement('img');
      img.src = json.data[index].images.original.url;
      document.querySelector('#gifs').appendChild(img);
    });
    copy();
  });
}

function search(word){
  document.querySelector('#gifs').innerHTML = '';
  getGif('http://api.giphy.com/v1/gifs/search?q='+word+'&api_key=dc6zaTOxFJmzC')
  .then(function(json){
    console.log(json);
    Object.keys(json.data).map(function(key, index){
      let img = document.createElement('img');
      img.src = json.data[index].images.original.url;
      document.querySelector('#gifs').appendChild(img);
    });
    copy();
  });
  //https://github.com/Giphy/GiphyAPI#random-endpoint
}

function favories(){

}

function copy(){
  let gifs = document.querySelectorAll('img'), el;
  for(el of gifs){
    el.onclick = function(){
      const {clipboard} = require('electron');
      clipboard.writeText(this.src);
    }
  }
}

document.querySelector('#rand').onclick = ()=>{
  random();
}
document.querySelector('#trend').onclick = ()=>{
  trend();
}
document.querySelector('#fav').onclick = ()=>{
  favories();
}
document.querySelector('input').onkeyup = function(e){
  if(e.key === 'Enter'){
    search(this.value);
  }
}


trend();
