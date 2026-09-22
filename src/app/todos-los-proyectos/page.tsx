import type { Metadata } from "next";
import { ProjectGrid } from "@/components/projects/ProjectGrid";
import { Contact } from "@/components/site/Contact";
import { bySlug, photo, projectHref, projects, projectsIntro } from "@/components/site/content";
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
      <main className="bg-paper px-(--gutter) pb-[18vh]">
        {/* La página abre con la frase, igual que "Cómo trabajamos": el spread grande queda debajo */}
        <section className="grid grid-cols-12 gap-x-(--gutter) pt-[18vh] pb-[12vh] md:pt-[24vh] md:pb-[16vh]">
          {/* Medida corta y balanceada: la frase corta en tres líneas parejas, no en una larga y un resto */}
          <h1 data-page-title className="col-span-12 max-w-[24ch] text-balance text-heading md:col-span-7">
            {projectsIntro}
          </h1>
        </section>

        {/* El spread se sale del margen de la página: la foto llega al borde */}
        {/* Ajuste manual: separación entre la apertura y la grilla (la barra de filtros se fija arriba) */}
        <div className="mx-[calc(-1_*_var(--gutter))] mb-[26vh]">
          <Spread
            indexLabel="Selección"
            indexMeta={`(${String(selection.length).padStart(2, "0")})`}
            rows={selection.map((p) => ({ title: p.name, note: p.place, href: projectHref(p) }))}
            cover={{ src: photo(cover), label: `${cover.name}, portada`, tone: cover.tone }}
            inset={{ src: photo(aside), label: `${aside.name}, ${aside.place}`, tone: aside.tone }}
            full
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
