/**
 * Fuente única de los valores que muestra /fundamentos.
 *
 * Nada se escribe a mano acá: los tokens salen de `src/app/globals.css`, los textos de uso y los
 * pendientes de `DESIGN.md`, los números de obra de `content.ts` y el vocabulario de movimiento de
 * `motion.ts`. Si el sitio cambia, esta página cambia sola. Se lee en el build (módulo de servidor,
 * como `wordmark.ts`).
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import { contact, featured, nav, programs, projects, studio, work } from "@/components/site/content";

const read = (file: string) => readFileSync(path.join(process.cwd(), file), "utf8");

const css = read("src/app/globals.css");
const design = read("DESIGN.md");
const motion = read("src/components/site/motion.ts");
// La preferencia de movimiento reducido se resuelve en el componente, no en las animaciones.
const siteMotion = read("src/components/site/SiteMotion.tsx");

/* ---------------------------------------------------------------- tipografía */

export type Role = {
  /** Nombre del token sin prefijo: display, title, … */
  name: string;
  /** Clase de Tailwind que usa el sitio */
  className: string;
  /** Valor literal del token, tal cual está en globals.css */
  size: string;
  /** Extremos del clamp en px (si el token es fijo, los dos son iguales) */
  min: number;
  max: number;
  lineHeight: number;
  /** em, 0 cuando el token no define tracking */
  tracking: number;
  weight: number;
  /** Columna "Uso" de la tabla §2 de DESIGN.md */
  use: string;
};

const PX_PER_REM = 16;

/** "2.75rem" | "44px" -> 44 */
function toPx(value: string): number {
  const n = parseFloat(value);
  return value.trim().endsWith("rem") ? n * PX_PER_REM : n;
}

/** Extremos de un clamp(min, fluido, max); un valor suelto devuelve el mismo número dos veces. */
function bounds(value: string): [number, number] {
  const clamp = /clamp\(([^,]+),[^,]+,([^)]+)\)/.exec(value);
  if (!clamp) return [toPx(value), toPx(value)];
  return [toPx(clamp[1]), toPx(clamp[2])];
}

function token(name: string, suffix = ""): string | undefined {
  const re = new RegExp(`--text-${name}${suffix}:[ ]*([^;]+);`);
  return re.exec(css)?.[1].trim();
}

/** Filas de la tabla de tipografía de DESIGN.md: `| \`display\` | … | Uso |` */
const uses = new Map<string, string>(
  [...design.matchAll(/^\|\s*`([a-z]+)`\s*\|(.+)\|\s*$/gm)].map((m) => {
    const cells = m[2].split("|").map((c) => c.trim());
    return [m[1], cells[cells.length - 1]];
  }),
);

/** Dónde se aplica cada rol, dicho para alguien que no lee código. */
const where: Record<string, { where: string; note: string }> = {
  display: { where: "Títulos de página", note: "Uno por página, como mucho." },
  title: { where: "Nombres", note: "Obras, listados y menú." },
  heading: { where: "Frases", note: "Títulos de sección y frases de marca." },
  subheading: { where: "Subtítulos", note: "Índices, equipo y acciones con «+»." },
  lead: { where: "Introducciones", note: "Bajadas, nombres en tarjetas y filtros." },
  body: { where: "Textos", note: "Texto corrido, hasta 60 caracteres por línea." },
  meta: { where: "Datos", note: "Programa, lugar y enlaces chicos." },
  label: { where: "Etiquetas", note: "Rótulos y encabezados. Las únicas en mayúscula." },
};

const order = ["display", "title", "heading", "subheading", "lead", "body", "meta", "label"];

export const roles: (Role & { where: string; note: string })[] = order.flatMap((name) => {
  const size = token(name);
  if (!size) return [];
  const [min, max] = bounds(size);
  return [
    {
      name,
      className: `text-${name}`,
      size,
      min,
      max,
      lineHeight: parseFloat(token(name, "--line-height") ?? "1"),
      tracking: parseFloat(token(name, "--letter-spacing") ?? "0"),
      weight: parseInt(token(name, "--font-weight") ?? "400", 10),
      use: uses.get(name) ?? "",
      ...where[name],
    },
  ];
});

/** Eje variable de ABC Areal, declarado en `src/app/layout.tsx` (weight: "400 700"). */
export const weightAxis = (() => {
  const declared = /weight:\s*"(\d+)\s+(\d+)"/.exec(read("src/app/layout.tsx"));
  return { min: Number(declared?.[1] ?? 400), max: Number(declared?.[2] ?? 700) };
})();

/** Los pesos que el sitio usa de verdad, con el rol que los ocupa. */
export const weightsInUse = (() => {
  const used = new Map<number, string[]>();
  for (const r of roles) used.set(r.weight, [...(used.get(r.weight) ?? []), r.where.toLowerCase()]);
  const rows = [...used.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([value, list]) => ({ value, use: list.join(", "), off: false }));
  if (!used.has(weightAxis.max)) {
    rows.push({ value: weightAxis.max, use: "disponible, no se usa", off: true });
  }
  return rows;
})();

/* --------------------------------------------------------------------- color */

export type Swatch = { name: string; label: string; hex: string; use: string; share: number; ink: string };

function cssVar(name: string): string {
  return new RegExp(`--${name}:[ ]*(#[0-9a-fA-F]{3,6});`).exec(css)?.[1] ?? "#000000";
}

/** share: peso aproximado de cada tono en la superficie del sitio. Estimado a ojo, no medido. */
const tones: Omit<Swatch, "ink">[] = [
  { name: "paper", label: "Blanco", hex: cssVar("background"), use: "El papel: la hoja sobre la que vive todo.", share: 62 },
  { name: "ink", label: "Negro", hex: cssVar("foreground"), use: "Lo que nombra, y los bloques de cierre.", share: 20 },
  { name: "fog", label: "Niebla", hex: cssVar("fog"), use: "Bandas de corte a ancho completo.", share: 8 },
  { name: "concrete", label: "Hormigón", hex: cssVar("concrete"), use: "Filetes y placeholder de obra clara.", share: 5 },
  { name: "graphite", label: "Grafito", hex: cssVar("graphite"), use: "Lo que informa: datos y texto corrido.", share: 3 },
  { name: "shadow", label: "Sombra", hex: cssVar("shadow"), use: "Fondo de foto y placeholder oscuro.", share: 2 },
];

const channel = (c: number) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);

function luminance(hex: string): number {
  const full = hex.length === 4 ? `#${[...hex.slice(1)].map((c) => c + c).join("")}` : hex;
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(full.slice(i, i + 2), 16) / 255);
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

/** Ratio de contraste WCAG, redondeado a una decimal. */
export function contrast(a: string, b: string): number {
  const [x, y] = [luminance(a), luminance(b)].sort((m, n) => n - m);
  return Math.round(((x + 0.05) / (y + 0.05)) * 10) / 10;
}

/** Sobre cada tono, el logotipo va en el color que más contraste le dé: blanco o negro. */
export const palette: Swatch[] = tones.map((t) => ({
  ...t,
  ink: contrast(t.hex, "#ffffff") >= contrast(t.hex, "#000000") ? "#ffffff" : "#000000",
}));

const byName = (n: string) => palette.find((s) => s.name === n)!.hex;

export const contrastChecks = [
  { label: "Negro sobre blanco", fg: "ink", bg: "paper", size: "Nombres y títulos" },
  { label: "Grafito sobre blanco", fg: "graphite", bg: "paper", size: "Datos y texto corrido" },
  { label: "Blanco sobre negro", fg: "paper", bg: "ink", size: "Bloque de contacto" },
  { label: "Grafito sobre niebla", fg: "graphite", bg: "fog", size: "Rótulos en la banda" },
].map((c) => {
  const ratio = contrast(byName(c.fg), byName(c.bg));
  return { ...c, fgHex: byName(c.fg), bgHex: byName(c.bg), ratio, aa: ratio >= 4.5 };
});

/* ------------------------------------------------------------------- grilla */

export const grid = {
  columns: 12,
  columnsMobile: 4,
  gutter: /--gutter:\s*([^;]+);/.exec(css)?.[1].trim() ?? "",
  label: "1–3",
  content: "4–12",
};

export const breakpoints = [
  { px: "1500", text: "Diseño de escritorio" },
  { px: "1024", text: "Escala, sin cambios de composición" },
  { px: "768", text: "La navegación pasa a «Menú»; de 12 a 4 columnas" },
  { px: "390", text: "Celular: todo en una columna" },
];

/* --------------------------------------------------------------- movimiento */

/**
 * Vocabulario de movimiento. Cada entrada existe como una función de `motion.ts`: si alguna se
 * borra del sitio, deja de aparecer acá en lugar de quedar como promesa vieja.
 */
const moves: { fn: string; name: string; text: string }[] = [
  { fn: "reveals", name: "Revelado", text: "La foto se descubre de abajo hacia arriba y las marcas «+» aparecen en las esquinas." },
  { fn: "pageIntro", name: "Título que sube", text: "El título de página sube línea por línea, como si ya existiera fuera de cuadro." },
  { fn: "statements", name: "Frase que se enciende", text: "Palabra por palabra, al ritmo del scroll. Obliga a leerla despacio." },
  { fn: "plusDraws", name: "Trazado", text: "Los «+» grandes se dibujan: primero el trazo horizontal, después el vertical." },
  { fn: "work", name: "Texto que se fija", text: "En Cómo trabajamos las obras se quedan quietas y es el texto el que se detiene." },
  { fn: "rollLinks", name: "Letras que giran", text: "En los enlaces grandes, las letras giran hacia arriba al pasar el cursor." },
  { fn: "indexPreview", name: "Vista previa del índice", text: "Al recorrer el índice, la obra de cada fila aparece siguiendo al cursor." },
  { fn: "capWheelSpeed", name: "Freno del scroll", text: "Por más fuerte que se tire de la rueda, la página no se adelanta ni saltea secciones." },
];

export const motionVocab = moves.filter((m) => motion.includes(`export function ${m.fn}`));

/** El sitio respeta la preferencia del sistema: se verifica que el código lo consulte. */
export const respectsReducedMotion = /prefers-reduced-motion/.test(motion + siteMotion);

/* ------------------------------------------------------------------ contenido */

export const figures = {
  projects: projects.length,
  withoutText: projects.filter((p) => !p.text).length,
  withoutArea: projects.filter((p) => !p.area).length,
  withoutYear: projects.length,
  programs: programs.length,
  featured: featured.length,
  steps: work.steps.length,
  nav: nav.length,
  founded: studio.founded,
  partners: studio.partners.length,
};

/** La regla de 4, con los números que hoy tiene el sitio. */
export const ruleOfFour = [
  { n: String(figures.featured), text: "proyectos destacados en la home" },
  { n: String(figures.nav), text: "ítems en la navegación" },
  { n: `${figures.programs} + 1`, text: "filtros más «Todos»" },
  { n: String(figures.steps), text: "etapas en Cómo trabajamos" },
];

/** Frase del estudio que se usa en todas las muestras: nada de lorem. */
export const specimen = {
  line: studio.approach,
  short: "Berthet + Taranto Arquitectas",
  word: "Berthet",
};

export const site = { contact, studio };

/* ----------------------------------------------------------------- pendientes */

/** Lista de "Pendientes para el cliente" de DESIGN.md, leída tal cual. */
export const pending: string[] = (() => {
  const block = design.split("### Pendientes para el cliente")[1] ?? "";
  return [...block.split(/\n#{2,3} /)[0].matchAll(/^- \[ \] (.+)$/gm)].map((m) => m[1].trim().replace(/`/g, ""));
})();

export const version = "v0.2 — wireframe";
export const generated = new Date().toISOString().slice(0, 10);
