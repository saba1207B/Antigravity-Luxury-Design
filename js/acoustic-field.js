/* ═══════════════════════════════════════════════════════════════
   ANTIGRAVITY — ACOUSTIC LEVITATION FIELD CANVAS
   ═══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  const canvas = document.getElementById('acoustic-field-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ─── Configuration ───
  const PARTICLE_COUNT = 80;
  const NODE_COUNT = 5;
  const GOLD = { r: 212, g: 175, b: 55 };
  const SURFACE = { r: 250, g: 249, b: 246 };

  let particles = [];
  let mouseX = 0.5;
  let mouseY = 0.5;
  let animationId;
  let canvasRect;
  let dpr = 1;

  // ─── Resize ───
  function resize() {
    dpr = window.devicePixelRatio || 1;
    canvasRect = canvas.parentElement.getBoundingClientRect();
    canvas.width = canvasRect.width * dpr;
    canvas.height = canvasRect.height * dpr;
    canvas.style.width = canvasRect.width + 'px';
    canvas.style.height = canvasRect.height + 'px';
    ctx.scale(dpr, dpr);
  }

  // ─── Particle ───
  function createParticle() {
    const w = canvasRect.width;
    const h = canvasRect.height;
    return {
      x: Math.random() * w,
      y: Math.random() * h,
      baseX: Math.random() * w,
      baseY: Math.random() * h,
      radius: Math.random() * 2.5 + 0.5,
      alpha: Math.random() * 0.5 + 0.2,
      phase: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.003 + 0.001,
      nodeIndex: Math.floor(Math.random() * NODE_COUNT),
    };
  }

  function initParticles() {
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(createParticle());
    }
  }

  // ─── Standing wave nodes ───
  function getNodeY(index, time) {
    const h = canvasRect.height;
    const spacing = h / (NODE_COUNT + 1);
    const baseY = spacing * (index + 1);
    return baseY + Math.sin(time * 0.5 + index * 0.8) * 8;
  }

  // ─── Animation Loop ───
  function draw(time) {
    const w = canvasRect.width;
    const h = canvasRect.height;

    ctx.clearRect(0, 0, w, h);

    // Draw standing wave lines
    for (let i = 0; i < NODE_COUNT; i++) {
      const nodeY = getNodeY(i, time * 0.001);
      ctx.beginPath();
      ctx.strokeStyle = `rgba(${GOLD.r}, ${GOLD.g}, ${GOLD.b}, 0.06)`;
      ctx.lineWidth = 1;

      for (let x = 0; x < w; x += 2) {
        const wave = Math.sin((x / w) * Math.PI * 4 + time * 0.001 + i) * 3;
        const mouseInfluence = Math.exp(-Math.pow((x / w - mouseX) * 3, 2)) * 8 * (mouseY - 0.5);
        const y = nodeY + wave + mouseInfluence;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    // Draw particles
    particles.forEach(p => {
      p.phase += p.speed;

      const targetNodeY = getNodeY(p.nodeIndex, time * 0.001);
      const driftX = Math.sin(p.phase) * 20;
      const driftY = Math.cos(p.phase * 0.7) * 6;

      // Mouse repulsion
      const dx = (mouseX * w) - p.baseX;
      const dy = (mouseY * h) - p.baseY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const repulse = Math.max(0, 1 - dist / 150) * 30;
      const repulseX = dist > 0 ? (-dx / dist) * repulse : 0;
      const repulseY = dist > 0 ? (-dy / dist) * repulse : 0;

      const targetX = p.baseX + driftX + repulseX;
      const targetY = targetNodeY + driftY + repulseY;

      p.x += (targetX - p.x) * 0.04;
      p.y += (targetY - p.y) * 0.04;

      // Draw
      const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 3);
      gradient.addColorStop(0, `rgba(${GOLD.r}, ${GOLD.g}, ${GOLD.b}, ${p.alpha * 0.8})`);
      gradient.addColorStop(0.5, `rgba(${GOLD.r}, ${GOLD.g}, ${GOLD.b}, ${p.alpha * 0.3})`);
      gradient.addColorStop(1, `rgba(${GOLD.r}, ${GOLD.g}, ${GOLD.b}, 0)`);

      ctx.beginPath();
      ctx.fillStyle = gradient;
      ctx.arc(p.x, p.y, p.radius * 3, 0, Math.PI * 2);
      ctx.fill();

      // Core dot
      ctx.beginPath();
      ctx.fillStyle = `rgba(${SURFACE.r}, ${SURFACE.g}, ${SURFACE.b}, ${p.alpha})`;
      ctx.arc(p.x, p.y, p.radius * 0.6, 0, Math.PI * 2);
      ctx.fill();
    });

    // Draw connecting lines between nearby particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i];
        const b = particles[j];
        const dist = Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
        if (dist < 80) {
          const alpha = (1 - dist / 80) * 0.08;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(${GOLD.r}, ${GOLD.g}, ${GOLD.b}, ${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    animationId = requestAnimationFrame(draw);
  }

  // ─── Mouse tracking ───
  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseX = (e.clientX - rect.left) / rect.width;
    mouseY = (e.clientY - rect.top) / rect.height;
  });

  canvas.addEventListener('mouseleave', () => {
    mouseX = 0.5;
    mouseY = 0.5;
  });

  // ─── Init ───
  function init() {
    if (prefersReducedMotion) {
      // Static render
      resize();
      initParticles();
      draw(0);
      cancelAnimationFrame(animationId);
      return;
    }

    resize();
    initParticles();

    // Only animate when visible
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          animationId = requestAnimationFrame(draw);
        } else {
          cancelAnimationFrame(animationId);
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(canvas);
  }

  window.addEventListener('resize', () => {
    resize();
    initParticles();
  });

  window.AntigravityAcoustic = { init };
})();
