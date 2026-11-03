const menuButton = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('#mobile-nav');
function closeMenu() { menuButton.setAttribute('aria-expanded', 'false'); menuButton.setAttribute('aria-label', 'Abrir menú'); mobileNav.hidden = true; }
menuButton?.addEventListener('click', () => { const open = menuButton.getAttribute('aria-expanded') !== 'true'; menuButton.setAttribute('aria-expanded', String(open)); menuButton.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú'); mobileNav.hidden = !open; });
mobileNav?.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
document.addEventListener('keydown', event => { if (event.key === 'Escape' && !mobileNav.hidden) { closeMenu(); menuButton.focus(); } });
document.addEventListener('click', event => { if (!event.target.closest('.header') && !mobileNav.hidden) closeMenu(); });
matchMedia('(min-width: 801px)').addEventListener('change', event => { if(event.matches) closeMenu(); });
const filters = document.querySelectorAll('[data-filter]');
filters.forEach(button => button.addEventListener('click', () => { const selection = button.dataset.filter; filters.forEach(b => { b.classList.toggle('active', b === button); b.setAttribute('aria-pressed', String(b === button)); }); let count = 0; document.querySelectorAll('[data-category]').forEach(card => { card.hidden = selection !== 'all' && card.dataset.category !== selection; if (!card.hidden) { count++; card.classList.add('visible'); } }); document.querySelector('.result-count').textContent = `${count} ${count === 1 ? 'elemento' : 'elementos'}`; document.dispatchEvent(new Event('portfolio:filtered'));  }));
const form = document.querySelector('#contact-form');
if (form) {
 const interest = new URLSearchParams(location.search).get('interes');
 if ([...form.elements.interes.options].some(option => option.value === interest)) form.elements.interes.value = interest;
 let currentMessage = '', downloadURL;
 form.addEventListener('submit', event => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  const fields = new FormData(form);
  currentMessage = `Hola Koi Studio,\n\nSoy ${fields.get('nombre')}.\nEmail: ${fields.get('email')}\nEmpresa: ${fields.get('empresa') || 'No especificada'}\nInterés: ${fields.get('interes') || 'Consulta general'}\n\n${fields.get('mensaje')}\n\nAcepté compartir estos datos para conversar sobre mi consulta.`;
  const subject = `Consulta desde la web — ${fields.get('interes') || 'Nuevo proyecto'}`;
  if (downloadURL) URL.revokeObjectURL(downloadURL);
  downloadURL = URL.createObjectURL(new Blob([currentMessage], {type:'text/plain;charset=utf-8'}));
  document.querySelector('#download-message').href = downloadURL;
  document.querySelector('#form-fallback').hidden = false;
  document.querySelector('#form-status').textContent = 'Tu consulta está preparada, todavía no enviada. Revisá y enviá el correo en tu aplicación. Si no se abrió, copiá el mensaje y mandalo a ' + form.dataset.email + '.';
  const mailto = `mailto:${form.dataset.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(currentMessage)}`;
  if (mailto.length < 1900) window.location.href = mailto;
  else document.querySelector('#form-status').textContent = 'Tu consulta está preparada. Por su extensión, copiá o descargá el mensaje y envialo a ' + form.dataset.email + '. Todavía no se envió.';
 });
 document.querySelector('#copy-message').addEventListener('click', async () => { try { await navigator.clipboard.writeText(currentMessage); document.querySelector('#form-status').textContent = 'Mensaje copiado. Pegalo en un correo dirigido a ' + form.dataset.email + ' y envialo desde allí.'; } catch { document.querySelector('#form-status').textContent = 'El navegador no permitió copiar. Usá “Descargar consulta” para guardar el mensaje.'; } });
 window.addEventListener('pagehide', () => { if(downloadURL) URL.revokeObjectURL(downloadURL); });
}
