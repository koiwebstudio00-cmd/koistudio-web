import http from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import { createReadStream } from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(fileURLToPath(new URL('../dist/',import.meta.url)));
const types={'.mp4':'video/mp4','.ico':'image/x-icon','.webmanifest':'application/manifest+json','.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json','.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp','.ttf':'font/ttf','.txt':'text/plain; charset=utf-8','.xml':'application/xml; charset=utf-8'};
const port=Number(process.env.PORT || 4173);

function streamVideo(req, res, file, size) {
  const headers = { 'Content-Type': 'video/mp4', 'Accept-Ranges': 'bytes' };
  let start = 0;
  let end = size - 1;
  if (req.headers.range) {
    const range = /^bytes=(\d*)-(\d*)$/.exec(req.headers.range);
    if (range && (range[1] || range[2])) {
      if (range[1]) {
        start = Number(range[1]);
        if (range[2]) end = Math.min(Number(range[2]), end);
      } else {
        start = Math.max(0, size - Number(range[2]));
      }
    } else {
      start = size;
    }
    if (start >= size || start > end) {
      res.writeHead(416, { ...headers, 'Content-Range': `bytes */${size}` });
      return res.end();
    }
    headers['Content-Range'] = `bytes ${start}-${end}/${size}`;
  }
  headers['Content-Length'] = end - start + 1;
  res.writeHead(req.headers.range ? 206 : 200, headers);
  if (req.method === 'HEAD') return res.end();
  const stream = createReadStream(file, { start, end });
  stream.on('error', error => res.destroy(error));
  res.on('close', () => stream.destroy());
  stream.pipe(res);
}

http.createServer(async(req,res)=>{
 if(!['GET','HEAD'].includes(req.method)){res.writeHead(405,{'Allow':'GET, HEAD'});return res.end();}
 try{
  const url=new URL(req.url,'http://localhost');
  const pathname=decodeURIComponent(url.pathname);
  let file=path.resolve(root,'.'+pathname);
  if(file!==root&&!file.startsWith(root+path.sep)){res.writeHead(403);return res.end('Forbidden');}
  let status=200;
  try{if((await stat(file)).isDirectory()){if(!pathname.endsWith('/')){res.writeHead(308,{Location:pathname+'/'+url.search});return res.end();}file=path.join(file,'index.html');}}catch{file=path.join(root,'404.html');status=404;}
  if (status === 200 && path.extname(file) === '.mp4') {
    const { size } = await stat(file);
    if (size > 0) return streamVideo(req, res, file, size);
  }
  let data;
  try{data=await readFile(file);}catch{data=await readFile(path.join(root,'404.html'));status=404;file='404.html';}
  res.writeHead(status,{'Content-Type':types[path.extname(file)]||'application/octet-stream','X-Content-Type-Options':'nosniff','Referrer-Policy':'strict-origin-when-cross-origin','X-Frame-Options':'DENY','Content-Security-Policy':"default-src 'self'; script-src 'self' https://*.clarity.ms; connect-src 'self' https://*.clarity.ms https://c.bing.com; style-src 'self'; img-src 'self' data: https://*.clarity.ms https://c.bing.com; font-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'"});
  res.end(req.method==='HEAD'?undefined:data);
 }catch{res.writeHead(400);res.end('Bad request');}
}).listen(port,'127.0.0.1',()=>console.log(`Koi Studio: http://127.0.0.1:${port}`));
