/* ═══════════════════════════════════════════════════════════════
   ANTIGRAVITY — APP ORCHESTRATION
   ═══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  // ─── Commission Drawer ───
  const overlay = document.getElementById('modal-overlay');
  const drawer = document.getElementById('commission-drawer');
  const closeBtn = document.getElementById('drawer-close');

  const commissionTriggers = [
    'nav-commission-btn',
    'hero-commission-btn',
    'cta-commission-btn',
    'drawer-commission-btn',
  ];

  function openCommission() {
    if (!overlay || !drawer) return;
    overlay.classList.add('is-open');
    overlay.setAttribute('aria-hidden', 'false');
    drawer.classList.add('is-open');
    drawer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Focus first input
    requestAnimationFrame(() => {
      const input = drawer.querySelector('input, textarea');
      if (input) input.focus();
    });
  }

  function closeCommission() {
    if (!overlay || !drawer) return;
    overlay.classList.remove('is-open');
    overlay.setAttribute('aria-hidden', 'true');
    drawer.classList.remove('is-open');
    drawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  commissionTriggers.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('click', openCommission);
  });

  if (closeBtn) closeBtn.addEventListener('click', closeCommission);
  if (overlay) overlay.addEventListener('click', closeCommission);

  // Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer && drawer.classList.contains('is-open')) {
      closeCommission();
    }
  });

  // Focus trap in drawer
  if (drawer) {
    drawer.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab') return;
      const focusable = drawer.querySelectorAll(
        'input, textarea, select, button, [tabindex]:not([tabindex="-1"])'
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    });
  }

  // ─── Smooth scroll for anchor links ───
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ─── Initialize all modules ───
  document.addEventListener('DOMContentLoaded', () => {
    if (window.AntigravityMotion) window.AntigravityMotion.init();
    if (window.AntigravityAcoustic) window.AntigravityAcoustic.init();
    if (window.AntigravityBento) window.AntigravityBento.init();
    if (window.AntigravityReactiveCursor) window.AntigravityReactiveCursor.init();
  });
})();

