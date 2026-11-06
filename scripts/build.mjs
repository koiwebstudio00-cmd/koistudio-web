import { cp, mkdir, readFile, rm, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { products, projects, workshops } from '../src/content.mjs';

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
const menu = '<a href="/#productos">Productos</a><a href="/proyectos/">Proyectos</a><a href="/#workshops">Workshops</a>';
const brand = `<a class="brand" href="/" aria-label="Koi Studio, inicio"><img src="/assets/brand/koi-symbol.png" width="38" height="38" alt=""><span>Koi Studio<small>AI &amp; SOFTWARE</small></span></a>`;
const asset = name => '/assets/' + name;

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
  const social = config.url + '/assets/social-card.jpg';
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
<link rel="icon" href="/favicon.ico">
<meta property="og:type" content="website">
<meta property="og:locale" content="es_AR">
<meta property="og:title" content="${escape(title)}">
<meta property="og:description" content="${escape(description)}">
<meta property="og:url" content="${escape(canonical)}">
<meta property="og:image" content="${escape(social)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:image" content="${escape(social)}">
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
    <nav class="desktop-nav" aria-label="Principal">${menu}</nav>
    ${button('Hablemos', whatsapp(), 'nav-cta')}
    <button type="button" class="menu-toggle" aria-label="Abrir menú" aria-expanded="false" aria-controls="mobile-nav"><span aria-hidden="true">☰</span></button>
  </div>
  <nav id="mobile-nav" class="mobile-nav wrap" aria-label="Navegación móvil" hidden>${menu}<a href="${whatsapp()}">WhatsApp ${arrow}</a></nav>
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
const illustration = product => `<div class="vertical-art detail-art" data-art-theme="${product.artTheme}" data-vertical="${product.slug}">
  ${shaderCanvas(product.artTheme)}
  ${productImage(product.image, product.alt)}
</div>`;
const clientLogo = project => `<div class="case-logo"${project.darkLogoSource ? ' data-dark-source="true"' : ''}><img src="${asset('clients/' + project.logo)}" alt="" loading="lazy"></div>`;
const closing = `<section class="closing">${shaderCanvas('orange')}<div class="wrap" data-enter>
  ${note('04 / HABLEMOS')}
  <h2>¿Qué tarea te gustaría <em class="editorial">dejar de hacer a mano?</em></h2>
  <p>Contanos cómo la resuelven hoy. Con un ejemplo alcanza para empezar a hablar.</p>
  ${button('Escribinos por WhatsApp', contact, 'black')}
</div></section>`;
const intro = `<section class="hero">
  <div class="hero-stage">
    <div class="hero-backdrop" aria-hidden="true">${shaderCanvas('dark', true)}</div>
    <div class="wrap">
      <div class="hero-copy" data-enter>
        ${note('KOI STUDIO / EMPLEADOS DIGITALES')}
        <h1>Armamos <em class="editorial">empleados digitales</em> para que no tengas que estar en todo.</h1>
        <p>Atienden consultas, toman pedidos y retoman conversaciones de venta. Los armamos con tus precios, tus horarios y tus reglas, para que resuelvan lo de todos los días y te pasen lo que necesita tu atención.</p>
        <div class="actions">${button('Ver cómo funciona', '#vsl', 'secondary', '<span aria-hidden="true">↓</span>')}${shaderButton('Hablemos por WhatsApp', whatsapp())}</div>
      </div>
    </div>
  </div>
  <div class="wrap vsl-reveal" id="vsl">
    ${await media('media/koi-vsl.mp4', 'KOI STUDIO / CÓMO FUNCIONA', 'Video en preparación')}
  </div>
</section>`;
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

const cases = await Promise.all(projects.map(async (project, index) => `<article class="case-detail" id="${project.slug}">
  <div class="case-copy" data-enter>${clientLogo(project)}${note('0' + (index + 1) + ' / ' + project.sector)}
  <h2>${escape(project.name)}</h2><p class="scene">${escape(project.scene)}</p><p>${escape(project.description)}</p></div>
  ${await media('media/proyectos/' + project.slug + '.png', 'Captura de ' + project.name, 'Captura pendiente')}
</article>`));
const portfolio = `<section class="grid-bg inner-intro"><div class="wrap" data-enter>${note('PORTFOLIO / KOI STUDIO')}<h1>Así se usa lo que hacemos.</h1>
  <nav class="case-index" aria-label="Casos del portfolio">${projects.map(project => `<a href="#${project.slug}">${escape(project.name)} ${arrow}</a>`).join('')}</nav>
</div></section><section class="section light"><div class="wrap case-list">${cases.join('')}</div></section>${closing}`;

const pages = [
  ['/', 'Koi Studio | Empleados digitales para tu empresa', config.description, home],
  ['/proyectos/', 'Proyectos | Koi Studio', 'Conocé cómo se usan las soluciones de Koi Studio en distintos equipos.', portfolio],
];
for (const product of products) {
  const demo = (product.slug === 'toki-ai' ? 'Demo de ' : 'Captura de ') + product.name;
  const body = `<section class="grid-bg inner-intro"><div class="wrap product-detail">
    <div data-enter><a class="back" href="/#productos">← Productos</a>${note(product.sector)}
    <h1>${product.name}</h1><p class="scene">${escape(product.scene)}</p><p>${escape(product.description)}</p>
    <div class="actions">${button('Hablemos de ' + product.name, whatsapp('Hola, equipo de Koi. Quiero saber cómo podría usar ' + product.name + ' en mi empresa.'))}</div></div>
    ${illustration(product)}
  </div></section>
  <section class="section light"><div class="wrap">
    ${heading('PRODUCTO / ' + product.name.toUpperCase(), demo)}
    ${await media('media/productos/' + product.slug + '.png', demo, 'Captura pendiente')}
    ${product.project ? `<div class="section-action">${button(product.projectLabel, projectPath(product.project), 'text-button')}</div>` : ''}
  </div></section>`;
  pages.push([productPath(product), product.name + ' | Koi Studio', product.description, body]);
}

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
