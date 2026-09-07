/* ═══════════════════════════════════════════════════════════════
   ANTIGRAVITY — PILL NAVIGATION & MOBILE DRAWER
   ═══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  const SCROLL_THRESHOLD = 48;
  const nav = document.getElementById('nav-pill');
  const toggle = document.getElementById('nav-toggle');
  const drawer = document.getElementById('nav-drawer');
  const drawerLinks = drawer ? drawer.querySelectorAll('.nav-link') : [];

  let isCompact = false;

  // ─── Shrinking on scroll ───
  function handleScroll() {
    const shouldBeCompact = window.scrollY > SCROLL_THRESHOLD;
    if (shouldBeCompact !== isCompact) {
      isCompact = shouldBeCompact;
      nav.classList.toggle('is-compact', isCompact);
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Initial check

  // ─── Mobile Toggle ───
  function openDrawer() {
    toggle.classList.add('is-open');
    toggle.setAttribute('aria-expanded', 'true');
    drawer.classList.add('is-open');
    drawer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Focus first link
    requestAnimationFrame(() => {
      const firstLink = drawer.querySelector('.nav-link');
      if (firstLink) firstLink.focus();
    });
  }

  function closeDrawer() {
    toggle.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    drawer.classList.remove('is-open');
    drawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    toggle.focus();
  }

  if (toggle) {
    toggle.addEventListener('click', () => {
      const isOpen = toggle.classList.contains('is-open');
      isOpen ? closeDrawer() : openDrawer();
    });
  }

  // Close drawer on link click
  drawerLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  // Escape key handler
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('is-open')) {
      closeDrawer();
    }
  });

  // Focus trap inside drawer
  if (drawer) {
    drawer.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab') return;
      const focusable = drawer.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])');
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

  // Expose
  window.AntigravityNav = { openDrawer, closeDrawer };
})();
