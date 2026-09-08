/* ANTIGRAVITY — PERFORMANCE-OPTIMIZED REACTIVE PARTICLES */
(function () {
  'use strict';

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const mobileQuery = window.matchMedia('(max-width: 767px)');

  if (reducedMotion.matches) {
    window.AntigravityReactiveCursor = { init() {} };
    return;
  }

  const COLORS = [
    'rgb(212,175,55)', 'rgb(231,200,115)', 'rgb(166,124,31)',
    'rgb(74,72,67)', 'rgb(122,119,110)', 'rgb(59,100,176)',
    'rgb(176,59,59)', 'rgb(200,196,186)'
  ];

  let canvas, ctx;
  let particles = [];
  let animationId = 0;
  let running = false;
  let visible = true;
  let width = 0;
  let pageHeight = 0;
  let dpr = 1;
  let mouseX = -9999;
  let mouseY = -9999;
  let lastFrame = 0;
  let startTime = 0;

  const mobile = () => mobileQuery.matches;
  const fps = () => mobile() ? 30 : 45;

  function createCanvas() {
    if (canvas) return;
    canvas = document.createElement('canvas');
    canvas.className = 'reactive-particle-canvas';
    canvas.id = 'reactive-particle-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    document.body.appendChild(canvas);
    ctx = canvas.getContext('2d', { alpha: true });
  }

  function getSections() {
    const definitions = [
      ['.hero', 0.40], ['.brand-statement', 0.15],
      ['.bento-section', 0.20], ['.philosophy', 0.15], ['.cta-section', 0.10]
    ];
    const result = [];
    for (const [selector, weight] of definitions) {
      const el = document.querySelector(selector);
      if (!el) continue;
      const r = el.getBoundingClientRect();
      result.push({ top: r.top + window.scrollY, height: r.height, weight });
    }
    return result.length ? result : [{ top: 0, height: pageHeight, weight: 1 }];
  }

  function resize() {
    width = window.innerWidth;
    pageHeight = Math.max(document.documentElement.scrollHeight, window.innerHeight);
    dpr = mobile() ? 1 : Math.min(window.devicePixelRatio || 1, 1.5);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(pageHeight * dpr);
    canvas.style.width = width + 'px';
    canvas.style.height = pageHeight + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    createParticles();
  }

  function createParticles() {
    const count = mobile() ? 38 : 120;
    particles = [];
    for (const section of getSections()) {
      const n = Math.max(1, Math.round(count * section.weight));
      const margin = mobile() ? 24 : 40;
      for (let i = 0; i < n; i++) {
        const p = {
          ox: margin + Math.random() * Math.max(1, width - margin * 2),
          oy: section.top + margin + Math.random() * Math.max(1, section.height - margin * 2),
          x: 0, y: 0, vx: 0, vy: 0,
          size: 1.5 + Math.random() * (mobile() ? 2 : 3),
          alpha: 0.35 + Math.random() * 0.45,
          color: COLORS[(Math.random() * COLORS.length) | 0],
          dot: Math.random() < 0.4,
          phase: Math.random() * Math.PI * 2,
          speed: 0.00035 + Math.random() * 0.0005
        };
        p.x = p.ox; p.y = p.oy;
        particles.push(p);
      }
    }
  }

  function updateAndDraw(p, time) {
    const isMobile = mobile();
    const driftX = Math.sin(time * p.speed + p.phase) * (isMobile ? 7 : 13);
    const driftY = Math.cos(time * p.speed * 1.2 + p.phase) * (isMobile ? 3 : 7);

    if (!isMobile) {
      const dx = p.x - mouseX;
      const dy = p.y - mouseY;
      const distSq = dx * dx + dy * dy;
      const radius = 170;
      if (distSq < radius * radius && distSq > 0.01) {
        const dist = Math.sqrt(distSq);
        const force = (1 - dist / radius) * 5.5;
        p.vx += (dx / dist) * force;
        p.vy += (dy / dist) * force;
      }
    }

    p.vx += (p.ox + driftX - p.x) * 0.025;
    p.vy += (p.oy + driftY - p.y) * 0.025;
    p.vx *= 0.90;
    p.vy *= 0.90;
    p.x += p.vx;
    p.y += p.vy;

    ctx.globalAlpha = p.alpha * 0.75;
    ctx.fillStyle = p.color;
    if (p.dot) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * 0.45, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillRect(p.x - p.size * 1.5, p.y - p.size * 0.35, p.size * 3, p.size * 0.7);
    }
  }

  function tick(timestamp) {
    if (!running || document.hidden) return;
    const interval = 1000 / fps();
    if (timestamp - lastFrame < interval) {
      animationId = requestAnimationFrame(tick);
      return;
    }
    lastFrame = timestamp;
    if (!startTime) startTime = timestamp;

    const top = Math.max(0, window.scrollY - 80);
    const bottom = Math.min(pageHeight, window.scrollY + window.innerHeight + 80);
    ctx.clearRect(0, top, width, bottom - top);

    for (const p of particles) {
      if (p.y >= top - 60 && p.y <= bottom + 60) updateAndDraw(p, timestamp);
    }
    ctx.globalAlpha = 1;
    canvas.style.opacity = Math.min(1, (timestamp - startTime) / 600);
    animationId = requestAnimationFrame(tick);
  }

  function start() {
    if (running || !visible || document.hidden) return;
    running = true;
    lastFrame = 0;
    animationId = requestAnimationFrame(tick);
  }

  function stop() {
    running = false;
    cancelAnimationFrame(animationId);
  }

  function init() {
    createCanvas();
    resize();

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start(); else stop();
    }, { threshold: 0, rootMargin: '150px' });
    observer.observe(document.documentElement);

    if (!mobile()) {
      window.addEventListener('pointermove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY + window.scrollY;
      }, { passive: true });
      window.addEventListener('pointerleave', () => {
        mouseX = -9999;
        mouseY = -9999;
      }, { passive: true });
    }

    document.addEventListener('visibilitychange', () => document.hidden ? stop() : start());
    window.addEventListener('resize', resize, { passive: true });
    start();
  }

  window.AntigravityReactiveCursor = { init };
})();
