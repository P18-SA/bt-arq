import Link from "next/link";
import type { CSSProperties } from "react";
import { featured, hero, heroPhoto, photo, projectHref, projects, studio } from "@/components/site/content";
import { Media } from "@/components/site/Media";
import { PlusLabel } from "@/components/site/Plus";
import { Word } from "@/components/site/Word";
import { wordmark } from "@/components/site/wordmark";

/**
 * Apertura: la banda negra arranca a pantalla completa (pantalla de carga: la cruz se abre y
 * se repliega en el "+", los nombres salen desde ahí) y después se cierra hacia arriba,
 * dejando el logo con márgenes mínimos. Va a sangre: se sale del card blanco.
 */
function HeroBand() {
  return (
    <div
      data-hero-band
      className="relative z-10 -mx-(--edge) flex flex-col overflow-hidden bg-ink text-paper"
    >
      <h1 className="sr-only">Berthet + Taranto Arquitectas</h1>

      <div
        data-hero-word
        aria-hidden="true"
        className="px-[calc(var(--gutter)+var(--edge))] pt-[clamp(0.2rem,0.5vw,0.6rem)] pb-[clamp(0.2rem,0.5vw,0.6rem)]"
      >
        <div className="flex items-center justify-between text-[8.6vw] leading-[0.8]">
          {/* Palabras en SVG; alto = altura de mayúscula de la tipografía (0.66em) */}
          <span className="flex justify-end overflow-hidden py-[0.06em]">
            <span data-name-left className="block">
              <Word svg={wordmark.berthet} height="0.66em" />
            </span>
          </span>
          <span data-plus className="relative mx-[0.06em] block size-[0.56em] shrink-0">
            <span data-plus-h className="absolute inset-x-0 top-[calc(50%-0.02em)] h-[0.04em] bg-current" />
            <span data-plus-v className="absolute inset-y-0 left-[calc(50%-0.02em)] w-[0.04em] bg-current" />
          </span>
          <span className="flex overflow-hidden py-[0.06em]">
            <span data-name-right className="block">
              {/* El viewBox de TARANTO incluye el sobrepaso de la O: 159 unidades contra 154 de mayúscula */}
              <Word svg={wordmark.taranto} height={`${(0.66 * wordmark.taranto.h) / 154}em`} />
            </span>
          </span>
        </div>
      </div>

      {/* Datos de carga: arriba de la pantalla negra, en la línea del nav; se van cuando la banda se cierra */}
      <div
        data-hero-meta
        aria-hidden="true"
        className="absolute inset-x-0 top-0 flex items-start justify-between gap-6 px-[calc(var(--gutter)+var(--edge))] pt-[calc(env(safe-area-inset-top,0px)+1.1rem)] text-[clamp(1rem,1.15vw,1.25rem)] leading-[1.15]"
      >
        <p className="text-paper/70">
          Estudio de arquitectura
          <br />
          <span className="text-paper">Berthet + Taranto</span>
        </p>
        <p className="hidden text-paper/70 sm:block">
          Montevideo
          <br />
          <span className="text-paper">Uruguay</span>
        </p>
        <p className="text-right text-paper/70">
          Cargando
          <br />
          <span className="tabular-nums text-paper">
            <span data-hero-count>0</span>%
          </span>
        </p>
      </div>
    </div>
  );
}

export function Hero() {
  return (
    // El card solo existe acá y en el cierre: el negro asoma a los costados mientras dura la apertura
    <section
      id="inicio"
      data-hero
      // AJUSTE A MANO — ancho del negro a cada costado del card (marco del hero).
      // Pisa el --edge global solo dentro del hero: lo usan el card, la banda y las tiras negras.
      //   clamp(<mínimo en pantalla chica>, <proporcional al ancho>, <máximo en pantalla grande>)
      //   más grande = más negro al costado · más chico = el blanco llega más al borde
      style={{ "--edge": "clamp(16px, 1.8vw, 34px)" } as CSSProperties}
      className="relative mx-(--edge) flex h-svh flex-col bg-paper"
    >
      {/* El negro de la banda baja por los costados del card: es un solo fondo con el lettering.
          Al abrirse, los márgenes del card van a 0 y las tiras quedan fuera de pantalla. */}
      <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 -left-(--edge) w-(--edge) bg-ink" />
      <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 -right-(--edge) w-(--edge) bg-ink" />

      <HeroBand />

      <div data-hero-stage className="relative min-h-0 flex-1 overflow-hidden">
        {/*
          AJUSTE A MANO — medida de la tira ANTES de abrirse con el scroll.
          Apoyada en el borde inferior del hero: al scrollear crece hasta ocupar toda la ventana.
          De cada par manda el valor más chico, así no se desborda ni en pantallas anchas ni bajas:
            width  = min(<A>svh, <B>vw) → A/B más grandes = tira MÁS ANCHA
            height = min(<C>svh, <D>vw) → C/D más grandes = tira MÁS ALTA
          Para que quede más apaisada, subí solo los del width.
        */}
        <div
          data-hero-frame
          className="absolute bottom-0 left-1/2 -translate-x-1/2 overflow-hidden"
          style={{ width: "min(80svh, 49vw)", height: "min(58svh, 44vw)" }}
        >
          <Media
            src={heroPhoto}
            tone="shadow"
            label={`${hero.name}, ${hero.place}`}
            preload
            className="h-full w-full"
          />
          <div
            data-hero-caption
            className="absolute inset-x-0 bottom-0 flex items-end gap-4 px-[clamp(0.9rem,2vw,2.5rem)] pb-[clamp(0.9rem,2vw,2.5rem)] text-white"
          >
            <p className="text-lead">{hero.name}</p>
          </div>
        </div>

        <p
          data-hero-hint
          className="absolute bottom-[calc(env(safe-area-inset-bottom,0px)+1.25rem)] left-(--gutter) text-label text-graphite"
        >
          [Deslizá para entrar]
        </p>
      </div>
    </section>
  );
}

const featuredLayout = [
  "md:col-span-7",
  "md:col-span-4 md:col-start-9 md:mt-[34vh]",
  "md:col-span-6 md:col-start-2 md:mt-[6vh]",
  "md:col-span-4 md:col-start-9 md:mt-[28vh]",
];

export function Featured() {
  return (
    <section id="proyectos" className="px-(--gutter) pt-[10vh] pb-[18vh]">
      <div className="mb-[10vh] flex items-baseline justify-between gap-6 border-t border-ink pt-5">
        <h2 className="text-heading">
          Proyectos seleccionados <span className="text-graphite">(04)</span>
        </h2>
        <a href="#indice" className="link-draw shrink-0 pb-0.5 text-meta">
          Ver todos
        </a>
      </div>

      <div className="grid grid-cols-1 gap-x-(--gutter) gap-y-[12vh] md:grid-cols-12">
        {featured.map(({ project: p, ratio }, i) => (
          <article key={p.name} data-reveal className={featuredLayout[i]}>
            <Link href={projectHref(p)} className="group block">
              <Media
                src={photo(p)}
                tone={p.tone}
                label={`${p.name}, ${p.place}`}
                sizes="(min-width: 768px) 55vw, 100vw"
                ratio={ratio}
                bleed="y"
                speed="auto"
                marks
              />
              <div className="mt-4 flex items-baseline justify-between gap-4">
                <h3 className="overflow-hidden text-lead">
                  <span data-reveal-line className="link-draw block w-fit pb-0.5">
                    {p.name}
                  </span>
                </h3>
                <p className="overflow-hidden text-meta text-graphite">
                  <span data-reveal-line className="block">
                    {p.place.split(",")[0]}
                  </span>
                </p>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}

const indexed = projects.slice(0, 8);

export function ProjectIndex() {
  return (
    <section id="indice" className="mx-(--edge) bg-paper px-(--gutter) pt-[18vh] pb-[20vh]">
      <div className="mb-10 flex items-baseline justify-between gap-6">
        <h2 className="text-heading">
          Todos los proyectos <span className="text-graphite tabular-nums">({projects.length})</span>
        </h2>
      </div>

      <div className="hidden grid-cols-12 gap-x-(--gutter) border-b border-ink/15 pb-3 text-label text-graphite md:grid">
        <span className="col-span-1">N.º</span>
        <span className="col-span-6">Proyecto</span>
        <span className="col-span-2">Programa</span>
        <span className="col-span-3 text-right">Lugar</span>
      </div>

      <ul data-index-list>
        {indexed.map((p, i) => (
          <li
            key={p.name}
            data-row
            data-row-index={i}
            className="border-b border-ink/15 transition-opacity duration-500"
          >
            <Link
              href={projectHref(p)}
              className="grid grid-cols-12 items-baseline gap-x-(--gutter) py-[clamp(0.9rem,2.2vh,1.5rem)]"
            >
              <span className="col-span-2 text-meta text-graphite tabular-nums md:col-span-1">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span
                data-row-name
                className="col-span-10 text-subheading transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] md:col-span-6"
              >
                {p.name}
              </span>
              <span className="col-span-2 hidden text-meta text-graphite md:block">{p.program}</span>
              <span className="col-span-3 hidden text-right text-meta text-graphite md:block">{p.place}</span>
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-10 flex justify-end">
        <Link
          href="/todos-los-proyectos"
          className="group inline-flex items-center gap-3 text-subheading"
        >
          <PlusLabel>Ver los {projects.length}</PlusLabel>
        </Link>
      </div>
    </section>
  );
}

/** Vista previa que sigue al cursor en el índice. Va fuera del contenedor con scroll suave. */
export function IndexPreview() {
  return (
    <div
      data-index-preview
      aria-hidden="true"
      className="pointer-events-none invisible fixed top-0 left-0 z-40 hidden h-[clamp(10rem,16vw,14rem)] w-[clamp(14rem,23vw,20rem)] overflow-hidden [@media(hover:hover)_and_(pointer:fine)]:block"
    >
      {indexed.map((p, i) => (
        <div
          key={p.name}
          data-index-item
          data-item-index={i}
          className="absolute inset-0 overflow-hidden will-change-[clip-path]"
        >
          <Media

            src={photo(p)}
            tone={p.tone}
            label=""
            sizes="24vw"
            className="absolute inset-0 h-full w-full will-change-transform"
          />
        </div>
      ))}
    </div>
  );
}

/**
 * Corte duro entre las obras y el índice (TIWD: "crear el borde de la página"): banda de ancho completo
 * con el estudio en una frase y los datos que la sostienen.
 */
export function StudioBreak() {
  const facts = [
    ["Desde", studio.founded],
    ["Obras publicadas", String(projects.length)],
    ["Con base en", "Montevideo"],
  ];
  return (
    <section id="estudio" className="bg-fog px-(--gutter) py-[16vh]">
      <div className="grid grid-cols-12 gap-x-(--gutter) gap-y-10">
        <p className="col-span-12 text-label text-graphite md:col-span-3">(Estudio)</p>
        <div className="col-span-12 md:col-span-9">
          <p data-statement className="max-w-[22ch] text-heading text-balance">
            {studio.statement}
          </p>
          <dl className="mt-[10vh] grid grid-cols-3 gap-x-(--gutter) border-t border-ink/15 pt-5">
            {facts.map(([term, value]) => (
              <div key={term}>
                <dt className="text-label text-graphite">{term}</dt>
                <dd className="mt-2 text-subheading tabular-nums">{value}</dd>
              </div>
            ))}
          </dl>
          <Link href="/estudio" className="group mt-[8vh] inline-flex items-center gap-3 text-lead">
            <PlusLabel>Conocé el estudio</PlusLabel>
          </Link>
        </div>
      </div>
    </section>
  );
}
