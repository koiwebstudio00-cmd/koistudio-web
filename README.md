# Koi Studio

Sitio estático en español argentino, con HTML generado por Node, CSS y JavaScript nativo. Vercel publica el directorio `dist/`.

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
