// Diccionario de textos de INTERFAZ (menús, botones, encabezados, formularios).
// El contenido que viene de la base de datos (nombre/descripción de productos
// y categorías) NO se traduce acá — se queda en español, tal como está en la
// base de datos. Traducir eso requeriría campos bilingües en el esquema de
// Prisma y en el panel de Admin, que es un proyecto aparte.
//
// `en` está tipado como `typeof es`, así que si a `en` le falta una clave (o
// le sobra), TypeScript lo marca como error — los dos idiomas quedan
// sincronizados en la estructura por construcción.

const es = {
  nav: {
    promo: "🚚 Domicilios gratis en la sabana occidente por compras desde $50.000 🚚",
    inicio: "Emma inicio",
    conocenos: "Conócenos",
    productos: "Productos",
    sostenibilidad: "Sostenibilidad",
    trabajaConNosotros: "Trabaja con Nosotros",
    contacto: "Contacto",
    buscarPlaceholder: "Buscar productos...",
    buscarAria: "Buscar",
    limpiarBusquedaAria: "Limpiar búsqueda",
    cerrarBusquedaAria: "Cerrar búsqueda",
    carritoAria: "Carrito",
    menuAria: "Menú",
    cambiarIdiomaAria: "Switch to English",
    idiomaBoton: "EN",
  },
  footer: {
    descripcion:
      "Del campo a tu casa. Granos y legumbres colombianas seleccionadas con amor y de la más alta calidad.",
    columnas: {
      atencion: {
        titulo: "Atención al cliente",
        horarios: "Horarios de despacho",
        telefonica: "Atención telefónica",
        pqrs: "Escríbenos (PQRS)",
        lineaCorporativa: "Línea corporativa",
      },
      empresa: {
        titulo: "Emma Colombia",
        quienesSomos: "Quiénes somos",
        trabajaConNosotros: "Trabaja con nosotros",
        clientesInstitucionales: "Clientes institucionales",
        preguntasFrecuentes: "Preguntas frecuentes",
      },
      legal: {
        titulo: "Información legal",
        terminos: "Términos y condiciones",
        datos: "Tratamiento de datos",
        privacidad: "Políticas de privacidad",
        etica: "Transparencia y ética profesional",
      },
    },
    copyright: "Emma Colombia S.A.S  |  NIT  |  Todos los derechos reservados",
  },
  home: {
    heroBadge: "Del campo a tu casa",
    heroPrevAria: "Anterior",
    heroNextAria: "Siguiente",
    heroVerAria: (titulo: string) => `Ver ${titulo}`,
    heroSlides: [
      { id: 1, titulo: "Arroz" },
      { id: 2, titulo: "Lenteja" },
      { id: 3, titulo: "Frijol Radical" },
      { id: 4, titulo: "Garbanzos" },
      { id: 5, titulo: "Maíz Pira" },
    ],
    trust: [
      "Del campo directo",
      "Seleccionado con amor",
      "Frescura garantizada",
      "Industria colombiana",
    ],
    destacados: {
      eyebrow: "Nuestra despensa",
      titulo: "Lo más vendido",
      descripcion:
        "Nuestros productos más pedidos, seleccionados con amor y de la más alta calidad.",
      verTodos: "Conoce todos los productos →",
    },
    nosotros: {
      eyebrow: "Quiénes somos",
      tituloPre: "Llevamos el campo",
      tituloEm: "a tu casa",
      parrafo1:
        "Emma es una compañía colombiana de alimentos con sede en Mosquera, Cundinamarca. Trabajamos de la mano de familias campesinas para llevar granos y legumbres de la más alta calidad, desde la tierra que los produce hasta la mesa de tu familia.",
      parrafo2:
        "Cada grano de Emma es cultivado con tradición y el esfuerzo de miles de familias campesinas cundinamarquesas que ponen el corazón en cada cosecha.",
      miniFeatures: [
        { titulo: "Origen local", texto: "Cundinamarca, Colombia" },
        { titulo: "Calidad seleccionada", texto: "Escogido lote a lote" },
        { titulo: "100% natural", texto: "Sin conservantes" },
        { titulo: "Sostenible", texto: "Reparto eléctrico" },
      ],
    },
    proceso: {
      eyebrow: "Nuestro proceso",
      titulo: "De la semilla a tu mesa",
      descripcion: "Un camino corto y cuidado que garantiza sabor, frescura y nutrición en cada grano.",
      pasos: [
        { titulo: "Cultivo", texto: "Familias campesinas siembran con prácticas responsables." },
        { titulo: "Selección", texto: "Cada lote se escoge a mano, garantizando alta calidad." },
        { titulo: "Empaque", texto: "Empacado con cuidado para conservar su frescura." },
        { titulo: "A tu casa", texto: "Entrega en flota eléctrica, del campo a tu mesa." },
      ],
    },
    calidad: {
      titulo: "Calidad que se siente",
      subtitulo: "Seleccionamos lo mejor de nuestra tierra",
      parrafo:
        "Granos frescos, nutritivos y llenos de sabor, con procesos que garantizan pureza y conservación natural, siempre pensando en tu bienestar.",
      link: "Conoce todos nuestros productos →",
    },
    sostenibilidad: {
      eyebrow: "#SOStenibilidad",
      tituloPre: "Calidad que alimenta,",
      tituloEm: "sostenibilidad",
      tituloPost: "que inspira",
      parrafo:
        "Creemos que cuidar el planeta es tan importante como cuidar lo que comes. Por eso transformamos la energía del sol en el motor de nuestro trabajo.",
      puntos: [
        "Flota de reparto 100% eléctrica",
        "Planta productiva con paneles solares",
        "Menor huella de carbono en cada entrega",
      ],
      cifras: [
        { valor: "100%", texto: "Energía solar en planta" },
        { valor: "0", texto: "Emisiones en reparto eléctrico" },
      ],
      link: "Conoce más sobre sostenibilidad",
    },
    faq: {
      eyebrow: "Preguntas frecuentes",
      titulo: "Todo lo que quieres saber",
      preguntas: [
        {
          pregunta: "¿Dónde puedo comprar los productos Emma?",
          respuesta:
            "Puedes hacer tu pedido directamente por WhatsApp al (+57) 317 809 9577 o escribiéndonos a miguel@emmacolombia.com. Estamos ubicados en Mosquera, Cundinamarca, y realizamos entregas del campo a tu casa.",
        },
        {
          pregunta: "¿Los granos y legumbres Emma son 100% naturales?",
          respuesta:
            "Sí. Todos nuestros productos son granos y legumbres naturales, sin conservantes, seleccionados con amor y de la más alta calidad directamente del campo colombiano.",
        },
        {
          pregunta: "¿Qué productos ofrece Emma?",
          respuesta:
            "Ofrecemos lenteja, fríjol radical, fríjol cargamanto, fríjol bola roja, garbanzo, arveja verde, maíz pira y arroz, todos en presentación de 500g.",
        },
        {
          pregunta: "¿Cómo preparo la lenteja o el fríjol Emma?",
          respuesta:
            "Deja el grano en remojo, cocínalo en olla a presión con una cucharadita de sal y hogao durante unos 20–30 minutos y sirve con arroz. En cada empaque encontrarás la sugerencia de preparación.",
        },
        {
          pregunta: "¿Hacen entregas a domicilio?",
          respuesta:
            "Sí, contamos con flota de reparto 100% eléctrica para llevar tus productos frescos, con menor huella de carbono, del campo a tu casa.",
        },
      ],
    },
  },
  productos: {
    eyebrow: "Directo del campo a tu mesa",
    titulo: "Nuestros productos",
    descripcion: "Elige, agrega al carrito y recíbelo del campo a tu casa.",
    buscarPlaceholder: "Buscar por nombre...",
    limpiarBusquedaAria: "Limpiar búsqueda",
    todos: "Todos",
    sinResultadosBusqueda: (termino: string) => `No encontramos productos que coincidan con "${termino}".`,
    sinProductos: "Aún no hay productos disponibles.",
    verYPedir: "Ver y pedir",
    desde: "Desde",
    consultarPrecio: "Consultar precio",
  },
  detalleProducto: {
    sinPresentaciones: "Este producto no tiene presentaciones disponibles en este momento.",
    presentacion: "Presentación",
    agregado: "Agregado ✓",
    agregarAlCarrito: "Agregar al carrito",
    agotado: "(agotado)",
  },
  carrito: {
    titulo: "Tu Carrito",
    vacio: "Todavía no agregaste ningún producto.",
    verProductos: "Ver productos",
    articulos: "artículo(s)",
    total: "Total:",
    continuar: "Continuar",
    quitar: "Quitar",
  },
  checkout: {
    carritoVacioTitulo: "Tu carrito está vacío",
    carritoVacioTexto: "Agrega productos antes de continuar con el pago.",
    verProductos: "Ver productos",
    titulo: "Finalizar pedido",
    nombreCompleto: "Nombre completo",
    nombrePlaceholder: "Nombre y apellido",
    correo: "Correo",
    correoPlaceholder: "correo@ejemplo.com",
    telefono: "Teléfono",
    telefonoPlaceholder: "3xxxxxxxxx",
    direccion: "Dirección",
    direccionPlaceholder: "Calle, número, barrio",
    ciudad: "Ciudad",
    ciudadPlaceholder: "Ciudad",
    ciudadElige: "Elige tu ciudad",
    ciudadNoAparece: "¿Tu ciudad no está? Escríbenos y coordinamos el envío",
    procesando: "Procesando...",
    confirmarPedido: "Confirmar pedido",
    resumenPedido: "Resumen del pedido",
    articulos: "artículo(s)",
    subtotal: "Subtotal",
    envio: "Envío",
    envioGratis: "Gratis",
    envioPendiente: "Elige tu ciudad",
    faltaParaEnvioGratis: (falta: string) =>
      `Te faltan ${falta} para el envío gratis`,
    total: "Total:",
    completaCampos: "Por favor completa todos los campos.",
    eligeCiudad: "Elige tu ciudad para calcular el envío.",
    autorizoInicio: "Autorizo el ",
    autorizoTratamiento: "tratamiento de mis datos personales",
    autorizoMedio: " y acepto los ",
    autorizoTerminos: "términos y condiciones",
    debesAutorizar:
      "Debes autorizar el tratamiento de datos para continuar.",
    errorGenerico: "No se pudo procesar el pedido, intenta de nuevo.",
  },
  pedidoRecibido: {
    gracias: (nombre: string) => `¡Gracias, ${nombre}!`,
    tituloPagado: "¡Pago confirmado!",
    // Antes estos dos textos prometían un correo con los siguientes pasos y
    // con el link de pago. Como el envío automático de correos no está
    // funcionando, era una promesa que el sitio no cumplía: el cliente se
    // quedaba esperando algo que nunca llegaba. Ahora el canal que se ofrece
    // es WhatsApp, que sí funciona.
    explicacionPagado:
      "ya está pagado. Escríbenos por WhatsApp y coordinamos la entrega.",
    tituloPendiente: "Tu pedido quedó registrado",
    explicacionPendiente:
      "quedó registrado. Si tuviste algún problema con el pago, escríbenos por WhatsApp y lo resolvemos.",
    pedidoLabel: "Pedido",
    seguirViendoProductos: "Seguir viendo productos",
    escribirPorPedido: "Escribir por WhatsApp",
    // El número de pedido va dentro del mensaje para que quien atiende pueda
    // buscarlo en el panel sin tener que pedírselo al cliente.
    mensajePagado: (numero: string) =>
      `Hola, acabo de pagar el pedido #${numero}. Quiero coordinar la entrega.`,
    mensajePendiente: (numero: string) =>
      `Hola, tengo el pedido #${numero} y necesito ayuda para completar el pago.`,
  },
  contacto: {
    eyebrow: "Hablemos",
    titulo: "Contáctanos",
    descripcion:
      "Escríbenos por WhatsApp o por correo, sea para una consulta, para postularte a una vacante o para ofrecernos tus productos.",
    direccion: "Dirección",
    telefono: "Teléfono",
    correo: "Correo",
    horario: "Horario de atención",
    horarioValor: "Lunes a viernes, 8:00 a.m. – 5:00 p.m.",
    porDefinir: "Por definir",
    escribirWhatsApp: "Escribir por WhatsApp",
    escribirCorreo: "Escribir por correo",
    irConsultas: "Consultas y pedidos",
    irTrabaja: "Trabaja con nosotros",
    irProveedores: "Proveedores",
    consultas: {
      eyebrow: "Consultas y pedidos",
      titulo: "¿Tienes una pregunta?",
      descripcion:
        "Dudas sobre un producto, el estado de un pedido o cualquier cosa que necesites. Te respondemos por el canal que prefieras.",
      mensaje: "Hola, tengo una consulta sobre los productos de Emma.",
      asunto: "Consulta desde la página web",
    },
  },
  sostenibilidadPage: {
    eyebrow: "#Sostenibilidad",
    tituloPre: "En Emma,",
    tituloPost: "el futuro es sostenible",
    parrafo:
      "Con nuestra flota eléctrica y planta con energía solar, trabajamos por un futuro más limpio y responsable con el planeta.",
    hitosEyebrow: "Nuestros hitos",
    hitosTitulo: "Comprometidos con el planeta",
    hitos: [
      {
        titulo: "Infraestructura Limpia",
        descripcion:
          "Nuestra planta funciona con energía solar y contamos con una flota de vehículos eléctricos para la distribución.",
      },
      {
        titulo: "Economía Circular",
        descripcion:
          "Optimizamos el uso de nuestros residuos a través de la Logística Inversa, reduciendo el impacto de cada entrega.",
      },
      {
        titulo: "Cero Papel",
        descripcion:
          'Con nuestra política "No Papper", usamos herramientas tecnológicas para eliminar el consumo de papel en nuestros procesos.',
      },
    ],
  },
  conocenos: {
    hero: {
      eyebrow: "Quiénes somos",
      titulo: "Emma: Del campo a tu casa",
      parrafo:
        "Transformamos talento y tradición en nutrición de alta calidad para las familias colombianas.",
    },
    cadena: {
      eyebrow: "Cómo trabajamos",
      titulo: "Nuestra Cadena de Valor",
      descripcion: "Del campo a tu casa, garantizando calidad e inocuidad en cada etapa.",
      pasos: ["COMPRAR", "PRODUCIR", "DISTRIBUIR", "VENDER"],
    },
    esencia: {
      eyebrow: "Nuestra historia",
      titulo: "Un legado de unión y talento",
      parrafo1:
        "Emma nace de la visión de Salomón Rodriguez y Miguel Rodriguez, quienes unieron su pasión y experiencia para transformar la industria alimentaria. Nuestro crecimiento no es casualidad: es el resultado de potenciar el talento humano.",
      parrafo2:
        "Actualmente, el 90% de nuestro equipo se encuentra en formación constante, garantizando que cada proceso, desde el origen en el campo hasta tu hogar, sea ejecutado con la excelencia que caracteriza a nuestra compañía.",
      imagenPlaceholder: "[Imagen: Equipo de trabajo o fotografía de fundadores]",
    },
    liderazgo: {
      eyebrow: "Dirección",
      titulo: "Dirección Estratégica",
      descripcion:
        "Un equipo plural y diverso que vive la adaptabilidad y la visión sostenible, guiando el futuro de Emma.",
      presidente: "Presidente Grupo Inlotrans",
      ceo: "CEO",
      cita: "En EMMA nos levantamos cada día para construir un mundo mejor donde el desarrollo sea para todos.",
    },
    estrategia: {
      eyebrow: "Rumbo claro",
      titulo: "Nuestra estrategia",
      mision: {
        titulo: "Nuestra Misión",
        parrafo:
          "Proporcionar bienestar a través de una amplia variedad de productos alimenticios con altos estándares de calidad e inocuidad. Nos dedicamos a fomentar un estilo de vida sostenible, llevando el campo directamente a la casa de nuestros consumidores.",
      },
      vision: {
        titulo: "Nuestra Visión",
        parrafo:
          "Ser líderes en el mercado de alimentos en Colombia y el mundo, ofreciendo soluciones innovadoras, saludables y sostenibles que inspiren a las personas a adoptar un estilo de vida consciente, contribuyendo a la salud de las generaciones futuras.",
      },
    },
    pilares: {
      eyebrow: "Nuestra esencia",
      titulo: "Nuestra ADN: Valores con Propósito",
      descripcion: "La brújula que guía cada producto que llega a tu mesa.",
      valores: [
        { titulo: "Intrépido", descripcion: "Persistimos hasta alcanzar metas imposibles." },
        { titulo: "Emprendedor", descripcion: "Unimos talentos para identificar y resolver tus necesidades." },
        { titulo: "Solidario", descripcion: "Trabajamos unidos con el objetivo de llevar bienestar al hogar." },
        { titulo: "Entusiasta", descripcion: "Resiliencia y actitud positiva ante cada desafío diario." },
        { titulo: "Visionario", descripcion: "Acción e innovación constante para el futuro de tu salud." },
      ],
    },
    cta: {
      titulo: "¿Listo para probar la diferencia Emma?",
      parrafo: "Somos más que alimentos; somos una compañía comprometida con la calidad colombiana.",
      boton: "Explora nuestro portafolio",
    },
  },
  trabajaConNosotros: {
    vacantes: {
      eyebrow: "Únete al equipo",
      titulo: "Vacantes de empleo",
      descripcion:
        "Buscamos personas intrépidas, emprendedoras y solidarias que quieran construir con nosotros el futuro de la alimentación colombiana.",
      sinVacantesTitulo: "En este momento no tenemos vacantes abiertas.",
      sinVacantesTexto:
        "Aun así, escríbenos y déjanos tu hoja de vida: te tendremos en cuenta para futuras oportunidades.",
      postularme: "Postularme",
      // Ni WhatsApp ni mailto permiten adjuntar archivos desde un enlace, así
      // que hay que pedirle explícitamente a la persona que adjunte su hoja
      // de vida. Sin este aviso, la mayoría escribe sin adjuntar nada.
      notaHojaDeVida:
        "Adjunta tu hoja de vida en el chat o en el correo para que podamos revisar tu perfil.",
      mensajeVacante: (titulo: string) =>
        `Hola, me interesa la vacante de ${titulo}. Adjunto mi hoja de vida.`,
      asuntoVacante: (titulo: string) => `Postulación: ${titulo}`,
      mensajeGeneral:
        "Hola, quiero dejar mi hoja de vida para futuras oportunidades en Emma. La adjunto acá.",
      asuntoGeneral: "Hoja de vida para futuras oportunidades",
      beneficios: [
        { titulo: "Crecimiento real", texto: "El 90% de nuestro equipo está en formación constante." },
        { titulo: "Ambiente familiar", texto: "Un equipo plural que trabaja unido por un mismo propósito." },
        { titulo: "Aprende del campo", texto: "Desde el origen en la tierra hasta la mesa de tu familia." },
      ],
      tipoContrato: {
        TIEMPO_COMPLETO: "Tiempo completo",
        MEDIO_TIEMPO: "Medio tiempo",
        TEMPORAL: "Temporal",
        PRACTICA: "Práctica",
      },
    },
    proveedores: {
      eyebrow: "Alianzas",
      titulo: "Registro de proveedores",
      descripcion:
        "¿Produces o distribuyes granos, legumbres u otros insumos? Cuéntanos y evaluemos cómo trabajar juntos.",
      beneficios: [
        { titulo: "Alianzas de largo plazo", texto: "Trabajamos de la mano con familias campesinas y empresas aliadas." },
        { titulo: "Pago justo y puntual", texto: "Relaciones comerciales claras, transparentes y responsables." },
        { titulo: "Impacto en el campo", texto: "Tu producto llega del campo a la casa de miles de familias." },
      ],
      mensaje:
        "Hola, quiero registrarme como proveedor de Emma. El producto o servicio que ofrezco es: ",
      asunto: "Registro de proveedor",
    },
  },
};

const en: typeof es = {
  nav: {
    promo: "🚚 Free delivery in the western savannah on orders over $50,000 🚚",
    inicio: "Emma home",
    conocenos: "About Us",
    productos: "Products",
    sostenibilidad: "Sustainability",
    trabajaConNosotros: "Work With Us",
    contacto: "Contact",
    buscarPlaceholder: "Search products...",
    buscarAria: "Search",
    limpiarBusquedaAria: "Clear search",
    cerrarBusquedaAria: "Close search",
    carritoAria: "Cart",
    menuAria: "Menu",
    cambiarIdiomaAria: "Cambiar a Español",
    idiomaBoton: "ES",
  },
  footer: {
    descripcion:
      "From the field to your home. Colombian grains and legumes selected with love and the highest quality.",
    columnas: {
      atencion: {
        titulo: "Customer Service",
        horarios: "Delivery hours",
        telefonica: "Phone support",
        pqrs: "Write to us",
        lineaCorporativa: "Corporate line",
      },
      empresa: {
        titulo: "Emma Colombia",
        quienesSomos: "About us",
        trabajaConNosotros: "Work with us",
        clientesInstitucionales: "Institutional clients",
        preguntasFrecuentes: "FAQ",
      },
      legal: {
        titulo: "Legal information",
        terminos: "Terms and conditions",
        datos: "Data handling",
        privacidad: "Privacy policy",
        etica: "Transparency and professional ethics",
      },
    },
    copyright: "Emma Colombia S.A.S  |  Tax ID  |  All rights reserved",
  },
  home: {
    heroBadge: "From the field to your home",
    heroPrevAria: "Previous",
    heroNextAria: "Next",
    heroVerAria: (titulo: string) => `View ${titulo}`,
    heroSlides: [
      { id: 1, titulo: "Rice" },
      { id: 2, titulo: "Lentils" },
      { id: 3, titulo: "Radical Beans" },
      { id: 4, titulo: "Chickpeas" },
      { id: 5, titulo: "Popping Corn" },
    ],
    trust: [
      "Straight from the field",
      "Selected with love",
      "Guaranteed freshness",
      "Colombian industry",
    ],
    destacados: {
      eyebrow: "Our pantry",
      titulo: "Best sellers",
      descripcion:
        "Our most requested products, selected with love and the highest quality.",
      verTodos: "See all products →",
    },
    nosotros: {
      eyebrow: "About us",
      tituloPre: "We bring the field",
      tituloEm: "to your home",
      parrafo1:
        "Emma is a Colombian food company based in Mosquera, Cundinamarca. We work hand in hand with farming families to bring the highest quality grains and legumes from the land that produces them to your family's table.",
      parrafo2:
        "Every Emma grain is grown with tradition and the effort of thousands of farming families from Cundinamarca who put their heart into every harvest.",
      miniFeatures: [
        { titulo: "Local origin", texto: "Cundinamarca, Colombia" },
        { titulo: "Selected quality", texto: "Chosen batch by batch" },
        { titulo: "100% natural", texto: "No preservatives" },
        { titulo: "Sustainable", texto: "Electric delivery" },
      ],
    },
    proceso: {
      eyebrow: "Our process",
      titulo: "From seed to table",
      descripcion: "A short, careful path that guarantees flavor, freshness and nutrition in every grain.",
      pasos: [
        { titulo: "Growing", texto: "Farming families plant with responsible practices." },
        { titulo: "Selection", texto: "Every batch is hand-picked to guarantee high quality." },
        { titulo: "Packaging", texto: "Carefully packed to preserve freshness." },
        { titulo: "To your home", texto: "Delivered by our electric fleet, from the field to your table." },
      ],
    },
    calidad: {
      titulo: "Quality you can feel",
      subtitulo: "We select the best of our land",
      parrafo:
        "Fresh, nutritious, flavorful grains, with processes that guarantee purity and natural preservation, always thinking of your wellbeing.",
      link: "See all our products →",
    },
    sostenibilidad: {
      eyebrow: "#SOStainability",
      tituloPre: "Quality that nourishes,",
      tituloEm: "sustainability",
      tituloPost: "that inspires",
      parrafo:
        "We believe caring for the planet is just as important as caring for what you eat. That's why we turn the sun's energy into the engine of our work.",
      puntos: [
        "100% electric delivery fleet",
        "Production plant with solar panels",
        "Lower carbon footprint on every delivery",
      ],
      cifras: [
        { valor: "100%", texto: "Solar energy at the plant" },
        { valor: "0", texto: "Emissions on electric delivery" },
      ],
      link: "Learn more about sustainability",
    },
    faq: {
      eyebrow: "Frequently asked questions",
      titulo: "Everything you want to know",
      preguntas: [
        {
          pregunta: "Where can I buy Emma products?",
          respuesta:
            "You can order directly via WhatsApp at (+57) 317 809 9577 or write to us at miguel@emmacolombia.com. We're based in Mosquera, Cundinamarca, and deliver from the field to your home.",
        },
        {
          pregunta: "Are Emma grains and legumes 100% natural?",
          respuesta:
            "Yes. All our products are natural grains and legumes, free of preservatives, selected with love and the highest quality straight from the Colombian countryside.",
        },
        {
          pregunta: "What products does Emma offer?",
          respuesta:
            "We offer lentils, radical beans, cargamanto beans, red kidney beans, chickpeas, green peas, popping corn and rice, all in 500g packages.",
        },
        {
          pregunta: "How do I cook Emma lentils or beans?",
          respuesta:
            "Soak the grain, cook it in a pressure cooker with a teaspoon of salt and sofrito for about 20–30 minutes and serve with rice. Each package includes a preparation suggestion.",
        },
        {
          pregunta: "Do you deliver to homes?",
          respuesta:
            "Yes, we have a 100% electric delivery fleet to bring you fresh products, with a lower carbon footprint, from the field to your home.",
        },
      ],
    },
  },
  productos: {
    eyebrow: "Straight from the field to your table",
    titulo: "Our products",
    descripcion: "Choose, add to cart, and receive it from the field to your home.",
    buscarPlaceholder: "Search by name...",
    limpiarBusquedaAria: "Clear search",
    todos: "All",
    sinResultadosBusqueda: (termino: string) => `We couldn't find products matching "${termino}".`,
    sinProductos: "There are no products available yet.",
    verYPedir: "View and order",
    desde: "From",
    consultarPrecio: "Ask for price",
  },
  detalleProducto: {
    sinPresentaciones: "This product has no packages available right now.",
    presentacion: "Package",
    agregado: "Added ✓",
    agregarAlCarrito: "Add to cart",
    agotado: "(sold out)",
  },
  carrito: {
    titulo: "Your Cart",
    vacio: "You haven't added any products yet.",
    verProductos: "View products",
    articulos: "item(s)",
    total: "Total:",
    continuar: "Continue",
    quitar: "Remove",
  },
  checkout: {
    carritoVacioTitulo: "Your cart is empty",
    carritoVacioTexto: "Add products before continuing to checkout.",
    verProductos: "View products",
    titulo: "Complete your order",
    nombreCompleto: "Full name",
    nombrePlaceholder: "First and last name",
    correo: "Email",
    correoPlaceholder: "email@example.com",
    telefono: "Phone",
    telefonoPlaceholder: "3xxxxxxxxx",
    direccion: "Address",
    direccionPlaceholder: "Street, number, neighborhood",
    ciudad: "City",
    ciudadPlaceholder: "City",
    ciudadElige: "Choose your city",
    ciudadNoAparece: "City not listed? Message us and we'll arrange delivery",
    procesando: "Processing...",
    confirmarPedido: "Confirm order",
    resumenPedido: "Order summary",
    articulos: "item(s)",
    subtotal: "Subtotal",
    envio: "Shipping",
    envioGratis: "Free",
    envioPendiente: "Choose your city",
    faltaParaEnvioGratis: (falta: string) =>
      `Add ${falta} more for free shipping`,
    total: "Total:",
    completaCampos: "Please fill in all the fields.",
    eligeCiudad: "Choose your city to calculate shipping.",
    autorizoInicio: "I authorize the ",
    autorizoTratamiento: "processing of my personal data",
    autorizoMedio: " and accept the ",
    autorizoTerminos: "terms and conditions",
    debesAutorizar: "You must authorize data processing to continue.",
    errorGenerico: "We couldn't process your order, please try again.",
  },
  pedidoRecibido: {
    gracias: (nombre: string) => `Thank you, ${nombre}!`,
    tituloPagado: "Payment confirmed!",
    explicacionPagado:
      "is already paid. Message us on WhatsApp and we'll arrange delivery.",
    tituloPendiente: "Your order was received",
    explicacionPendiente:
      "was received. If you had any trouble with the payment, message us on WhatsApp and we'll sort it out.",
    pedidoLabel: "Order",
    seguirViendoProductos: "Keep browsing products",
    escribirPorPedido: "Message us on WhatsApp",
    mensajePagado: (numero: string) =>
      `Hi, I just paid order #${numero}. I'd like to arrange delivery.`,
    mensajePendiente: (numero: string) =>
      `Hi, I have order #${numero} and I need help completing the payment.`,
  },
  contacto: {
    eyebrow: "Let's talk",
    titulo: "Contact us",
    descripcion:
      "Write to us on WhatsApp or by email — whether it's a question, a job application, or to offer us your products.",
    direccion: "Address",
    telefono: "Phone",
    correo: "Email",
    horario: "Business hours",
    horarioValor: "Monday to Friday, 8:00 a.m. – 5:00 p.m.",
    porDefinir: "To be confirmed",
    escribirWhatsApp: "Message us on WhatsApp",
    escribirCorreo: "Send us an email",
    irConsultas: "Questions & orders",
    irTrabaja: "Work with us",
    irProveedores: "Suppliers",
    consultas: {
      eyebrow: "Questions & orders",
      titulo: "Have a question?",
      descripcion:
        "Questions about a product, the status of an order, or anything else you need. We'll reply on whichever channel you prefer.",
      mensaje: "Hi, I have a question about Emma's products.",
      asunto: "Question from the website",
    },
  },
  sostenibilidadPage: {
    eyebrow: "#Sustainability",
    tituloPre: "At Emma,",
    tituloPost: "the future is sustainable",
    parrafo:
      "With our electric fleet and solar-powered plant, we work toward a cleaner, more responsible future for the planet.",
    hitosEyebrow: "Our milestones",
    hitosTitulo: "Committed to the planet",
    hitos: [
      {
        titulo: "Clean Infrastructure",
        descripcion:
          "Our plant runs on solar energy and we have an electric vehicle fleet for distribution.",
      },
      {
        titulo: "Circular Economy",
        descripcion:
          "We optimize our waste through Reverse Logistics, reducing the impact of every delivery.",
      },
      {
        titulo: "Zero Paper",
        descripcion:
          'With our "No Paper" policy, we use technology tools to eliminate paper use in our processes.',
      },
    ],
  },
  conocenos: {
    hero: {
      eyebrow: "About us",
      titulo: "Emma: From the field to your home",
      parrafo:
        "We turn talent and tradition into high-quality nutrition for Colombian families.",
    },
    cadena: {
      eyebrow: "How we work",
      titulo: "Our Value Chain",
      descripcion: "From the field to your home, guaranteeing quality and safety at every stage.",
      pasos: ["BUY", "PRODUCE", "DISTRIBUTE", "SELL"],
    },
    esencia: {
      eyebrow: "Our story",
      titulo: "A legacy of unity and talent",
      parrafo1:
        "Emma was born from the vision of Salomón Rodríguez and Miguel Rodríguez, who combined their passion and experience to transform the food industry. Our growth is no accident: it's the result of empowering human talent.",
      parrafo2:
        "Today, 90% of our team is in constant training, making sure every process, from its origin in the field to your home, is carried out with the excellence that defines our company.",
      imagenPlaceholder: "[Image: Work team or founders' photo]",
    },
    liderazgo: {
      eyebrow: "Leadership",
      titulo: "Strategic Leadership",
      descripcion:
        "A plural, diverse team that lives adaptability and sustainable vision, guiding Emma's future.",
      presidente: "President, Grupo Inlotrans",
      ceo: "CEO",
      cita: "At EMMA we wake up every day to build a better world where development is for everyone.",
    },
    estrategia: {
      eyebrow: "Clear direction",
      titulo: "Our strategy",
      mision: {
        titulo: "Our Mission",
        parrafo:
          "To provide wellbeing through a wide variety of food products with high standards of quality and safety. We're committed to fostering a sustainable lifestyle, bringing the field directly to our consumers' homes.",
      },
      vision: {
        titulo: "Our Vision",
        parrafo:
          "To lead the food market in Colombia and the world, offering innovative, healthy and sustainable solutions that inspire people to adopt a mindful lifestyle, contributing to the health of future generations.",
      },
    },
    pilares: {
      eyebrow: "Our essence",
      titulo: "Our DNA: Values with Purpose",
      descripcion: "The compass that guides every product that reaches your table.",
      valores: [
        { titulo: "Fearless", descripcion: "We persist until we reach impossible goals." },
        { titulo: "Entrepreneurial", descripcion: "We bring talents together to find and solve your needs." },
        { titulo: "Supportive", descripcion: "We work united to bring wellbeing home." },
        { titulo: "Enthusiastic", descripcion: "Resilience and a positive attitude for every daily challenge." },
        { titulo: "Visionary", descripcion: "Constant action and innovation for the future of your health." },
      ],
    },
    cta: {
      titulo: "Ready to try the Emma difference?",
      parrafo: "We're more than food; we're a company committed to Colombian quality.",
      boton: "Explore our portfolio",
    },
  },
  trabajaConNosotros: {
    vacantes: {
      eyebrow: "Join the team",
      titulo: "Job openings",
      descripcion:
        "We're looking for fearless, entrepreneurial and supportive people who want to build the future of Colombian food with us.",
      sinVacantesTitulo: "We don't have any open positions right now.",
      sinVacantesTexto:
        "Even so, write to us and send your resume: we'll keep you in mind for future opportunities.",
      postularme: "Apply",
      notaHojaDeVida:
        "Attach your resume in the chat or email so we can review your profile.",
      mensajeVacante: (titulo: string) =>
        `Hi, I'm interested in the ${titulo} opening. My resume is attached.`,
      asuntoVacante: (titulo: string) => `Application: ${titulo}`,
      mensajeGeneral:
        "Hi, I'd like to share my resume for future opportunities at Emma. It's attached here.",
      asuntoGeneral: "Resume for future opportunities",
      beneficios: [
        { titulo: "Real growth", texto: "90% of our team is in constant training." },
        { titulo: "Family atmosphere", texto: "A plural team working together toward one purpose." },
        { titulo: "Learn from the field", texto: "From its origin in the land to your family's table." },
      ],
      tipoContrato: {
        TIEMPO_COMPLETO: "Full-time",
        MEDIO_TIEMPO: "Part-time",
        TEMPORAL: "Temporary",
        PRACTICA: "Internship",
      },
    },
    proveedores: {
      eyebrow: "Partnerships",
      titulo: "Supplier registration",
      descripcion:
        "Do you produce or distribute grains, legumes or other supplies? Tell us and let's evaluate how to work together.",
      beneficios: [
        { titulo: "Long-term partnerships", texto: "We work hand in hand with farming families and partner companies." },
        { titulo: "Fair, timely payment", texto: "Clear, transparent and responsible business relationships." },
        { titulo: "Impact in the field", texto: "Your product reaches from the field to thousands of homes." },
      ],
      mensaje:
        "Hi, I'd like to register as an Emma supplier. The product or service I offer is: ",
      asunto: "Supplier registration",
    },
  },
} as const;

export const dictionaries = { es, en };
export type Locale = keyof typeof dictionaries;
export type Dictionary = typeof es;
