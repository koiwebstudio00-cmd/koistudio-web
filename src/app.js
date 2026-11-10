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
const productMenus = document.querySelectorAll('.product-menu');
const header = menuButton.closest('.header');

function syncHeader() {
  header.toggleAttribute('data-compact', window.scrollY > 56);
}

window.addEventListener('scroll', syncHeader, { passive: true });
window.addEventListener('pageshow', syncHeader);
syncHeader();

function setMenu(open) {
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  mobileNav.inert = !open;
  if (!open) mobileNav.querySelector('.product-menu').open = false;
}

menuButton.addEventListener('click', () => setMenu(mobileNav.inert));
mobileNav.addEventListener('click', event => {
  if (event.target.closest('a')) setMenu(false);
});
document.addEventListener('click', event => {
  if (!mobileNav.inert && !mobileNav.contains(event.target) && !menuButton.contains(event.target)) setMenu(false);
  for (const menu of productMenus) {
    if (!menu.contains(event.target)) menu.open = false;
  }
});
document.addEventListener('keydown', event => {
  if (event.key !== 'Escape') return;
  const openMenu = Array.from(productMenus).find(menu => menu.open && menu.getClientRects().length);
  if (openMenu) {
    openMenu.open = false;
    openMenu.querySelector('summary').focus();
  } else if (!mobileNav.inert) {
    setMenu(false);
    menuButton.focus();
  }
});
matchMedia('(min-width: 701px)').addEventListener('change', () => {
  setMenu(false);
  for (const menu of productMenus) menu.open = false;
});

const caseViewer = document.querySelector('.case-viewer');
if (caseViewer) {
  const image = caseViewer.querySelector('img');
  const caption = caseViewer.querySelector('p');
  let slides = [];
  let index = 0;

  function showSlide(nextIndex) {
    index = (nextIndex + slides.length) % slides.length;
    const link = slides[index];
    image.src = link.href;
    image.alt = link.querySelector('img').alt;
    caption.textContent = `${link.nextElementSibling.querySelector('h3').textContent} · ${index + 1} de ${slides.length}`;
  }

  document.querySelectorAll('.case-gallery').forEach(gallery => {
    gallery.addEventListener('click', event => {
      const link = event.target.closest('a');
      if (!link || event.button !== 0 || event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return;
      event.preventDefault();
      slides = Array.from(gallery.querySelectorAll('a'));
      showSlide(slides.indexOf(link));
      caseViewer.showModal();
    });
  });
  caseViewer.querySelector('button[autofocus]').addEventListener('click', () => caseViewer.close());
  caseViewer.querySelectorAll('[data-step]').forEach(button => {
    button.addEventListener('click', () => showSlide(index + Number(button.dataset.step)));
  });
  caseViewer.addEventListener('keydown', event => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    showSlide(index + (event.key === 'ArrowLeft' ? -1 : 1));
  });
}

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
