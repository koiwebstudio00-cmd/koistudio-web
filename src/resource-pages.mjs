import { resources, resourceTypes } from './resources.mjs';
import { carouselResources } from './carousel-resources.mjs';
const libraryResources=[...resources,...carouselResources];
const typeLabel=resource=>resource.type==='recurso_carrusel'?'Guía y recursos':resourceTypes[resource.type];

const e = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
const route = resource => `/recursos/${resource.slug}/`;
const icon = topic => {
  const paths = {
    'Fotografía': '<rect x="3" y="6" width="26" height="21" rx="4"/><circle cx="16" cy="16.5" r="6"/><path d="m10 6 2-3h8l2 3"/>',
    'Estrategia': '<rect x="4" y="4" width="24" height="24" rx="3"/><path d="M4 12h24M12 12v16M4 20h24"/>',
    'Branding': '<path d="m6 23 13-18 7 5-13 18-8 1zM16 9l7 5M7 23l6 5"/>',
    'Ventas': '<path d="M5 4v24h24M11 22v-6M18 22V11M25 22V6"/>',
  };
  return `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[topic] ?? paths.Estrategia}</svg>`;
};

function card(resource) {
  return `<article class="resource-card" data-resource data-resource-key="${e(resource.clave_integracion??resource.slug)}" data-format="${resource.format??'prompt'}" data-topic="${e(resource.topic)}" data-search="${e([resource.title, resource.description, resource.topic, typeLabel(resource), resource.sector??'', resource.outcome, resource.preview, ...resource.needs, resource.prompt??''].join(' '))}">
    ${resource.cover?`<a class="resource-card-cover" href="${route(resource)}" tabindex="-1" aria-hidden="true"><img src="${e(resource.cover.archivo)}" alt="" width="1080" height="1350" loading="lazy"></a>`:''}
    <div class="resource-card-top"><span class="resource-icon">${icon(resource.topic)}</span><span class="resource-type">${e(typeLabel(resource))} <span aria-hidden="true">/</span> ${e(resource.topic)}</span></div>
    <h3><a href="${route(resource)}">${e(resource.title)}</a></h3>
    <p>${e(resource.description)}</p>
    <div class="resource-card-excerpt"><span aria-hidden="true">“</span><p>${e(resource.preview)}</p></div>
    <a class="resource-card-link" href="${route(resource)}">${resource.type==='recurso_carrusel'?'Ver recurso':'Ver '+e(resourceTypes[resource.type].toLowerCase())}<span class="sr-only">: ${e(resource.title)}</span></a>
  </article>`;
}

export const resourceIndex = `
<section class="resources-hero grid-bg"><div class="wrap resources-hero-grid">
  <div class="resources-hero-copy" data-enter>
    <p class="resource-kicker">RECURSOS KOI · ACCESO LIBRE</p>
    <h1>Ideas útiles.<br>IA para <em class="editorial">tu negocio.</em></h1>
    <p>Prompts, guías y herramientas para aplicar IA en tu negocio. Recursos prácticos para aprender, resolver tareas y mejorar tu forma de trabajar.</p>
    <a class="button primary resource-button" href="#biblioteca">Explorar recursos</a>
  </div>
  <div class="resource-hero-art"><img src="/assets/recursos/biblioteca-ia.png" width="1254" height="1254" alt="Logos de ChatGPT, Claude Code y Gemini en vidrio naranja junto a una guía y documentos." fetchpriority="high"></div>
</div></section>
<section class="section light resources-library" id="biblioteca"><div class="wrap" data-resource-library>
  <div class="resource-library-heading"><div><p class="resource-kicker">PARA PASAR A LA PRÁCTICA</p><h2>Encontrá tu <em class="editorial">próximo recurso.</em></h2></div><p>Sin registro. Con instrucciones para usarlo y revisar el resultado.</p></div>
  <div class="resource-tools" data-resource-controls hidden>
    <div class="resource-filters" role="group" aria-label="Filtrar por tema">${['Todos', ...new Set(libraryResources.map(x => x.topic))].map((topic, i) => `<button type="button" data-resource-filter="${e(i === 0 ? '' : topic)}" aria-pressed="${i === 0}">${e(topic)}</button>`).join('')}</div>
    <label class="resource-format">Formato<select data-resource-format><option value="">Todos los formatos</option><option value="prompt">Prompts</option><option value="guia">Guías y recursos</option></select></label>
    <label class="resource-search"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 4 4"/></svg><span class="sr-only">Buscar recursos</span><input type="search" name="q" placeholder="Buscar un recurso" maxlength="120" autocomplete="off" data-resource-search></label>
  </div>
  <p class="resource-result-count" data-resource-count role="status" aria-live="polite">${libraryResources.length} recursos disponibles</p>
  <div class="resource-grid">${libraryResources.map(card).join('')}</div>
  <div class="resource-load-more" hidden data-resource-pagination><button type="button" class="button black resource-button" data-resource-more>Mostrar más recursos</button></div>
  <div class="resource-empty" data-resource-empty hidden><h3>No encontramos ese recurso.</h3><p>Probá con otra palabra o volvé a ver la biblioteca completa.</p><button class="button black resource-button" type="button" data-resource-reset>Ver todos los recursos</button></div>
</div></section>
<section class="resource-method"><div class="wrap resource-method-grid"><div><p class="resource-kicker">RECURSOS PARA TU NEGOCIO</p><h2>De la idea <em class="editorial">a la práctica.</em></h2></div><div class="resource-method-steps"><div><h3>Elegí un recurso.</h3><p>Buscá una guía, un prompt o una herramienta para lo que necesitás resolver.</p></div><div><h3>Aplicalo a tu negocio.</h3><p>Seguí las instrucciones y adaptá los ejemplos a tu forma de trabajar.</p></div><div><h3>Revisá y seguí probando.</h3><p>Comprobá el resultado, ajustá lo necesario y guardá lo que te sirva.</p></div></div></div></section>`;

export function resourceDetail(resource) {
  return `<section class="resource-detail-intro grid-bg"><div class="wrap">
    <nav class="resource-breadcrumb" aria-label="Ubicación"><a href="/recursos/">Recursos</a><span aria-hidden="true">/</span><span>${e(resource.topic)}</span></nav>
    <p class="resource-kicker">${e(resourceTypes[resource.type])} · ${e(resource.topic)} · ACCESO LIBRE</p>
    <h1>${e(resource.title)}</h1><p class="resource-detail-description">${e(resource.description)}</p>
    <div class="actions"><a class="button primary resource-button" href="#prompt">Ir al prompt</a></div>
  </div></section>
  <section class="section light resource-detail-body"><div class="wrap resource-detail-grid">
    <aside class="resource-instructions"><div><p class="resource-kicker">QUÉ VAS A OBTENER</p><p class="resource-outcome">${e(resource.outcome)}</p></div><div><h2>Antes de empezar</h2><ul>${resource.needs.map(x => `<li>${e(x)}</li>`).join('')}</ul></div><div><h2>Cómo usarlo</h2><ol>${resource.steps.map(x => `<li>${e(x)}</li>`).join('')}</ol></div></aside>
    <div class="resource-prompt-column"><section class="resource-prompt" id="prompt" aria-labelledby="prompt-title">
      <div class="resource-prompt-heading"><div><p class="resource-kicker">LISTO PARA ADAPTAR</p><h2 id="prompt-title">Tu prompt.</h2></div><button class="button primary resource-button resource-copy" type="button" data-copy-prompt hidden><span class="resource-copy-label" data-copy-label>Copiar prompt</span></button></div>
      <p class="resource-prompt-help">Reemplazá los campos entre corchetes por la información de tu negocio.</p>
      <pre id="prompt-text" class="resource-prompt-text" tabindex="0" aria-label="Texto completo del prompt">${e(resource.prompt)}</pre>
      <div class="resource-prompt-footer"><span data-copy-status role="status" aria-live="polite">Copiá el prompt y completá los campos con tus datos.</span></div>
    </section>
    <section class="resource-review"><h2>Antes de usar el resultado</h2><ul>${resource.checklist.map(x => `<li>${e(x)}</li>`).join('')}</ul></section></div>
  </div></section>
  <section class="section resource-related"><div class="wrap"><div class="resource-related-heading"><h2>Seguí <em class="editorial">probando.</em></h2><a href="/recursos/">Ver todos los recursos</a></div><div class="resource-related-grid">${resources.filter(x => x.slug !== resource.slug).map(x => `<a class="resource-related-card" href="${route(x)}"><span class="resource-kicker">${e(resourceTypes[x.type])} / ${e(x.topic)}</span><h3>${e(x.title)}</h3><p>${e(x.description)}</p></a>`).join('')}</div></div></section>`;
}
