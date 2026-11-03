# Koi Studio — Sistema visual web v2

## Dirección

Una startup de tecnología con criterio editorial: tipografía protagonista, superficies tranquilas y objetos tridimensionales que explican conexión y operación. Se mantiene el manual de marca v1 como autoridad. La guía de sitios de presentación de Sites se aplica al recorrido, la jerarquía y la claridad del contenido. Este sistema corresponde al sitio local; no se declara un proyecto de Stitch.

## Color

- Naranja Koi (#FA5D00): acciones principales, recorridos y énfasis visual. Texto negro sobre naranja.
- Negro editorial (#0B0B0B): escenas, proceso de trabajo y pie de página.
- Gris claro (#F2F2F0): lienzo principal y espacio negativo.
- Gris de superficie (#EAEAE5): agrupación de servicios y formulario.
- Grafito (#222222) y gris de lectura (#595953): texto, jerarquía secundaria y bordes.

## Tipografía y escala

Manrope local 400/600/800. Instrument Serif Italic 400 destaca una idea por título. Titular de portada de 58 a 92 px en escritorio y 39 a 55 px en móvil; titulares de sección de 36 a 58 px. Cuerpo de 14 a 17 px, interlínea amplia. Las líneas se adaptan al ancho sin comprimir letras. Los logos son PNG originales intactos: ninguna animación, recoloración ni reconstrucción.

## Composición

Contenedor de 1360 px máximo. Márgenes de 56 px en escritorio, 36 en tablet y 20 en móvil. Secciones separadas por 108, 76 y 60 px según el ancho. Retícula de dos columnas en portada y estudio; tres tarjetas de proyectos en escritorio, dos en tablet y una en móvil. Navegación despejada con borde inferior, sin una cápsula alrededor de todo el encabezado. Los recursos y los títulos comparten los mismos ejes de alineación.

## Imágenes

Cuatro imágenes originales generadas para esta versión: conexión de plataformas en portada, arquitectura y llave para Lokation, automóvil para Zyro y bolsa/rollo de pedidos para Toki. Vidrio, metal y papel comparten luz y acentos naranjas. Son ilustraciones conceptuales, no capturas de productos ni evidencia de clientes. Textos y nombres siempre en HTML. Se conservó el asset anterior.

## Movimiento

GSAP y ScrollTrigger locales, con versión fijada en package-lock.json. Entrada de títulos y tarjetas, profundidad leve en la portada de escritorio, línea de progreso general, recorrido vertical del proceso y flecha de cierre vinculada al scroll. Sin secuestro del scroll, desplazamientos horizontales forzados ni reproducción infinita. Respeto por prefers-reduced-motion y reversión al cambiar de ancho. El contenido funciona sin JavaScript y si GSAP no carga.

## Referencias técnicas

- https://gsap.com/docs/v3/Plugins/ScrollTrigger/
- https://gsap.com/docs/v3/GSAP/gsap.matchMedia()/

## Ajuste v3: portada centrada y gráficos

Por solicitud del propietario, el logo del navbar se presenta a 128 px de lienzo (aproximadamente 117 px de dibujo visible), conservando el PNG completo, sus proporciones y colores. Es una excepción al mínimo operativo del manual para este navbar compacto. El pie conserva su tamaño anterior.

La portada ahora centra el mensaje sobre un fondo CSS de luz naranja, retícula tenue y órbitas. Se elimina la composición de texto e imagen en dos columnas. Las tarjetas de productos y sus assets no cambian. Se agregan iconos SVG propios, un diagrama ilustrativo consulta → proceso → acción y una transición tipográfica decorativa. GSAP anima las capas del fondo, los iconos, el trazado del diagrama y la tipografía según el scroll. El esquema se apila en móvil y las animaciones respetan reduced motion. No se anima el logo.

Los ajustes están en src/refinement.css y src/sections.mjs; motion.js mantiene los efectos y su limpieza responsive. Verificado visualmente a 1280, 390 y 320 px, sin desbordes ni errores de consola.
