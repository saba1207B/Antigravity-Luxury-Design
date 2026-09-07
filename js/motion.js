/* ═══════════════════════════════════════════════════════════════
   ANTIGRAVITY — SCROLL REVEAL & MOTION
   ═══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal');

    if (prefersReducedMotion) {
      // Immediately show all elements
      revealElements.forEach(el => {
        el.classList.add('is-visible');
        el.style.transitionDelay = '0ms';
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    revealElements.forEach(el => observer.observe(el));
  }

  // Expose for app.js orchestration
  window.AntigravityMotion = { init: initScrollReveal };
})();
