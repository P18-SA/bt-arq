import type { Metadata } from "next";
import { ProjectGrid } from "@/components/projects/ProjectGrid";
import { Contact } from "@/components/site/Contact";
import { bySlug, photo, projects } from "@/components/site/content";
import { Shell } from "@/components/site/Shell";
import { Spread } from "@/components/site/Spread";

export const metadata: Metadata = {
  title: "Todos los proyectos",
  description: "Obra nueva, reformas, oficinas y otros proyectos de Berthet + Taranto Arquitectas.",
};

/** Apertura editorial: una obra a sangre y el índice de la selección. */
const cover = projects[0];
const selection = projects.slice(1, 7);
const aside = bySlug("apartamento-en-punta-carretas");

export default function TodosLosProyectos() {
  return (
    <Shell>
      {/* Fondo explícito: la barra de filtros se invierte contra lo que tiene detrás y, dentro del
          contenedor de scroll suave, sin este fondo no tendría contra qué mezclarse. */}
      <main className="bg-paper px-(--gutter) pt-[20vh] pb-[18vh]">
        <div className="mb-[6vh] flex flex-wrap items-end justify-between gap-x-10 gap-y-4">
          <h1
            data-page-title
            className="max-w-[12ch] text-title"
          >
            Todos los proyectos
          </h1>
          <p data-page-in className="pb-[1.2vw] text-meta text-graphite tabular-nums">
            ({projects.length}) proyectos
          </p>
        </div>

        {/* El spread se sale del margen de la página: la foto llega al borde */}
        <div className="mx-[calc(-1_*_var(--gutter))] mb-[14vh]">
          <Spread
            eyebrow={`${cover.name}, ${cover.place}`}
            indexLabel="Selección"
            indexMeta={`(${String(selection.length).padStart(2, "0")})`}
            rows={selection.map((p) => ({ title: p.name, note: p.place }))}
            cover={{ src: photo(cover), label: `${cover.name}, portada`, tone: cover.tone }}
            inset={{ src: photo(aside), label: `${aside.name}, ${aside.place}`, tone: aside.tone }}
          />
        </div>

        <ProjectGrid projects={projects} />
      </main>
      <footer>
        <Contact />
      </footer>
    </Shell>
  );
}
