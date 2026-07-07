/* ============================================================
   particles.js — ambient golden sparkles & fireflies
   ============================================================ */
(function(){
  const canvas = document.getElementById("particleCanvas");
  if(!canvas) return;
  const ctx = canvas.getContext("2d");
  let w, h, particles = [];

  const COLORS = ["#F9E7A0","#D4AF37","#E6B8AF","#fff6d6"];
  const COUNT_DESKTOP = 55;
  const COUNT_MOBILE = 26;

  function resize(){
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  window.addEventListener("resize", resize);
  resize();

  function makeParticle(){
    const firefly = Math.random() < .35;
    return {
      x: Math.random()*w,
      y: Math.random()*h,
      r: firefly ? (1.4 + Math.random()*1.8) : (0.6 + Math.random()*1.4),
      baseAlpha: .25 + Math.random()*.6,
      alpha: 0,
      speed: .15 + Math.random()*.35,
      drift: (Math.random()-.5)*.4,
      twinkle: Math.random()*Math.PI*2,
      twinkleSpeed: .01 + Math.random()*.03,
      color: COLORS[Math.floor(Math.random()*COLORS.length)],
      firefly
    };
  }

  function init(){
    const count = window.innerWidth < 700 ? COUNT_MOBILE : COUNT_DESKTOP;
    particles = Array.from({length:count}, makeParticle);
  }
  init();
  window.addEventListener("resize", init);

  function tick(){
    ctx.clearRect(0,0,w,h);
    particles.forEach(p => {
      p.y -= p.speed;
      p.x += p.drift + Math.sin(p.twinkle)*.15;
      p.twinkle += p.twinkleSpeed;
      p.alpha = p.baseAlpha * (0.5 + 0.5*Math.sin(p.twinkle));

      if(p.y < -10){ p.y = h + 10; p.x = Math.random()*w; }
      if(p.x < -10) p.x = w + 10;
      if(p.x > w + 10) p.x = -10;

      ctx.beginPath();
      const glow = p.firefly ? p.r*4 : p.r*2.5;
      const grad = ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,glow);
      grad.addColorStop(0, p.color);
      grad.addColorStop(1, "transparent");
      ctx.fillStyle = grad;
      ctx.globalAlpha = p.alpha;
      ctx.arc(p.x,p.y, glow, 0, Math.PI*2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
})();
