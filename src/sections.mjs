const escapeHTML = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

export const icon = name => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${({spark:'<path d="m12 2 2.8 7.2L22 12l-7.2 2.8L12 22l-2.8-7.2L2 12l7.2-2.8Z"/>',chat:'<path d="M20 11a8 8 0 0 1-8 8H4l-2 3V11a9 9 0 0 1 18 0Z"/><path d="M7 10h8M7 14h5"/>',layers:'<path d="m12 3 10 5-10 5L2 8l10-5Zm-10 9 10 5 10-5M2 16l10 5 10-5"/>',compass:'<circle cx="12" cy="12" r="9"/><path d="m16 8-3 5-5 3 3-5 5-3Z"/>',arrow:'<path d="M4 12h16m-6-6 6 6-6 6"/>',team:'<circle cx="9" cy="8" r="3"/><path d="M3 21v-3a6 6 0 0 1 12 0v3M16 5a3 3 0 0 1 0 6m2 3a5 5 0 0 1 3 4v3"/>'})[name] || ''}</svg>`;

export const heroSection = `
<section class="hero hero--center">
  <div class="hero-atmosphere" aria-hidden="true"><div class="ambient-glow glow-one"></div><div class="ambient-glow glow-two"></div><div class="hero-grid"></div><div class="orbit orbit-one"></div><div class="orbit orbit-two"></div></div>
  <div class="hero-copy">
    <p class="eyebrow hero-pill">${icon('spark')} MENOS RUIDO. MÁS DIRECCIÓN.</p>
    <h1><span class="title-line">Tu negocio,</span><span class="title-line">en otra <em>escala.</em></span></h1>
    <p>Conectamos personas, procesos y tecnología.<br>Empleados digitales y software para avanzar con menos fricción.</p>
    <div class="hero-actions">
      <a class="button orange" href="/contacto/">Hablemos de tu negocio <span aria-hidden="true">↗</span></a>
      <a class="text-link" href="/proyectos/">Explorá lo que hacemos <span aria-hidden="true">↗</span></a>
    </div>
    <div class="hero-disciplines"><span>ESTRATEGIA</span><i aria-hidden="true">+</i><span>DISEÑO</span><i aria-hidden="true">+</i><span>TECNOLOGÍA</span></div>
  </div>
  <div class="hero-satellite satellite-left" aria-hidden="true">${icon('chat')}<span>Cada consulta,<br><b>un próximo paso.</b></span></div>
  <div class="hero-satellite satellite-right" aria-hidden="true">${icon('layers')}<span>Menos tareas sueltas.<br><b>Todo conectado.</b></span></div>
  <a class="scroll-cue" href="#estudio"><span class="scroll-cue-line" aria-hidden="true"></span>EXPLORÁ LO QUE SIGUE <span aria-hidden="true">↓</span></a>
</section>`;

export const flowSection = `<div class="flow-demo">
  <div class="flow-heading"><span class="eyebrow">DEL MENSAJE AL PRÓXIMO PASO</span><span>Una forma de pensar tu operación.</span></div>
  <div class="flow-nodes">
    <svg class="flow-connections" viewBox="0 0 1000 100" preserveAspectRatio="none" aria-hidden="true"><path class="flow-track" d="M130 50H870"/><path class="flow-draw" d="M130 50H870" pathLength="1"/></svg>
    <div class="flow-node">${icon('chat')}<span class="flow-number">01</span><h3>Una consulta.</h3><p>El punto de partida.</p></div>
    <div class="flow-node flow-node-core">${icon('spark')}<span class="flow-number">02</span><h3>Un proceso claro.</h3><p>Contexto, criterio y responsable.</p></div>
    <div class="flow-node">${icon('arrow')}<span class="flow-number">03</span><h3>Una acción.</h3><p>Saber cómo seguir.</p></div>
  </div>
  <p class="flow-footnote">Esquema ilustrativo. Cada solución se diseña según tu negocio.</p>
</div>`;

export const scrollStatement = `<div class="scroll-statement" aria-hidden="true"><div class="statement-track"><span>Personas.</span>${icon('spark')}<span>Procesos.</span>${icon('spark')}<em>Posibilidades.</em>${icon('spark')}</div></div>`;

export const ctaSection = `
<section class="wrap cta-section">
  <div class="cta-copy"><p class="eyebrow">EL SIGUIENTE PASO ES TUYO</p>
    <h2>Hagamos lugar<br>a lo que <em>viene.</em></h2>
    <p>Un problema concreto. Una conversación.<br>Una forma más clara de avanzar.</p>
    <a class="button black" href="/contacto/">Empecemos por una charla <span aria-hidden="true">↗</span></a>
  </div>
  <div class="cta-art" aria-hidden="true"><span class="cta-arrow">↗</span><span class="cta-orbit"></span><span class="cta-art-label">NEXT CHAPTER / KOI STUDIO</span></div>
</section>`;

export function renderProjectCard(p, index) {
  const alt = {lokation:'Arquitectura de vidrio y una llave naranja: concepto visual para Lokation',zyro:'Vehículo de aluminio y ruedas naranjas: concepto visual para Zyro',toki:'Bolsa y rollo de pedidos: concepto visual para Toki'};
  return `<article class="project-card" data-category="propios">
  <a class="project-link" href="/proyectos/${p.slug}/">
    <div class="project-art art-${p.slug}">
      <img class="project-image" src="/assets/${p.slug}-v2.jpg" alt="${alt[p.slug]}" width="1254" height="1254" loading="lazy" decoding="async">
      <span class="art-index">0${index + 1} / PRODUCTO PROPIO</span><span class="art-sector">${escapeHTML(p.sector)}</span>
      <span class="art-word">${escapeHTML(p.name)}</span><span class="circle-arrow" aria-hidden="true">↗</span>
    </div>
    <div class="project-info"><h3>${escapeHTML(p.line)}</h3></div>
    <p>${p.focus.map(escapeHTML).join(' · ')}</p>
  </a></article>`;
}
