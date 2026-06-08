function scrollToSection(id){
  document.getElementById(id).scrollIntoView({
    behavior:"smooth"
  });

  music.play();
}

let music = document.getElementById("music");
let playing = false;

function toggleMusic(){
  if(playing){
    music.pause();
    playing = false;
  } else {
    music.play();
    playing = true;
  }
}

// Auto play on first user interaction
window.addEventListener("load", () => {
  music.play().then(() => {
    playing = true;
  }).catch(() => {
    console.log("Autoplay blocked by browser");
  });
});

document.body.addEventListener("click", () => {
  music.play();
  playing = true;
}, { once: true });

const weddingDate = new Date("December 16, 2026 12:00:00").getTime();

setInterval(() => {
  const now = new Date().getTime();
  const gap = weddingDate - now;

  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  document.getElementById("days").innerText =
    Math.floor(gap / day);

  document.getElementById("hours").innerText =
    Math.floor((gap % day) / hour);

  document.getElementById("minutes").innerText =
    Math.floor((gap % hour) / minute);

  document.getElementById("seconds").innerText =
    Math.floor((gap % minute) / second);
}, 1000);