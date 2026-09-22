// Contenido real recuperado de la web anterior del estudio (bmtarquitectas.uy, archivo 2023).
// Lo que no se pudo recuperar queda marcado como `null` y se muestra como pendiente en el wireframe.
// Las fotos se cargan desde public/obras/<slug>/NN.jpg con scripts/import-photos.mjs (ver DESIGN.md).

import { photos } from "./photos";

export type Tone = "concrete" | "fog" | "graphite" | "shadow";

export const programs = ["Obra nueva", "Reforma", "Oficinas y otros"] as const;
export type Program = (typeof programs)[number];

export type Project = {
  slug: string;
  name: string;
  program: Program;
  place: string;
  /** Superficie construida, cuando la web anterior la informaba */
  area: string | null;
  /** Superficie del terreno, cuando se conoce */
  site: string | null;
  /** Frase de apertura del detalle */
  statement: string | null;
  /** Texto del proyecto (resumen de la web anterior) */
  text: string | null;
  /** Carpeta en imgs/ de la web anterior, para importar las fotos */
  source: string;
  /** Cantidad de fotos que tenía la galería anterior (define los huecos del wireframe) */
  shots: number;
  tone: Tone;
};

type Seed = Omit<Project, "slug" | "tone">;

const list: Seed[] = [
  {
    name: "Casa en Punta del Este",
    program: "Obra nueva",
    place: "Punta del Este, Maldonado",
    area: "270 m²",
    site: "1.000 m²",
    statement: "Una casa de veraneo escalonada que acompaña un frente de 33 metros.",
    text: "En una manzana enjardinada, en las paradas de la playa Mansa, el terreno de proporciones excepcionales llevó a una volumetría escalonada que se abre a lo largo de todo el frente.",
    source: "obra-nueva/tio-tom-I",
    shots: 14,
  },
  {
    name: "Cabaña en Punta Rubia",
    program: "Obra nueva",
    place: "Punta Rubia, Rocha",
    area: null,
    site: null,
    statement: "Una cabaña de madera sobre pilotes, frente a las dunas.",
    text: "Junto a La Pedrera, donde la calle termina en la arena. Diseño cuidado, recursos acotados y mano de obra local; los pilotes de madera preservan el terreno natural.",
    source: "obra-nueva/cabana-punta-rubia",
    shots: 12,
  },
  {
    name: "Hotel de campo en José Ignacio",
    program: "Obra nueva",
    place: "José Ignacio, Maldonado",
    area: null,
    site: "3,7 ha",
    statement: "Una casa con sabor a campo, inspirada en los viejos cascos de estancia.",
    text: "Cerca de la ruta 10, la planta en herradura resguarda del viento y organiza las alas laterales alrededor de un patio abierto al horizonte.",
    source: "obra-nueva/hotel-de-campo",
    shots: 9,
  },
  {
    name: "Casa en Carrasco III",
    program: "Reforma",
    place: "Carrasco, Montevideo",
    area: null,
    site: "892 m²",
    statement: "Una casa de temporada, oscura y cerrada, abierta a la luz del oeste.",
    text: "Las construcciones antiguas de Carrasco se pensaban para el verano: ventanas chicas y grandes aleros. La reforma y ampliación fue radical para ganar luz y relación con el jardín.",
    source: "reforma/casa-en-carrasco",
    shots: 7,
  },
  {
    name: "Casa en Carrasco I",
    program: "Obra nueva",
    place: "Carrasco, Montevideo",
    area: "400 m²",
    site: "1.280 m²",
    statement: "Lo tradicional y lo contemporáneo, en dos volúmenes asimétricos.",
    text: "Diseñada para una familia en un barrio privado. El acceso queda retranqueado entre dos volúmenes coronados por techos a cuatro aguas; al fondo, un estar exterior.",
    source: "obra-nueva/casa-carrasco",
    shots: 10,
  },
  {
    name: "Casa en Punta Carretas III",
    program: "Obra nueva",
    place: "Punta Carretas, Montevideo",
    area: null,
    site: null,
    statement: "Una obra nueva donde lo viejo y lo nuevo conviven sin sobresaltos.",
    text: "Las puertas interiores vienen de una casona demolida y la escalera de hierro forjado perteneció a un convento. Se proyectó desde el inicio para integrar esas piezas.",
    source: "obra-nueva/casa-punta-carretas-iii",
    shots: 8,
  },
  {
    name: "Casa en Punta Gorda",
    program: "Reforma",
    place: "Punta Gorda, Montevideo",
    area: null,
    site: null,
    statement: "Sobre la loma de la rambla, mirando al río y al atardecer.",
    text: "Una casa ya reformada varias veces, con la planta baja siete metros por encima de la vereda. El primer desafío fue resolver ese acceso.",
    source: "reforma/casa-en-punta-gorda",
    shots: 9,
  },
  {
    name: "Casa en Buceo I",
    program: "Obra nueva",
    place: "Buceo, Montevideo",
    area: "280 m²",
    site: "280 m²",
    statement: "Una casa completa en un frente de diez metros.",
    text: "Planta baja con estar, cocina y servicios; subsuelo con acceso vehicular por rampa y escalera de servicio.",
    source: "obra-nueva/casa-buceo",
    shots: 10,
  },
  {
    name: "Apartamento en Punta Carretas",
    program: "Reforma",
    place: "Punta Carretas, Montevideo",
    area: null,
    site: null,
    statement: "Un primer piso con patio, frente a la rambla.",
    text: "En un edificio de los años 80 con el río siempre presente. Reforma total: locales, instalaciones y terminaciones, con un lenguaje contemporáneo.",
    source: "reforma/apto-en-punta-carretas-I",
    shots: 10,
  },
  {
    name: "Barbacoa en Punta Gorda",
    program: "Obra nueva",
    place: "Punta Gorda, Montevideo",
    area: "128 m²",
    site: "1.440 m²",
    statement: "Barbacoa y piscina climatizada en steel framing.",
    text: "Proyectada junto a una gran casa de inspiración española que el estudio reformó y amplió después. El sistema se eligió por su relación calidad-precio y rapidez de obra.",
    source: "obra-nueva/barbacoa-punta-gorda",
    shots: 11,
  },
  {
    name: "Casa Quinta de Berro",
    program: "Reforma",
    place: "Prado, Montevideo",
    area: null,
    site: null,
    statement: "La restauración de una casa quinta de 140 años.",
    text: "Sobre la avenida Agraciada; fue embajada argentina durante un siglo. Proyecto de restauración y reforma realizado en asociación.",
    source: "oficinas/quinta-de-berro",
    shots: 6,
  },
  {
    name: "Montevideo College",
    program: "Oficinas y otros",
    place: "Pocitos, Montevideo",
    area: "1.700 m²",
    site: "750 m²",
    statement: "Un colegio construido en seis meses.",
    text: "Hormigón prefabricado modular: pilares, vigas, losas y fachadas se fabrican en planta y se ensamblan en obra.",
    source: "oficinas/montevideo-college",
    shots: 15,
  },
  // Sin texto recuperado: quedan como pendientes en el wireframe
  { name: "Casa en Solanas", program: "Obra nueva", place: "Solanas, Maldonado", area: null, site: null, statement: null, text: null, source: "obra-nueva/casa-solanas", shots: 14 },
  { name: "Casa en Las Piedras", program: "Obra nueva", place: "Las Piedras, Canelones", area: null, site: null, statement: null, text: null, source: "obra-nueva/casa-las-piedras", shots: 9 },
  { name: "Casa en Punta del Este II", program: "Obra nueva", place: "Punta del Este, Maldonado", area: null, site: null, statement: null, text: null, source: "obra-nueva/tio-tom-II", shots: 11 },
  { name: "Notable Publicidad", program: "Oficinas y otros", place: "Montevideo", area: null, site: null, statement: null, text: null, source: "oficinas/notable", shots: 13 },
  { name: "Casa en Puerto del Buceo II", program: "Reforma", place: "Buceo, Montevideo", area: null, site: null, statement: null, text: null, source: "reforma/casa-puerto-del-buceo", shots: 10 },
  { name: "Casa en Carrasco II", program: "Reforma", place: "Carrasco, Montevideo", area: null, site: null, statement: null, text: null, source: "reforma/casa-carrasco", shots: 11 },
  { name: "Casa en Punta Carretas I", program: "Reforma", place: "Punta Carretas, Montevideo", area: null, site: null, statement: null, text: null, source: "reforma/casa-punta-carretas", shots: 11 },
  { name: "Casa en Punta Carretas II", program: "Reforma", place: "Punta Carretas, Montevideo", area: null, site: null, statement: null, text: null, source: "reforma/casa-punta-carretas-ii", shots: 11 },
  { name: "Casa en Parque Batlle", program: "Reforma", place: "Parque Batlle, Montevideo", area: null, site: null, statement: null, text: null, source: "reforma/casa-parque-batlle", shots: 10 },
  { name: "Casa en Pocitos", program: "Reforma", place: "Pocitos, Montevideo", area: null, site: null, statement: null, text: null, source: "reforma/casa-en-pocitos-nuevo", shots: 15 },
  { name: "Apartamento en Pocitos", program: "Reforma", place: "Pocitos, Montevideo", area: null, site: null, statement: null, text: null, source: "reforma/apto-en-pocitos", shots: 8 },
];

const slugify = (text: string) =>
  text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const toneCycle: Tone[] = ["graphite", "concrete", "shadow", "fog"];

export const projects: Project[] = list.map((p, i) => ({ ...p, slug: slugify(p.name), tone: toneCycle[i % 4] }));

/** Frase de apertura del índice de proyectos, en la misma clave que la de "Cómo trabajamos". */
export const projectsIntro = "Treinta años de obra construida: casas, reformas y oficinas.";

export const projectHref = (p: Project) => `/proyectos/${p.slug}`;

/** Foto n (0 = portada) del proyecto si ya fue importada; si no, undefined y se dibuja el placeholder. */
export const photo = (p: Project, n = 0): string | undefined => photos[p.slug]?.[n];

export const bySlug = (slug: string) => projects.find((p) => p.slug === slug)!;

/** Proyecto del hero y las cuatro mejores casas (regla de 4). */
export const hero = bySlug("casa-en-punta-del-este");

/** Foto de portada del hero: la penúltima de la serie. */
export const heroPhoto = photo(hero, photos[hero.slug]!.length - 2);

export const featured = [
  // Solo obras con fotos en alta (≥ 2400 px): el resto se ve blando a ancho completo.
  { project: bySlug("casa-en-carrasco-iii"), ratio: "4 / 5" },
  { project: bySlug("casa-en-punta-del-este-ii"), ratio: "3 / 4" },
  { project: bySlug("casa-en-punta-gorda"), ratio: "16 / 10" },
  { project: bySlug("apartamento-en-punta-carretas"), ratio: "4 / 5" },
];

export type Shot = { label: string; tone: Tone; ratio: string; src?: string };

const ratios = ["4 / 5", "1 / 1", "3 / 4", "21 / 9"];

/** Material del detalle: galería con los huecos de la web anterior y el siguiente proyecto. */
export function projectDetail(p: Project) {
  const start = toneCycle.indexOf(p.tone);
  const gallery: Shot[] = Array.from({ length: Math.max(p.shots - 1, 0) }, (_, i) => ({
    label: `Foto ${String(i + 2).padStart(2, "0")}`,
    tone: toneCycle[(start + i + 1) % 4],
    ratio: ratios[i % ratios.length],
    src: photo(p, i + 1),
  }));
  const index = projects.findIndex((x) => x.slug === p.slug);
  const next = projects[(index + 1) % projects.length];
  return { gallery, next };
}

export const studio = {
  founded: "1995",
  intro:
    "Estudio de arquitectura en Montevideo. Desde 1995 damos forma a los deseos y necesidades de cada cliente, en obra nueva, reformas e interiores.",
  /** Frase de la home. La página de estudio usa `approach`, para no repetir el mismo texto en las dos vistas. */
  statement: "Nos apasiona la arquitectura y cómo interactúa con quienes la usan. Volúmenes, espacios, funciones.",
  /** Frase de la página de estudio */
  approach: "Treinta años de oficio, con la obra construida como única carta de presentación.",
  paragraphs: [
    "Abrimos el estudio después de recorrer juntas la carrera universitaria, y siempre concebimos los diseños en conjunto, seguras de lo que aporta esa forma de trabajo.",
    "Hacemos anteproyectos, proyectos y direcciones de obra de construcciones nuevas y de edificios a reformar, además de diseño de interiores. También desarrollamos proyectos ejecutivos para colegas.",
  ],
  partners: [
    { name: "Marcela Berthet", role: "Arquitecta, socia fundadora" },
    { name: "Perla Taranto", role: "Arquitecta, socia fundadora" },
  ],
  /** Servicios del estudio, para el índice numerado de la página de estudio */
  services: [
    { title: "Anteproyecto", note: "Planos, perspectivas y renders" },
    { title: "Proyecto ejecutivo", note: "Detalles, memorias y asesores" },
    { title: "Dirección de obra", note: "Seguimiento hasta la entrega" },
    { title: "Reformas y ampliaciones", note: "Sobre construcción existente" },
    { title: "Diseño de interiores", note: "Equipamiento y terminaciones" },
    { title: "Proyectos para colegas", note: "Desarrollo ejecutivo por encargo" },
  ],
  team: ["Patricia Carreira", "Halinna Egaña", "Pablo Cortada", "Mariana Valladares", "Leticia Dellepiane", "Elisa Varela"],
  languages: ["Español", "English", "Français", "Português", "Italiano"],
};

/** Nota editorial de la home: de qué se trata el trabajo del estudio, en tono de marca. */
export const note = {
  eyebrow: "El oficio",
  lead: "Cada encargo empieza por entender cómo quiere vivir quien va a habitar la obra.",
  paragraphs: [
    "No partimos de un estilo. Partimos del terreno, de la orientación, del presupuesto y de una conversación larga con el cliente. De ahí sale la volumetría, y no al revés.",
    "Proyectamos de a dos y revisamos todo en conjunto: cada decisión pasa dos veces por el tablero antes de llegar a la obra. Es más lento y es el motivo por el que las casas se sostienen treinta años después.",
    "Acompañamos la construcción hasta la entrega. La dirección de obra no es un trámite final: es donde el proyecto se defiende de las concesiones.",
  ],
};

// Cómo trabajamos: cuatro etapas, cada una ilustrada con una obra distinta de las carpetas en alta.
export const work = {
  eyebrow: "Cómo trabajamos",
  /** La página abre con esta frase: no lleva título grande, la frase es la entrada */
  intro: "Del terreno a la llave, proyectamos de a dos.",
  /** Para los metadatos, donde sí hace falta contar de qué se trata */
  summary:
    "Cuatro etapas, del terreno a la entrega: conversación, anteproyecto, proyecto y dirección de obra.",
  steps: [
    {
      title: "Conversación",
      text: "Empezamos escuchando: cómo quiere vivir quien encarga la obra, qué pide el terreno, con qué orientación y con qué presupuesto. De esa conversación sale la primera volumetría, y no de un estilo decidido de antemano.",
      shot: () => photo(bySlug("casa-en-punta-del-este"), 4),
      tone: "shadow",
    },
    {
      title: "Anteproyecto",
      text: "Planos, perspectivas y renders, para que cada cliente entienda a fondo cómo va a ser su obra antes de que exista. Lo revisamos de a dos: cada decisión pasa dos veces por el tablero.",
      shot: () => photo(bySlug("casa-en-punta-del-este"), 10),
      tone: "fog",
    },
    {
      title: "Proyecto",
      text: "La etapa técnica: planos de detalle, memorias y coordinación con los asesores de estructura, sanitaria y eléctrica. Con ese material la obra se presupuesta con precisión y se licita sin sorpresas.",
      shot: () => photo(bySlug("apartamento-en-punta-carretas"), 2),
      tone: "concrete",
    },
    {
      title: "Dirección de obra",
      text: "Seguimos la construcción de cerca y con exigencia, hasta la entrega. La dirección no es un trámite final: es donde el proyecto se defiende de las concesiones.",
      shot: () => photo(bySlug("apartamento-en-punta-carretas"), 4),
      tone: "graphite",
    },
  ] satisfies { title: string; text: string; tone: Tone; shot: () => string | undefined }[],
};

export const contact = {
  email: "info@berthet-taranto.uy",
  phone: "2622 0558",
  instagram: { handle: "berthet-taranto", href: "https://www.instagram.com/berthet-taranto/" },
  city: "Montevideo, Uruguay",
  address: {
    street: "Edificio Yacht Club, piso 6",
    detail: "Av. Rep. Federal de Alemania s/n",
    city: "Montevideo, Uruguay",
    mapsQuery: "Edificio Yacht Club Uruguayo, Montevideo",
  },
};

export const nav = [
  { href: "/estudio", label: "Estudio" },
  { href: "/como-trabajamos", label: "Cómo trabajamos" },
  { href: "/todos-los-proyectos", label: "Proyectos" },
  { href: "/contacto", label: "Contacto" },
];
