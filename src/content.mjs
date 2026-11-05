export const products = [
  {
    slug: 'zyro-ai', name: 'Zyro AI', sector: 'Para concesionarias',
    image: 'zyro-v2.jpg', alt: 'Ilustración de un auto plateado con detalles naranjas',
    scene: 'Sábado, nueve de la noche. «Hola, ¿sigue disponible?»',
    description: 'Es el mismo auto por el que te preguntaron toda la semana. Zyro consulta el stock, responde por WhatsApp y le pasa la conversación a tu equipo si el cliente quiere avanzar.',
    project: 'gentile-autos', projectLabel: 'Ver catálogo y gestión de stock en Gentile Autos',
  },
  {
    slug: 'cubiko-ai', name: 'Cubiko AI', sector: 'Para inmobiliarias',
    image: 'lokation-v2.jpg', alt: 'Ilustración de un edificio y una llave naranja',
    scene: 'Estás mostrando un departamento y te escriben por otro.',
    description: 'Mientras seguís con la visita, Cubiko responde la consulta con la información de la propiedad y se la pasa al vendedor que corresponde.',
    project: 'lamelas-chaumont', projectLabel: 'Ver la implementación en Lamelas & Chaumont',
  },
  {
    slug: 'toki-ai', name: 'Toki AI', sector: 'Para negocios gastronómicos',
    image: 'toki-v2.jpg', alt: 'Ilustración de una bolsa de pedidos sobre fondo naranja',
    scene: 'Tenés las manos en la plancha y entran tres pedidos juntos.',
    description: 'Toki muestra el menú y toma los pedidos por WhatsApp. A vos te llegan a un tablero donde podés ver qué falta preparar y qué ya está listo.',
  },
];

export const projects = [
  {
    slug: 'lamelas-chaumont', name: 'Lamelas & Chaumont', sector: 'Inmobiliaria · Cliente de Cubiko AI',
    label: 'Cubiko AI', logo: 'lamelas-chaumont.png',
    summary: 'Una consulta entra por WhatsApp. Sofía responde y se la pasa al vendedor que la puede tomar.',
    scene: 'Entra una consulta por un departamento. ¿Quién la toma?',
    description: 'El equipo carga las propiedades en un panel y las publica en la web. Cuando alguien consulta por WhatsApp, Sofía responde y le pasa la conversación a un vendedor. Si pasan 30 minutos y todavía nadie la tomó, se la asigna a otro.',
  },
  {
    slug: 'universidad-san-pablo-t', name: 'Universidad San Pablo T', sector: 'Universidad · Plataforma a medida',
    label: 'Plataforma a medida', logo: 'usp-t.png',
    summary: 'Desde la web, una persona puede inscribirse, pagar y quedar matriculada.',
    scene: 'De «me quiero inscribir» a «ya estoy matriculado».',
    description: 'Armamos la web pública y la plataforma donde cada persona puede crear su cuenta, inscribirse y pagar. La matriculación se hace automáticamente y el equipo de la universidad puede gestionar las inscripciones desde su panel.',
  },
  {
    slug: 'gentile-autos', name: 'Gentile Autos', sector: 'Concesionaria · Cliente de Zyro AI',
    label: 'Zyro AI', logo: 'gentile-autos.png',
    summary: 'El equipo actualiza el stock desde su panel y el comprador ve qué autos siguen disponibles en el catálogo.',
    scene: 'Se vendió un auto. Ahora hay que sacarlo del catálogo.',
    description: 'Armamos el catálogo online y el panel donde el equipo carga los vehículos y actualiza el stock. Así, cuando cambia lo que hay disponible en la concesionaria, el equipo puede actualizar lo que ve el comprador en la web.',
  },
  {
    slug: 'estudio-guzman', name: 'Estudio Guzmán Abogados Asociados', sector: 'Estudio jurídico · Sistema interno a medida',
    label: 'Sistema interno a medida', logo: 'estudio-guzman.png',
    scene: '«¿Quién lleva este expediente y qué vence esta semana?»',
    description: 'Armamos un sistema donde el equipo puede abrir un expediente y ver quién lo lleva, cuál fue la última actuación y qué tareas quedan pendientes. Cada tarea tiene responsable y vencimiento, y desde un tablero común se ve cómo está repartido el trabajo.',
  },
];

export const workshops = [
  {
    title: 'Workshop inicial', length: 'Una sesión',
    description: 'Le enseñamos a tu equipo a usar herramientas como ChatGPT o Claude con ejemplos de su propio trabajo. Se llevan prompts listos para usar y una revisión rápida de sus procesos para identificar qué tareas pueden empezar a automatizar por su cuenta.',
  },
  {
    title: 'Workshop aplicado', length: 'Dos sesiones',
    description: 'Trabajamos sobre la misma base y nos metemos más a fondo en tareas puntuales de tu empresa. Cuando el proceso lo permite, dejamos alguna herramienta configurada para que el equipo pueda usarla después del workshop.',
  },
];
