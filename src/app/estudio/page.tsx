import type { Metadata } from "next";
import Link from "next/link";
import { Contact } from "@/components/site/Contact";
import { VILLA, type Tone } from "@/components/site/content";
import { Media } from "@/components/site/Media";
import { PlusLabel } from "@/components/site/Plus";
import { Shell } from "@/components/site/Shell";

export const metadata: Metadata = {
  title: "Estudio",
  description: "Berthet + Taranto es un estudio de arquitectura en Montevideo, Uruguay.",
};

const partners: { name: string; role: string; tone: Tone }[] = [
  { name: "Marcela Berthet", role: "Arquitecta, socia fundadora", tone: "concrete" },
  { name: "Perla Taranto", role: "Arquitecta, socia fundadora", tone: "fog" },
];

const lorem =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante venenatis dapibus posuere velit aliquet. Donec ullamcorper nulla non metus auctor fringilla, vestibulum id ligula porta felis euismod semper.";

export default function Estudio() {
  return (
    <Shell>
      <main>
        <section className="grid grid-cols-12 gap-x-(--gutter) px-(--gutter) pt-[20vh] pb-[10vh]">
          <h1
            data-page-title
            className="col-span-12 text-[clamp(3.5rem,13vw,15rem)] leading-[0.9] font-light tracking-[-0.035em]"
          >
            Estudio
          </h1>
          <p
            data-page-in
            className="col-span-12 mt-8 max-w-[34ch] text-[clamp(1.1rem,1.7vw,1.5rem)] leading-snug md:col-span-5 md:col-start-8 md:mt-[4vh]"
          >
            Berthet + Taranto es un estudio de arquitectura con base en Montevideo. Trabajamos en todo Uruguay.
          </p>
        </section>

        <div data-reveal className="px-(--gutter)">
          <Media src={VILLA} label="Casa en la costa, Maldonado" preload ratio="16 / 8" bleed="y" speed="auto" />
        </div>

        <section className="grid grid-cols-12 gap-x-(--gutter) px-(--gutter) pt-[20vh] pb-[14vh]">
          <h2 className="col-span-12 mb-8 text-sm text-graphite md:col-span-3 md:mb-0 md:pt-[0.7em]">Enfoque</h2>
          <div className="col-span-12 md:col-span-9">
            <p
              data-statement
              className="max-w-[24ch] text-[clamp(1.75rem,4.2vw,4.25rem)] leading-[1.08] font-light tracking-[-0.015em] text-balance"
            >
              Una buena casa empieza por entender cómo se va a vivir en ella. Por eso escuchamos antes de dibujar.
            </p>
            <div className="mt-[10vh] grid gap-10 text-[0.975rem] leading-relaxed text-graphite sm:grid-cols-2 lg:max-w-4xl">
              <p className="max-w-[60ch]">{lorem}</p>
              <p className="max-w-[60ch]">{lorem}</p>
            </div>
          </div>
        </section>

        <section className="px-(--gutter) pb-[18vh]">
          <h2 className="mb-[8vh] border-t border-ink pt-5 text-[clamp(1.75rem,4.2vw,4.25rem)] leading-none font-light tracking-[-0.015em]">
            Socias
          </h2>
          <div className="grid gap-x-(--gutter) gap-y-[10vh] md:grid-cols-12">
            {partners.map((p, i) => (
              <article
                key={p.name}
                data-reveal
                className={i === 0 ? "md:col-span-5" : "md:col-span-5 md:col-start-8 md:mt-[22vh]"}
              >
                {/* Placeholder con silueta hasta tener las fotos de las socias */}
                <Media
                  placeholder="person"
                  tone={p.tone}
                  label={`Retrato, ${p.name}`}
                  ratio="3 / 4"
                  bleed="y"
                  speed="auto"
                  marks
                />
                <h3 className="mt-5 overflow-hidden text-[clamp(1.2rem,1.8vw,1.6rem)]">
                  <span data-reveal-line className="block">
                    {p.name}
                  </span>
                </h3>
                <p className="overflow-hidden text-sm text-graphite">
                  <span data-reveal-line className="block">
                    {p.role}
                  </span>
                </p>
                <p className="mt-5 max-w-[52ch] text-[0.975rem] leading-relaxed text-graphite">{lorem}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="px-(--gutter) pb-[20vh]">
          <Link
            href="/todos-los-proyectos"
            className="group inline-flex items-center gap-3 text-[clamp(1.35rem,2.4vw,2.25rem)] font-light"
          >
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
