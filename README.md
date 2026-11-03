# Koi Studio · Sitio corporativo

Sitio estático multipágina con Node.js 22 o superior. Contenido HTML generado para SEO y accesibilidad; CSS y JavaScript progresivos para las interacciones. GSAP y ScrollTrigger se instalan desde npm y se sirven localmente, sin CDN.

## Uso local

Desde esta carpeta, instalar las dependencias una vez y luego iniciar:

```sh
npm ci
npm run dev
```

Abrí http://127.0.0.1:4173. Para regenerar después de editar: `npm run build` y recargá el navegador. `npm start` sirve la última compilación. `PORT` permite cambiar el puerto. El servidor está limitado a localhost.

```sh
npm run build
npm run check
```

El resultado publicable está en `dist/`. El dominio configurado es `https://koistudio.com.ar`; no se modificó su DNS ni se publicó el sitio.

## Estructura

- `site.config.json`: dominio, correo y redes oficiales.
- `src/projects.json`: productos propios y fichas.
- `src/clients.json`: nombres de clientes confirmados por el propietario.
- `scripts/build.mjs`: plantillas HTML, SEO y archivos de descubrimiento.
- `src/styles.css`: sistema visual y comportamiento adaptable.
- `src/design.css`: rediseño v2, escalas, alineaciones, retículas y adaptaciones móviles.
- `src/sections.mjs`: portada, tarjetas de proyectos y cierre de la versión v2.
- `src/app.js`: menú móvil, filtros, animaciones y formulario.
- `src/motion.js`: GSAP + ScrollTrigger, media queries, movimiento reducido y limpieza de efectos.
- `DESIGN.md`: criterios del sistema visual y de movimiento.
- `assets/brand/`: PNG originales sin modificar. La caja CSS alinea sus márgenes transparentes y conserva el dibujo completo.
- `assets/fonts/`: fuentes locales y licencias OFL.
- `assets/hero-v2.jpg`, `lokation-v2.jpg`, `zyro-v2.jpg`, `toki-v2.jpg`: nuevas ilustraciones generadas, optimizadas a JPEG. No son capturas de productos. `hero.jpg` conserva el recurso anterior.

## Páginas y funciones

Inicio, portfolio filtrable, tres fichas propias, contacto, privacidad y 404. Incluye robots.txt, sitemap.xml, llm.txt y llms.txt; canonical, descripciones únicas, Open Graph, Twitter Cards y Organization JSON-LD. Navegación por teclado, enlace de salto, semántica HTML, etiquetas de formularios, estados accesibles y respeto de reduced motion.

## Formulario y contacto

El formulario valida datos y prepara un correo dirigido a `koistudio00@gmail.com`. El visitante revisa y envía desde su aplicación de correo. No declara envíos exitosos que no ocurrieron. Incluye copiar y descargar como alternativas cuando no hay un cliente de correo configurado; mensajes extensos usan estas alternativas para evitar límites de mailto. No se guardan datos en un servidor.

Para envío directo desde la web se necesita conectar un servicio transaccional o backend y su configuración privada; no se incluyeron credenciales ni se habilitó un proveedor sin autorización. La política de privacidad refleja el comportamiento actual.

## Contenido

Lokation, Zyro y Toki se describen según el manual; no se presenta su alcance como una lista de funciones disponibles. Los cinco clientes se muestran con los nombres aportados, sin inventar capturas, testimonios ni resultados. Para convertir sus tarjetas en casos de estudio, agregar alcance aprobado, imágenes y enlaces reales. La etiqueta "Clientes" distingue estas relaciones de las fichas de productos propios.

## Publicación

Subir el contenido de `dist/` a un alojamiento estático y asociar el dominio. Configurar páginas de directorio (`/contacto/index.html`) y una respuesta HTTP 404 real para rutas inexistentes usando `404.html`; no reescribir todo a index.html. `_headers` aporta cabeceras en plataformas compatibles. El servidor local ya implementa estados HTTP y redirección a rutas con barra final. Configurar HTTPS, redirección www a dominio canónico y compresión en el proveedor elegido. Luego enviar sitemap.xml a Search Console. Ninguno de estos pasos externos fue realizado.

## Identidad

Manual Koi Studio v1 (02/11/2026): naranja #FA5D00, negro #0B0B0B, grafito #222222, gris #F2F2F0. Manrope 400/600/800 e Instrument Serif Italic 400. Se conservaron los originales del logo y sus colores. Los gráficos de productos son ilustraciones conceptuales, no capturas ni identidades alternativas.

## Movimiento v2

Entradas escalonadas, parallax leve de la portada en escritorio, progreso de lectura, recorrido del proceso y flecha final ligada al scroll. El desplazamiento sigue siendo nativo. `prefers-reduced-motion: reduce` desactiva GSAP; cambios de breakpoint revierten sus estilos. Si falta GSAP o falla su inicio, el contenido sigue disponible. Los filtros y acordeones actualizan los cálculos de ScrollTrigger. Los logos no se animan.

## Refinamiento v3

`src/refinement.css` añade navbar compacto, hero centrado con fondo CSS, iconos SVG y diagrama responsive. Se mantienen las cards de productos. ScrollTrigger controla el parallax por capas, la línea del diagrama y la transición tipográfica. El servidor local existente puede mantenerse abierto: después de `npm run build`, recargar el navegador.

## Favicon e imagen social

Los PNG `assets/brand/icon-{16,32,48,180,192,512}.png` y el ICO multiresolución se generan con `scripts/create-icons.ps1` a partir del isotipo original, sobre fondo oscuro y con margen. El original no se modifica. El build publica favicon.ico en la raíz, los tamaños PNG, apple-touch-icon y site.webmanifest.

`assets/social-card.jpg` es el render final de 1200 × 630 utilizado por Open Graph y Twitter en todas las páginas. `src/social-preview.html` y `src/social-preview.css` conservan la composición editable, con fuentes y logo originales, sobre `assets/social-background.jpg`. Para regenerar: servir temporalmente el HTML en /social-preview.html y su CSS en /assets/social-preview.css, capturar a 1200 × 630 con las fuentes cargadas, guardar en assets/social-card.jpg y reconstruir. La página de render no forma parte de la publicación.
