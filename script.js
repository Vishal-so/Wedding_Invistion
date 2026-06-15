const music = document.getElementById("music");
const musicIcon = document.getElementById("musicIcon");
let playing = false;

function scrollToSection(id){
  const target = document.getElementById(id);
  if(target){
    target.scrollIntoView({ behavior:"smooth" });
  }
  playMusic();
}

function playMusic(){
  if(!music) return;
  music.play().then(() => {
    playing = true;
    musicIcon.textContent = "❚❚";
  }).catch(() => {
    playing = false;
    musicIcon.textContent = "♫";
  });
}

function toggleMusic(){
  if(!music) return;
  if(playing){
    music.pause();
    playing = false;
    musicIcon.textContent = "♫";
  }else{
    playMusic();
  }
}

document.addEventListener("click", () => playMusic(), { once:true });

const weddingDate = new Date("2026-12-16T12:00:00+05:30").getTime();

function updateCountdown(){
  const now = Date.now();
  const gap = Math.max(0, weddingDate - now);

  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  document.getElementById("days").innerText = Math.floor(gap / day).toString().padStart(2,"0");
  document.getElementById("hours").innerText = Math.floor((gap % day) / hour).toString().padStart(2,"0");
  document.getElementById("minutes").innerText = Math.floor((gap % hour) / minute).toString().padStart(2,"0");
  document.getElementById("seconds").innerText = Math.floor((gap % minute) / second).toString().padStart(2,"0");
}

updateCountdown();
setInterval(updateCountdown, 1000);

const revealItems = document.querySelectorAll(".reveal");
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      entry.target.classList.add("show");
      observer.unobserve(entry.target);
    }
  });
},{ threshold:.15 });

revealItems.forEach(item => observer.observe(item));
