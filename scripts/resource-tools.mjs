import { readFile, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { toolRoute } from '../src/carousel-resources.mjs';
const e=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

// Raw downloads remain identical. Hosted tools externalize scripts/styles for CSP.
export async function buildResourceTools(root,out,articles,siteUrl){
  const routes=[];
  for(const article of articles)for(const download of article.descargas.filter(d=>d.tipo==='text/html')){
    let html=await readFile(path.join(root,download.archivo),'utf8');
    if(!/<head[ >]/.test(html))html=html.replace(/(<html[^>]*>)/,'$1<head>').replace('<main>','</head><body><main>').replace('</html>','</body></html>');
    const route=toolRoute(article,download),folder=path.join(out,route);await mkdir(folder,{recursive:true});
    let style='';html=html.replace(/<style[^>]*>([\s\S]*?)<\/style>/g,(_,css)=>{style+=css;return `<link rel="stylesheet" href="${route}herramienta.css">`;});
    let scriptIndex=0;const scripts=[];
    html=html.replace(/<script([^>]*)>([\s\S]*?)<\/script>/g,(match,attributes,js)=>{
      if(/type=["']application\/json["']/.test(attributes))return match;
      const name=`herramienta-${++scriptIndex}.js`;scripts.push([name,js]);return `<script src="${route+name}" defer></script>`;
    });
    const title=html.match(/<title>(.*?)<\/title>/s)[1].replace(/ · Koi$/,'')+' | Herramientas Koi Studio';
    html=html.replace(/<html lang="es">/,'<html lang="es-AR">').replace(/<title>.*?<\/title>/s,`<title>${e(title)}</title>`);
    const org={'@context':'https://schema.org','@type':'Organization',name:'Koi Studio',url:siteUrl};
    html=html.replace('</head>',`<meta name="description" content="${e(download.uso)}"><link rel="canonical" href="${siteUrl+route}"><script type="application/ld+json">${JSON.stringify(org)}</script></head>`);
    html=html.replace(/(<body[^>]*>)/,`$1<nav class="koi-tool-nav" aria-label="Navegación de la herramienta"><a href="/recursos/${article.slug}/">Koi Studio · Volver al recurso</a></nav>`);
    style+=`\n@font-face{font-family:Manrope;src:url('/assets/fonts/Manrope-400.ttf');font-weight:400;font-display:swap}@font-face{font-family:Manrope;src:url('/assets/fonts/Manrope-800.ttf');font-weight:800;font-display:swap}body{background:#f2f2f0;font-family:Manrope,sans-serif;color:#0b0b0b}h1,h2{font-weight:800;letter-spacing:-.04em}button{min-height:44px}.koi-tool-nav{background:#0b0b0b;padding:18px 24px}.koi-tool-nav a{color:#ff9b64;font-size:15px;text-decoration:none}textarea{font-family:Manrope,sans-serif;font-size:16px}.bar>*{max-width:100%;min-width:0}.import{display:flex;flex-direction:column;gap:8px}.import input{display:block;width:100%;min-width:0}.head{flex-wrap:wrap}@media(max-width:400px){form{padding:16px;grid-template-columns:minmax(0,1fr)}main{padding-inline:16px}.fields{grid-template-columns:minmax(0,1fr)}}@media print{.koi-tool-nav{display:none}}`;
    await writeFile(path.join(folder,'index.html'),html);await writeFile(path.join(folder,'herramienta.css'),style);
    for(const [name,js] of scripts)await writeFile(path.join(folder,name),js);
    routes.push(route);
  }
  return routes;
}
