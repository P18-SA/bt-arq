import type { Metadata } from "next";
import Link from "next/link";
import { Fragment } from "react";
import { Contact } from "@/components/site/Contact";
import { featured, hero, photo, projects, studio, type Tone } from "@/components/site/content";
import { Media } from "@/components/site/Media";
import { Plus, PlusLabel } from "@/components/site/Plus";
import { Shell } from "@/components/site/Shell";
import { Spread } from "@/components/site/Spread";

export const metadata: Metadata = {
  title: "Estudio",
  description: studio.intro,
};

const tones: Tone[] = ["concrete", "fog"];

/** Obra que abre el spread de servicios, y la foto chica que lo cierra. */
const cover = featured[0].project;
const aside = projects.find((p) => p.slug !== cover.slug)!;

export default function Estudio() {
  return (
    <Shell>
      <main>
        <section className="grid grid-cols-12 gap-x-(--gutter) px-(--gutter) pt-[20vh] pb-[6vh]">
          {/*
            Sin título en `display`: la intro entra en `heading` y arranca en la misma columna que la
            foto y el resto ocupa todo el ancho. La sangría se hace con un espaciador en línea y
            no con `text-indent`, porque SplitText parte el párrafo en líneas y la indentación se
            repetiría en cada una. El nombre de la página vive en los metadatos y en la nav.
          */}
          <h1 className="sr-only">Estudio</h1>
          <p data-page-title className="col-span-12 text-heading">
            <span aria-hidden="true" className="hidden md:inline-block md:w-[25%]" />
            {studio.intro}
          </p>

          {/* Ficha mínima en el aire que deja la foto a la izquierda: rótulo, filete y datos de la obra. */}
          <aside data-page-in className="col-span-12 mt-[6vh] text-graphite md:col-span-3 md:mt-[18vh]">
            <p className="text-label">(01)</p>
            <hr className="mt-2 mb-3 border-0 border-t border-ink/20" />
            <p className="max-w-[24ch] text-meta">
              {hero.name}
              <br />
              {hero.place}
              <br />
              {hero.program}
              {hero.area ? `, ${hero.area}` : ""}
            </p>
          </aside>

          <div data-reveal className="col-span-12 mt-4 md:col-span-9 md:mt-[12vh]">
            <Media
              src={photo(hero)}
              tone="graphite"
              label={`${hero.name}, ${hero.place}`}
              preload
              // En mano un poco más alta que 16:9, que quedaba muy apaisada
              className="aspect-[3/2] md:aspect-video"
              bleed="y"
              speed="auto"
              sizes="(min-width: 768px) 75vw, 100vw"
            />
          </div>
        </section>

        <section className="grid grid-cols-12 gap-x-(--gutter) px-(--gutter) pt-[8vh] pb-[14vh] md:pt-[12vh]">
          <h2 className="col-span-12 mb-6 text-label text-graphite md:col-span-3 md:mb-0 md:pt-[0.7em] uppercase">Enfoque</h2>
          <div className="col-span-12 md:col-span-9">
            <p data-statement className="max-w-[22ch] text-heading text-balance">
              {studio.approach}
            </p>
            <div className="mt-[5vh] grid gap-10 text-body md:mt-[10vh] text-graphite sm:grid-cols-2 lg:max-w-4xl">
              {studio.paragraphs.map((text) => (
                <p key={text} className="max-w-[60ch]">
                  {text}
                </p>
              ))}
            </div>
          </div>
        </section>

        <Spread
          coverMeta={{
            label: "(02)",
            lines: [cover.name, cover.place, cover.area ? `${cover.program}, ${cover.area}` : cover.program],
          }}
          indexLabel="Capacidades"
          indexMeta={`(${String(studio.services.length).padStart(2, "0")})`}
          rows={studio.services.map((s) => ({ title: s.title, note: s.note }))}
          cover={{ src: photo(cover), label: `${cover.name}, ${cover.place}`, tone: cover.tone }}
          insetLow
          inset={{ src: photo(aside), label: `${aside.name}, ${aside.place}`, tone: aside.tone }}
        />

        <section className="px-(--gutter) pt-[18vh] pb-[18vh]">
          <h2 className="mb-[8vh] text-heading">Socias</h2>
          {/*
            Retratos en las columnas 1-5 y 8-12, con el "+" del logo en las dos columnas del medio.
            El "+" queda a la altura media entre las dos fotos (la segunda baja 22vh):
            alto de foto = ancho de 5 columnas × 4/3, medido con cqw sobre la grilla.
          */}
          <div className="@container grid justify-items-center gap-x-(--gutter) gap-y-[10vh] md:grid-cols-12 md:justify-items-stretch">
            {studio.partners.map((p, i) => (
              <Fragment key={p.name}>
                {i === 1 && (
                  <div className="md:col-span-2 md:col-start-6 md:row-start-1 md:mt-[calc((22vh_+_(5_*_(100cqw_-_11_*_var(--gutter))_/_12_+_4_*_var(--gutter))_*_4_/_3)_/_2)] md:-translate-y-1/2 md:self-start md:justify-self-center">
                    <Plus thin draw className="block text-[clamp(4rem,7.4vw,10rem)]" />
                  </div>
                )}
                <article
                  data-reveal
                  className={`w-full ${i === 0 ? "md:col-span-5 md:row-start-1" : "md:col-span-5 md:col-start-8 md:row-start-1 md:mt-[22vh]"}`}
                >
                  <Media
                    placeholder="person"
                    tone={tones[i]}
                    label={`Retrato, ${p.name}`}
                    ratio="3 / 4"
                    bleed="y"
                    speed="auto"
                    marks
                  />
                  <h3 className="mt-5 overflow-hidden text-lead">
                    <span data-reveal-line className="block">
                      {p.name}
                    </span>
                  </h3>
                  <p className="overflow-hidden text-meta text-graphite">
                    <span data-reveal-line className="block">
                      {p.role}
                    </span>
                  </p>
                </article>
              </Fragment>
            ))}
          </div>
        </section>

        <section className="grid grid-cols-12 gap-x-(--gutter) gap-y-10 border-t border-ink/15 px-(--gutter) pt-8 pb-[18vh]">
          <h2 className="col-span-12 text-label text-graphite md:col-span-3">(Equipo)</h2>
          <ul className="col-span-12 grid gap-x-(--gutter) gap-y-3 text-subheading sm:grid-cols-2 md:col-span-6">
            {studio.team.map((name) => (
              <li key={name}>{name}</li>
            ))}
          </ul>
          <div className="col-span-12 md:col-span-3">
            <h3 className="text-label text-graphite">(Idiomas)</h3>
            <p className="mt-3 text-body">{studio.languages.join(", ")}</p>
          </div>
        </section>

        <section className="px-(--gutter) py-[20vh]">
          <Link href="/todos-los-proyectos" className="group inline-flex items-center gap-3 text-subheading">
            <PlusLabel>Ver proyectos</PlusLabel>
          </Link>
        </section>
      </main>
      <footer>
        <Contact />
      </footer>
    </Shell>
  );
}
