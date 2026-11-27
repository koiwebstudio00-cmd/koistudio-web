const escape = value => String(value).replace(/[&<>"']/g, char => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
})[char]);

function formatWhatsapp(digits) {
  const match = /^54(9)(\d{3})(\d{3})(\d{4})$/.exec(String(digits));
  if (!match) return '+' + digits;
  return `+54 ${match[1]} ${match[2]} ${match[3]}-${match[4]}`;
}

export function privacyPage(config) {
  const email = escape(config.email);
  const phone = escape(formatWhatsapp(config.whatsapp));
  const wa = escape('https://wa.me/' + config.whatsapp);
  const site = escape(config.url);
  return `<section class="inner-intro legal-hero"><div class="wrap">
  <p class="eyebrow">Koi Studio</p>
  <h1>Política de privacidad</h1>
  <p>Cómo tratamos los datos personales en este sitio, en las consultas que nos llegan y en la administración de nuestros propios anuncios y contenido.</p>
  <p class="legal-updated">Última actualización: 27 de noviembre de 2026.</p>
</div></section>
<section class="section light legal-body"><article class="wrap legal">
  <section>
    <h2>Quién es el responsable</h2>
    <p>Koi Studio es un estudio de software y automatización con inteligencia artificial, con sede en San Miguel de Tucumán, provincia de Tucumán, Argentina. Koi Studio es el responsable del tratamiento de los datos personales que se describen en esta política.</p>
    <p>Sitio: <a href="${site}">${site}</a>. Para consultas sobre tus datos, escribinos a <a href="mailto:${email}">${email}</a>.</p>
  </section>
  <section>
    <h2>A qué se aplica esta política</h2>
    <p>Esta política cubre:</p>
    <ul>
      <li>el sitio web de Koi Studio;</li>
      <li>las consultas que recibimos por WhatsApp, por correo o desde el sitio y los anuncios, incluidos los datos de contacto y los mensajes;</li>
      <li>la aplicación interna Koi Ads Bot, que usamos solo para administrar la cuenta publicitaria de Koi Studio y el contenido de nuestra Página de Facebook y de nuestra cuenta de Instagram, mediante la Meta Marketing API y la Graph API.</li>
    </ul>
    <p>Koi Ads Bot no se ofrece al público y no se usa para ingresar a cuentas de terceros. Cuando prestamos un software a un cliente, los datos de los clientes de ese negocio se tratan para prestar ese servicio y según lo acordado con él.</p>
  </section>
  <section>
    <h2>Qué datos recopilamos</h2>
    <p>Según cómo te comuniques con nosotros, podemos tratar:</p>
    <ul>
      <li>nombre;</li>
      <li>teléfono;</li>
      <li>mensajes de WhatsApp y el contenido de esas conversaciones;</li>
      <li>correo electrónico, si nos lo compartís;</li>
      <li>información sobre tu negocio que nos cuentes en la conversación, por ejemplo el rubro, la consulta o lo que necesitás.</li>
    </ul>
    <p>Esos datos suelen llegarnos cuando escribís por WhatsApp a partir de un anuncio o del sitio, o cuando nos contactás por otro medio publicado en el sitio.</p>
    <h2>Datos de las plataformas de Meta</h2>
    <p>A través de Koi Ads Bot, y únicamente sobre las cuentas de Koi Studio, podemos acceder a:</p>
    <ul>
      <li>datos de rendimiento de nuestros propios anuncios, como campañas y métricas de la cuenta publicitaria;</li>
      <li>contenido de nuestra Página de Facebook y de nuestra cuenta de Instagram al que llegamos por la API de Meta.</li>
    </ul>
    <p>Usamos esa información para administrar nuestra publicidad y nuestro contenido. No la vendemos ni la usamos para armar perfiles de personas ajenas a esa gestión.</p>
    <h2>Analítica del sitio y cookies</h2>
    <p>En el dominio público del sitio (koistudio.com.ar y www.koistudio.com.ar) cargamos Microsoft Clarity para entender cómo se usa el sitio, mediante mapas de calor y grabaciones de sesión. Clarity puede procesar interacciones de uso, datos técnicos del dispositivo y cookies. Esa herramienta no se carga en entornos locales ni en vistas previas.</p>
    <p>En el código de este sitio no hay otra herramienta de analítica ni un píxel publicitario. Podés limitar o bloquear las cookies desde tu navegador. La <a href="https://privacy.microsoft.com/es-es/privacystatement">declaración de privacidad de Microsoft</a> explica cómo Clarity trata esos datos.</p>
  </section>
  <section>
    <h2>Para qué usamos los datos</h2>
    <ul>
      <li>responder consultas;</li>
      <li>hacer el seguimiento comercial de esas consultas;</li>
      <li>prestar los servicios que nos pedís;</li>
      <li>administrar nuestros propios anuncios y el contenido de nuestras cuentas de Facebook e Instagram;</li>
      <li>mejorar el sitio a partir de la analítica descrita arriba;</li>
      <li>cumplir obligaciones legales.</li>
    </ul>
  </section>
  <section>
    <h2>Base legal</h2>
    <p>El tratamiento se rige por la Ley 25.326 de Protección de Datos Personales, su Decreto reglamentario 1558/2001 y las normas complementarias de la Agencia de Acceso a la Información Pública.</p>
    <p>Según el caso, la base es tu consentimiento, cuando nos escribís o nos compartís datos; la relación contractual o los pasos previos a un contrato, cuando la consulta es para evaluar o prestar un servicio; o el interés legítimo de Koi Studio en administrar su propia publicidad y su contenido y en mejorar el sitio, sin que ese interés prevalezca sobre tus derechos.</p>
  </section>
  <section>
    <h2>Con quién compartimos los datos</h2>
    <p>No vendemos, alquilamos ni comercializamos datos personales.</p>
    <p>Podemos compartirlos con proveedores que nos ayudan a operar el sitio, la comunicación y los servicios, y solo en la medida necesaria para eso:</p>
    <ul>
      <li>Meta, WhatsApp, Facebook e Instagram, para recibir y responder mensajes y para administrar nuestros anuncios y contenido;</li>
      <li>el proveedor de alojamiento del sitio (en la configuración actual, Vercel);</li>
      <li>Microsoft, por el uso de Clarity en el sitio público;</li>
      <li>herramientas de gestión comercial o bases de datos, cuando las usamos para ordenar consultas y prestar el servicio.</li>
    </ul>
    <p>Algunos de esos proveedores pueden tratar datos fuera de Argentina. Cuando eso ocurre, la transferencia se hace de conformidad con la Ley 25.326.</p>
  </section>
  <section>
    <h2>Conservación</h2>
    <p>Conservamos los datos el tiempo necesario para la finalidad por la que los recibimos: responder, hacer seguimiento, prestar el servicio y, cuando corresponde, cumplir plazos legales o contables. Después los eliminamos o los anonimizamos.</p>
    <p>Los datos de anuncios y de contenido obtenidos con Koi Ads Bot se conservan mientras administramos esas cuentas y durante el plazo que haga falta para nuestros propios reportes. Los datos de Clarity se conservan según los plazos de esa herramienta.</p>
    <p>Si pedís la eliminación, borramos o anonimizamos lo que tengamos, salvo aquello que debamos guardar por una obligación legal.</p>
  </section>
  <section>
    <h2>Seguridad</h2>
    <p>Aplicamos medidas de seguridad razonables, técnicas y organizativas: el acceso a los datos queda limitado a quien los necesita para su tarea, y el sitio se sirve por una conexión cifrada. Koi Ads Bot se usa de forma interna. Ninguna medida es infalible. Si ocurre un incidente que te afecte y la ley nos obliga a informarlo, te vamos a avisar.</p>
  </section>
  <section>
    <h2>Tus derechos</h2>
    <p>De acuerdo con la Ley 25.326, podés solicitar el acceso, la rectificación, la actualización y la supresión de tus datos personales, y retirar el consentimiento cuando el tratamiento se base en él.</p>
    <p>Para ejercerlos, escribinos a <a href="mailto:${email}">${email}</a>. Indicá tu nombre, un teléfono o correo que hayamos usado para identificarte y qué estás pidiendo. También podés escribirnos por WhatsApp al <a href="${wa}">${phone}</a>.</p>
    <p>La reglamentación de la Ley 25.326 prevé que el acceso se responda dentro de los diez días corridos, y que la rectificación, la actualización o la supresión se resuelva dentro de los cinco días hábiles, contados desde que el pedido nos permite identificarte. El ejercicio de estos derechos es gratuito.</p>
  </section>
  <section id="eliminacion-de-datos">
    <h2>Solicitud de eliminación de datos</h2>
    <p>Si querés que eliminemos datos personales tuyos —incluidos los que nos enviaste por WhatsApp, por correo o desde el sitio, o los asociados a una interacción con nuestras páginas—, envianos un correo a <a href="mailto:${email}?subject=Eliminaci%C3%B3n%20de%20datos">${email}</a> con el asunto «Eliminación de datos».</p>
    <p>En el mensaje incluí:</p>
    <ul>
      <li>tu nombre;</li>
      <li>el teléfono, el correo o, si corresponde, la cuenta con la que te comunicaste;</li>
      <li>qué datos querés que eliminemos.</li>
    </ul>
    <p>Vamos a eliminar o anonimizar los datos que estén en nuestro poder, salvo los que debamos conservar por una obligación legal, y te vamos a confirmar la gestión por el mismo medio.</p>
    <p>Si el pedido se refiere a datos que Meta, WhatsApp, Facebook o Instagram conservan como plataforma —tu cuenta o tu actividad en sus servicios—, también tenés que usar las herramientas de esas empresas. Nosotros no podemos borrar lo que queda únicamente en sus sistemas.</p>
    <p>Koi Ads Bot administra las cuentas propias de Koi Studio. Si creés que un dato tuyo fue tratado por esa aplicación, usá el mismo correo y el mismo asunto. No usamos Koi Ads Bot para recolectar datos de personas ajenas a la administración de nuestras cuentas y de nuestro contenido.</p>
  </section>
  <section>
    <h2>Autoridad de control</h2>
    <p>La Agencia de Acceso a la Información Pública (AAIP) es la autoridad de control de la Ley 25.326 de Protección de Datos Personales. Podés consultarla en <a href="https://www.argentina.gob.ar/aaip">argentina.gob.ar/aaip</a> y, si corresponde, presentar un reclamo.</p>
  </section>
  <section>
    <h2>Cambios de esta política</h2>
    <p>Podemos actualizar esta política. La versión vigente se publica en esta página y la fecha de última actualización cambia con ella. La fecha vigente es el 27 de noviembre de 2026.</p>
  </section>
  <section>
    <h2>Contacto</h2>
    <p>Koi Studio<br>San Miguel de Tucumán, Tucumán, Argentina<br><a href="mailto:${email}">${email}</a><br>WhatsApp <a href="${wa}">${phone}</a></p>
    <p class="legal-note">Última actualización: 27 de noviembre de 2026.</p>
  </section>
</article></section>`;
}
