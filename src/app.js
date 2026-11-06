import Lenis from './lenis.js';

const lenis = new Lenis({ autoRaf: true, lerp: 0.095, stopInertiaOnNavigate: true });

const videoReveal = document.querySelector('.vsl-reveal');
if (videoReveal) {
  const motion = matchMedia('(prefers-reduced-motion: reduce)');

  function revealVideo() {
    if (motion.matches) return;
    const viewportHeight = window.innerHeight;
    const top = videoReveal.getBoundingClientRect().top;
    const progress = Math.max(0, Math.min(1, (viewportHeight - top) / (viewportHeight * 0.48)));
    const remaining = 1 - progress;
    videoReveal.style.setProperty('--vsl-offset', `${remaining * Math.min(118, viewportHeight * 0.14)}px`);
    videoReveal.style.setProperty('--vsl-scale', String(1 - remaining * 0.08));
    videoReveal.style.setProperty('--vsl-opacity', String(1 - remaining * 0.73));
  }

  lenis.on('scroll', revealVideo);
  window.addEventListener('resize', revealVideo);
  window.addEventListener('pageshow', revealVideo);
  motion.addEventListener('change', revealVideo);
  document.fonts.ready.then(revealVideo);
  revealVideo();
}

document.addEventListener('click', event => {
  if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  const link = event.target.closest('a[href]');
  if (!link || link.target || link.hasAttribute('download') || link.classList.contains('skip')) return;
  const url = new URL(link.href);
  if (url.origin !== location.origin || url.pathname !== location.pathname || url.search !== location.search || !url.hash) return;
  let id;
  try { id = decodeURIComponent(url.hash.slice(1)); } catch { return; }
  const target = document.getElementById(id);
  if (!target) return;
  event.preventDefault();
  if (location.hash !== url.hash) history.pushState(null, '', url.hash);
  if (!target.hasAttribute('tabindex')) target.tabIndex = -1;
  target.focus({ preventScroll: true });
  lenis.scrollTo(target);
});

const menuButton = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('#mobile-nav');

function setMenu(open) {
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  mobileNav.hidden = !open;
}

menuButton.addEventListener('click', () => setMenu(mobileNav.hidden));
mobileNav.addEventListener('click', event => {
  if (event.target.closest('a')) setMenu(false);
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && !mobileNav.hidden) {
    setMenu(false);
    menuButton.focus();
  }
});
matchMedia('(min-width: 701px)').addEventListener('change', event => {
  if (event.matches) setMenu(false);
});

if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.remove('enter-pending');
      entry.target.classList.add('entering');
      observer.unobserve(entry.target);
    }
  }, { threshold: 0.08 });
  document.querySelectorAll('[data-enter]').forEach(element => {
    if (element.dataset.enter === 'card') element.classList.add('enter-pending');
    observer.observe(element);
  });
}
