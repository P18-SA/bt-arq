import type { Metadata } from "next";
import type { CSSProperties, ReactNode } from "react";
import { GuidelineIndex } from "@/components/guideline/GuidelineIndex";
import { nav, programs, work } from "@/components/site/content";
import { Plus, PlusLabel } from "@/components/site/Plus";

/**
 * Guía de diseño: las decisiones generales del sitio y sus razones, contadas en lenguaje de diseño
 * (sin nombres de archivos ni de código). Página interna: ningún enlace del sitio lleva acá y no se
 * indexa. Sin Shell: no tiene header ni scroll suave, así el índice puede quedar fijo con sticky.
 */
export const metadata: Metadata = {
  title: "Guía de diseño",
  description: "Decisiones generales de diseño del sitio de Berthet + Taranto y las razones detrás de cada una.",
  robots: { index: false, follow: false },
};

const sections = [
  { id: "principio", label: "Principio" },
  { id: "tipografia", label: "Tipografía" },
  { id: "color", label: "Color" },
  { id: "grilla", label: "Grilla" },
  { id: "ritmo", label: "Jerarquía y ritmo" },
  { id: "signo", label: "El signo +" },
  { id: "movimiento", label: "Movimiento" },
  { id: "responsive", label: "Responsive" },
];

const numeral = (id: string) => String(sections.findIndex((s) => s.id === id) + 1).padStart(2, "0");

/* ------------------------------------------------------------------ Tipografía */

/** Pesos del eje variable, ubicados en su posición real entre 400 y 700. */
const weights = [
  { value: 400, use: "Títulos, frases y textos grandes" },
  { value: 450, use: "Texto corrido" },
  { value: 500, use: "Datos y etiquetas" },
  { value: 700, use: "Disponible, no se usa", off: true },
];

type Role = {
  where: string;
  note: string;
  size: string;
  leading: string;
  tracking?: string;
  weight: string;
  sample: ReactNode;
};

const roles: Role[] = [
  {
    where: "Títulos de página",
    note: "Uno por página, como mucho.",
    size: "44–120",
    leading: "0.9",
    tracking: "−0.035em",
    weight: "400",
    sample: <p className="text-display">Título</p>,
  },
  {
    where: "Nombres",
    note: "Obras, listados y menú.",
    size: "36–80",
    leading: "0.96",
    tracking: "−0.03em",
    weight: "400",
    sample: <p className="text-title">Casa patio</p>,
  },
  {
    where: "Frases",
    note: "Títulos de sección y frases de marca.",
    size: "28–64",
    leading: "1.05",
    tracking: "−0.015em",
    weight: "400",
    sample: <p className="text-heading">Una sola idea</p>,
  },
  {
    where: "Subtítulos",
    note: "Índices, equipo y acciones con «+».",
    size: "18–26",
    leading: "1.15",
    tracking: "−0.01em",
    weight: "400",
    sample: (
      <p className="flex gap-4 text-subheading">
        <span className="tabular-nums text-graphite">01</span>
        Casa en la sierra
      </p>
    ),
  },
  {
    where: "Introducciones",
    note: "Bajadas, nombres en tarjetas y filtros.",
    size: "17–20",
    leading: "1.3",
    weight: "400",
    sample: <p className="max-w-[38ch] text-lead">Una bajada breve que presenta la página en dos líneas.</p>,
  },
  {
    where: "Textos",
    note: "Texto corrido, hasta 60 caracteres por línea.",
    size: "16",
    leading: "1.6",
    weight: "450",
    sample: (
      <p className="max-w-[48ch] text-body text-graphite">
        Un párrafo que cuenta una obra con calma, a lo largo de varias líneas, sin apurar la lectura.
      </p>
    ),
  },
  {
    where: "Datos",
    note: "Programa, lugar y enlaces chicos.",
    size: "14",
    leading: "1.4",
    weight: "500",
    sample: (
      <p className="flex flex-wrap gap-x-6 text-meta">
        <span>Obra nueva</span>
        <span className="text-graphite">Maldonado</span>
        <span className="text-graphite tabular-nums">240 m²</span>
      </p>
    ),
  },
  {
    where: "Etiquetas",
    note: "Rótulos y encabezados. Las únicas en mayúscula.",
    size: "12",
    leading: "1.3",
    tracking: "0.02em",
    weight: "500",
    sample: (
      <p className="flex flex-wrap gap-x-6 text-label text-graphite">
        <span className="uppercase">Rótulo</span>
        <span>(Sección)</span>
        <span className="tabular-nums">(12 fotos)</span>
      </p>
    ),
  },
];

/* ------------------------------------------------------------------ Color */

const palette = [
  { name: "Blanco", hex: "#ffffff", bg: "bg-paper", ink: "text-ink", use: "El papel: la hoja sobre la que vive todo el contenido." },
  { name: "Niebla", hex: "#ebeae6", bg: "bg-fog", ink: "text-ink", use: "Bandas de corte a ancho completo, para un respiro en el recorrido." },
  { name: "Grafito", hex: "#5e5d59", bg: "bg-graphite", ink: "text-paper", use: "Lo que informa: datos, etiquetas y texto corrido." },
  { name: "Negro", hex: "#000000", bg: "bg-ink", ink: "text-paper", use: "Lo que nombra, y los bloques de cierre." },
];

/* ------------------------------------------------------------------ Piezas */

type Decision = { title: string; text: ReactNode };

function Decisions({ items }: { items: Decision[] }) {
  return (
    <dl className="grid gap-x-(--gutter) sm:grid-cols-2">
      {items.map((item) => (
        <div key={item.title} className="border-t border-concrete pt-4 pb-10">
          <dt className="text-lead">{item.title}</dt>
          <dd className="mt-3 max-w-[46ch] text-body text-graphite">{item.text}</dd>
        </div>
      ))}
    </dl>
  );
}

function Section({ id, title, intro, children }: { id: string; title: string; intro: ReactNode; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-8 pb-[clamp(6rem,14vh,10rem)]">
      <header className="flex items-baseline justify-between gap-6 border-t border-ink pt-5">
        <h2 id={`${id}-title`} className="text-heading">
          {title}
        </h2>
        <span className="text-label text-graphite tabular-nums">({numeral(id)})</span>
      </header>
      <p className="mt-8 mb-16 max-w-[40ch] text-lead">{intro}</p>
      {children}
    </section>
  );
}

/** Subtítulo interno de una sección: etiqueta en mayúscula, como las de la web. */
function Eyebrow({ children }: { children: ReactNode }) {
  return <h3 className="mb-6 text-label text-graphite uppercase">{children}</h3>;
}

export default function DesignGuideline() {
  return (
    <div className="min-h-svh bg-paper text-ink">
      <div className="grid grid-cols-4 gap-x-(--gutter) px-(--gutter) md:grid-cols-12">
        {/* Índice: arriba en mobile, fijo a la izquierda en escritorio */}
        <aside className="col-span-4 pt-10 md:col-span-3 md:sticky md:top-0 md:h-svh md:self-start md:py-10">
          <GuidelineIndex items={sections} />
        </aside>

        <main className="col-span-4 md:col-span-9">
          <header className="pt-[16vh] pb-[clamp(6rem,14vh,10rem)]">
            <p className="text-label text-graphite uppercase">Berthet + Taranto · Documento interno</p>
            <h1 className="mt-6 text-display">Guía de diseño</h1>
            <p className="mt-8 max-w-[40ch] text-lead">
              Las decisiones generales del sitio y por qué se tomaron. No describe páginas: describe el sistema del que salen
              todas.
            </p>
          </header>

          {/* ------------------------------------------------------------ 01 */}
          <Section
            id="principio"
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
          </Section>

          {/* ------------------------------------------------------------ 02 */}
          <Section
            id="tipografia"
            title="Una sola familia, un rol por estilo"
            intro="No se agrega otra fuente sin un rol nuevo y justificado. La jerarquía la da el tamaño, no la mezcla de familias."
          >
            {/* Presentación de la familia: el nombre y su eje de peso */}
            <div className="bg-fog px-(--gutter) pt-[clamp(3rem,8vh,5rem)] pb-12">
              <div className="flex items-baseline justify-between gap-6 text-label text-graphite">
                <p className="uppercase">La familia</p>
                <p>(Dinamo)</p>
              </div>
              <p className="mt-6 text-display">ABC Areal</p>
              <p className="mt-8 max-w-[44ch] text-body text-graphite">
                Una sola familia sin serifa para todo el sitio. En tamaños grandes se parece a la rotulación de un plano, que es el
                registro que buscábamos.
              </p>

              {/* Eje de peso, de 400 a 700: cada marca en su lugar real del eje */}
              <div className="mt-16">
                <p className="mb-6 text-label text-graphite uppercase">Eje de peso</p>
                <div className="relative grid grid-cols-2 gap-y-8 md:block md:h-28 md:border-t md:border-ink">
                  {weights.map((w) => (
                    <div
                      key={w.value}
                      style={{ "--x": `${((w.value - 400) / 300) * 100}%` } as CSSProperties}
                      className={`md:absolute md:top-0 md:left-(--x) ${w.value === 700 ? "md:-translate-x-full md:text-right" : ""} ${w.off ? "text-graphite" : ""}`}
                    >
                      <span
                        aria-hidden="true"
                        className={`hidden h-3 w-px -translate-y-1/2 md:block ${w.value === 700 ? "ml-auto" : ""} ${w.off ? "bg-graphite" : "bg-ink"}`}
                      />
                      <p className="text-subheading tabular-nums md:mt-3" style={{ fontWeight: w.value }}>
                        {w.value}
                      </p>
                      <p className="mt-1 max-w-[18ch] text-meta text-graphite">{w.use}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Tabla de roles: una fila por uso, con la muestra y sus medidas */}
            <div className="mt-20">
              <div className="hidden grid-cols-12 gap-x-(--gutter) border-b border-ink pb-3 text-label text-graphite uppercase md:grid">
                <span className="col-span-3">Dónde se aplica</span>
                <span className="col-span-5">Ejemplo</span>
                <span>Tamaño</span>
                <span>Interl.</span>
                <span>Espaciado</span>
                <span>Peso</span>
              </div>
              <ol>
                {roles.map((role) => (
                  <li
                    key={role.where}
                    className="grid grid-cols-4 items-center gap-x-(--gutter) gap-y-3 border-b border-concrete py-5 md:grid-cols-12"
                  >
                    <div className="col-span-4 md:col-span-3">
                      <p className="text-meta">{role.where}</p>
                      <p className="mt-0.5 text-label text-graphite">{role.note}</p>
                    </div>
                    <div className="col-span-4 overflow-hidden md:col-span-5">{role.sample}</div>
                    <dl className="col-span-4 grid grid-cols-4 gap-x-(--gutter) text-label text-graphite tabular-nums md:contents">
                      <div>
                        <dt className="md:sr-only">Tamaño</dt>
                        <dd>{role.size} px</dd>
                      </div>
                      <div>
                        <dt className="md:sr-only">Interlineado</dt>
                        <dd>{role.leading}</dd>
                      </div>
                      <div>
                        <dt className="md:sr-only">Espaciado</dt>
                        <dd>{role.tracking ?? "—"}</dd>
                      </div>
                      <div>
                        <dt className="md:sr-only">Peso</dt>
                        <dd>{role.weight}</dd>
                      </div>
                    </dl>
                  </li>
                ))}
              </ol>
              <p className="mt-4 text-label text-graphite">
                Los tamaños con dos valores crecen con la pantalla y se detienen en el mayor.
              </p>
            </div>

            <div className="mt-24">
              <Eyebrow>Por qué así</Eyebrow>
              <Decisions
                items={[
                  {
                    title: "Sin light ni negritas",
                    text: "No existe peso light. Tampoco hay negritas en el contenido: si algo tiene que pesar más, crece de tamaño.",
                  },
                  {
                    title: "Los chicos van más negros",
                    text: "Los textos grandes van en 400; el texto corrido en 450 y los datos y etiquetas en 500. En tamaño chico el regular se deshilacha y pierde el carácter editorial.",
                  },
                  {
                    title: "El interlineado baja cuando sube el tamaño",
                    text: "De 1.6 en el texto corrido a 0.9 en los títulos, y el espaciado entre letras se cierra en la misma dirección. Los títulos se leen como un bloque; el texto respira.",
                  },
                  {
                    title: "Mayúsculas solo en etiquetas",
                    text: "Rótulos y encabezados. Los textos grandes van siempre en minúscula: el tamaño ya los distingue.",
                  },
                  {
                    title: "Paréntesis y numerales",
                    text: "La información secundaria va entre paréntesis sin cambiar de color: (Estudio), (04), (11 fotos). Los índices se numeran 01, 02, 03 con cifras del mismo ancho.",
                  },
                  {
                    title: "Escala fluida con tope",
                    text: "Cada estilo crece con la pantalla y se detiene. Los textos chicos y la navegación no crecen sin límite en monitores grandes.",
                  },
                ]}
              />
            </div>
          </Section>

          {/* ------------------------------------------------------------ 03 */}
          <Section
            id="color"
            title="Blanco, negro y grises de obra"
            intro="Neutros cálidos y ningún acento. En un portfolio de arquitectura el color lo ponen las fotos: madera, hormigón, cielo, vegetación."
          >
            <div className="grid grid-cols-2 gap-x-(--gutter) gap-y-10 md:grid-cols-4">
              {palette.map((c) => (
                <div key={c.name}>
                  <div className={`flex aspect-[4/5] items-end p-4 ${c.bg} ${c.ink} ${c.bg === "bg-paper" ? "border border-concrete" : ""}`}>
                    <p className="text-meta tabular-nums">{c.hex}</p>
                  </div>
                  <p className="mt-3 text-lead">{c.name}</p>
                  <p className="mt-1 max-w-[30ch] text-meta text-graphite">{c.use}</p>
                </div>
              ))}
            </div>

            <div className="mt-24">
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
                ]}
              />
            </div>
          </Section>

          {/* ------------------------------------------------------------ 04 */}
          <Section
            id="grilla"
            title="Doce columnas, un solo margen"
            intro="Una sola medida horizontal gobierna el sitio: sirve de margen lateral y de separación entre columnas. Cambiarla reencuadra toda la web de forma coherente."
          >
            <div className="relative">
              <div className="grid h-48 grid-cols-4 gap-x-(--gutter) md:grid-cols-12">
                {Array.from({ length: 12 }, (_, i) => (
                  <div key={i} className={`bg-fog ${i >= 4 ? "hidden md:block" : ""}`} />
                ))}
              </div>
              {/* Patrón rótulo + cuerpo, superpuesto a la grilla */}
              <div className="absolute inset-x-0 top-8 hidden grid-cols-12 gap-x-(--gutter) md:grid">
                <p className="col-span-3 border-t border-ink pt-2 text-label text-graphite uppercase">Rótulo · 1–3</p>
                <p className="col-span-9 border-t border-ink pt-2 text-label text-graphite uppercase">Contenido · 4–12</p>
              </div>
              <div className="mt-2 grid grid-cols-4 gap-x-(--gutter) text-label text-graphite tabular-nums md:grid-cols-12">
                {Array.from({ length: 12 }, (_, i) => (
                  <span key={i} className={i >= 4 ? "hidden md:block" : ""}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                ))}
              </div>
            </div>
            <p className="mt-6 text-meta text-graphite">12 columnas en escritorio, 4 en el celular.</p>

            <div className="mt-24">
              <Decisions
                items={[
                  {
                    title: "Rótulo + cuerpo",
                    text: "El rótulo de sección va en las columnas 1–3 y el contenido en las 4–12. Es el recurso del índice de catálogo: se sabe de qué habla la sección sin un título grande que compita.",
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
          </Section>

          {/* ------------------------------------------------------------ 05 */}
          <Section
            id="ritmo"
            title="Contenido y corte, alternados"
            intro="Cada cambio de sección tiene un borde. El ritmo alterna lo que se mira con lo que marca que algo terminó."
          >
            <Eyebrow>Tres maneras de cortar</Eyebrow>
            <div className="grid gap-x-(--gutter) gap-y-10 sm:grid-cols-3">
              <div>
                <div className="flex h-32 flex-col justify-start">
                  <span className="h-px bg-ink" />
                </div>
                <p className="mt-3 text-lead">Línea</p>
                <p className="mt-1 text-meta text-graphite">Negra, a ancho completo, con el título apoyado contra ella.</p>
              </div>
              <div>
                <div className="h-32 bg-fog" />
                <p className="mt-3 text-lead">Banda</p>
                <p className="mt-1 text-meta text-graphite">Niebla a ancho completo, para un respiro en medio del recorrido.</p>
              </div>
              <div>
                <div className="h-32 bg-ink" />
                <p className="mt-3 text-lead">Bloque negro</p>
                <p className="mt-1 text-meta text-graphite">El cierre final: el contacto al pie de las páginas.</p>
              </div>
            </div>

            <div className="mt-24">
              <Eyebrow>La regla de 4</Eyebrow>
              <ul className="grid grid-cols-2 gap-x-(--gutter) gap-y-8 md:grid-cols-4">
                {[
                  ["4", "proyectos destacados en la home"],
                  [String(nav.length), "ítems en la navegación"],
                  [`${programs.length} + 1`, "filtros más «Todos»"],
                  [String(work.steps.length), "etapas en Cómo trabajamos"],
                ].map(([n, text]) => (
                  <li key={text} className="border-t border-ink pt-4">
                    <p className="text-title tabular-nums">{n}</p>
                    <p className="mt-3 text-meta text-graphite">{text}</p>
                  </li>
                ))}
              </ul>
              <p className="mt-8 max-w-[52ch] text-body text-graphite">
                Nunca más de cuatro ítems por grupo visible. Con cuatro el ojo los cuenta sin leerlos; con más, empieza a comparar.
              </p>
            </div>

            <div className="mt-24">
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
          </Section>

          {/* ------------------------------------------------------------ 06 */}
          <Section
            id="signo"
            title="El «+» cose el sitio"
            intro="Berthet + Taranto: el signo que une los dos apellidos es lo único gráfico de la marca. En vez de dejarlo quieto en el logo, se reparte por todo el sitio."
          >
            <div className="grid gap-x-(--gutter) gap-y-12 md:grid-cols-9">
              <div className="flex aspect-square items-center justify-center bg-fog md:col-span-3">
                <Plus thin className="text-display" />
              </div>
              <div className="relative flex aspect-square items-center justify-center md:col-span-3">
                <div className="relative h-3/5 w-3/5 bg-fog">
                  <span className="ph-mark -top-1.5 -left-1.5" />
                  <span className="ph-mark -top-1.5 -right-1.5" />
                  <span className="ph-mark -bottom-1.5 -left-1.5" />
                  <span className="ph-mark -bottom-1.5 -right-1.5" />
                </div>
              </div>
              <div className="flex aspect-square items-center justify-center border border-concrete md:col-span-3">
                <span className="group inline-flex cursor-default items-center gap-3 text-subheading">
                  <PlusLabel>Ver proyectos</PlusLabel>
                </span>
              </div>
            </div>
            <div className="mt-3 grid gap-x-(--gutter) text-meta text-graphite md:grid-cols-9">
              <p className="md:col-span-3">Trazo fino a escala grande</p>
              <p className="md:col-span-3">Marcas de corte en las esquinas</p>
              <p className="md:col-span-3">Encabeza cada acción (pasá el cursor)</p>
            </div>

            <div className="mt-24">
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
          </Section>

          {/* ------------------------------------------------------------ 07 */}
          <Section
            id="movimiento"
            title="El movimiento explica el recorrido"
            intro="Un vocabulario corto, el mismo en todas las páginas. Una página nueva no inventa cómo se mueve: usa lo que ya existe."
          >
            <Eyebrow>El vocabulario</Eyebrow>
            <ol className="border-t border-ink">
              {[
                ["Revelado", "La foto se descubre de abajo hacia arriba y las marcas «+» aparecen en las esquinas."],
                ["Título que sube", "El título de página sube línea por línea, como si ya existiera fuera de cuadro."],
                ["Frase que se enciende", "Palabra por palabra, al ritmo del scroll. Obliga a leerla despacio."],
                ["Trazado", "Los «+» grandes se dibujan: primero el trazo horizontal, después el vertical."],
                ["Texto que se fija", "En Cómo trabajamos las obras se quedan quietas y es el texto el que se detiene."],
                ["Letras que giran", "En los enlaces grandes, las letras giran hacia arriba al pasar el cursor."],
              ].map(([name, text]) => (
                <li key={name} className="grid gap-x-(--gutter) gap-y-1 border-b border-concrete py-5 md:grid-cols-9">
                  <p className="text-lead md:col-span-3">{name}</p>
                  <p className="text-body text-graphite md:col-span-6">{text}</p>
                </li>
              ))}
            </ol>

            <div className="mt-24">
              <Decisions
                items={[
                  {
                    title: "Respeta a quien no quiere movimiento",
                    text: "Si el visitante pidió reducir el movimiento en su equipo, no se anima nada y todo aparece en su lugar desde el primer momento.",
                  },
                  {
                    title: "Scroll suave, con freno",
                    text: "Por más fuerte que se tire de la rueda, la página no se adelanta: un golpe de trackpad no saltea secciones ni sus animaciones. Si se cambia de dirección, el giro es inmediato.",
                  },
                  {
                    title: "La intro se ve una vez",
                    text: "Corre una sola vez por visita. Al volver a la home, la portada ya aparece armada: la segunda vez sería una demora, no un gesto.",
                  },
                  {
                    title: "Hover solo con cursor",
                    text: "La vista previa que sigue al cursor en el índice existe solo en computadoras. En celular y tablet no hay hover, así que no se simula.",
                  },
                ]}
              />
            </div>
          </Section>

          {/* ------------------------------------------------------------ 08 */}
          <Section
            id="responsive"
            title="Escala fija, un solo corte"
            intro="El escritorio se diseña desde 1500 px y escala sin cambios hasta 768 px. Ahí la navegación se reduce a «Menú» y la grilla pasa a cuatro columnas."
          >
            <ul className="grid grid-cols-2 gap-x-(--gutter) gap-y-8 md:grid-cols-4">
              {[
                ["1500", "Diseño de escritorio"],
                ["1024", "Escala, sin cambios de composición"],
                ["768", "La navegación pasa a «Menú»; de 12 a 4 columnas"],
                ["390", "Celular: todo en una columna"],
              ].map(([px, text]) => (
                <li key={px} className="border-t border-ink pt-4">
                  <p className="text-title tabular-nums">{px}</p>
                  <p className="mt-3 text-meta text-graphite">{text}</p>
                </li>
              ))}
            </ul>
            <div className="mt-24">
              <Decisions
                items={[
                  {
                    title: "En el celular no se fija nada",
                    text: "Lo que en escritorio se detiene, en el celular se lee en orden: rótulo, texto y obra, uno debajo del otro.",
                  },
                  {
                    title: "Se revisa en cuatro anchos",
                    text: "1500, 1024, 768 y 390 px, antes de dar una página por terminada.",
                  },
                ]}
              />
            </div>
          </Section>

          <div className="pb-[40vh]" />
        </main>
      </div>
    </div>
  );
}
