import {readFile,readdir,stat} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const root=fileURLToPath(new URL('../dist/',import.meta.url));
async function walk(dir){const result=[];for(const entry of await readdir(dir,{withFileTypes:true})){const full=path.join(dir,entry.name);if(entry.isDirectory())result.push(...await walk(full));else result.push(full);}return result;}
const files=await walk(root), pages=files.filter(f=>f.endsWith('.html'));
const titles=new Set();let links=0;
for(const file of pages){const html=await readFile(file,'utf8');assert.equal((html.match(/<h1[ >]/g)||[]).length,1,`${file}: un solo H1`);assert.match(html,/<html lang="es-AR">/);assert.match(html,/<meta name="description" content="[^"]{30,}"/);assert.match(html,/<link rel="canonical" href="https:\/\/koistudio.com.ar/);const title=html.match(/<title>(.*?)<\/title>/)[1];assert(!titles.has(title),'Títulos únicos');titles.add(title);for(const match of html.matchAll(/(?:href|src)="(\/[^"?#]*)(?:[?#][^"]*)?"/g)){const route=decodeURIComponent(match[1]);let local=path.join(root,route);if((await stat(local)).isDirectory())local=path.join(local,'index.html');await stat(local);links++;}for(const img of html.matchAll(/<img\b[^>]*>/g))assert.match(img[0],/alt="[^"]+"/);JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1]);}
assert.equal(createHash('sha256').update(await readFile(path.join(root,'assets/brand/logo-black.png'))).digest('hex'),'2d559adfb0737eb811354abee6c3194ecc18fda1174498ad766206c747befddc','Logo negro original intacto');
assert.equal(createHash('sha256').update(await readFile(path.join(root,'assets/brand/logo-white.png'))).digest('hex'),'7044aecb0cd3a5bbca489b7f16cb75405d658d145c643dfcf523a69911244a41','Logo blanco original intacto');
for(const filename of ['robots.txt','llm.txt','llms.txt','sitemap.xml'])await stat(path.join(root,filename));
assert(!(await readFile(path.join(root,'sitemap.xml'),'utf8')).includes('404.html'));
console.log(`OK: ${pages.length} páginas, ${links} enlaces y recursos locales, títulos únicos, metadatos, JSON-LD, sitemap y logos originales.`);
