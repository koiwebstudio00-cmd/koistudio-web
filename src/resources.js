const normalize = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('es');
const library = document.querySelector('[data-resource-library]');

if (library) {
  const search = library.querySelector('[data-resource-search]');
  const filters = [...library.querySelectorAll('[data-resource-filter]')];
  const cards = [...library.querySelectorAll('[data-resource]')];
  const count = library.querySelector('[data-resource-count]');
  const empty = library.querySelector('[data-resource-empty]');
  const formatSelect = library.querySelector('[data-resource-format]');
  const more = library.querySelector('[data-resource-more]');
  const pagination = library.querySelector('[data-resource-pagination]');
  let topic = '';
  let limit = 12;

  function filter(updateUrl = true) {
    const words = normalize(search.value.trim()).split(/\s+/).filter(Boolean);
    let visible = 0;
    for (const card of cards) {
      const matches = (topic === '' || card.dataset.topic === topic) && (!formatSelect.value || card.dataset.format === formatSelect.value) && words.every(word => normalize(card.dataset.search).includes(word));
      if (matches) visible++;
      card.hidden = !matches || visible > limit;
    }
    for (const button of filters) button.setAttribute('aria-pressed', String(button.dataset.resourceFilter === topic));
    count.textContent = `${visible} ${visible === 1 ? 'recurso disponible' : 'recursos disponibles'}`;
    empty.hidden = visible !== 0;
    pagination.hidden = visible <= limit;
    more.textContent = `Mostrar más recursos (${Math.max(0,visible-limit)} restantes)`;
    if (updateUrl) {
      const url = new URL(location.href);
      for (const [key, value] of [['q', search.value.trim()], ['tema', topic], ['formato',formatSelect.value]]) {
        if (value) url.searchParams.set(key, value);
        else url.searchParams.delete(key);
      }
      history.replaceState(null, '', url);
    }
  }

  function readLocation() {
    const params = new URLSearchParams(location.search);
    search.value = (params.get('q') ?? '').slice(0, search.maxLength);
    topic = filters.some(button => button.dataset.resourceFilter === params.get('tema')) ? params.get('tema') : '';
    formatSelect.value = ['prompt','guia'].includes(params.get('formato')) ? params.get('formato') : '';
    limit = 12;
    filter(false);
  }

  for (const button of filters) button.addEventListener('click', () => {
    topic = button.dataset.resourceFilter;
    limit = 12;
    filter();
  });
  search.addEventListener('input', () => {limit=12;filter();});
  formatSelect.addEventListener('change', () => {limit=12;filter();});
  more.addEventListener('click', () => {limit+=12;filter(false);});
  library.querySelector('[data-resource-reset]').addEventListener('click', () => {
    search.value = '';
    topic = '';
    formatSelect.value = '';
    limit = 12;
    filter();
    search.focus();
  });
  window.addEventListener('popstate', readLocation);
  readLocation();
  library.querySelector('[data-resource-controls]').hidden = false;
}

for (const copyButton of document.querySelectorAll('[data-copy-prompt]')) {
  const widget = copyButton.closest('[data-prompt-widget]') ?? document;
  const prompt = widget.querySelector('[data-prompt-text]') ?? widget.querySelector('#prompt-text');
  const status = widget.querySelector('[data-copy-status]');
  const label = copyButton.querySelector('[data-copy-label]');
  const successMessage = 'Copiado! ahora Pegalo en CHAT GPT, CLAUDE O GEMINI.';
  let morph;

  function showCopied() {
    if (label.textContent === successMessage) return;
    const before = copyButton.getBoundingClientRect();
    label.textContent = successMessage;
    const after = copyButton.getBoundingClientRect();
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // Keep the final line wrapping stable while the button grows around it.
    label.style.width = `${label.getBoundingClientRect().width}px`;
    label.style.maxWidth = 'none';
    morph = copyButton.animate([
      { width: `${before.width}px`, height: `${before.height}px` },
      { width: `${after.width}px`, height: `${after.height}px` },
    ], { duration: 480, easing: 'cubic-bezier(.22, 1, .36, 1)' });
    label.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 300, delay: 90, fill: 'backwards' });
    const clearSize = () => { label.style.width = ''; label.style.maxWidth = ''; };
    morph.finished.then(clearSize).catch(clearSize);
  }

  // Reflow the full message naturally if the viewport changes mid-animation.
  window.addEventListener('resize', () => {
    morph?.cancel();
    label.style.width = '';
    label.style.maxWidth = '';
  });
  copyButton.hidden = false;
  copyButton.addEventListener('click', async () => {
    copyButton.disabled = true;
    try {
      await navigator.clipboard.writeText(prompt.textContent);
      showCopied();
      status.textContent = 'Prompt copiado al portapapeles.';
    } catch {
      const range = document.createRange();
      range.selectNodeContents(prompt);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      prompt.focus({ preventScroll: true });
      status.textContent = 'No se pudo copiar automáticamente. El texto quedó seleccionado: copialo con el menú de tu dispositivo.';
    } finally {
      copyButton.disabled = false;
    }
  });
}
