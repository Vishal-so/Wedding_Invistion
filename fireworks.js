/* ============================================================
   fireworks.js — golden firework bursts + confetti fall
   ============================================================ */
(function(){
  const canvas = document.getElementById("fireworksCanvas");
  if(!canvas) return;
  const ctx = canvas.getContext("2d");
  let w, h;
  let particles = [];
  let confetti = [];
  let running = false;

  const FIREWORK_COLORS = ["#F9E7A0","#D4AF37","#A00028","#0B8457","#006D77","#E6B8AF"];

  function resize(){
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  window.addEventListener("resize", resize);
  resize();

  function burst(x, y){
    const count = 46;
    const color = FIREWORK_COLORS[Math.floor(Math.random()*FIREWORK_COLORS.length)];
    for(let i=0;i<count;i++){
      const angle = (Math.PI*2/count)*i + Math.random()*.2;
      const speed = 2.4 + Math.random()*3.4;
      particles.push({
        x, y,
        vx: Math.cos(angle)*speed,
        vy: Math.sin(angle)*speed,
        life: 1,
        decay: .012 + Math.random()*.012,
        color,
        size: 1.6 + Math.random()*1.8
      });
    }
  }

  function spawnConfetti(count){
    for(let i=0;i<count;i++){
      confetti.push({
        x: Math.random()*w,
        y: -20 - Math.random()*h*.4,
        vy: 1.5 + Math.random()*2.5,
        vx: (Math.random()-.5)*1.6,
        rot: Math.random()*360,
        vrot: (Math.random()-.5)*8,
        size: 5 + Math.random()*6,
        color: FIREWORK_COLORS[Math.floor(Math.random()*FIREWORK_COLORS.length)],
        life: 1
      });
    }
  }

  function tick(){
    ctx.clearRect(0,0,w,h);

    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy; p.vy += .035; p.life -= p.decay;
      ctx.globalAlpha = Math.max(p.life,0);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x,p.y,p.size,0,Math.PI*2);
      ctx.fill();
    });
    particles = particles.filter(p => p.life > 0);

    confetti.forEach(c => {
      c.x += c.vx; c.y += c.vy; c.rot += c.vrot;
      c.life -= 0.0022;
      ctx.save();
      ctx.globalAlpha = Math.max(c.life,0);
      ctx.translate(c.x,c.y);
      ctx.rotate(c.rot*Math.PI/180);
      ctx.fillStyle = c.color;
      ctx.fillRect(-c.size/2,-c.size/2,c.size,c.size*.6);
      ctx.restore();
    });
    confetti = confetti.filter(c => c.life > 0 && c.y < h + 30);

    ctx.globalAlpha = 1;

    if(particles.length || confetti.length){
      requestAnimationFrame(tick);
    } else {
      running = false;
    }
  }

  function start(){
    if(!running){ running = true; requestAnimationFrame(tick); }
  }

  // public API
  window.RoyalFireworks = {
    celebrate(){
      const cx = w/2, cy = h*0.32;
      burst(cx, cy);
      setTimeout(()=>burst(cx - w*0.18, cy + h*0.06), 260);
      setTimeout(()=>burst(cx + w*0.18, cy + h*0.03), 480);
      setTimeout(()=>burst(cx, cy - h*0.08), 700);
      spawnConfetti(90);
      start();
    }
  };
})();
