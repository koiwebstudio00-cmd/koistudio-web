import { cp, mkdir, readFile, rm, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { products, projects, workshops } from '../src/content.mjs';
import { zyro } from '../src/zyro.mjs';
import { cubiko } from '../src/cubiko.mjs';
import { toki } from '../src/toki.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const out = path.join(root, 'dist');
const config = JSON.parse(await readFile(path.join(root, 'site.config.json'), 'utf8'));
const escape = value => String(value).replace(/[&<>"']/g, char => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
})[char]);
const whatsapp = message => 'https://wa.me/5493815709287' + (message ? '?text=' + encodeURIComponent(message) : '');
const arrow = '<span aria-hidden="true">↗</span>';
const button = (label, href, style = 'primary', glyph = arrow) =>
  `<a class="button ${style}" href="${escape(href)}">${escape(label)}${glyph}</a>`;
const shaderCanvas = (theme, animated = false) =>
  `<canvas data-shader="${theme}"${animated ? ' data-shader-motion' : ''} aria-hidden="true"></canvas>`;
const shaderButton = (label, href, animated = false) =>
  button(label, href, 'primary button-grain', arrow + shaderCanvas('orange', animated));
const note = text => `<p class="eyebrow">${escape(text)}</p>`;
const productPath = product => '/productos/' + product.slug + '/';
const projectPath = slug => '/proyectos/#' + slug;
const contact = whatsapp('Hola, equipo de Koi. Hay una tarea que hacemos a mano y quiero ver si se puede automatizar.');
const zyroContact = whatsapp('ZYRO');
const zyroContactLabel = 'Escribinos por WhatsApp para probarlo gratis en tu concesionaria HOY';
const cubikoContact = whatsapp('CUBIKO');
const cubikoContactLabel = 'Escribinos por WhatsApp para probarla gratis en tu inmobiliaria HOY';
const tokiContact = whatsapp('TOKI');
const tokiContactLabel = 'Escribinos por WhatsApp para probarlo gratis en tu local HOY';
const productDetails = {
  'zyro-ai': { name: zyro.name, contact: zyroContact },
  'cubiko-ai': { name: cubiko.name, contact: cubikoContact },
  'toki-ai': { name: toki.name, contact: tokiContact },
};
const productName = product => productDetails[product.slug]?.name ?? product.name;
const menu = route => `<details class="product-menu"><summary>Productos<svg aria-hidden="true" viewBox="0 0 16 16" fill="none"><path d="m4 6 4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></summary>
  <div class="product-menu-links">${products.map(product => `<a href="${productPath(product)}"${route === productPath(product) ? ' aria-current="page"' : ''}>${escape(productName(product))}</a>`).join('')}</div>
</details><a href="/proyectos/"${route === '/proyectos/' ? ' aria-current="page"' : ''}>Proyectos y Clientes</a><a href="/#workshops">Workshops</a>`;
const whatsappIcon = `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.372-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.262.489 1.694.626.712.226 1.36.194 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347M12.012 22h-.004a9.95 9.95 0 0 1-5.071-1.389l-.364-.215-3.772.989 1.007-3.677-.237-.377a9.94 9.94 0 0 1-1.523-5.303C2.05 6.527 6.52 2.054 12.015 2.054a9.9 9.9 0 0 1 7.043 2.921 9.9 9.9 0 0 1 2.916 7.049C21.971 17.526 17.501 22 12.012 22m8.48-18.434A11.9 11.9 0 0 0 12.015.05C5.407.05.029 5.426.026 12.034c0 2.112.551 4.173 1.599 5.99L0 23.95l6.065-1.591a12 12 0 0 0 5.943 1.515h.005c6.606 0 11.985-5.377 11.988-11.984a11.9 11.9 0 0 0-3.51-8.324"/></svg>`;
const brand = `<a class="brand" href="/" aria-label="Koi Studio, inicio"><img src="/assets/brand/koi-symbol.png" width="38" height="38" alt=""><span>Koi Studio<small>AI &amp; SOFTWARE</small></span></a>`;
const playIcon = `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M10 8.5 16 12l-6 3.5z" fill="currentColor"/></svg>`;
const heroActions = (href, contactLabel = 'Probá gratis por WhatsApp', videoLabel = 'Ver video de la demo') =>
  button(contactLabel, href, 'primary hero-action', whatsappIcon) +
  button(videoLabel, '#vsl', 'secondary hero-action', playIcon);
const asset = name => '/assets/' + name;
const socialCards = {
  'zyro-ai': { file: 'social/zyro.jpg', alt: 'Zyro AI para concesionarias. Catálogo web, stock y atención con IA por WhatsApp y redes.' },
  'cubiko-ai': { file: 'social/cubiko.jpg', alt: 'Cubiko AI para inmobiliarias. Publicá propiedades y atendé con IA. Gestioná visitas y alquileres.' },
  'toki-ai': { file: 'social/toki.jpg', alt: 'Toki para locales gastronómicos. Menú web y pedidos por WhatsApp. Cocina y mostrador en un lugar.' },
};
const defaultSocialCard = { file: 'social-card.jpg', alt: 'Koi Studio. Tu negocio, en otra escala. Empleados digitales y software.' };

async function media(file, title, pending, id = '') {
  const available = await stat(path.join(root, 'assets', file)).then(info => info.isFile(), () => false);
  const video = file.endsWith('.mp4');
  return `<figure class="media-slot ${available ? 'available' : 'pending'}"${id ? ` id="${id}"` : ''}>
    <figcaption><span class="status-dot"></span>${escape(title)}</figcaption>
    ${available ? video
      ? `<video controls playsinline preload="none" poster="${asset(file.replace(/\.mp4$/, '-poster.jpg'))}" src="${asset(file)}" aria-label="${escape(title)}"></video>`
      : `<img src="${asset(file)}" alt="${escape(title)}" loading="lazy">`
      : `<div class="media-empty"><span class="media-icon" aria-hidden="true">${video ? '◎' : '⊞'}</span><p>${escape(pending)}</p></div>`}
  </figure>`;
}

function shell(title, description, route, content, index = true) {
  const canonical = config.url + route;
  const product = products.find(item => productPath(item) === route);
  const headerContact = productDetails[product?.slug]?.contact ?? whatsapp();
  const social = socialCards[product?.slug] ?? defaultSocialCard;
  const socialUrl = config.url + asset(social.file);
  const organization = { '@context': 'https://schema.org', '@type': 'Organization', name: config.name, url: config.url, logo: config.url + '/assets/brand/logo-black.png', email: config.email, sameAs: [config.instagram].filter(Boolean) };
  return `<!doctype html>
<html lang="es-AR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escape(title)}</title>
<meta name="description" content="${escape(description)}">
<meta name="theme-color" content="#0b0b0b">
<meta name="robots" content="${index ? 'index, follow' : 'noindex, follow'}">
<link rel="canonical" href="${escape(canonical)}">
<link rel="icon" href="/favicon.ico?v=2">
<meta property="og:type" content="website">
<meta property="og:locale" content="es_AR">
<meta property="og:title" content="${escape(title)}">
<meta property="og:description" content="${escape(description)}">
<meta property="og:url" content="${escape(canonical)}">
<meta property="og:image" content="${escape(socialUrl)}">
<meta property="og:image:type" content="image/jpeg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${escape(social.alt)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:image" content="${escape(socialUrl)}">
<meta name="twitter:image:alt" content="${escape(social.alt)}">
<link rel="stylesheet" href="/assets/lenis.css">
<link rel="stylesheet" href="/assets/styles.css">
<script type="application/ld+json">${JSON.stringify(organization).replace(/</g, "\\u003c")}</script>
<script type="module" src="/assets/app.js"></script>
${route === '/' || route === '/proyectos/' || route.startsWith('/productos/') ? '<script type="module" src="/assets/hero-shader.js"></script>' : ''}
<script src="/assets/analytics.js" defer></script>
</head>
<body>
<svg class="logo-filters" width="0" height="0" aria-hidden="true" focusable="false">
  <defs>
    <filter id="logo-white-from-light" color-interpolation-filters="sRGB" x="0" y="0" width="100%" height="100%">
      <feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  -.4252 -1.4304 -.1444 2 0" />
    </filter>
    <filter id="logo-white-from-dark" color-interpolation-filters="sRGB" x="0" y="0" width="100%" height="100%">
      <feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  .4252 1.4304 .1444 -.65 0" />
    </filter>
  </defs>
</svg>
<a class="skip" href="#contenido">Ir al contenido</a>
<header class="header">
  <div class="wrap header-inner">
    ${brand}
    <nav class="desktop-nav" aria-label="Principal">${menu(route)}</nav>
    <a class="button nav-cta" href="${escape(headerContact)}" aria-label="Hablemos por WhatsApp">${whatsappIcon}</a>
    <button type="button" class="menu-toggle" aria-label="Abrir menú" aria-expanded="false" aria-controls="mobile-nav">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true" focusable="false"><path d="M4 8h16"/><path d="M4 16h16"/></svg>
    </button>
  </div>
  <nav id="mobile-nav" class="mobile-nav" aria-label="Navegación móvil" inert>
    <div class="mobile-nav-panel" data-lenis-prevent><div class="wrap">${menu(route)}</div></div>
  </nav>
</header>
<main id="contenido">${content}</main>
<footer class="footer">
  <div class="wrap footer-inner">${brand}<span>© ${new Date().getFullYear()} Koi Studio</span><nav aria-label="Pie de página"><a href="${escape(config.instagram)}">Instagram</a><a href="/privacidad/">Privacidad</a></nav></div>
</footer>
</body>
</html>`;
}

const heading = (label, title, accent = '') => `<div class="section-heading" data-enter>${note(label)}<h2>${escape(title)}${accent ? ` <em class="editorial">${escape(accent)}</em>` : ''}</h2></div>`;
const productImage = (image, alt, lazy = false, height = 800) =>
  `<img src="${asset(image)}" alt="${escape(alt)}" width="800" height="${height}"${lazy ? ' loading="lazy"' : ''}>`;
const clientLogo = project => `<div class="case-logo"${project.darkLogoSource ? ' data-dark-source="true"' : ''}><img src="${asset('clients/' + project.logo)}" alt="" loading="lazy"></div>`;
const closing = `<section class="closing">${shaderCanvas('orange')}<div class="wrap" data-enter>
  ${note('04 / HABLEMOS')}
  <h2>¿Qué tarea te gustaría <em class="editorial">dejar de hacer a mano?</em></h2>
  <p>Contanos cómo la resuelven hoy. Con un ejemplo alcanza para empezar a hablar.</p>
  ${button('Escribinos por WhatsApp', contact, 'black')}
</div></section>`;
const hero = ({ label, title, description, actions, preview }) => `<section class="hero">
  <div class="hero-stage">
    <div class="hero-backdrop" aria-hidden="true">${shaderCanvas('dark', true)}</div>
    <div class="wrap">
      <div class="hero-copy" data-enter>
        ${note(label)}
        <h1>${title}</h1>
        <p>${escape(description)}</p>
        <div class="actions">${actions}</div>
      </div>
    </div>
  </div>
  <div class="wrap vsl-reveal" id="vsl">
    ${preview}
  </div>
</section>`;
const intro = hero({
  label: 'KOI STUDIO / EMPLEADOS DIGITALES',
  title: 'Armamos <em class="editorial">empleados digitales</em> para que no tengas que estar en todo.',
  description: 'Atienden consultas, toman pedidos y retoman conversaciones de venta. Los armamos con tus precios, tus horarios y tus reglas, para que resuelvan lo de todos los días y te pasen lo que necesita tu atención.',
  actions: heroActions(whatsapp(), 'Hablemos por WhatsApp', 'Ver el video'),
  preview: await media('media/koi-vsl.mp4', 'KOI STUDIO / CÓMO FUNCIONA', 'Video en preparación'),
});
const beamVariants = ['quick', 'slow', 'thick'];
const productCards = products.map((product, index) => `<article class="product-card" data-beam="${beamVariants[index]}" data-enter="card">
  <div class="vertical-art glass-card-surface" data-art-theme="dark" data-vertical="${product.slug}">
    ${shaderCanvas('dark')}
    <div class="product-art">${productImage(product.cardImage ?? product.image, product.cardAlt ?? product.alt, true, product.cardImageHeight)}<span aria-hidden="true">0${index + 1}</span></div>
    <div class="card-content">${note(product.sector)}<h3>${escape(product.name)}</h3><p class="scene">${escape(product.scene)}</p><p>${escape(product.description)}</p>
    ${button('Conocé ' + product.name, productPath(product), 'product-link')}</div>
  </div>
</article>`).join('');
const featured = projects.slice(0, 3).map((project, index) => `<article class="case-card" data-beam="${beamVariants[index]}" data-beam-reveal data-enter="card">
  ${clientLogo(project)}${note(project.label)}<h3>${escape(project.name)}</h3>
  <p>${escape(project.summary)}</p>${button('Ver el caso', projectPath(project.slug), 'text-button')}
</article>`).join('');
const workshopCards = workshops.map((workshop, index) => `<article class="workshop-card" data-beam="${index === 0 ? 'quick' : 'slow'}" data-beam-reveal data-enter="card">
  <div class="vertical-art glass-card-surface" data-art-theme="light">
    ${shaderCanvas('light')}
    <div class="workshop-art"><img src="${asset(workshop.image)}" alt="${escape(workshop.alt)}" width="1340" height="755" loading="lazy"></div>
    <div class="card-content">${note(workshop.length)}<h3>${escape(workshop.title)}</h3><p>${escape(workshop.description)}</p></div>
  </div>
</article>`).join('');
const home = `${intro}
<section class="section light" id="productos"><div class="wrap">
  ${heading('01 / PRODUCTOS', 'Tres rubros. Tres formas de', 'sacarte trabajo de encima.')}
  <div class="three-up">${productCards}</div>
</div></section>
<section class="section grid-bg"><div class="wrap">
  ${heading('02 / PROYECTOS', 'Así se usa', 'lo que hacemos.')}
  <div class="three-up">${featured}</div>
  <div class="section-action">${shaderButton('Ver todos los proyectos', '/proyectos/', true)}</div>
</div></section>
<section class="section light" id="workshops"><div class="wrap">
  ${heading('03 / WORKSHOPS', 'Probemos la IA con algo que tu equipo', 'ya hace todos los días.')}
  <p class="section-lead">Traigan una tarea de verdad. Un presupuesto que siempre arranca de cero, un informe que lleva media mañana o las mismas preguntas que el equipo responde cada semana. Sobre eso trabajamos.</p>
  <div class="two-up">${workshopCards}</div>
  <div class="workshop-end"><p>Si quieren seguir, podemos hacer un relevamiento completo de la empresa. Con eso les presentamos una propuesta que explica qué desarrollaríamos, qué procesos automatizaríamos y cuánto costaría por mes mantenerlo funcionando.</p>
  ${shaderButton('Hablemos de un workshop', whatsapp('Hola, equipo de Koi. Quiero saber cómo sería un workshop para mi equipo.'), true)}</div>
</div></section>${closing}`;

const featureCards = items => items.map(([title, description, image]) => {
  const copy = `<h3>${escape(title)}</h3><p>${escape(description)}</p>`;
  if (!image) return `<li class="product-feature">${copy}</li>`;
  return `<li class="product-feature product-feature-illustrated">
    <img src="${escape(asset(image))}" alt="" width="960" height="480" loading="lazy" decoding="async">
    <div class="product-feature-copy">${copy}</div>
  </li>`;
}).join('');
const productGallery = (directory, name, items, variant = '') => `<div class="product-gallery ${variant}" data-gallery="${directory}">${items.map(([title, description, image]) => {
  const src = asset(`media/${directory}/${image}`);
  return `<figure class="product-screen">
    <a href="${src}" target="_blank" rel="noopener" aria-label="Ampliar captura de ${escape(title)}">
      <img src="${src}" alt="${escape(`Captura de ${name} · ${title}`)}" loading="lazy">
    </a>
    <figcaption><h3>${escape(title)}</h3><p>${escape(description)}</p></figcaption>
  </figure>`;
}).join('')}</div>`;

const cases = projects.map((project, index) => `<article class="case-detail" id="${project.slug}">
  <div class="case-copy" data-enter>
    <div>${note('0' + (index + 1) + ' / ' + project.sector)}<h2>${escape(project.name)}</h2></div>
    <div><p class="scene">${escape(project.scene)}</p><p>${escape(project.description)}</p></div>
  </div>
  ${productGallery(project.galleryDir, project.name, project.gallery, 'case-gallery')}
</article>`).join('');

const portfolio = `<section class="grid-bg inner-intro portfolio-intro"><div class="wrap">
  <div data-enter>${note('PORTFOLIO / KOI STUDIO')}<h1>Proyectos y <em class="editorial">clientes.</em></h1>
    <p>Mirá los sistemas que armamos y cómo los usan nuestros clientes.</p></div>
  <nav class="case-index" aria-label="Casos del portfolio">${projects.map(project => `<a href="#${project.slug}">
    <img src="${asset(`media/${project.galleryDir}/${project.gallery[0][2]}`)}" alt="" loading="lazy">
    <div class="case-index-copy">${note(project.label)}<span>${escape(project.shortName ?? project.name)}</span>${arrow}</div>
  </a>`).join('')}</nav>
</div></section>
<section class="section light"><div class="wrap case-list">${cases}</div></section>
<dialog class="case-viewer" aria-label="Capturas del proyecto">
  <div class="case-viewer-bar"><p aria-live="polite"></p><button type="button" aria-label="Cerrar galería" autofocus>×</button></div>
  <img alt="">
  <div class="case-viewer-controls">
    <button type="button" data-step="-1" aria-label="Captura anterior">←</button>
    <button type="button" data-step="1" aria-label="Captura siguiente">→</button>
  </div>
</dialog>${closing}`;

const zyroPage = hero({
  label: 'ZYRO AI / PARA CONCESIONARIAS',
  title: 'Subís un auto. <em class="editorial">Martina lo vende</em> en todos tus canales.',
  description: zyro.description + ' Martina atiende las consultas y tu equipo cierra la venta.',
  actions: heroActions(zyroContact),
  preview: await media(zyro.video, 'ZYRO AI / CONOCÉ A MARTINA', 'Video en preparación'),
}) + `
<section class="section light" id="martina"><div class="wrap">
  ${heading('01 / MARTINA', 'Una vendedora para', 'todos tus canales.')}
  <p class="section-lead">Cuando las consultas llegan por cuatro lugares y el stock vive en una planilla, es fácil que una charla se enfríe. Martina atiende con el inventario de tu concesionaria a mano y le deja al vendedor el contexto para seguir.</p>
  <ul class="product-features">${featureCards(zyro.martina)}</ul>
</div></section>
<section class="section grid-bg" id="publicar"><div class="wrap">
  ${heading('02 / CARGA DE STOCK', 'Cargás el auto una vez.', 'Esto pasa con un clic.')}
  <ol class="product-features product-numbered">${featureCards(zyro.publishing)}</ol>
</div></section>
<section class="section light" id="panel"><div class="wrap">
  ${heading('03 / PANEL DE GESTIÓN', 'El stock, los contactos', 'y tu equipo en un lugar.')}
  <p class="section-lead">Cada persona entra con su propio usuario y rol. El administrador puede gestionar quién forma parte del equipo.</p>
  ${productGallery('zyro', zyro.name, zyro.panel)}
  <p class="product-caption">Capturas del panel con datos de demostración.</p>
  <div class="product-storefront">
    ${heading('VIDRIERA PÚBLICA / GENTILE AUTOS', 'Así lo ve', 'el comprador.')}
    <p class="section-lead">Gentile Autos es el primer cliente de Zyro AI. Su vidriera incluye inicio, catálogo y ficha de cada unidad.</p>
    ${productGallery('zyro', zyro.name, zyro.storefront, 'product-gallery-public')}
    <div class="section-action">${button('Ver el caso de Gentile Autos', projectPath('gentile-autos'), 'text-button')}</div>
  </div>
</div></section>
<section class="section grid-bg" id="recorrido"><div class="wrap">
  ${heading('04 / EJEMPLO DE USO', 'De un mensaje a', 'una visita agendada.')}
  <ol class="product-timeline">${featureCards(zyro.example)}</ol>
</div></section>
<section class="closing">${shaderCanvas('orange')}<div class="wrap" data-enter>
  ${note('05 / PROBÁ ZYRO AI')}
  <h2>¿Cómo se vería Zyro en <em class="editorial">tu concesionaria?</em></h2>
  ${button(zyroContactLabel, zyroContact, 'black')}
</div></section>`;

const cubikoPage = hero({
  label: 'CUBIKO AI / PARA INMOBILIARIAS',
  title: 'Cargás una propiedad. <em class="editorial">Martina atiende</em> las consultas.',
  description: cubiko.description,
  actions: heroActions(cubikoContact),
  preview: await media(cubiko.video, 'CUBIKO AI / CONOCÉ A MARTINA', 'Video en preparación'),
}) + `
<section class="section light" id="martina"><div class="wrap" id="sofia">
  ${heading('01 / MARTINA', 'Una asistente para', 'todos tus canales.')}
  <p class="section-lead">Mientras mostrás una propiedad, Martina puede responder por otra. Registra qué busca cada persona y le deja al equipo lo que necesita para seguir la conversación.</p>
  <ul class="product-features">${featureCards(cubiko.martina)}</ul>
</div></section>
<section class="section grid-bg" id="publicar"><div class="wrap">
  ${heading('02 / PUBLICACIÓN', 'Cargás la propiedad una vez.', 'La publicás con un clic.')}
  <ol class="product-features product-numbered">${featureCards(cubiko.publishing)}</ol>
</div></section>
<section class="section light" id="panel"><div class="wrap">
  ${heading('03 / PANEL DE GESTIÓN', 'Propiedades, consultas', 'y tareas en un lugar.')}
  <p class="section-lead">El equipo puede ver quién lleva cada consulta, qué propiedad le interesa al cliente y qué queda por hacer. Las secciones disponibles dependen del rol de cada persona.</p>
  ${productGallery('cubiko', cubiko.name, cubiko.panel)}
  <p class="product-caption">Capturas del panel con datos de demostración.</p>
  <div class="section-action">${button('Ver el caso de Lamelas & Chaumont', projectPath('lamelas-chaumont'), 'text-button')}</div>
</div></section>
<section class="section light" id="alquileres"><div class="wrap">
  ${heading('04 / ALQUILERES', 'Administrá contratos', 'y pedidos de mantenimiento.')}
  <p class="section-lead">El equipo gestiona los alquileres desde el panel. Los inquilinos tienen un portal con acceso propio para consultar su cuenta y sus contratos.</p>
  ${productGallery('cubiko', cubiko.name, cubiko.rentals)}
  <p class="product-caption">Capturas del panel con datos de demostración.</p>
</div></section>
<section class="section grid-bg" id="recorrido"><div class="wrap">
  ${heading('05 / EJEMPLO DE USO', 'De una búsqueda', 'a una visita agendada.')}
  <ol class="product-timeline">${featureCards(cubiko.example)}</ol>
</div></section>
<section class="closing">${shaderCanvas('orange')}<div class="wrap" data-enter>
  ${note('06 / PROBÁ CUBIKO AI')}
  <h2>¿Cómo se vería Cubiko en <em class="editorial">tu inmobiliaria?</em></h2>
  ${button(cubikoContactLabel, cubikoContact, 'black')}
</div></section>`;

const tokiPage = hero({
  label: 'TOKI / PARA NEGOCIOS GASTRONÓMICOS',
  title: 'Seguí en la plancha. <em class="editorial">Toki toma el pedido.</em>',
  description: toki.description,
  actions: heroActions(tokiContact),
  preview: await media(toki.video, 'TOKI / MIRÁ CÓMO FUNCIONA', 'Video en preparación'),
}) + `
<section class="section light" id="como-funciona"><div class="wrap">
  ${heading('01 / TOKI', 'Del menú a cocina,', 'sin copiar pedidos a mano.')}
  <p class="section-lead">Cuando entran varios pedidos a la vez, tu equipo puede ver qué preparar y por dónde llegó cada uno. Mientras tanto, Toki atiende por WhatsApp.</p>
  <ul class="product-features">${featureCards(toki.features)}</ul>
</div></section>
<section class="section light" id="panel"><div class="wrap">
  ${heading('02 / PANEL DE GESTIÓN', 'Lo que entró, lo que se prepara', 'y lo que ya está listo.')}
  <p class="section-lead">Desde el panel podés revisar pedidos, registrar ventas de mostrador y actualizar lo que aparece en el menú.</p>
  ${productGallery('toki', toki.name, toki.panel)}
  <div class="product-storefront" id="menu-digital">
    ${heading('MENÚ DIGITAL / VISTA DEL CLIENTE', 'Así se ve un pedido', 'desde el otro lado.')}
    <p class="section-lead">El cliente puede armar su carrito, elegir entre envío o retiro y consultar cómo avanza el pedido.</p>
    ${productGallery('toki', toki.name, toki.storefront, 'product-gallery-public')}
  </div>
  <p class="product-caption">Capturas del sistema con datos de demostración.</p>
</div></section>
<section class="section grid-bg" id="recorrido"><div class="wrap">
  ${heading('03 / EJEMPLO DE USO', 'De un pedido en la web', 'a un retiro en el local.')}
  <ol class="product-timeline">${featureCards(toki.example)}</ol>
</div></section>
<section class="closing">${shaderCanvas('orange')}<div class="wrap" data-enter>
  ${note('04 / PROBÁ TOKI')}
  <h2>¿Cómo se vería Toki en <em class="editorial">tu local?</em></h2>
  ${button(tokiContactLabel, tokiContact, 'black')}
</div></section>`;

const pages = [
  ['/', 'Koi Studio | Empleados digitales para tu empresa', config.description, home],
  ['/proyectos/', 'Proyectos | Koi Studio', 'Conocé cómo se usan las soluciones de Koi Studio en distintos equipos.', portfolio],
  ['/productos/zyro-ai/', zyro.name + ' | Koi Studio', zyro.description, zyroPage],
  ['/productos/cubiko-ai/', cubiko.name + ' | Koi Studio', cubiko.description, cubikoPage],
  ['/productos/toki-ai/', toki.name + ' | Koi Studio', toki.description, tokiPage],
];

await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });
await cp(path.join(root, 'assets'), path.join(out, 'assets'), { recursive: true });
for (const file of ['styles.css', 'app.js', 'analytics.js', 'hero-shader.js']) {
  await cp(path.join(root, 'src', file), path.join(out, 'assets', file));
}
const lenis = path.join(root, 'node_modules/lenis');
await cp(path.join(lenis, 'dist/lenis.mjs'), path.join(out, 'assets/lenis.js'));
await cp(path.join(lenis, 'dist/lenis.css'), path.join(out, 'assets/lenis.css'));
await cp(path.join(lenis, 'LICENSE'), path.join(out, 'assets/lenis-LICENSE.txt'));
await cp(path.join(root, 'assets/brand/favicon.ico'), path.join(out, 'favicon.ico'));
for (const [route, title, description, body] of pages) {
  const directory = path.join(out, route);
  await mkdir(directory, { recursive: true });
  await writeFile(path.join(directory, 'index.html'), shell(title, description, route, body));
}
await mkdir(path.join(out, 'privacidad'));
await writeFile(path.join(out, 'privacidad/index.html'), shell('Privacidad | Koi Studio', 'Información sobre el uso de datos.', '/privacidad/', `<section class="inner-intro"><div class="wrap legal"><h1>Privacidad</h1><p>Usamos Microsoft Clarity en el sitio público para mejorar la experiencia mediante mapas de calor y grabaciones de sesiones. Clarity puede procesar interacciones, datos técnicos del dispositivo y cookies según su configuración y las preferencias de consentimiento. Podés consultar la <a href="https://privacy.microsoft.com/es-es/privacystatement">declaración de privacidad de Microsoft</a>.</p><p>Si nos escribís por WhatsApp, usamos lo que compartís para responder tu consulta. Para consultas sobre tus datos, escribinos a <a href="mailto:${escape(config.email)}">${escape(config.email)}</a>.</p></div></section>`));
await writeFile(path.join(out, '404.html'), shell('Página no encontrada | Koi Studio', 'Volvé al inicio de Koi Studio.', '/404.html', `<section class="inner-intro"><div class="wrap">${note('404')}<h1>Página no encontrada</h1>${button('Volver al inicio', '/')}</div></section>`, false));
await writeFile(path.join(out, 'robots.txt'), 'User-agent: *\nAllow: /\nSitemap: ' + config.url + '/sitemap.xml\n');
await writeFile(path.join(out, 'sitemap.xml'), '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' +
  [...pages.map(page => page[0]), '/privacidad/'].map(route => '<url><loc>' + escape(config.url + route) + '</loc></url>').join('') + '</urlset>\n');
