import Link from "next/link";
import { featured, projectHref, projects, VILLA } from "@/components/site/content";
import { Media } from "@/components/site/Media";
import { PlusLabel } from "@/components/site/Plus";
import { Word } from "@/components/site/Word";
import { wordmark } from "@/components/site/wordmark";

/** Logo del hero. Se dibuja dos veces: negro sobre el blanco y blanco dentro de la foto. */
function HeroWordmark({ inverted = false }: { inverted?: boolean }) {
  return (
    <div
      data-hero-block
      aria-hidden={inverted || undefined}
      className={`pointer-events-none absolute inset-0 ${inverted ? "text-paper" : "text-ink"}`}
    >
      <div data-hero-intro className="absolute inset-x-0 top-1/2 -translate-y-1/2 px-(--gutter)">
        {/* El h1 va solo en la copia principal; la copia blanca es decorativa */}
        {inverted ? null : <h1 className="sr-only">Berthet + Taranto Arquitectas</h1>}
        <div
          aria-hidden="true"
          className="grid grid-cols-[1fr_auto_1fr] items-center text-[clamp(2rem,7.4vw,10rem)] leading-[0.8]"
        >
          {/* Palabras en SVG (public/BERTHET.svg, etc.); alto = altura de mayúscula de Work Sans (0.66em) */}
          <span className="flex justify-end overflow-hidden py-[0.06em]">
            <span data-name-left className="block">
              <Word svg={wordmark.berthet} height="0.66em" />
            </span>
          </span>
          <span data-plus className="relative mx-[0.15em] block size-[0.62em]">
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
        <p
          aria-hidden="true"
          data-hero-sub
          className="absolute inset-x-0 top-full mt-[clamp(0.6rem,2vw,2rem)] flex justify-center overflow-hidden text-[clamp(0.85rem,2.3vw,3rem)]"
        >
          {/* 124 unidades de caja, 102.5 de mayúscula (la Q baja) */}
          <Word svg={wordmark.arquitectas} height={`${(0.66 * wordmark.arquitectas.h) / 102.5}em`} />
        </p>
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <section id="inicio" data-hero className="relative h-svh overflow-hidden bg-paper">
      <HeroWordmark />

      <div data-hero-media className="absolute inset-0">
        <Media src={VILLA} label="Casa en la costa, Maldonado" preload className="h-full w-full" />
        <div aria-hidden="true" className="absolute inset-0 bg-linear-to-b from-ink/25 via-ink/5 to-ink/45" />
        <HeroWordmark inverted />
      </div>

      <p
        data-hero-hint
        data-hero-intro
        className="absolute bottom-[calc(env(safe-area-inset-bottom,0px)+1.25rem)] left-1/2 -translate-x-1/2 text-xs text-paper/80"
      >
        Deslizá para entrar
      </p>

      <div
        data-hero-caption
        className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 px-(--gutter) pb-[calc(env(safe-area-inset-bottom,0px)+1.5rem)] text-white"
      >
        <p className="text-[clamp(1rem,1.6vw,1.35rem)]">Casa en la costa</p>
        <p className="text-sm text-white/80">Maldonado, 2025</p>
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
        <h2 className="text-[clamp(1.75rem,4.2vw,4.25rem)] leading-none font-light tracking-[-0.015em]">
          Proyectos seleccionados
        </h2>
        <a href="#indice" className="link-draw shrink-0 pb-0.5 text-sm">
          Ver todos
        </a>
      </div>

      <div className="grid grid-cols-1 gap-x-(--gutter) gap-y-[12vh] md:grid-cols-12">
        {featured.map(({ project: p, ratio }, i) => (
          <article key={p.name} data-reveal className={featuredLayout[i]}>
            <Link href={projectHref(p)} className="group block">
              <Media
                src={VILLA}
                crop={p.crop}
                label={`${p.name}, ${p.place}`}
                sizes="(min-width: 768px) 55vw, 100vw"
                ratio={ratio}
                bleed="y"
                speed="auto"
                marks
              />
              <div className="mt-4 flex items-baseline justify-between gap-4">
                <h3 className="overflow-hidden text-[clamp(1.1rem,1.7vw,1.5rem)]">
                  <span data-reveal-line className="link-draw block w-fit pb-0.5">
                    {p.name}
                  </span>
                </h3>
                <p className="overflow-hidden text-sm text-graphite">
                  <span data-reveal-line className="block">
                    {p.place}, {p.year}
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
    <section id="indice" className="px-(--gutter) pt-[18vh] pb-[20vh]">
      <div className="mb-10 flex items-baseline justify-between gap-6">
        <h2 className="text-[clamp(1.75rem,4.2vw,4.25rem)] leading-none font-light tracking-[-0.015em]">
          Todos los proyectos
        </h2>
        <p className="text-sm text-graphite tabular-nums">{projects.length}</p>
      </div>

      <div className="hidden grid-cols-12 gap-x-(--gutter) border-b border-ink/15 pb-3 text-xs text-graphite md:grid">
        <span className="col-span-6">Proyecto</span>
        <span className="col-span-2">Programa</span>
        <span className="col-span-3">Lugar</span>
        <span className="col-span-1 text-right">Año</span>
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
              <span
                data-row-name
                className="col-span-9 text-[clamp(1.15rem,2.4vw,2.25rem)] font-light transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] md:col-span-6"
              >
                {p.name}
              </span>
              <span className="col-span-2 hidden text-sm text-graphite md:block">{p.program}</span>
              <span className="col-span-3 hidden text-sm text-graphite md:block">{p.place}</span>
              <span className="col-span-3 text-right text-sm text-graphite tabular-nums md:col-span-1">{p.year}</span>
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-10 flex justify-end">
        <Link
          href="/todos-los-proyectos"
          className="group inline-flex items-center gap-3 text-[clamp(1.35rem,2.4vw,2.25rem)] font-light"
        >
          <PlusLabel>Ver más</PlusLabel>
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
      className="pointer-events-none invisible fixed top-0 left-0 z-40 hidden h-[clamp(14rem,24vw,22rem)] w-[clamp(11rem,19vw,17rem)] overflow-hidden [@media(hover:hover)_and_(pointer:fine)]:block"
    >
      <div data-index-strip className="absolute inset-x-0 top-0" style={{ height: `${indexed.length * 100}%` }}>
        {indexed.map((p) => (
          <Media
            key={p.name}
            src={VILLA}
            crop={p.crop}
            label=""
            sizes="20vw"
            className="w-full"
            style={{ height: `${100 / indexed.length}%` }}
          />
        ))}
      </div>
    </div>
  );
}
