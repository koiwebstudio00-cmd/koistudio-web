import { readFileSync } from 'node:fs';
export const carouselArticles=JSON.parse(readFileSync(new URL('./content/carruseles.json',import.meta.url),'utf8'));
const topics={C01:'Contenido',C02:'Contenido',C03:'Herramientas',C04:'Fotografía',C05:'Ventas',C06:'Herramientas',C07:'Organización',C08:'Contenido',C09:'Productividad',C10:'Productividad',C11:'Ventas',C12:'Fotografía',C13:'Fotografía',C14:'Contenido',C15:'Organización',C16:'Organización',C17:'Contenido',C18:'Herramientas',C19:'Contenido',C20:'Ventas',C21:'Herramientas',C22:'Ventas',C23:'Contenido',C24:'Organización',C25:'Estrategia',C26:'Ventas',C27:'Productividad',C28:'Ventas',C29:'Contenido',C30:'Herramientas'};
export const carouselResources=carouselArticles.map(a=>({
  slug:a.slug,type:'recurso_carrusel',topic:topics[a.id],title:a.titulo,description:a.extracto,
  outcome:a.aprendizajes[0],preview:a.aprendizajes[0],needs:a.aprendizajes,cover:a.portada,
  clave_integracion:a.clave_integracion,format:'guia',sector:a.rubro,
}));
const e=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const route=a=>`/recursos/${a.slug}/`;
export const toolRoute=(a,d)=>`${route(a)}herramientas/${d.archivo.endsWith('Calculadora.html')?'calculadora':'cuaderno'}/`;

function block(a,b,i){
  const heading=`<h2 id="seccion-${i}">${e(b.titulo)}</h2>`;
  let body='';
  switch(b.tipo){
    case 'resultado': body=`<p class="article-outcome">${e(b.texto)}</p>`;break;
    case 'texto':body=b.parrafos.map(p=>`<p>${e(p)}</p>`).join('');break;
    case 'lista':case 'pasos':{
      const tag=b.tipo==='pasos'?'ol':'ul';body=`<${tag}>${b.items.map(x=>`<li>${e(x)}</li>`).join('')}</${tag}>`;break;
    }
    case 'tabla':body=`${b.intro?`<p>${e(b.intro)}</p>`:''}<div class="article-table" tabindex="0" role="region" aria-label="${e(b.titulo)}"><table><thead><tr>${b.columnas.map(x=>`<th scope="col">${e(x)}</th>`).join('')}</tr></thead><tbody>${b.filas.map(row=>`<tr>${row.map(x=>`<td>${e(x)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;break;
    case 'prompts':body=b.items.map((p,j)=>`<section class="article-prompt" data-prompt-widget><div class="article-prompt-bar"><h3>${e(p.titulo)}</h3><button type="button" class="button primary resource-button resource-copy" data-copy-prompt aria-label="Copiar prompt: ${e(p.titulo)}" hidden><span class="resource-copy-label" data-copy-label>Copiar prompt</span></button></div><pre class="resource-prompt-text" data-prompt-text tabindex="0" aria-label="${e(p.titulo)}">${e(p.texto)}</pre><p class="sr-only" data-copy-status role="status" aria-live="polite"></p></section>`).join('');break;
    case 'descargas':body=`<div class="article-downloads">${b.items.map(d=>`<div class="article-download"><div><h3>${e(d.nombre)}</h3><p>${e(d.uso)}</p></div><div class="article-download-actions">${d.tipo==='text/html'?`<a class="button black resource-button" href="${toolRoute(a,d)}">Abrir herramienta</a>`:''}<a class="button resource-button article-download-link" href="${e(d.archivo)}" download>Descargar<span class="sr-only"> ${e(d.nombre)}</span></a></div></div>`).join('')}</div>`;break;
    case 'relacionados':body=`<div class="article-related">${b.ids.map(id=>{
      const related=carouselArticles.find(x=>x.id===id);if(!related)throw Error('Recurso relacionado ausente: '+id);
      return `<a href="${route(related)}"><img src="${e(related.portada.archivo)}" alt="${e(related.portada.alt)}" width="1080" height="1350" loading="lazy"><span>${e(related.titulo)}</span></a>`;
    }).join('')}</div>`;break;
    default:throw Error('Bloque sin representación: '+b.tipo);
  }
  return `<section class="article-section article-section-${b.tipo}" aria-labelledby="seccion-${i}">${heading}${body}</section>`;
}

export function carouselDetail(a){
  return `<section class="resource-detail-intro grid-bg"><div class="wrap article-intro-grid"><div>
    <nav class="resource-breadcrumb" aria-label="Ubicación"><a href="/recursos/">Recursos</a><span aria-hidden="true">/</span><span>Guías y recursos</span></nav>
    <p class="resource-kicker">GUÍA Y RECURSOS · ${e(a.rubro)}</p><h1>${e(a.titulo)}</h1><p class="resource-detail-description">${e(a.extracto)}</p>
    <p class="article-planning">Carrusel planificado para el ${a.fecha_carrusel_planificada.split('-').reverse().join('/')}.</p><div class="actions"><a class="button primary resource-button" href="#guia">Leer la guía</a><a class="button secondary resource-button" href="#descargables">Ver descargables</a></div>
    </div><img class="article-cover" src="${e(a.portada.archivo)}" alt="${e(a.portada.alt)}" width="1080" height="1350" fetchpriority="high"></div></section>
    <section class="section light" id="guia"><div class="wrap article-layout"><aside class="article-toc"><p class="resource-kicker">EN ESTE RECURSO</p><nav aria-label="Contenido del artículo">${a.bloques.map((b,i)=>`<a href="#seccion-${i}">${e(b.titulo)}</a>`).join('')}</nav></aside><article class="article-content" data-resource-key="${e(a.clave_integracion)}">${a.bloques.map((b,i)=>`${b.tipo==='descargas'?'<div id="descargables"></div>':''}${block(a,b,i)}`).join('')}${a.fuentes.length?`<section class="article-section"><h2>Fuentes para consultar</h2><ul>${a.fuentes.map(f=>`<li><a href="${e(f.url)}" rel="noreferrer">${e(f.titulo)}</a><p>${e(f.uso)}</p></li>`).join('')}</ul></section>`:''}</article></div></section>`;
}
