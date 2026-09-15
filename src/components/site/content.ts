// Contenido provisorio: nombres, lugares y años son placeholders hasta tener el material real.

export type Tone = "concrete" | "fog" | "graphite" | "shadow";

/** Imagen provisoria para toda la home; cada uso elige un encuadre distinto con object-position. */
export const VILLA = "/villa.png";

export const programs = ["Vivienda", "Trabajo", "Público", "Reforma", "Comercio"] as const;
export type Program = (typeof programs)[number];

export type Project = {
  slug: string;
  name: string;
  program: Program;
  place: string;
  year: string;
  /** Superficie construida, provisoria */
  area: string;
  status: "Terminado" | "En obra";
  tone: Tone;
  /** Encuadre de la imagen provisoria */
  crop: string;
  /** Algunos proyectos tienen video (placeholder por ahora) */
  video?: boolean;
};

const slugify = (text: string) =>
  text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const list: Omit<Project, "slug">[] = [
  { name: "Casa en la costa", program: "Vivienda", place: "Maldonado", year: "2025", area: "240 m²", status: "En obra", tone: "graphite", crop: "50% 50%", video: true },
  { name: "Casa patio", program: "Vivienda", place: "Montevideo", year: "2024", area: "180 m²", status: "Terminado", tone: "concrete", crop: "18% 55%" },
  { name: "Oficinas en Cordón", program: "Trabajo", place: "Montevideo", year: "2024", area: "620 m²", status: "Terminado", tone: "shadow", crop: "72% 25%", video: true },
  { name: "Refugio de monte", program: "Vivienda", place: "Lavalleja", year: "2023", area: "95 m²", status: "Terminado", tone: "fog", crop: "55% 88%" },
  { name: "Biblioteca barrial", program: "Público", place: "Canelones", year: "2023", area: "410 m²", status: "Terminado", tone: "concrete", crop: "35% 40%" },
  { name: "Reforma en Pocitos", program: "Reforma", place: "Montevideo", year: "2022", area: "130 m²", status: "Terminado", tone: "graphite", crop: "92% 70%" },
  { name: "Local en Ciudad Vieja", program: "Comercio", place: "Montevideo", year: "2022", area: "85 m²", status: "Terminado", tone: "fog", crop: "5% 50%" },
  { name: "Casa de los aromos", program: "Vivienda", place: "Rocha", year: "2021", area: "160 m²", status: "Terminado", tone: "shadow", crop: "66% 62%" },
  { name: "Cowork en Parque Rodó", program: "Trabajo", place: "Montevideo", year: "2021", area: "350 m²", status: "Terminado", tone: "concrete", crop: "40% 70%" },
  { name: "Plaza de la estación", program: "Público", place: "Florida", year: "2020", area: "2.400 m²", status: "Terminado", tone: "graphite", crop: "80% 45%", video: true },
  { name: "Reforma en Malvín", program: "Reforma", place: "Montevideo", year: "2020", area: "110 m²", status: "Terminado", tone: "fog", crop: "25% 30%" },
  { name: "Panadería de barrio", program: "Comercio", place: "Colonia", year: "2019", area: "70 m²", status: "Terminado", tone: "shadow", crop: "60% 35%" },
];

export const projects: Project[] = list.map((p) => ({ ...p, slug: slugify(p.name) }));

export const projectHref = (p: Project) => `/proyectos/${p.slug}`;

const toneCycle: Tone[] = ["graphite", "concrete", "shadow", "fog"];

export type Shot = { label: string; tone: Tone; ratio: string };
export type BeforeShot = { title: string; text: string; tone: Tone };

/** Material de la página de detalle: fotos, texto y, en las reformas, el "antes". Todo provisorio. */
export function projectDetail(p: Project) {
  const start = toneCycle.indexOf(p.tone);
  const tone = (i: number) => toneCycle[(start + i) % toneCycle.length];
  const reform = p.program === "Reforma";

  const gallery: Shot[] = [
    { label: reform ? "Después, living" : "Vista exterior", tone: tone(1), ratio: "4 / 5" },
    { label: reform ? "Después, cocina" : "Interior", tone: tone(2), ratio: "1 / 1" },
    { label: "Detalle constructivo", tone: tone(3), ratio: "3 / 4" },
    { label: reform ? "Después, fachada" : "Vista general", tone: tone(0), ratio: "21 / 9" },
  ];

  const before: BeforeShot[] | null = reform
    ? [
        { title: "Fachada", text: "Revoque deteriorado y aberturas originales sin aislación.", tone: "fog" },
        { title: "Cocina", text: "Ambiente cerrado, sin luz natural directa.", tone: "concrete" },
        { title: "Living", text: "Tabiques que dividían el espacio en tres cuartos chicos.", tone: "graphite" },
        { title: "Baño", text: "Instalaciones sanitarias a renovar por completo.", tone: "shadow" },
      ]
    : null;

  const statement: Record<Program, string> = {
    Vivienda: "Una casa abierta al paisaje, con ambientes que cambian con la luz del día.",
    Trabajo: "Un lugar de trabajo flexible, con luz natural y espacios para encontrarse.",
    Público: "Un espacio para el barrio, abierto y fácil de recorrer.",
    Reforma: "Recuperamos la estructura existente y abrimos la planta para ganar luz y amplitud.",
    Comercio: "Un local que se lee desde la vereda y ordena el recorrido de quien entra.",
  };

  const index = projects.findIndex((x) => x.slug === p.slug);
  const next = projects[(index + 1) % projects.length];

  return { gallery, before, next, statement: statement[p.program] };
}

export const featured = [
  { project: projects[0], ratio: "4 / 5" },
  { project: projects[1], ratio: "3 / 4" },
  { project: projects[2], ratio: "16 / 10" },
  { project: projects[3], ratio: "4 / 5" },
];

export const steps = [
  {
    title: "Escuchar",
    text: "Visitamos el terreno y conversamos sobre cómo querés vivir o trabajar.",
    tone: "fog",
  },
  {
    title: "Anteproyecto",
    text: "Dibujamos alternativas, armamos maquetas y estimamos el costo de obra.",
    tone: "concrete",
  },
  {
    title: "Proyecto ejecutivo",
    text: "Resolvemos cada detalle constructivo y tramitamos los permisos.",
    tone: "graphite",
  },
  {
    title: "Dirección de obra",
    text: "Acompañamos la construcción, semana a semana, hasta la entrega.",
    tone: "shadow",
  },
] satisfies { title: string; text: string; tone: Tone }[];

export const contact = {
  email: "info@berthet-taranto.uy",
  instagram: { handle: "berthet-taranto", href: "https://www.instagram.com/berthet-taranto/" },
  city: "Montevideo, Uruguay",
  /** Dirección provisoria: reemplazar por la real (el enlace al mapa usa mapsQuery) */
  address: {
    street: "Calle Ejemplo 1234",
    city: "Montevideo, Uruguay",
    mapsQuery: "Montevideo, Uruguay",
    /** Por ahora la villa; más adelante, foto del edificio u oficina */
    photo: VILLA,
    photoCrop: "22% 50%",
  },
};

export const nav = [
  { href: "/estudio", label: "Estudio" },
  { href: "/todos-los-proyectos", label: "Proyectos" },
  { href: "/contacto", label: "Contacto" },
];
