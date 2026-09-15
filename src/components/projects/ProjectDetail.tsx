import Link from "next/link";
import { Contact } from "@/components/site/Contact";
import { projectDetail, projectHref, type Project, type Shot } from "@/components/site/content";
import { Media } from "@/components/site/Media";
import { PlusLabel } from "@/components/site/Plus";
import { Process } from "@/components/site/Process";
import { Shell } from "@/components/site/Shell";
import { VideoFrame } from "@/components/site/VideoFrame";

// El markup vive acá y no en app/proyectos/[slug]: Tailwind no escanea carpetas con corchetes.
// Las imágenes del detalle no tienen animación de entrada, solo parallax (speed="auto").

const lorem =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante venenatis dapibus posuere velit aliquet. Donec ullamcorper nulla non metus auctor fringilla.";

// Grilla de fotos: posiciones en 12 columnas, alternando para que el recorrido no sea una lista pareja
const shotLayout = [
  "md:col-span-5",
  "md:col-span-6 md:col-start-7 md:mt-[24vh]",
  "md:col-span-6 md:col-start-4",
  "md:col-span-12",
];

function ShotFigure({ shot, className }: { shot: Shot; className: string }) {
  return (
    <figure className={`m-0 ${className}`}>
      <Media label={shot.label} tone={shot.tone} ratio={shot.ratio} bleed="y" speed="auto" />
      <figcaption className="mt-3 text-sm text-graphite">{shot.label}</figcaption>
    </figure>
  );
}

/** Página de detalle de un proyecto: datos, fotos, video opcional y, en reformas, el antes y el después. */
export function ProjectDetail({ project }: { project: Project }) {
  const { gallery, before, next, statement } = projectDetail(project);
  const facts = [
    ["Programa", project.program],
    ["Lugar", project.place],
    ["Año", project.year],
    ["Superficie", project.area],
    ["Estado", project.status],
  ];

  return (
    <Shell>
      <main>
        <section className="px-(--gutter) pt-[18vh] pb-[8vh]">
          <Link href="/todos-los-proyectos" data-page-in className="text-sm text-graphite hover:text-ink">
            <span className="link-draw pb-0.5">Todos los proyectos</span>
          </Link>
          <h1
            data-page-title
            className="mt-[5vh] max-w-[14ch] text-[clamp(2.75rem,8vw,9.5rem)] leading-[0.98] font-light tracking-[-0.03em]"
          >
            {project.name}
          </h1>
          <dl
            data-page-in
            className="mt-[6vh] grid grid-cols-2 gap-x-(--gutter) gap-y-5 border-t border-ink/15 pt-5 sm:grid-cols-3 lg:grid-cols-5"
          >
            {facts.map(([term, value]) => (
              <div key={term}>
                <dt className="text-xs text-graphite">{term}</dt>
                <dd className="mt-1">{value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <div className="px-(--gutter)">
          <Media label={`${project.name}, vista principal`} tone={project.tone} ratio="16 / 9" bleed="y" speed="auto" />
        </div>

        <section className="grid grid-cols-12 gap-x-(--gutter) px-(--gutter) py-[18vh]">
          <p
            data-statement
            className="col-span-12 max-w-[26ch] text-[clamp(1.6rem,3.4vw,3.5rem)] leading-[1.1] font-light tracking-[-0.015em] md:col-span-8"
          >
            {statement}
          </p>
          <div className="col-span-12 mt-[8vh] grid gap-8 leading-relaxed text-graphite sm:grid-cols-2 md:col-span-7 md:col-start-6">
            <p>{lorem}</p>
            <p>{lorem}</p>
          </div>
        </section>

        {before && (
          <Process
            id="antes"
            title="Antes de la reforma"
            aside={`${before.length} ambientes`}
            items={before}
            numbered={false}
            mediaLabel="Antes"
          />
        )}

        <section className="px-(--gutter) pb-[18vh]">
          {before && (
            <h2 className="mt-[18vh] mb-[8vh] border-t border-ink pt-5 text-[clamp(1.75rem,4.2vw,4.25rem)] leading-none font-light tracking-[-0.015em]">
              Después
            </h2>
          )}
          <div className="grid grid-cols-1 gap-x-(--gutter) gap-y-[10vh] md:grid-cols-12">
            <ShotFigure shot={gallery[0]} className={shotLayout[0]} />
            <ShotFigure shot={gallery[1]} className={shotLayout[1]} />
            {project.video && <VideoFrame label={`Video, ${project.name}`} reveal={false} speed="auto" className="md:col-span-12" />}
            <ShotFigure shot={gallery[2]} className={shotLayout[2]} />
            <ShotFigure shot={gallery[3]} className={shotLayout[3]} />
          </div>
        </section>

        <section className="px-(--gutter) pb-[14vh]">
          <Link
            href={projectHref(next)}
            className="group grid items-end gap-8 border-t border-ink/15 pt-6 md:grid-cols-12"
          >
            <div className="md:col-span-8">
              <p className="text-sm text-graphite">Siguiente proyecto</p>
              <p className="mt-5 flex items-center gap-[0.3em] text-[clamp(2.25rem,6vw,6.5rem)] leading-none font-light tracking-[-0.03em]">
                <PlusLabel>{next.name}</PlusLabel>
              </p>
            </div>
            <div className="md:col-span-3 md:col-start-10">
              <Media label={next.name} tone={next.tone} ratio="4 / 3" bleed="y" speed="auto" />
            </div>
          </Link>
        </section>
      </main>
      <footer>
        <Contact />
      </footer>
    </Shell>
  );
}
