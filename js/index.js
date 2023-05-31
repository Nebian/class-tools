const menu = document.getElementById("menu");

// Cambio al índice del objeto del menú sobre el que se hace hover
Array.from(document.getElementsByClassName("menu-item"))
  .forEach((item, index) => {
    item.onmouseover = () => {
      menu.dataset.activeIndex = index;
    }
  });


// Reproducción y pausa del audio en la opción de Relax
var audio = new Audio('sounds/chopin.mp3');
var isAudioPlaying = false;

function chillAudio() {
  if (isAudioPlaying) {
    audio.pause();
    isAudioPlaying = false;
  } else {
    audio.play();
    isAudioPlaying = true;
  }
}