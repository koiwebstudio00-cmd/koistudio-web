export const CUPO_KEY = 'koi-cupo-10';
export const CUPO_TTL = 7 * 24 * 60 * 60 * 1000;
export const CUPO_DELAY = 7000;
export const CUPO_TEXT = 'Hola, quiero la auditoría gratuita';

export function cupoUrl(whatsapp = '5493813359456') {
  return `https://wa.me/${String(whatsapp).replace(/\D/g, '')}?text=${encodeURIComponent(CUPO_TEXT)}`;
}

export function cupoBlocked(raw, now = Date.now()) {
  if (!raw) return false;
  try {
    const data = JSON.parse(raw);
    return typeof data?.until === 'number' && data.until > now;
  } catch {
    return false;
  }
}

export function cupoMarkup(whatsapp) {
  const href = cupoUrl(whatsapp);
  return `<dialog class="cupo" id="cupo" aria-labelledby="cupo-title" aria-describedby="cupo-body" data-lenis-prevent>
  <div class="cupo-panel">
    <button type="button" class="cupo-close" data-cupo-close aria-label="Cerrar">
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M6 6l12 12M18 6 6 18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
    </button>
    <div class="cupo-copy">
      <p class="eyebrow">Cupos limitados</p>
      <h2 id="cupo-title" tabindex="-1">Quedan 3 lugares</h2>
      <p id="cupo-body">Estamos eligiendo 10 empresas de Tucumán para automatizar sus procesos con IA: ventas, atención por WhatsApp, administración y lo que hoy les come horas. Ya tenemos 7. Si querés uno de los 3 lugares que quedan, escribinos y te damos una auditoría gratuita para ver qué se puede automatizar en tu empresa.</p>
      <a class="button primary" href="${href}" target="_blank" rel="noopener noreferrer">Quiero mi auditoría gratis</a>
      <p class="cupo-note">Te respondemos por WhatsApp. Sin compromiso.</p>
    </div>
  </div>
</dialog>`;
}

export function startCupo(dialog, { lenis, onOpen } = {}) {
  if (!dialog) return;
  const storageKey = CUPO_KEY;
  let remembered = false;
  let scheduled = false;
  let returnFocus = null;

  function blocked() {
    try { return cupoBlocked(localStorage.getItem(storageKey)); } catch { return false; }
  }

  function remember() {
    remembered = true;
    try { localStorage.setItem(storageKey, JSON.stringify({ until: Date.now() + CUPO_TTL })); } catch { /* private mode */ }
  }

  function open() {
    if (remembered || blocked() || dialog.open || scheduled) return;
    scheduled = true;
    clearTimeout(timer);
    document.documentElement.removeEventListener('mouseleave', onLeave);
    returnFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    onOpen?.();
    dialog.showModal();
    lenis?.stop?.();
    dialog.querySelector('#cupo-title')?.focus();
  }

  function dismiss() {
    remember();
    if (dialog.open) dialog.close();
  }

  const timer = setTimeout(open, CUPO_DELAY);
  function onLeave(event) {
    if (event.clientY > 0) return;
    if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    open();
  }
  if (!blocked()) document.documentElement.addEventListener('mouseleave', onLeave);
  else clearTimeout(timer);

  dialog.addEventListener('cancel', event => {
    event.preventDefault();
    dismiss();
  });
  dialog.addEventListener('close', () => {
    lenis?.start?.();
    if (returnFocus?.isConnected) returnFocus.focus();
  });
  dialog.addEventListener('keydown', event => {
    if (event.key !== 'Tab') return;
    const items = [...dialog.querySelectorAll('button, a[href]')]
      .filter(element => !element.disabled && element.getClientRects().length);
    if (!items.length) return;
    const first = items[0];
    const last = items.at(-1);
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    const outside = event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom;
    if (outside) dismiss();
  });
  dialog.querySelector('[data-cupo-close]')?.addEventListener('click', dismiss);
  dialog.querySelector('a[href]')?.addEventListener('click', dismiss);
}
