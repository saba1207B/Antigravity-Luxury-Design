/* ═══════════════════════════════════════════════════════════════
   ANTIGRAVITY — REACTIVE PARTICLE FIELD
   Replicates the Google Antigravity download page mouse-reactive
   confetti particle system: radial repulsion + spring return.
   ═══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    window.AntigravityReactiveCursor = { init() {} };
    return;
  }

  // ═══════════════════════════════════════════════════════════════
  // CONFIGURATION
  // ═══════════════════════════════════════════════════════════════

  const CONFIG = {
    // Particle counts
    particleCount: 180,          // Total number of particles
    particleDensityMobile: 90,   // Reduced count on mobile

    // Particle appearance
    minSize: 2,                  // Min particle size (px)
    maxSize: 5,                  // Max particle size (px)
    dashLength: 3.5,             // Length-to-width ratio for dash shapes
    dotRatio: 0.35,              // Fraction of particles that are round dots vs dashes

    // Mouse repulsion physics
    repulsionRadius: 200,        // Radius of cursor force field (px)
    repulsionStrength: 8,        // How strongly particles are pushed
    velocityDamping: 0.92,       // Friction / velocity decay (0-1, lower = more friction)
    springStiffness: 0.035,      // Spring constant pulling back to origin (higher = snappier)

    // Idle drift animation
    driftAmplitude: 15,          // Max pixel drift when idle
    driftSpeed: 0.0008,          // Drift animation speed

    // Visual
    globalAlpha: 0.75,           // Base opacity of particles
    canvasFadeDuration: 800,     // Fade-in duration (ms)
  };

  // ─── Brand Color Palette (Gold/Champagne accented) ───
  // Adapted from the luxury design system's gold and obsidian palette
  const COLORS = [
    { r: 212, g: 175, b: 55  },  // Royal Gold
    { r: 231, g: 200, b: 115 },  // Champagne Gold
    { r: 166, g: 124, b: 31  },  // Antique Gold
    { r: 74,  g: 72,  b: 67  },  // Ink Secondary (dark)
    { r: 122, g: 119, b: 110 },  // Ink Tertiary (mid grey)
    { r: 59,  g: 100, b: 176 },  // Accent blue
    { r: 176, g: 59,  b: 59  },  // Accent muted red
    { r: 200, g: 196, b: 186 },  // Stone (light)
  ];

  // ═══════════════════════════════════════════════════════════════
  // STATE
  // ═══════════════════════════════════════════════════════════════

  let canvas = null;
  let ctx = null;
  let particles = [];
  let mouseX = -9999;
  let mouseY = -9999;
  let isMouseActive = false;
  let animationId = null;
  let dpr = 1;
  let canvasW = 0;
  let canvasH = 0;
  let startTime = 0;
  let canvasOpacity = 0;

  // ═══════════════════════════════════════════════════════════════
  // PARTICLE CLASS
  // ═══════════════════════════════════════════════════════════════

  class Particle {
    constructor(x, y, section) {
      // Origin (home position)
      this.originX = x;
      this.originY = y;

      // Current position
      this.x = x;
      this.y = y;

      // Velocity
      this.vx = 0;
      this.vy = 0;

      // Rotation angle (radians)
      this.angle = Math.random() * Math.PI * 2;
      this.baseAngle = this.angle;

      // Appearance
      this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
      this.size = CONFIG.minSize + Math.random() * (CONFIG.maxSize - CONFIG.minSize);
      this.isDot = Math.random() < CONFIG.dotRatio;
      this.alpha = 0.4 + Math.random() * 0.5;

      // Drift phase (for idle floating)
      this.driftPhaseX = Math.random() * Math.PI * 2;
      this.driftPhaseY = Math.random() * Math.PI * 2;
      this.driftSpeedX = CONFIG.driftSpeed * (0.5 + Math.random());
      this.driftSpeedY = CONFIG.driftSpeed * (0.7 + Math.random() * 0.6);

      // Which section this particle belongs to (for scoped rendering)
      this.section = section;
    }

    update(time) {
      // ─── Mouse repulsion ───
      const dx = this.x - mouseX;
      const dy = this.y - mouseY;
      const distSq = dx * dx + dy * dy;
      const radius = CONFIG.repulsionRadius;
      const radiusSq = radius * radius;

      if (isMouseActive && distSq < radiusSq && distSq > 0.01) {
        const dist = Math.sqrt(distSq);
        const force = (1 - dist / radius) * CONFIG.repulsionStrength;
        const angle = Math.atan2(dy, dx);
        this.vx += Math.cos(angle) * force;
        this.vy += Math.sin(angle) * force;
      }

      // ─── Spring return to origin + idle drift ───
      const driftX = Math.sin(time * this.driftSpeedX + this.driftPhaseX) * CONFIG.driftAmplitude;
      const driftY = Math.cos(time * this.driftSpeedY + this.driftPhaseY) * CONFIG.driftAmplitude * 0.6;

      const targetX = this.originX + driftX;
      const targetY = this.originY + driftY;

      this.vx += (targetX - this.x) * CONFIG.springStiffness;
      this.vy += (targetY - this.y) * CONFIG.springStiffness;

      // ─── Apply velocity with damping ───
      this.vx *= CONFIG.velocityDamping;
      this.vy *= CONFIG.velocityDamping;
      this.x += this.vx;
      this.y += this.vy;

      // ─── Rotation: align with velocity when moving fast ───
      const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
      if (speed > 0.5) {
        const velocityAngle = Math.atan2(this.vy, this.vx);
        // Blend toward velocity angle proportional to speed
        const blendFactor = Math.min(speed / 8, 1) * 0.3;
        this.angle += angleDiff(velocityAngle, this.angle) * blendFactor;
      } else {
        // Slowly return to base angle
        this.angle += angleDiff(this.baseAngle, this.angle) * 0.02;
      }
    }

    draw(ctx) {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle);
      ctx.globalAlpha = this.alpha * CONFIG.globalAlpha;

      const { r, g, b } = this.color;
      ctx.fillStyle = `rgb(${r},${g},${b})`;

      if (this.isDot) {
        // Round dot
        ctx.beginPath();
        ctx.arc(0, 0, this.size * 0.5, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Dash / elongated rectangle with rounded ends
        const halfW = this.size * CONFIG.dashLength * 0.5;
        const halfH = this.size * 0.4;
        const r2 = halfH;

        ctx.beginPath();
        ctx.moveTo(-halfW + r2, -halfH);
        ctx.lineTo(halfW - r2, -halfH);
        ctx.arcTo(halfW, -halfH, halfW, -halfH + r2, r2);
        ctx.lineTo(halfW, halfH - r2);
        ctx.arcTo(halfW, halfH, halfW - r2, halfH, r2);
        ctx.lineTo(-halfW + r2, halfH);
        ctx.arcTo(-halfW, halfH, -halfW, halfH - r2, r2);
        ctx.lineTo(-halfW, -halfH + r2);
        ctx.arcTo(-halfW, -halfH, -halfW + r2, -halfH, r2);
        ctx.closePath();
        ctx.fill();
      }

      ctx.restore();
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // HELPER: Shortest angle difference
  // ═══════════════════════════════════════════════════════════════

  function angleDiff(target, current) {
    let diff = target - current;
    while (diff > Math.PI) diff -= Math.PI * 2;
    while (diff < -Math.PI) diff += Math.PI * 2;
    return diff;
  }

  // ═══════════════════════════════════════════════════════════════
  // CANVAS SETUP
  // ═══════════════════════════════════════════════════════════════

  function createCanvas() {
    canvas = document.createElement('canvas');
    canvas.className = 'reactive-particle-canvas';
    canvas.id = 'reactive-particle-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    document.body.appendChild(canvas);
    ctx = canvas.getContext('2d');
  }

  function resizeCanvas() {
    dpr = window.devicePixelRatio || 1;
    canvasW = window.innerWidth;
    canvasH = document.documentElement.scrollHeight;

    canvas.width = canvasW * dpr;
    canvas.height = canvasH * dpr;
    canvas.style.width = canvasW + 'px';
    canvas.style.height = canvasH + 'px';

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  // ═══════════════════════════════════════════════════════════════
  // PARTICLE GENERATION
  // ═══════════════════════════════════════════════════════════════

  function generateParticles() {
    particles = [];

    const isMobile = window.innerWidth < 768;
    const count = isMobile ? CONFIG.particleDensityMobile : CONFIG.particleCount;

    // Identify sections to populate with particles
    const sections = getSections();

    sections.forEach(section => {
      const sectionParticleCount = Math.round(count * section.weight);

      for (let i = 0; i < sectionParticleCount; i++) {
        // Distribute particles across the section area with some margin
        const margin = 40;
        const x = margin + Math.random() * (section.width - margin * 2);
        const y = section.top + margin + Math.random() * (section.height - margin * 2);

        particles.push(new Particle(x, y, section.id));
      }
    });
  }

  function getSections() {
    const sections = [];
    const scrollY = 0; // Particles use page coordinates

    // Hero section — primary particle zone
    const hero = document.querySelector('.hero');
    if (hero) {
      const rect = hero.getBoundingClientRect();
      sections.push({
        id: 'hero',
        top: rect.top + window.scrollY,
        height: rect.height,
        width: canvasW,
        weight: 0.4,
      });
    }

    // Brand statement
    const brand = document.querySelector('.brand-statement');
    if (brand) {
      const rect = brand.getBoundingClientRect();
      sections.push({
        id: 'brand',
        top: rect.top + window.scrollY,
        height: rect.height,
        width: canvasW,
        weight: 0.15,
      });
    }

    // Bento section
    const bento = document.querySelector('.bento-section');
    if (bento) {
      const rect = bento.getBoundingClientRect();
      sections.push({
        id: 'bento',
        top: rect.top + window.scrollY,
        height: rect.height,
        width: canvasW,
        weight: 0.2,
      });
    }

    // Philosophy
    const philosophy = document.querySelector('.philosophy');
    if (philosophy) {
      const rect = philosophy.getBoundingClientRect();
      sections.push({
        id: 'philosophy',
        top: rect.top + window.scrollY,
        height: rect.height,
        width: canvasW,
        weight: 0.15,
      });
    }

    // CTA section
    const cta = document.querySelector('.cta-section');
    if (cta) {
      const rect = cta.getBoundingClientRect();
      sections.push({
        id: 'cta',
        top: rect.top + window.scrollY,
        height: rect.height,
        width: canvasW,
        weight: 0.1,
      });
    }

    // Fallback: if no sections found, distribute across full page
    if (sections.length === 0) {
      sections.push({
        id: 'page',
        top: 0,
        height: canvasH,
        width: canvasW,
        weight: 1.0,
      });
    }

    return sections;
  }

  // ═══════════════════════════════════════════════════════════════
  // ANIMATION LOOP
  // ═══════════════════════════════════════════════════════════════

  function tick(timestamp) {
    if (!startTime) startTime = timestamp;
    const elapsed = timestamp - startTime;
    const time = timestamp;

    // Fade in canvas
    if (canvasOpacity < 1) {
      canvasOpacity = Math.min(1, elapsed / CONFIG.canvasFadeDuration);
      canvas.style.opacity = canvasOpacity;
    }

    // Get visible region for culling
    const scrollY = window.scrollY;
    const viewTop = scrollY - 100;
    const viewBottom = scrollY + window.innerHeight + 100;

    // Clear only the visible region (performance)
    ctx.clearRect(0, viewTop, canvasW, viewBottom - viewTop + 200);

    // Update & draw particles
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      // Cull particles far from viewport
      if (p.y < viewTop - 50 || p.y > viewBottom + 50) continue;

      p.update(time);
      p.draw(ctx);
    }

    animationId = requestAnimationFrame(tick);
  }

  // ═══════════════════════════════════════════════════════════════
  // MOUSE TRACKING
  // ═══════════════════════════════════════════════════════════════

  function onMouseMove(e) {
    mouseX = e.clientX;
    mouseY = e.clientY + window.scrollY; // Convert to page coordinates
    isMouseActive = true;
  }

  function onMouseLeave() {
    isMouseActive = false;
    mouseX = -9999;
    mouseY = -9999;
  }

  // Touch support — treat touch as mouse
  function onTouchMove(e) {
    if (e.touches.length > 0) {
      mouseX = e.touches[0].clientX;
      mouseY = e.touches[0].clientY + window.scrollY;
      isMouseActive = true;
    }
  }

  function onTouchEnd() {
    isMouseActive = false;
    mouseX = -9999;
    mouseY = -9999;
  }

  // ═══════════════════════════════════════════════════════════════
  // INITIALIZATION
  // ═══════════════════════════════════════════════════════════════

  function init() {
    createCanvas();
    resizeCanvas();
    generateParticles();

    // Events
    document.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('touchmove', onTouchMove, { passive: true });
    document.addEventListener('touchend', onTouchEnd);

    // Handle resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        resizeCanvas();
        generateParticles();
      }, 300);
    });

    // Start animation
    canvas.style.opacity = 0;
    animationId = requestAnimationFrame(tick);
  }

  window.AntigravityReactiveCursor = { init };
})();
