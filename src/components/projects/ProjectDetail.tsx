import Link from "next/link";
import { Contact } from "@/components/site/Contact";
import { EditorialNote } from "@/components/site/EditorialNote";
import { photo, projectDetail, projectHref, projects, type Project, type Shot } from "@/components/site/content";
import { Media } from "@/components/site/Media";
import { PlusLabel } from "@/components/site/Plus";
import { Shell } from "@/components/site/Shell";

// El markup vive acá y no en app/proyectos/[slug]: Tailwind no escanea carpetas con corchetes.
// Las imágenes del detalle no tienen animación de entrada, solo parallax (speed="auto").

// Recorrido de fotos en 12 columnas; se repite cada cuatro para que la galería no sea una lista pareja
const shotLayout = [
  "md:col-span-5",
  "md:col-span-6 md:col-start-7 md:mt-[24vh]",
  "md:col-span-6 md:col-start-4",
  "md:col-span-12",
];

/** ABC Areal dibuja el "²" a la altura de la base; el superíndice se arma con <sup> para que se lea. */
function Fact({ text }: { text: string }) {
  const [head, ...rest] = text.split("²");
  if (!rest.length) return <>{text}</>;
  return (
    <>
      {head}
      <sup className="text-[0.62em]">2</sup>
      {rest.join("²")}
    </>
  );
}

function ShotFigure({ shot, index, className }: { shot: Shot; index: number; className: string }) {
  return (
    <figure className={`m-0 ${className}`}>
      <Media src={shot.src} label={shot.label} tone={shot.tone} ratio={shot.ratio} bleed="y" speed="auto" sizes="(min-width: 768px) 60vw, 100vw" />
      <figcaption className="mt-3 flex justify-between text-meta text-graphite tabular-nums">
        <span>({String(index + 2).padStart(2, "0")})</span>
      </figcaption>
    </figure>
  );
}

/** Pendiente del wireframe: se ve como hueco a completar, no como texto final. */
function Pending({ children }: { children: string }) {
  return <span className="border border-dashed border-ink/30 px-2 py-1 text-meta text-graphite">{children}</span>;
}

/** Página de detalle: datos, portada, texto y galería con la cantidad de fotos de la web anterior. */
export function ProjectDetail({ project }: { project: Project }) {
  const { gallery, next } = projectDetail(project);
  const index = projects.findIndex((p) => p.slug === project.slug);
  const facts: [string, string | null][] = [
    ["Programa", project.program],
    ["Lugar", project.place],
    ["Superficie", project.area],
    ["Terreno", project.site],
  ];

  return (
    <Shell>
      <main>
        <section className="px-(--gutter) pt-[18vh] pb-[8vh]">
          <div data-page-in className="flex items-baseline justify-between gap-6 text-meta text-graphite">
            <Link href="/todos-los-proyectos" className="hover:text-ink">
              <span className="link-draw pb-0.5">Todos los proyectos</span>
            </Link>
            <span className="tabular-nums">
              {String(index + 1).padStart(2, "0")} / {projects.length}
            </span>
          </div>
          <h1 data-page-title className="mt-[5vh] max-w-[14ch] text-title">
            {project.name}
          </h1>
          <dl
            data-page-in
            className="mt-[6vh] grid grid-cols-2 gap-x-(--gutter) gap-y-5 border-t border-ink/15 pt-5 lg:grid-cols-4"
          >
            {facts.map(([term, value]) => (
              <div key={term}>
                <dt className="text-label text-graphite">{term}</dt>
                <dd className="mt-1 text-body">{value ? <Fact text={value} /> : <span className="text-graphite">—</span>}</dd>
              </div>
            ))}
          </dl>
        </section>

        <div className="px-(--gutter)">
          <Media
            src={photo(project)}
            label={`${project.name}, portada`}
            tone={project.tone}
            ratio="16 / 9"
            bleed="y"
            speed="auto"
            preload
          />
        </div>

        <EditorialNote
          eyebrow="El proyecto"
          lead={project.statement}
          leadFallback={<Pending>Frase del proyecto pendiente</Pending>}
          paragraphs={project.text ? [project.text] : []}
          fallback={<Pending>Texto del proyecto pendiente</Pending>}
          aside={{ src: photo(project), label: `${project.name}, detalle`, tone: project.tone }}
          wide={{ src: gallery[0]?.src ?? photo(project), label: `${project.name}, ${project.place}`, tone: project.tone }}
        />

        {gallery.length > 0 && (
          <section className="px-(--gutter) pt-[18vh] pb-[18vh]">
            <h2 className="mb-[8vh] flex items-baseline justify-between border-t border-ink pt-5 text-heading">
              Galería <span className="text-meta text-graphite tabular-nums">({project.shots} fotos)</span>
            </h2>
            <div className="grid grid-cols-1 gap-x-(--gutter) gap-y-[10vh] md:grid-cols-12">
              {gallery.map((shot, i) => (
                <ShotFigure key={shot.label} shot={shot} index={i} className={shotLayout[i % shotLayout.length]} />
              ))}
            </div>
          </section>
        )}

        <section className="px-(--gutter) pt-[10vh] pb-[14vh]">
          <Link
            href={projectHref(next)}
            className="group grid items-end gap-8 border-t border-ink/15 pt-6 md:grid-cols-12"
          >
            <div className="md:col-span-8">
              <p className="text-meta text-graphite">Siguiente proyecto</p>
              <p className="mt-5 flex items-center gap-[0.3em] text-title">
                <PlusLabel>{next.name}</PlusLabel>
              </p>
            </div>
            <div className="md:col-span-3 md:col-start-10">
              <Media src={photo(next)} label={next.name} tone={next.tone} ratio="4 / 3" bleed="y" speed="auto" />
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
