import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { hero, projects, studio } from "@/components/site/content";
import { Plus, PlusLabel } from "@/components/site/Plus";
import {
  breakpoints,
  contrastChecks,
  figures,
  generated,
  grid,
  motionVocab,
  palette,
  pending,
  respectsReducedMotion,
  roles,
  ruleOfFour,
  site,
  specimen,
  version,
  weightAxis,
  weightsInUse,
} from "@/fundamentos/data";
import { BrandPlate, Lockup } from "./Brand";
import { Chrome } from "./Chrome";
import { num, sections } from "./sections";
import { Anatomy, WeightAxis } from "./TypeLab";
import "./fundamentos.css";

export const metadata: Metadata = {
  title: "Fundamentos",
  description: "Sistema visual del sitio de Berthet + Taranto Arquitectas y las razones de cada decisión.",
  robots: { index: false, follow: false },
};

/**
 * Una sección, que en papel es una hoja. Encabezado con filete negro, numeral a la derecha y una
 * bajada corta; el resto del contenido debajo, a todo el ancho de la columna.
 */
function Sheet({
  index,
  page,
  title,
  intro,
  children,
  cont = false,
}: {
  index: number;
  page: number;
  title: string;
  intro?: ReactNode;
  children: ReactNode;
  cont?: boolean;
}) {
  const s = sections[index];
  return (
    <section
      id={cont ? undefined : s.id}
      aria-labelledby={cont ? undefined : `${s.id}-title`}
      className="f-page scroll-mt-8 pb-20"
    >
      {/*
        En pantalla el encabezado va arriba de la sección y una sola vez. En papel es la celda
        izquierda de la hoja: título, numeral y bajada, con el filete de la grilla a su derecha.
      */}
      <header className={`f-head f-hair border-t pt-5 ${cont ? "hidden print:block" : "block"}`}>
        <div className="flex items-baseline justify-between gap-6">
          <h2 id={cont ? undefined : `${s.id}-title`} className="d-h2">
            {title}
            {cont ? <span className="f-muted"> (cont.)</span> : null}
          </h2>
          <span className="f-muted d-label tabular-nums print:hidden">({num(index)})</span>
        </div>
        <span className="f-muted hidden d-label tabular-nums print:mt-3 print:block">({num(index)})</span>
        {intro ? <p className="mt-5 hidden max-w-[40ch] d-lead print:block">{intro}</p> : null}
      </header>

      <div className="f-body">
        {intro ? <p className="mt-5 mb-10 max-w-[46ch] d-lead print:hidden">{intro}</p> : <div className={cont ? "mt-10 print:mt-0" : "mt-8 print:mt-0"} />}
        {children}
      </div>
      <footer className="f-foot f-muted f-rule mt-10 hidden items-baseline justify-between border-t pt-2 d-label">
        <span>Berthet + Taranto — Sistema visual</span>
        <span>{s.title}</span>
        <span className="tabular-nums">{String(page).padStart(3, "0")}</span>
      </footer>
    </section>
  );
}

/** Pares de decisión: el qué en una línea, el porqué debajo. */
function Decisions({ items }: { items: { title: string; text: ReactNode }[] }) {
  return (
    <dl className="grid gap-x-(--gutter) sm:grid-cols-2">
      {items.map((item) => (
        <div key={item.title} className="f-rule border-t pt-4 pb-8">
          <dt className="d-lead">{item.title}</dt>
          <dd className="f-muted mt-3 max-w-[46ch] d-body">{item.text}</dd>
        </div>
      ))}
    </dl>
  );
}

/** Subtítulo interno de una sección: etiqueta en mayúscula, como las del sitio. */
function Eyebrow({ children }: { children: ReactNode }) {
  return <h3 className="f-muted mb-6 d-label">{children}</h3>;
}

/* ------------------------------------------------------------- 02 tipografía */

const alphabet = [
  "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  "abcdefghijklmnopqrstuvwxyz",
  "0123456789 áéíóúñü ¿? ¡!",
  "( ) [ ] « » — – · / & @ % + = ° m² ha",
];

// Sin el extremo de 120 px: la muestra sirve para ver cómo cierra el interlineado, no para llenar la pantalla.
const waterfall = [72, 56, 40, 28, 20, 16];

/** Clases escritas enteras: Tailwind no genera las que se arman con un string dinámico. */
const roleClass: Record<string, string> = {
  display: "text-display",
  title: "text-title",
  heading: "text-heading",
  subheading: "text-subheading",
  lead: "text-lead",
  body: "text-body",
  meta: "text-meta",
  label: "text-label",
};

/** Line-height del rol que cubre ese tamaño: el interlineado se cierra a medida que el cuerpo crece. */
function lineHeightFor(px: number) {
  const covering = roles.find((r) => px >= r.min && px <= r.max);
  return covering ?? [...roles].sort((a, b) => Math.abs(a.max - px) - Math.abs(b.max - px))[0];
}


/**
 * Muestra de cada rol: corta y con contenido real del estudio. Una frase larga en el rol más grande
 * ocuparía media pantalla y no aportaría nada que no diga el tamaño.
 */
const sampleText: Record<string, string> = {
  display: "Estudio",
  title: projects[0].name,
  heading: "La obra habla",
  subheading: `01  ${projects[1].name}`,
  lead: "Treinta años de obra construida.",
  body: "Texto de proyecto, hasta sesenta caracteres por línea.",
  meta: `${projects[0].program} · ${projects[0].place}`,
  label: "PROGRAMA",
};

/**
 * Muestras de la escala, al modo de un manual: el rol a la izquierda, sus medidas a la derecha y la
 * muestra debajo, en el tamaño real del sitio. Se usa dos veces: en papel entran en dos hojas.
 */
function RoleTable({ list }: { list: typeof roles }) {
  return (
    <ol>
      {list.map((r) => (
        <li key={r.name} className="f-rule border-t py-6 first:border-t-0 first:pt-0">
          <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
            <p className="d-label">{r.where}</p>
            <p className="f-muted d-meta tabular-nums">
              ABC Areal · {r.weight} ·{" "}
              {r.min === r.max ? `${r.min} px` : `${Math.round(r.min)}–${Math.round(r.max)} px`} · interl. {r.lineHeight}
              {r.tracking ? ` · ${r.tracking}em` : ""}
            </p>
          </div>
          <div className="d-sample mt-3 max-h-20">
            <p className={roleClass[r.name]} style={{ fontWeight: r.weight }}>
              {sampleText[r.name]}
            </p>
          </div>
          <p className="f-muted mt-2 d-body">{r.note}</p>
        </li>
      ))}
    </ol>
  );
}

/* ------------------------------------------------------------ 10 aplicaciones */

const sample = hero;
const sampleData = [
  { label: "Programa", value: sample.program as string | null },
  { label: "Lugar", value: sample.place as string | null },
  { label: "Superficie", value: sample.area },
  { label: "Terreno", value: sample.site },
];

/** Marco plano de mockup: rótulo, proporción y una línea de qué demuestra. Sin sombras ni perspectiva. */
function Mock({
  title,
  ratio,
  shows,
  children,
  wide = false,
}: {
  title: string;
  ratio: string;
  shows: string;
  children: ReactNode;
  wide?: boolean;
}) {
  return (
    <figure className={`m-0 ${wide ? "sm:col-span-2" : ""}`}>
      <div className="f-rule border" style={{ aspectRatio: ratio }}>
        {children}
      </div>
      <figcaption className="mt-3">
        <p className="d-meta">
          {title} <span className="f-muted">({ratio.replace("/", ":")})</span>
        </p>
        <p className="f-muted max-w-[44ch] d-body">{shows}</p>
      </figcaption>
    </figure>
  );
}

const pendingPhone = `${site.contact.phone} (a confirmar)`;

export default function Fundamentos() {
  return (
    <Chrome>
      <header className="f-page f-cover pt-[12vh] pb-28">
        <p className="f-muted d-label">Berthet + Taranto · Documento interno</p>
        <h1 className="mt-6 d-title">Sistema visual</h1>
        <p className="mt-8 max-w-[42ch] d-lead">
          Las decisiones de diseño del sitio y por qué se tomaron. No describe páginas: describe el sistema del que
          salen todas.
        </p>
        <div
          className="f-rule mt-12 flex items-center justify-center border py-[clamp(3rem,9vh,6rem)]"
          style={{ background: "var(--foreground)", color: "var(--background)" }}
        >
          <Lockup size="clamp(1.6rem, 3.2vw, 2.6rem)" stacked />
        </div>

        <dl className="f-rule mt-12 grid max-w-[46rem] grid-cols-2 gap-x-(--gutter) gap-y-6 border-t pt-5 sm:grid-cols-4">
          {[
            ["Versión", version],
            ["Fecha", generated],
            ["Obras cargadas", String(figures.projects)],
            ["Pendientes", String(pending.length + 1)],
          ].map(([k, v]) => (
            <div key={k}>
              <dt className="f-muted d-label">{k}</dt>
              <dd className="mt-1 d-meta tabular-nums">{v}</dd>
            </div>
          ))}
        </dl>
        <footer className="f-foot f-muted f-rule mt-10 hidden items-baseline justify-between border-t pt-2 d-label">
          <span>Berthet + Taranto — Sistema visual</span>
          <span>Portada</span>
          <span className="tabular-nums">001</span>
        </footer>
      </header>

      {/* 01 ------------------------------------------------------------------ */}
      <Sheet
        index={0}
        page={2}
        title="La obra habla, el texto acompaña"
        intro="Tres décadas de obra construida en Uruguay, contadas con la calma de un catálogo de arquitectura."
      >
        <Decisions
          items={[
            {
              title: "Periodismo visual",
              text: "Cada página narra obras concretas, no promete estilo. Somos un estudio con obra, no una agencia de tendencias.",
            },
            {
              title: "Sobria, precisa, cálida sin decoración",
              text: "La personalidad se construye con escala, espacio y posición. Nada de adornos que no tengan una función en la lectura.",
            },
          ]}
        />

        <div className="mt-12">
          <Eyebrow>De dónde se parte</Eyebrow>
          <div className="grid gap-x-(--gutter) gap-y-8 md:grid-cols-3">
            {[
              {
                n: "01",
                head: "Sin años de obra",
                text: "La web anterior no publicaba el año de ninguna de las obras. Un estudio de treinta años no muestra trayectoria si no hay fechas.",
              },
              {
                n: "02",
                head: `${figures.withoutText} de ${figures.projects} fichas sin texto`,
                text: `De las ${figures.projects} obras recuperadas, ${figures.withoutText} no tienen descripción y ${figures.withoutArea} no informan superficie.`,
              },
              {
                n: "03",
                head: "Sin versión de celular diseñada",
                text: "No había una maqueta pensada para teléfono: la vista chica era la de escritorio reducida.",
              },
            ].map((d) => (
              <div key={d.n} className="f-rule border-t pt-4">
                <p className="f-muted d-label tabular-nums">({d.n})</p>
                <p className="mt-2 d-h3">{d.head}</p>
                <p className="f-muted mt-2 max-w-[40ch] d-body">{d.text}</p>
              </div>
            ))}
          </div>
          <p className="f-muted mt-6 max-w-[60ch] d-meta">
            Los tres datos salen del contenido recuperado del archivo 2023 de la web anterior. No son un juicio sobre el
            trabajo previo: son lo que falta para publicar.
          </p>
        </div>
      </Sheet>

      {/* 02 ------------------------------------------------------------------ */}
      <Sheet
        index={1}
        page={3}
        title="Una sola familia, un rol por estilo"
        intro="No se agrega otra fuente sin un rol nuevo y justificado. La jerarquía la da el tamaño, no la mezcla de familias."
      >
        <div className="f-band px-(--gutter) pt-[clamp(2.5rem,7vh,4rem)] pb-12">
          <div className="f-muted flex items-baseline justify-between gap-6 d-label">
            <p className="uppercase">La familia</p>
            <p>(Dinamo)</p>
          </div>
          <p className="mt-6 d-title">ABC Areal</p>
          <p className="f-muted mt-8 max-w-[44ch] d-body">
            Una sola familia sin serifa para todo el sitio. En tamaños grandes se parece a la rotulación de un plano,
            que es el registro que buscábamos.
          </p>

          <div className="mt-14">
            <Eyebrow>Alfabeto</Eyebrow>
            <div className="space-y-1">
              {alphabet.map((row, i) => (
                <p key={row} className={i < 2 ? "d-h3" : "d-lead"}>
                  {row}
                </p>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12">
          <Eyebrow>Eje de peso · {weightAxis.min}–{weightAxis.max}</Eyebrow>
          <WeightAxis min={weightAxis.min} max={weightAxis.max} line={specimen.short} />
          <ul className="mt-10 grid grid-cols-2 gap-x-(--gutter) gap-y-6 md:grid-cols-4">
            {weightsInUse.map((w) => (
              <li key={w.value} className={`f-hair border-t pt-3 ${w.off ? "f-muted" : ""}`}>
                <p className="d-h3 tabular-nums" style={{ fontWeight: w.value }}>
                  {w.value}
                </p>
                <p className="f-muted mt-1 max-w-[18ch] d-meta">{w.use}</p>
              </li>
            ))}
          </ul>
        </div>

      </Sheet>

      <Sheet index={1} page={4} cont title="Una sola familia, un rol por estilo">
        <div className="mt-14">
          <Eyebrow>Anatomía</Eyebrow>
          <Anatomy word={specimen.word} />
        </div>

        <div className="mt-14">
          <Eyebrow>La escala, en un texto real</Eyebrow>
        <div className="space-y-3">
          {waterfall.map((px) => {
            const r = lineHeightFor(px);
            return (
              // La muestra grande se corta contra el borde en vez de ensanchar la página.
              <div key={px} className="f-rule flex items-baseline gap-4 overflow-hidden border-t pt-3">
                <span className="f-muted w-[7ch] shrink-0 d-label tabular-nums">{px} px</span>
                <span className="f-muted w-[8ch] shrink-0 d-label tabular-nums">lh {r.lineHeight}</span>
                <p
                  className="min-w-0 flex-1 whitespace-nowrap"
                  style={{
                    fontSize: `calc(${px}px * var(--f-scale))`,
                    lineHeight: r.lineHeight,
                    letterSpacing: `${r.tracking}em`,
                  }}
                >
                  {specimen.line}
                </p>
              </div>
            );
          })}
        </div>

        </div>

        <div className="mt-12">
          <Eyebrow>Espaciado entre letras</Eyebrow>
          <div className="space-y-4">
            {[
              { label: "Sin ajuste", tracking: 0 },
              { label: `Como lo usa el sitio (${roles[2].tracking}em en frases)`, tracking: roles[2].tracking },
            ].map((t) => (
              <div key={t.label}>
                <p className="f-muted d-label">{t.label}</p>
                <p className="d-h2" style={{ letterSpacing: `${t.tracking}em` }}>
                  {specimen.short}
                </p>
              </div>
            ))}
          </div>
        </div>

      </Sheet>

      <Sheet index={1} page={5} cont title="Una sola familia, un rol por estilo">
        <div className="mt-14">
          <Eyebrow>Por qué así</Eyebrow>
          <Decisions
            items={[
              {
                title: "Sin light ni negritas",
                text: `El eje empieza en ${weightAxis.min}: no existe un peso más fino. Tampoco hay negritas en el contenido; si algo tiene que pesar más, crece de tamaño.`,
              },
              {
                title: "Los chicos van más negros",
                text: "Los textos grandes van en 400; el texto corrido en 450 y los datos y etiquetas en 500. En tamaño chico el regular se deshilacha y pierde el carácter editorial.",
              },
              {
                title: "El interlineado baja cuando sube el tamaño",
                text: `De ${roles[5].lineHeight} en el texto corrido a ${roles[0].lineHeight} en los títulos, y el espaciado entre letras se cierra en la misma dirección. Los títulos se leen como un bloque; el texto respira.`,
              },
              {
                title: "Mayúsculas solo en etiquetas",
                text: "Rótulos y encabezados. Los textos grandes van siempre en minúscula: el tamaño ya los distingue.",
              },
              {
                title: "Paréntesis y numerales",
                text: "La información secundaria va entre paréntesis sin cambiar de color: (Estudio), (04), (11 fotos). Los índices se numeran con cifras del mismo ancho.",
              },
              {
                title: "Licencia, pendiente",
                text: "ABC Areal es de Dinamo y es comercial. La licencia no está confirmada: falta definir la licencia web y su tope de visitas, si se usa en piezas impresas y a nombre de quién se compra.",
              },
            ]}
          />
        </div>
      </Sheet>

      {/* 03 ------------------------------------------------------------------ */}
      <Sheet
        index={2}
        page={6}
        title="Ocho roles, uno por uso"
        intro="Cada estilo tiene un lugar donde se aplica y no se usa en ningún otro. Los tamaños con dos valores crecen con la pantalla y se detienen en el mayor."
      >
        <RoleTable list={roles.slice(0, 4)} />

      </Sheet>

      <Sheet index={2} page={7} cont title="Ocho roles, uno por uso">
        <RoleTable list={roles.slice(4)} />
      </Sheet>

      <Sheet index={2} page={8} cont title="Ocho roles, uno por uso">
        <div className="mt-12">
          <Decisions
            items={[
              {
                title: "Los saltos son grandes a propósito",
                text: `De ${roles[1].where.toLowerCase()} a ${roles[0].where.toLowerCase()} hay casi el doble de tamaño. Si la diferencia entre dos niveles no se nota de un vistazo, no genera jerarquía: genera ruido.`,
              },
              {
                title: "Escala fluida con tope",
                text: "Cada estilo crece con la pantalla y se detiene. Los textos chicos y la navegación no crecen sin límite en monitores grandes, y en el celular bajan hasta el mínimo de la tabla.",
              },
            ]}
          />
        </div>
      </Sheet>

      {/* 04 ------------------------------------------------------------------ */}
      <Sheet
        index={3}
        page={9}
        title="Blanco, negro y grises de obra"
        intro="Neutros cálidos y ningún acento. En un portfolio de arquitectura el color lo ponen las fotos: madera, hormigón, cielo, vegetación."
      >
        <div className="grid grid-cols-2 gap-x-(--gutter) gap-y-10 md:grid-cols-3">
          {palette.map((c) => (
            <BrandPlate key={c.name} bg={c.hex} ink={c.ink} label={c.label} value={c.hex} note={c.use} size="1.1rem" />
          ))}
        </div>
        <p className="f-muted mt-5 max-w-[62ch] d-body">
          El logotipo va siempre en un solo color, el que contraste con el fondo: negro sobre los claros, blanco sobre
          los oscuros. Nunca lleva color propio.
        </p>

        <div className="mt-12">
          <Eyebrow>Cuánto pesa cada uno</Eyebrow>
          <div className="f-hair flex h-8 w-full border">
            {palette.map((c) => (
              <div key={c.name} style={{ background: c.hex, width: `${c.share}%` }} className="f-rule border-r last:border-r-0" />
            ))}
          </div>
          <ol className="f-muted mt-3 flex flex-wrap gap-x-5 gap-y-1 d-label tabular-nums">
            {palette.map((c) => (
              <li key={c.name}>
                {c.label} {c.share}%
              </li>
            ))}
          </ol>
          <p className="f-muted mt-3 max-w-[60ch] d-body">
            Reparto estimado, no medido: el blanco domina, el negro aparece como cierre y los grises quedan para los
            datos. Sirve para ver el peso relativo, no como cifra exacta.
          </p>
        </div>

      </Sheet>

      <Sheet index={3} page={10} cont title="Blanco, negro y grises de obra">
        <div className="mt-12">
          <Eyebrow>Contraste</Eyebrow>
          <ul>
            {contrastChecks.map((c) => (
              <li key={c.label} className="f-rule flex flex-wrap items-center gap-x-6 gap-y-2 border-b py-3">
                <span
                  className="f-rule inline-block border px-3 py-1 d-meta"
                  style={{ background: c.bgHex, color: c.fgHex }}
                >
                  Aa
                </span>
                <span className="d-meta">{c.label}</span>
                <span className="f-muted d-meta tabular-nums">{c.ratio.toFixed(1)}:1</span>
                <span className="d-meta">{c.aa ? "Cumple AA" : "No cumple AA"}</span>
                <span className="f-muted d-meta">{c.size}</span>
              </li>
            ))}
          </ul>
          <p className="f-muted mt-3 max-w-[60ch] d-body">
            Calculado con la fórmula de WCAG sobre los mismos valores del sitio; el umbral AA para texto normal es
            4,5:1. Los tonos que no llegan no se usan para texto: quedan para filetes y fondos.
          </p>
        </div>

        <div className="mt-12">
          <Decisions
            items={[
              {
                title: "Sin color de marca",
                text: "La jerarquía se consigue con escala, espacio y posición. Un color corporativo pelearía con las fotos, que ya traen el suyo.",
              },
              {
                title: "Gris para el dato, negro para el nombre",
                text: "Lo que nombra va en negro; lo que informa baja a grafito. Así una lista se escanea sin leerla entera.",
              },
              {
                title: "El negro es un lugar, no un acento",
                text: "Aparece en bloques enteros, como el cierre de contacto, y en el borde que enmarca la hoja blanca. Nunca en un botón suelto.",
              },
              {
                title: "Seis tonos y ni uno más",
                text: "Dos extremos y cuatro neutros cálidos. Un gris nuevo que no esté en esta lista es un error, no una variante.",
              },
            ]}
          />
        </div>
      </Sheet>

      {/* 05 ------------------------------------------------------------------ */}
      <Sheet
        index={4}
        page={11}
        title="Doce columnas, un solo margen"
        intro="Una sola medida horizontal gobierna el sitio: sirve de margen lateral y de separación entre columnas. Cambiarla reencuadra toda la web de forma coherente."
      >
        <div className="relative">
          <div className="f-grid-demo grid h-48 grid-cols-4 gap-x-(--gutter) md:grid-cols-12">
            {Array.from({ length: grid.columns }, (_, i) => (
              <span key={i} className={i >= grid.columnsMobile ? "hidden md:block" : ""} />
            ))}
          </div>
          <div className="absolute inset-x-0 top-8 hidden grid-cols-12 gap-x-(--gutter) md:grid">
            <p className="f-hair f-muted col-span-3 border-t pt-2 d-label">Rótulo · {grid.label}</p>
            <p className="f-hair f-muted col-span-9 border-t pt-2 d-label">Contenido · {grid.content}</p>
          </div>
          <div className="f-muted mt-2 grid grid-cols-4 gap-x-(--gutter) d-label tabular-nums md:grid-cols-12">
            {Array.from({ length: grid.columns }, (_, i) => (
              <span key={i} className={i >= grid.columnsMobile ? "hidden md:block" : ""}>
                {String(i + 1).padStart(2, "0")}
              </span>
            ))}
          </div>
        </div>
        <p className="f-muted mt-6 d-meta">
          {grid.columns} columnas en escritorio, {grid.columnsMobile} en el celular. Margen y separación:{" "}
          <span className="tabular-nums">{grid.gutter}</span>.
        </p>

        <div className="mt-12">
          <Decisions
            items={[
              {
                title: "Rótulo + cuerpo",
                text: `El rótulo de sección va en las columnas ${grid.label} y el contenido en las ${grid.content}. Es el recurso del índice de catálogo: se sabe de qué habla la sección sin un título grande que compita.`,
              },
              {
                title: "Asimetría deliberada",
                text: "Los bloques ocupan anchos distintos y arrancan en columnas y alturas distintas. La grilla existe, pero no se ve: eso separa una maqueta de revista de una plantilla.",
              },
              {
                title: "Las imágenes pueden salirse",
                text: "Las fotos a sangre rompen el margen a propósito. El texto nunca: siempre queda dentro de la grilla.",
              },
              {
                title: "Espacios con tope",
                text: "Las separaciones no se estiran con la altura de la pantalla: en un monitor alto el bloque conserva su aire de página impresa.",
              },
            ]}
          />
        </div>
      </Sheet>

      {/* 06 ------------------------------------------------------------------ */}
      <Sheet
        index={5}
        page={12}
        title="Contenido y corte, alternados"
        intro="Cada cambio de sección tiene un borde. El ritmo alterna lo que se mira con lo que marca que algo terminó."
      >
        <Eyebrow>Tres maneras de cortar</Eyebrow>
        <div className="grid gap-x-(--gutter) gap-y-10 sm:grid-cols-3">
          <div>
            <div className="flex h-32 flex-col justify-start">
              <span className="h-px" style={{ background: "var(--foreground)" }} />
            </div>
            <p className="mt-3 d-lead">Línea</p>
            <p className="f-muted mt-1 d-meta">Negra, a ancho completo, con el título apoyado contra ella.</p>
          </div>
          <div>
            <div className="f-band h-32" />
            <p className="mt-3 d-lead">Banda</p>
            <p className="f-muted mt-1 d-meta">Niebla a ancho completo, para un respiro en medio del recorrido.</p>
          </div>
          <div>
            <div className="h-32" style={{ background: "var(--foreground)" }} />
            <p className="mt-3 d-lead">Bloque negro</p>
            <p className="f-muted mt-1 d-meta">El cierre final: el contacto al pie de las páginas.</p>
          </div>
        </div>

        <div className="mt-14">
          <Eyebrow>La regla de 4</Eyebrow>
          <ul className="grid grid-cols-2 gap-x-(--gutter) gap-y-8 md:grid-cols-4">
            {ruleOfFour.map((r) => (
              <li key={r.text} className="f-hair border-t pt-4">
                <p className="d-num tabular-nums">{r.n}</p>
                <p className="f-muted mt-3 d-meta">{r.text}</p>
              </li>
            ))}
          </ul>
          <p className="f-muted mt-8 max-w-[52ch] d-body">
            Nunca más de cuatro ítems por grupo visible. Con cuatro el ojo los cuenta sin leerlos; con más, empieza a
            comparar.
          </p>
        </div>

        <div className="mt-14">
          <Eyebrow>La secuencia de la home</Eyebrow>
          <ol className="grid grid-cols-2 gap-x-(--gutter) gap-y-6 md:grid-cols-5">
            {[
              { t: "Hero", d: "Obra a sangre y la marca" },
              { t: "Obras", d: `${figures.featured} destacadas` },
              { t: "Banda estudio", d: "Corte de niebla" },
              { t: "Índice", d: "Numerado, más «ver todas»" },
              { t: "Contacto", d: "Bloque negro, cierre" },
            ].map((s, i) => (
              <li key={s.t}>
                <div className={`f-rule h-10 border ${i === 2 ? "f-band" : ""}`} style={i === 4 ? { background: "var(--foreground)" } : undefined} />
                <p className="mt-2 d-meta">
                  <span className="f-muted tabular-nums">{num(i)} </span>
                  {s.t}
                </p>
                <p className="f-muted d-body">{s.d}</p>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-14">
          <Decisions
            items={[
              {
                title: "Lo más grande es lo más oscuro",
                text: "Tamaño y color empujan en la misma dirección. Si algo es grande y gris, o chico y negro, las palancas se contradicen y la jerarquía se pierde.",
              },
              {
                title: "Contraste de cuerpos, sin tamaños intermedios",
                text: "Una frase grande y el resto en texto corrido. El salto grande es el que le da carácter al bloque.",
              },
            ]}
          />
        </div>
      </Sheet>

      {/* 07 ------------------------------------------------------------------ */}
      <Sheet
        index={6}
        page={13}
        title="El «+» cose el sitio"
        intro="Berthet + Taranto: el signo que une los dos apellidos es lo único gráfico de la marca. En vez de dejarlo quieto en el logo, se reparte por todo el sitio."
      >
        <div className="grid gap-x-(--gutter) gap-y-6 md:grid-cols-3">
          <div className="f-band flex aspect-square items-center justify-center">
            <Plus thin className="d-title" />
          </div>
          <div className="relative flex aspect-square items-center justify-center">
            <div className="f-band relative h-3/5 w-3/5">
              <span className="ph-mark -top-1.5 -left-1.5" />
              <span className="ph-mark -top-1.5 -right-1.5" />
              <span className="ph-mark -bottom-1.5 -left-1.5" />
              <span className="ph-mark -bottom-1.5 -right-1.5" />
            </div>
          </div>
          <div className="f-rule flex aspect-square items-center justify-center border">
            <span className="group inline-flex cursor-default items-center gap-3 d-h3">
              <PlusLabel>Ver proyectos</PlusLabel>
            </span>
          </div>
        </div>
        <div className="f-muted mt-3 grid gap-x-(--gutter) gap-y-1 d-meta md:grid-cols-3">
          <p>Trazo fino a escala grande</p>
          <p>Marcas de corte en las esquinas</p>
          <p>Encabeza cada acción (pasá el cursor)</p>
        </div>

        <div className="mt-14">
          <Decisions
            items={[
              {
                title: "Siempre del color del texto",
                text: "Negro sobre blanco, blanco sobre negro. Nunca lleva color propio.",
              },
              {
                title: "Dos trazos que escalan",
                text: "Crece con el texto que lo acompaña. A tamaño grande el trazo se afina, con la proporción del «+» del logo.",
              },
              {
                title: "Reemplaza a la flecha",
                text: "«+ Empezar un proyecto», «+ Ver proyectos». En vez de «ir hacia», propone «sumar». Al pasar el cursor gira un cuarto de vuelta y se dibuja el subrayado.",
              },
              {
                title: "Abre y cierra el recorrido",
                text: "La intro arranca con una cruz a pantalla completa que se repliega hasta ser el «+» del logo. El cierre de contacto vuelve a dividir la pantalla con esa cruz.",
              },
            ]}
          />
        </div>
      </Sheet>

      {/* 08 ------------------------------------------------------------------ */}
      <Sheet
        index={7}
        page={14}
        title="El movimiento explica el recorrido"
        intro="Un vocabulario corto, el mismo en todas las páginas. Una página nueva no inventa cómo se mueve: usa lo que ya existe."
      >
        <Eyebrow>El vocabulario</Eyebrow>
        <ol className="f-hair border-t">
          {motionVocab.map((m) => (
            <li key={m.name} className="f-rule grid gap-x-(--gutter) gap-y-1 border-b py-5 md:grid-cols-9">
              <p className="d-lead md:col-span-3">{m.name}</p>
              <p className="f-muted d-body md:col-span-6">{m.text}</p>
            </li>
          ))}
        </ol>

        <div className="mt-14">
          <Decisions
            items={[
              {
                title: "Respeta a quien no quiere movimiento",
                text: respectsReducedMotion
                  ? "Si el visitante pidió reducir el movimiento en su equipo, no se anima nada y todo aparece en su lugar desde el primer momento."
                  : "Pendiente: hoy el código no consulta la preferencia de movimiento reducido del sistema.",
              },
              {
                title: "La intro se ve una vez",
                text: "Corre una sola vez por visita. Al volver a la home, la portada ya aparece armada: la segunda vez sería una demora, no un gesto.",
              },
              {
                title: "Hover solo con cursor",
                text: "La vista previa que sigue al cursor en el índice existe solo en computadoras. En celular y tablet no hay hover, así que no se simula.",
              },
              {
                title: "Nada se mueve porque sí",
                text: "Cada movimiento de la lista explica una relación entre dos cosas: de dónde viene una imagen, en qué orden se lee una frase. Si no explica nada, no va.",
              },
            ]}
          />
        </div>
      </Sheet>

      {/* 09 ------------------------------------------------------------------ */}
      <Sheet
        index={8}
        page={15}
        title="Escala fija, un solo corte"
        intro="El escritorio se diseña desde 1500 px y escala sin cambios hasta 768 px. Ahí la navegación se reduce a «Menú» y la grilla pasa a cuatro columnas."
      >
        <ul className="grid grid-cols-2 gap-x-(--gutter) gap-y-8 md:grid-cols-4">
          {breakpoints.map((b) => (
            <li key={b.px} className="f-hair border-t pt-4">
              <p className="d-num tabular-nums">{b.px}</p>
              <p className="f-muted mt-3 d-meta">{b.text}</p>
            </li>
          ))}
        </ul>

        <div className="mt-14">
          <Decisions
            items={[
              {
                title: "En el celular no se fija nada",
                text: "Lo que en escritorio se detiene, en el celular se lee en orden: rótulo, texto y obra, uno debajo del otro.",
              },
              {
                title: "No es «la misma web más angosta»",
                text: "El logo se reduce a la marca corta, la navegación entra en un menú y las composiciones asimétricas se enderezan en una sola columna.",
              },
              {
                title: "Se revisa en cuatro anchos",
                text: "1500, 1024, 768 y 390 px, antes de dar una página por terminada.",
              },
            ]}
          />
        </div>
      </Sheet>

      {/* 10 ------------------------------------------------------------------ */}
      <Sheet
        index={9}
        page={16}
        title="El sistema fuera de la pantalla"
        intro="Ejemplos de aplicación dibujados con los mismos tokens. Son para discutir el sistema: no son piezas aprobadas ni mandadas a imprenta."
      >
        <div className="grid grid-cols-1 gap-x-(--gutter) gap-y-12 sm:grid-cols-2">
          <Mock
            title="Portada del sitio, escritorio"
            ratio="16 / 10"
            shows="La marca sobre la obra, con el peso real de la tipografía en pantalla grande."
            wide
          >
            <div className="flex h-full flex-col">
              <div className="f-rule flex items-baseline justify-between border-b px-3 py-2">
                <span className="d-label">Berthet + Taranto</span>
                <span className="f-muted d-label">Estudio · Proyectos · Contacto</span>
              </div>
              <div className="f-block relative flex-1">
                <span className="f-muted absolute bottom-2 left-3 d-label">{sample.name} — foto de obra</span>
              </div>
              <p className="px-3 py-3 d-num">berthet + taranto</p>
            </div>
          </Mock>

          <Mock title="Portada, celular" ratio="9 / 16" shows="La misma jerarquía con la escala mínima y una sola columna.">
            <div className="flex h-full flex-col">
              <div className="f-rule flex items-baseline justify-between border-b px-2 py-1">
                <span className="d-label">B + T</span>
                <span className="f-muted d-label">Menú</span>
              </div>
              <div className="f-block flex-1" />
              <p className="px-2 py-2 d-h3">berthet + taranto</p>
            </div>
          </Mock>

          <Mock
            title="Ficha de obra"
            ratio="4 / 5"
            shows="Los cuatro datos fijos de cada obra; cuando el dato no existe, se muestra como pendiente."
          >
            <div className="flex h-full flex-col p-3">
              <p className="d-h3">{sample.name}</p>
              <dl className="mt-3 space-y-1">
                {sampleData.map((d) => (
                  <div key={d.label} className="flex justify-between gap-3">
                    <dt className="f-muted d-label">{d.label}</dt>
                    <dd className={d.value ? "d-meta" : "f-muted f-rule border-b border-dotted d-meta"}>
                      {d.value ?? "pendiente"}
                    </dd>
                  </div>
                ))}
              </dl>
              <div className="f-block mt-3 flex-1" />
            </div>
          </Mock>
        </div>
      </Sheet>

      <Sheet index={9} page={17} cont title="El sistema fuera de la pantalla">
        <div className="grid grid-cols-1 gap-x-(--gutter) gap-y-12 sm:grid-cols-2">
          <Mock
            title="Tarjeta personal, frente y dorso"
            ratio="17 / 6"
            shows="Los datos mínimos y el reverso en el tono de cierre del sitio."
            wide
          >
            <div className="grid h-full grid-cols-2">
              <div className="f-rule flex flex-col justify-between border-r p-3">
                <p className="d-meta">Berthet + Taranto Arquitectas</p>
                <div>
                  <p className="d-meta">{studio.partners[0].name}</p>
                  <p className="f-muted d-label">{studio.partners[0].role}</p>
                </div>
              </div>
              <div className="f-block flex flex-col justify-between p-3">
                <p className="d-label">Montevideo · desde {studio.founded}</p>
                <div className="d-label">
                  <p>{site.contact.address.street}</p>
                  <p>{site.contact.email}</p>
                  <p>{pendingPhone}</p>
                </div>
              </div>
            </div>
          </Mock>

          <Mock
            title="Hoja A4 con membrete"
            ratio="210 / 297"
            shows="El sistema en papel: rótulo arriba, cuerpo a 60 caracteres, datos al pie."
          >
            <div className="flex h-full flex-col p-3">
              <p className="d-label">Berthet + Taranto Arquitectas</p>
              <div className="f-rule mt-2 border-t pt-2">
                <p className="f-muted d-body">{studio.intro}</p>
              </div>
              <div className="flex-1" />
              <p className="f-muted f-rule border-t pt-1 d-label">
                {site.contact.address.street} · {site.contact.email} · {pendingPhone}
              </p>
            </div>
          </Mock>

          <Mock
            title="Posteo cuadrado"
            ratio="1 / 1"
            shows="Una obra por posteo, con el pie del sitio. El usuario de Instagram está pendiente."
          >
            <div className="flex h-full flex-col">
              <div className="f-block relative flex-1">
                <span className="f-muted absolute bottom-2 left-2 d-label">Foto de obra</span>
              </div>
              <div className="p-2">
                <p className="d-meta">{projects[1].name}</p>
                <p className="f-muted d-label">{projects[1].place}</p>
              </div>
            </div>
          </Mock>
        </div>
      </Sheet>

      {/* 11 ------------------------------------------------------------------ */}
      <Sheet
        index={10}
        page={18}
        title="Qué falta para publicar"
        intro="Lista de trabajo, no de reclamos. Sale de los pendientes anotados en el sistema de diseño y se actualiza sola."
      >
        <ul>
          {[
            { item: "Sistema tipográfico, paleta y grilla", done: true, need: "Nada: está decidido y aplicado." },
            { item: "Licencia de ABC Areal", done: false, need: "Definir licencia web, tope de visitas y uso impreso." },
            ...pending.map((p) => ({ item: p, done: false, need: "Material o confirmación del estudio." })),
          ].map((row) => (
            <li key={row.item} className="f-rule grid gap-x-(--gutter) gap-y-1 border-b py-4 md:grid-cols-12">
              <p className="d-meta md:col-span-6">{row.item}</p>
              <p className={`d-meta md:col-span-2 ${row.done ? "" : "f-muted"}`}>{row.done ? "Decidido" : "Pendiente"}</p>
              <p className="f-muted d-meta md:col-span-4">{row.need}</p>
            </li>
          ))}
        </ul>

      </Sheet>

      <Sheet index={10} page={19} cont title="Qué falta para publicar">
        <p className="f-muted mt-10 max-w-[60ch] d-body">
          Todos los valores de este documento se leen del código del sitio: los tamaños y los colores salen de los
          tokens, los números de obra del contenido cargado y esta lista de los pendientes anotados en el sistema. Si el
          sitio cambia, el documento cambia con él.
        </p>
        <p className="f-muted mt-6 d-meta">
          {version} · generado el {generated} ·{" "}
          <Link href="/" className="underline underline-offset-4">
            Volver al sitio
          </Link>
        </p>
      </Sheet>
    </Chrome>
  );
}
