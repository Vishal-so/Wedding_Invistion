/* ============================================================
   script.js — Royal Wedding Invitation interactions
   ============================================================ */

/* ---------- tiny WebAudio bell chime (no external file needed) ---------- */
let audioCtx;
function playBellChime(){
  try{
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    const notes = [880, 1108, 1318];
    notes.forEach((freq, i) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      gain.gain.value = 0.0001;
      osc.connect(gain).connect(audioCtx.destination);
      const t = audioCtx.currentTime + i*0.18;
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(0.14, t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 1.1);
      osc.start(t);
      osc.stop(t + 1.2);
    });
  }catch(e){ /* audio not available, ignore silently */ }
}

/* ---------- build mandala petal group (SVG on opening screen) ---------- */
(function buildMandalaPetals(){
  const g = document.getElementById("mandalaPetalsGroup");
  if(!g) return;
  const cx = 200, cy = 200, petals = 16, rInner = 90, rOuter = 175;
  let markup = "";
  for(let i=0;i<petals;i++){
    const angle = (Math.PI*2/petals)*i;
    const x1 = cx + Math.cos(angle)*rInner;
    const y1 = cy + Math.sin(angle)*rInner;
    const x2 = cx + Math.cos(angle)*rOuter;
    const y2 = cy + Math.sin(angle)*rOuter;
    const cAngle = angle + (Math.PI/petals);
    const cx1 = cx + Math.cos(cAngle)*((rInner+rOuter)/2 - 12);
    const cy1 = cy + Math.sin(cAngle)*((rInner+rOuter)/2 - 12);
    markup += `<path d="M${x1},${y1} Q${cx1},${cy1} ${x2},${y2}" />`;
  }
  g.innerHTML = markup;
})();

/* ---------- opening sequence: opening screen -> invitation gate ---------- */
const openingScreen = document.getElementById("openingScreen");
const invitationGate = document.getElementById("invitationGate");
const mainSite = document.getElementById("mainSite");
const scroll3d = document.getElementById("scroll3d");
const openInviteBtn = document.getElementById("openInviteBtn");

setTimeout(() => {
  openingScreen.classList.add("fade-out");
  invitationGate.classList.add("active");
}, 3000);

openInviteBtn.addEventListener("click", () => {
  openInviteBtn.disabled = true;
  playBellChime();
  scroll3d.classList.add("opening");

  setTimeout(() => {
    scroll3d.classList.add("opened");
    if(window.RoyalFireworks) window.RoyalFireworks.celebrate();
  }, 900);

  setTimeout(() => {
    invitationGate.classList.add("dismiss");
    mainSite.classList.add("visible");
    playMusic();
    document.body.style.overflow = "auto";
  }, 1700);
});

// lock scroll until the invitation is opened
document.body.style.overflow = "hidden";

/* ---------- music ---------- */
const music = document.getElementById("music");
const musicIcon = document.getElementById("musicIcon");
let playing = false;

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

function scrollToSection(id){
  const target = document.getElementById(id);
  if(target){
    target.scrollIntoView({ behavior:"smooth" });
  }
}

/* ---------- countdown ---------- */
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

/* ---------- scroll reveal ---------- */
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

/* ---------- mouse tilt on hero card ---------- */
const heroCard = document.getElementById("heroCard");
if(heroCard){
  heroCard.addEventListener("mousemove", (e) => {
    const rect = heroCard.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - .5;
    const py = (e.clientY - rect.top) / rect.height - .5;
    heroCard.style.transform = `rotateY(${px*10}deg) rotateX(${-py*10}deg) translateY(-4px)`;
  });
  heroCard.addEventListener("mouseleave", () => {
    heroCard.style.transform = "rotateY(0) rotateX(0) translateY(0)";
  });
}

/* ---------- circular gallery orbit ---------- */
function positionOrbit(){
  const ring = document.getElementById("galleryOrbit");
  if(!ring) return;
  const items = ring.querySelectorAll(".orbit-item");
  const n = items.length;
  const itemWidth = window.innerWidth < 760 ? 130 : 190;
  const radius = Math.round((itemWidth/2) / Math.tan(Math.PI/n)) + 60;
  items.forEach((item, i) => {
    const angle = (360/n) * i;
    item.style.transform = `rotateY(${angle}deg) translateZ(${radius}px)`;
  });
}
positionOrbit();
window.addEventListener("resize", positionOrbit);

/* ---------- gallery lightbox ---------- */
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");
const lightboxClose = document.getElementById("lightboxClose");

document.querySelectorAll(".gallery img, .orbit-item img").forEach(img => {
  img.addEventListener("click", (e) => {
    e.stopPropagation();
    lightboxImg.src = img.src;
    lightbox.classList.add("active");
  });
});
lightboxClose.addEventListener("click", () => lightbox.classList.remove("active"));
lightbox.addEventListener("click", (e) => {
  if(e.target === lightbox) lightbox.classList.remove("active");
});
