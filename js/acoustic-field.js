/* ANTIGRAVITY — PERFORMANCE-OPTIMIZED ACOUSTIC FIELD */
(function () {
  'use strict';

  const canvas = document.getElementById('acoustic-field-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d', { alpha: true });
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const mobileQuery = window.matchMedia('(max-width: 767px)');

  const GOLD = 'rgba(212,175,55,0.10)';
  const GOLD_DOT = 'rgba(212,175,55,0.38)';
  const SURFACE = 'rgba(250,249,246,0.75)';
  const NODE_COUNT = 4;

  let particles = [];
  let width = 0;
  let height = 0;
  let dpr = 1;
  let frame = 0;
  let running = false;
  let visible = false;
  let lastFrame = 0;
  let mouseX = 0.5;
  let mouseY = 0.5;

  function isMobile() {
    return mobileQuery.matches;
  }

  function targetFPS() {
    return isMobile() ? 30 : 45;
  }

  function resize() {
    const rect = canvas.parentElement.getBoundingClientRect();
    width = Math.max(1, rect.width);
    height = Math.max(1, rect.height);
    // Cap backing-store resolution. High-DPI phones otherwise multiply canvas work.
    dpr = isMobile() ? 1 : Math.min(window.devicePixelRatio || 1, 1.5);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    createParticles();
  }

  function createParticles() {
    const count = reducedMotion.matches ? 16 : (isMobile() ? 24 : 55);
    particles = Array.from({ length: count }, (_, i) => ({
      x: Math.random() * width,
      y: Math.random() * height,
      baseX: Math.random() * width,
      baseY: Math.random() * height,
      radius: Math.random() * 1.8 + 0.6,
      alpha: Math.random() * 0.35 + 0.18,
      phase: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.002 + 0.0008,
      node: i % NODE_COUNT
    }));
  }

  function nodeY(index, time) {
    const spacing = height / (NODE_COUNT + 1);
    return spacing * (index + 1) + Math.sin(time * 0.0005 + index * 0.8) * (isMobile() ? 5 : 8);
  }

  function draw(timestamp) {
    if (!running || document.hidden) return;

    const interval = 1000 / targetFPS();
    if (timestamp - lastFrame < interval) {
      frame = requestAnimationFrame(draw);
      return;
    }
    lastFrame = timestamp;

    ctx.clearRect(0, 0, width, height);
    const time = timestamp;

    // Lightweight wave lines. Fewer samples on mobile.
    const step = isMobile() ? 8 : 5;
    for (let i = 0; i < NODE_COUNT; i++) {
      const y0 = nodeY(i, time);
      ctx.beginPath();
      ctx.strokeStyle = GOLD;
      ctx.lineWidth = 1;
      for (let x = 0; x <= width; x += step) {
        const wave = Math.sin((x / width) * Math.PI * 4 + time * 0.001 + i) * (isMobile() ? 2 : 3);
        const mouse = isMobile() ? 0 : Math.exp(-((x / width - mouseX) ** 2) * 18) * 6 * (mouseY - 0.5);
        const y = y0 + wave + mouse;
        if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    for (const p of particles) {
      p.phase += p.speed * (isMobile() ? 0.8 : 1);
      const targetY = nodeY(p.node, time);
      const driftX = Math.sin(p.phase) * (isMobile() ? 10 : 18);
      const driftY = Math.cos(p.phase * 0.7) * 5;

      let rx = 0, ry = 0;
      if (!isMobile()) {
        const dx = mouseX * width - p.baseX;
        const dy = mouseY * height - p.baseY;
        const distSq = dx * dx + dy * dy;
        if (distSq < 22500 && distSq > 1) {
          const dist = Math.sqrt(distSq);
          const force = (1 - dist / 150) * 22;
          rx = (-dx / dist) * force;
          ry = (-dy / dist) * force;
        }
      }

      p.x += (p.baseX + driftX + rx - p.x) * 0.045;
      p.y += (targetY + driftY + ry - p.y) * 0.045;

      ctx.beginPath();
      ctx.fillStyle = GOLD_DOT;
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.fillStyle = SURFACE;
      ctx.arc(p.x, p.y, p.radius * 0.45, 0, Math.PI * 2);
      ctx.fill();
    }

    // Connecting lines are desktop-only and limited to a small neighborhood.
    if (!isMobile()) {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i], b = particles[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const distSq = dx * dx + dy * dy;
          if (distSq < 3600) {
            const alpha = (1 - Math.sqrt(distSq) / 60) * 0.06;
            ctx.strokeStyle = `rgba(212,175,55,${alpha})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
    }

    frame = requestAnimationFrame(draw);
  }

  function start() {
    if (running || reducedMotion.matches || !visible) return;
    running = true;
    lastFrame = 0;
    frame = requestAnimationFrame(draw);
  }

  function stop() {
    running = false;
    cancelAnimationFrame(frame);
  }

  function init() {
    resize();

    if (reducedMotion.matches) return;

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start(); else stop();
    }, { threshold: 0.05, rootMargin: '100px' });
    observer.observe(canvas);

    canvas.addEventListener('pointermove', (e) => {
      if (isMobile()) return;
      const rect = canvas.getBoundingClientRect();
      mouseX = (e.clientX - rect.left) / rect.width;
      mouseY = (e.clientY - rect.top) / rect.height;
    }, { passive: true });

    document.addEventListener('visibilitychange', () => document.hidden ? stop() : start(), { passive: true });
    window.addEventListener('resize', resize, { passive: true });
  }

  window.AntigravityAcoustic = { init };
})();
