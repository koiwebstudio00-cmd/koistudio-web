// Biblioteca editorial: sumar recursos acá genera sus páginas, descargas y sitemap.
// Tipos previstos: prompt, guia, plantilla. Solo se muestran recursos disponibles.
export const resourceTypes = { prompt: 'Prompt', guia: 'Guía', plantilla: 'Plantilla' };

export const resources = [
  {
    slug: 'foto-de-producto',
    type: 'prompt',
    topic: 'Fotografía',
    reel: 'R02',
    title: 'De una foto común a una imagen publicitaria.',
    shortTitle: 'Una foto. Otra puesta en escena.',
    description: 'Dale una dirección de arte a la foto de tu producto: fondo, luz y composición, conservando lo que realmente vendés.',
    outcome: 'Una imagen de tu producto con una puesta en escena definida por vos.',
    needs: ['Una foto propia, nítida y bien iluminada del producto.', 'El formato de la pieza y una idea del fondo que querés.'],
    steps: ['Adjuntá la foto en una herramienta de IA que permita editar imágenes.', 'Copiá el prompt y reemplazá los campos entre corchetes.', 'Compará el resultado con la foto original antes de publicarlo.'],
    preview: 'Conservá el producto original. Cambiá el fondo, la iluminación y la composición.',
    checklist: ['¿Coinciden la forma, el color, los materiales y la cantidad?', '¿Se mantienen la etiqueta y todos los detalles visibles?', '¿La imagen representa el producto que tu cliente va a recibir?'],
    prompt: `Quiero editar la foto adjunta para crear una imagen publicitaria de mi producto.

CONTEXTO
Producto: [qué vendés y cuáles son sus características visibles].
Uso de la imagen: [historia, publicación, menú, catálogo u otro].
Formato: [vertical 9:16, cuadrado 1:1, vertical 4:5 u otro].
Fondo o escena: [describí el entorno que querés].
Iluminación: [por ejemplo, luz lateral suave de ventana].
Composición: [posición del producto, encuadre y espacio libre necesario].
Referencia visual: [adjuntá una referencia o describí el estilo; si no tenés, indicá “sin referencia”].

QUÉ NECESITO
Editá la foto adjunta siguiendo esa dirección. El producto debe seguir siendo el original: conservá su forma, proporciones, color, materiales, cantidad y detalles visibles. Modificá el entorno, la luz y el encuadre sin alterar lo que vendo.

No inventes etiquetas, ingredientes, accesorios, funciones ni texto. No agregues unidades ni cambies el contenido del producto. No tapes características importantes. La referencia de estilo sirve para el ambiente, no para reemplazar mi producto por el de otra marca.

Si falta una decisión que afecte el resultado, preguntame antes de generar. Si la foto no permite distinguir un detalle importante, pedime una referencia más clara en vez de inventarlo. Si tu herramienta no permite editar la imagen o conservar un detalle, explicame esa limitación.

Generá una propuesta sin texto superpuesto. Voy a comparar la imagen con el original antes de usarla.`,
  },
  {
    slug: 'analizar-competencia',
    type: 'prompt',
    topic: 'Estrategia',
    reel: 'R04',
    title: 'Conocé mejor a tu competencia.',
    shortTitle: 'Compará con fuentes. Encontrá oportunidades.',
    description: 'Ordená qué ofrecen otros negocios, cómo lo comunican y qué oportunidades podrías explorar con el tuyo.',
    outcome: 'Una tabla comparativa con fuentes y tres oportunidades para investigar.',
    needs: ['Tu rubro, ciudad y una descripción de tu oferta.', 'Nombres y enlaces de los negocios que querés comparar.'],
    steps: ['Completá los datos de tu negocio y los competidores en el prompt.', 'Usalo en una IA con navegación o adjuntá las fuentes que quieras analizar.', 'Abrí las fuentes y verificá los datos antes de decidir.'],
    preview: 'Compará oferta, precios publicados y comunicación. Mostrá de dónde sale cada dato.',
    checklist: ['¿Los enlaces respaldan los datos de la tabla?', '¿Los precios corresponden a la misma fecha y a ofertas comparables?', '¿Las oportunidades están separadas de los hechos comprobados?'],
    prompt: `Actuá como analista de investigación comercial. Quiero entender a mi competencia y encontrar oportunidades para mi negocio.

MI NEGOCIO
Rubro: [rubro].
Ciudad o mercado: [ubicación y alcance].
Qué vendo y a quién: [oferta y público].
Mi propuesta actual: [productos o servicios, precios que quieras comparar y canales].
Negocios para comparar: [nombres y enlaces a sus webs, catálogos o perfiles públicos].

INVESTIGACIÓN
Usá solamente información pública y comprobable. Si podés navegar, consultá las fuentes y registrá la fecha de consulta. Si no tenés navegación o no podés abrir un enlace, decímelo y pedime el contenido: no completes datos de memoria como si los hubieras verificado.

ENTREGÁ
1. Una tabla comparativa con: negocio, público al que se dirige, oferta, precios publicados y moneda cuando existan, canales de atención, mensajes principales, fuente y fecha consultada. Vinculá cada dato con su fuente y marcá “no confirmado” cuando corresponda. Diferenciá el mensaje de la empresa de una valoración tuya.
2. Una comparación con mi propuesta: qué ofrecen ellos que yo no mencioné y qué diferencias concretas aparecen. No asumas que algo no existe solo porque no lo encontraste publicado.
3. Tres oportunidades que podríamos investigar para diferenciarnos. Para cada una, indicá qué observación la originó, qué hipótesis planteás y una acción pequeña para validarla.

No inventes precios, promociones, capacidades ni resultados. No deduzcas ventas o rentabilidad a partir de seguidores o publicaciones. Si dos ofertas no son comparables por tamaño, condiciones o fecha, explicalo. Separá hechos, inferencias y datos faltantes.

Antes de empezar, preguntame por la información imprescindible que falte. Revisaremos las fuentes antes de tomar decisiones.`,
  },
  {
    slug: 'identidad-de-marca',
    type: 'prompt',
    topic: 'Branding',
    reel: 'R06',
    title: 'Una identidad para todas tus piezas.',
    shortTitle: 'Dale una base común a tu marca.',
    description: 'Empezá por las preguntas correctas y construí una referencia de colores, tipografías y criterios para tus diseños.',
    outcome: 'Una guía breve con las decisiones de marca que hayas elegido.',
    needs: ['Una descripción de tu negocio y de tus clientes.', 'Referencias que te gusten y materiales de marca que ya uses, si tenés.'],
    steps: ['Completá el contexto y pegá el prompt en tu herramienta de IA.', 'Respondé las preguntas y elegí una dirección antes de avanzar.', 'Guardá la guía final como referencia para tus próximas piezas.'],
    preview: 'Antes de diseñar, preguntame qué vendo, a quién y qué quiero transmitir.',
    checklist: ['¿La guía incluye solo decisiones que elegiste?', '¿Los colores y las tipografías funcionan en tus usos habituales?', '¿Están identificadas las revisiones pendientes del logo y las licencias?'],
    prompt: `Actuá como diseñador senior especializado en identidad de marca. Quiero desarrollar una base visual coherente para mi negocio, trabajando por etapas y con decisiones que yo pueda revisar.

CONTEXTO INICIAL
Nombre del negocio: [nombre].
Qué vendo: [productos o servicios].
A quién le vendo: [público].
Dónde uso la marca: [redes, menú, web, presupuestos, cartelería u otros].
Material existente: [adjuntá lo que tengas o indicá que empezás de cero].
Referencias y restricciones: [marcas que te gustan, colores que querés conservar, elementos que no querés usar].

CÓMO VAMOS A TRABAJAR
Primero haceme las preguntas necesarias para entender qué problema resuelvo, qué me diferencia, qué personalidad quiero transmitir y qué necesita funcionar en el día a día. Si ya te di un dato, no me lo vuelvas a pedir. No diseñes todavía.

Después avancemos por estas etapas, esperando mi elección antes de pasar a la siguiente:
1. Dirección de marca: resumí lo que entendiste y proponé dos direcciones visuales diferentes. Explicá para quién sirve cada una y qué transmite.
2. Sistema visual: para la dirección elegida, proponé una paleta con códigos HEX y roles de uso, tipografías para títulos y texto, y criterios de composición, imágenes y tono de voz. Señalá qué debemos comprobar sobre legibilidad y licencias.
3. Aplicaciones: mostrá cómo usaríamos esas reglas en dos piezas que yo necesite. Si no podés generar o mostrar diseños, describí una composición concreta sin presentarla como un archivo terminado.
4. Guía breve: reuní solamente las decisiones aprobadas, con ejemplos de uso, combinaciones recomendadas y errores a evitar. Dejá las propuestas no elegidas fuera de la guía.

Si trabajamos un logo, separá la idea conceptual de los archivos finales de producción e indicá las revisiones profesionales pendientes: originalidad, legibilidad, versiones, formatos y derechos de uso. No presentes como disponible una marca o una licencia que no hayas verificado.

No des por aprobada ninguna propuesta que yo no haya elegido. Empezá por tus preguntas.`,
  },
  {
    slug: 'analizar-ventas',
    type: 'prompt',
    topic: 'Ventas',
    reel: 'R08',
    title: 'Entendé qué te dicen tus ventas.',
    shortTitle: 'De la planilla a preguntas útiles.',
    description: 'Identificá qué productos facturan más, cuáles crecen o caen y qué conviene investigar con los datos de tu negocio.',
    outcome: 'Un análisis verificable de facturación, tendencias y oportunidades.',
    needs: ['Una copia de tu planilla de ventas sin datos personales.', 'El período que querés analizar y el significado de sus columnas.'],
    steps: ['Prepará una copia de la planilla sin nombres, teléfonos ni otros datos personales.', 'Adjuntala y completá el período y el contexto en el prompt.', 'Comprobá las cuentas y los períodos utilizados contra tu archivo.'],
    preview: 'Qué productos facturan más. Cuáles crecen o caen. Qué conviene investigar.',
    checklist: ['¿Los totales coinciden con la planilla y se contemplaron devoluciones?', '¿Los períodos comparados tienen una duración y un alcance equivalentes?', '¿La facturación está diferenciada de la ganancia y las hipótesis de los resultados?'],
    prompt: `Quiero analizar la planilla de ventas adjunta para entender mejor mi negocio. Trabajá solo con los datos del archivo y explicá cómo comprobar cada resultado.

CONTEXTO
Tipo de negocio: [rubro].
Período a analizar: [fechas].
Moneda: [moneda o monedas].
Qué representa cada fila: [venta, línea de producto, resumen diario u otro; si no lo sabés, indicá que hay que confirmarlo].
Observaciones: [promociones, cambios de precio, cierres, faltantes de stock u otros hechos conocidos; si no tenés, indicá “sin información adicional”].

ANTES DE CALCULAR
Identificá las hojas, columnas, unidades y fechas. Preguntame por los campos ambiguos que impidan interpretar los datos. Indicá qué entendés por facturación y verificá cómo están registrados descuentos, impuestos, anulaciones y devoluciones. No elimines duplicados sin explicar cómo los identificaste. No mezcles monedas sin un criterio que yo confirme.

RESPONDÉ ESTAS TRES PREGUNTAS
1. ¿Qué productos generan la mayor parte de la facturación? Mostrá importes, participación porcentual y total de referencia. Si hay cantidades, mostralas por separado. No confundas facturación con ganancia: si no hay costos, no calcules rentabilidad.
2. ¿Qué productos crecen o caen? Compará períodos equivalentes y mostrá valores absolutos y variación porcentual. Si la base es cero, explicá el caso sin calcular un porcentaje indefinido. Aclarame si un cambio de precio o un período incompleto puede afectar la lectura.
3. ¿Qué oportunidades comerciales podríamos investigar? Proponé tres hipótesis vinculadas con los datos. Para cada una, indicá qué dato la sugiere, qué información falta y cómo podríamos validarla. No afirmes causas que la planilla no permite demostrar.

PARA CADA CONCLUSIÓN
Indicá hoja, columnas, filtros, fórmula y período utilizados. Mostrá una tabla de respaldo y, si la herramienta lo permite, gráficos simples con título, ejes y unidades. Marcá faltantes e inconsistencias y explicá si cambian el resultado. No inventes datos para completar huecos.

Terminá con un resumen de hallazgos comprobados, hipótesis y preguntas pendientes. Si no podés leer el archivo o hacer los cálculos, pedime un formato que puedas procesar en vez de simular el análisis.`,
  },
];
