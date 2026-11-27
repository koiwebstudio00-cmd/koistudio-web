export const CUPO_KEY = 'koi-cupo-10';
export const CUPO_TTL = 7 * 24 * 60 * 60 * 1000;
export const CUPO_DELAY = 7000;

export function cupoDigits(value) {
  return String(value ?? '').replace(/\D/g, '');
}

export function cupoErrors(phone, company) {
  const errors = {};
  if (cupoDigits(phone).length < 8) errors.phone = 'Ingresá tu WhatsApp, con código de área.';
  if (String(company ?? '').trim().length < 2) errors.company = 'Ingresá el nombre de tu empresa o tus redes.';
  return errors;
}

export function cupoMessage(phone, company) {
  return [
    'Hola, equipo de Koi. Quiero mi asesoría gratis por uno de los lugares que quedan.',
    '',
    `Mi WhatsApp: ${String(phone).trim()}`,
    `Empresa o redes: ${String(company).trim()}`,
    'Origen: popup-cupo-10',
  ].join('\n');
}

export function cupoUrl(whatsapp, phone, company) {
  return `https://wa.me/${whatsapp}?text=${encodeURIComponent(cupoMessage(phone, company))}`;
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
  const number = String(whatsapp).replace(/\D/g, '');
  return `<dialog class="cupo" id="cupo" aria-labelledby="cupo-title" aria-describedby="cupo-body" data-whatsapp="${number}" data-lenis-prevent>
  <div class="cupo-panel">
    <button type="button" class="cupo-close" data-cupo-close aria-label="Cerrar">
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M6 6l12 12M18 6 6 18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
    </button>
    <form class="cupo-form" novalidate>
      <p class="eyebrow">Cupos limitados</p>
      <h2 id="cupo-title" tabindex="-1">Quedan 3 lugares</h2>
      <p id="cupo-body">Estamos eligiendo 10 empresas de Tucumán para automatizar sus procesos con IA: ventas, atención por WhatsApp, administración y lo que hoy les come horas. Ya tenemos 7. Si querés uno de los 3 lugares que quedan, dejanos tus datos y te damos una asesoría gratuita para ver qué se puede automatizar en tu empresa.</p>
      <div class="cupo-field">
        <label for="cupo-phone">Tu WhatsApp</label>
        <input id="cupo-phone" name="whatsapp" type="tel" required autocomplete="tel" inputmode="tel" maxlength="24" aria-describedby="cupo-phone-error">
        <p id="cupo-phone-error" class="cupo-error" role="alert" hidden></p>
      </div>
      <div class="cupo-field">
        <label for="cupo-company">Nombre de tu empresa o tus redes</label>
        <input id="cupo-company" name="company" type="text" required autocomplete="organization" maxlength="160" aria-describedby="cupo-company-error">
        <p id="cupo-company-error" class="cupo-error" role="alert" hidden></p>
      </div>
      <button class="button primary" type="submit">Quiero mi asesoría gratis</button>
      <p class="cupo-note">Te escribimos por WhatsApp. Sin compromiso.</p>
    </form>
    <p class="cupo-success" id="cupo-success" role="status" tabindex="-1" hidden>¡Listo! Te escribimos por WhatsApp en las próximas 24 horas.</p>
  </div>
</dialog>`;
}

function fieldError(input, message) {
  const error = document.getElementById(`${input.id}-error`);
  if (message) input.setAttribute('aria-invalid', 'true');
  else input.removeAttribute('aria-invalid');
  if (!error) return;
  error.textContent = message || '';
  error.hidden = !message;
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
    const items = [...dialog.querySelectorAll('button, input, a[href], #cupo-success')]
      .filter(element => !element.disabled && !element.closest('[hidden]') && element.getClientRects().length);
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

  const form = dialog.querySelector('form');
  const phone = dialog.querySelector('#cupo-phone');
  const company = dialog.querySelector('#cupo-company');
  const success = dialog.querySelector('#cupo-success');
  form?.addEventListener('submit', event => {
    event.preventDefault();
    const errors = cupoErrors(phone.value, company.value);
    fieldError(phone, errors.phone);
    fieldError(company, errors.company);
    if (errors.phone || errors.company) {
      (errors.phone ? phone : company).focus();
      return;
    }
    remember();
    form.hidden = true;
    success.hidden = false;
    dialog.setAttribute('aria-labelledby', 'cupo-success');
    dialog.removeAttribute('aria-describedby');
    success.focus();
    const url = cupoUrl(dialog.dataset.whatsapp, phone.value, company.value);
    const tab = window.open(url, '_blank', 'noopener,noreferrer');
    if (!tab) location.assign(url);
  });
  for (const input of [phone, company]) {
    input?.addEventListener('input', () => {
      if (input.getAttribute('aria-invalid') === 'true') fieldError(input, '');
    });
  }
}
