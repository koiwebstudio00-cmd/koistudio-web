"""Importación idempotente del paquete editorial. Nunca toca los talking heads."""
from pathlib import Path
import hashlib, json, shutil, sys, zipfile, copy

root = Path(__file__).resolve().parent.parent
source = Path(sys.argv[1]) if len(sys.argv)>1 else Path('/Volumes/DATA/Kointenido/4-Produccion/Entregables-Web-30')
index = json.loads((source/'indice.json').read_text())
prior_file=root/'integracion/carruseles.json'
prior={x['clave_integracion']:x for x in json.loads(prior_file.read_text())} if prior_file.exists() else {}
articles=[]; seen=set(); receipts=[]
for item in index['articulos']:
    folder=(source/item['articulo_json']).parent
    original=json.loads((folder/'articulo.json').read_text())
    key=original['clave_integracion']
    assert key==f"koi:carrusel:{original['id']}" and key not in seen, key
    seen.add(key)
    public=f"/assets/recursos/carruseles/{original['id']}"
    target=root/public.lstrip('/');target.mkdir(parents=True,exist_ok=True)
    names=['Portada.png']+[d['archivo'] for d in original['descargas']]
    for name in names:
        path=(folder/name).resolve()
        assert path.is_relative_to(folder.resolve()) and path.is_file(), path
        if path.suffix=='.zip':
            with zipfile.ZipFile(path) as z:
                assert z.testzip() is None
                assert not any('/../' in n or n.startswith('/') or n.lower().endswith(('qa.json','articulo.json','integracion.txt')) or 'Herramientas/' in n for n in z.namelist())
        dest=target/name;dest.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(path,dest)
        assert hashlib.sha256(path.read_bytes()).digest()==hashlib.sha256(dest.read_bytes()).digest()
    # Explicit allowlist: source instructions, generated review HTML and QA never enter dist.
    a={k:copy.deepcopy(original[k]) for k in ['id','clave_integracion','tipo','slug','titulo','extracto','aprendizajes','serie','rubro','fecha_carrusel_planificada','bloques','fuentes','version']}
    a['fecha_publicacion_web']=None
    a['portada']={**original['portada'],'archivo':public+'/Portada.png'}
    a['descargas']=[{**d,'archivo':public+'/'+d['archivo']} for d in original['descargas']]
    for b in a['bloques']:
        if b['tipo']=='descargas':
            b['items']=[{**d,'archivo':public+'/'+d['archivo']} for d in b['items']]
    articles.append(a)
    receipt={'url_publica':None,'fecha_publicacion_web':None,'estado':'integrado_local_pendiente_alojamiento',**prior.get(key,{}),'clave_integracion':key,'id_web':key,'ruta_web':'/recursos/'+a['slug']+'/', 'portada':a['portada']['archivo'],'descargas':a['descargas'],'sha256_bloques_origen':hashlib.sha256(json.dumps(original['bloques'],ensure_ascii=False,sort_keys=True).encode()).hexdigest()}
    receipts.append(receipt)
assert len(articles)==30 and len(seen)==30
content=root/'src/content';content.mkdir(parents=True,exist_ok=True)
(content/'carruseles.json').write_text(json.dumps(articles,ensure_ascii=False,indent=2)+'\n')
record=root/'integracion';record.mkdir(exist_ok=True)
(record/'carruseles.json').write_text(json.dumps(receipts,ensure_ascii=False,indent=2)+'\n')
print(f'Importados {len(articles)} artículos por clave estable; portadas y descargas idénticas al origen.')
