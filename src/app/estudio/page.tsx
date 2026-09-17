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
        <section className="grid grid-cols-12 gap-x-(--gutter) px-(--gutter) pt-[20vh] pb-[10vh]">
          <h1 data-page-title className="col-span-12 text-display">
            Estudio
          </h1>
          <p data-page-in className="col-span-12 mt-8 max-w-[34ch] text-lead md:col-span-5 md:col-start-8 md:mt-[4vh]">
            {studio.intro}
          </p>
        </section>

        <div data-reveal className="px-(--gutter)">
          <Media
            src={photo(hero)}
            tone="graphite"
            label={`${hero.name}, ${hero.place}`}
            preload
            ratio="16 / 8"
            bleed="y"
            speed="auto"
          />
        </div>

        <section className="grid grid-cols-12 gap-x-(--gutter) px-(--gutter) pt-[20vh] pb-[14vh]">
          <h2 className="col-span-12 mb-8 text-label text-graphite md:col-span-3 md:mb-0 md:pt-[0.7em]">(Enfoque)</h2>
          <div className="col-span-12 md:col-span-9">
            <p data-statement className="max-w-[22ch] text-heading text-balance">
              {studio.approach}
            </p>
            <div className="mt-[10vh] grid gap-10 text-body text-graphite sm:grid-cols-2 lg:max-w-4xl">
              {studio.paragraphs.map((text) => (
                <p key={text} className="max-w-[60ch]">
                  {text}
                </p>
              ))}
            </div>
          </div>
        </section>

        <Spread
          eyebrow={`${cover.name}, ${cover.place}`}
          indexLabel="Qué hacemos"
          indexMeta={`(${String(studio.services.length).padStart(2, "0")})`}
          rows={studio.services.map((s) => ({ title: s.title, note: s.note }))}
          cover={{ src: photo(cover), label: `${cover.name}, ${cover.place}`, tone: cover.tone }}
          inset={{ src: photo(aside), label: `${aside.name}, ${aside.place}`, tone: aside.tone }}
        />

        <section className="px-(--gutter) pt-[18vh] pb-[18vh]">
          <h2 className="mb-[8vh] border-t border-ink pt-5 text-heading">Socias</h2>
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
