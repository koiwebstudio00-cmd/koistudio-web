# Koi Studio

Sitio estático en español argentino, con HTML generado por Node, CSS y JavaScript nativo. Vercel publica el directorio `dist/`.

## Recursos

La biblioteca está en `/recursos/`, enlazada desde el navbar de escritorio y móvil y el pie de página. Conserva los cuatro prompts de talking heads y suma treinta artículos de carruseles, con portadas, bloques editoriales, 89 prompts copiables y 110 descargas. Los cuatro talking heads mantienen sus URLs, contenido y experiencia de copia. Las fechas de los artículos se identifican como planificación del carrusel; no se asignan fechas de publicación web.

El contenido se edita en `src/resources.mjs`. Las vistas están en `src/resource-pages.mjs`, los estilos en `src/resources.css` y la búsqueda y copia en `src/resources.js`. Al ejecutar `npm run build` se generan las fichas, los archivos `prompt.txt` y las entradas del sitemap. Después de editar, reconstruir y recargar el navegador; el servidor no tiene recarga automática.

Vista local: `npm run dev`, luego abrir `http://127.0.0.1:4173/recursos/`. No se necesitan credenciales ni servicios externos para esta sección.

Los carruseles están en `src/content/carruseles.json`; se importan con `python3 scripts/import-resources.py` usando `clave_integracion`, sin tocar `src/resources.mjs`. Las páginas se construyen desde `bloques`. El importador solo copia portadas y descargables declarados a `assets/recursos/carruseles/`. Los cuadernos y calculadoras tienen copias alojadas con CSS y JavaScript externos para funcionar bajo CSP, además de los HTML originales descargables que funcionan sin conexión. El kit C30 conserva sus diez recursos.

El catálogo filtra por tema, formato y búsqueda, y muestra más resultados por tandas. Sin JavaScript los 34 enlaces y contenidos siguen accesibles. Los registros locales en `integracion/` guardan claves, rutas y controles y se excluyen de Git. Esos registros, el paquete de origen y las herramientas internas de QA no se copian al sitio público. Las URLs públicas se registran después de comprobar el despliegue.

El número de todos los CTA de WhatsApp se configura en `site.config.json`, campo `whatsapp`, en formato internacional con solo dígitos. Los mensajes propios de Zyro, Cubiko, Toki y workshops se conservan al generar cada enlace.

```sh
npm ci
npm run build
npm run check
npm start
```

La home enlaza a los tres productos y a los casos del portfolio. El contenido editable está en `src/content.mjs`. El estilo de los titulares usa Poppins Bold con `letter-spacing: -0.05em`, equivalente a tracking −50.

## Cargar material real

Agregá los archivos con estos nombres y ejecutá de nuevo `npm run build`. Los espacios reservados se sustituyen automáticamente por el video o la captura.

| Contenido | Archivo |
| --- | --- |
| Video de la portada | `assets/media/koi-vsl.mp4` |
| Zyro AI | `assets/media/productos/zyro-ai.png` |
| Cubiko AI | `assets/media/productos/cubiko-ai.png` |
| Demo de Toki AI | `assets/media/productos/toki-ai.png` |
| Lamelas & Chaumont | `assets/media/proyectos/lamelas-chaumont.png` |
| Universidad San Pablo T | `assets/media/proyectos/universidad-san-pablo-t.png` |
| Gentile Autos | `assets/media/proyectos/gentile-autos.png` |
| Estudio Guzmán | `assets/media/proyectos/estudio-guzman.png` |
