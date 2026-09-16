import type { Metadata } from "next";
import { ProjectGrid } from "@/components/projects/ProjectGrid";
import { Contact } from "@/components/site/Contact";
import { projects } from "@/components/site/content";
import { Shell } from "@/components/site/Shell";

export const metadata: Metadata = {
  title: "Todos los proyectos",
  description: "Obra nueva, reformas, oficinas y otros proyectos de Berthet + Taranto Arquitectas.",
};

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

        <ProjectGrid projects={projects} />
      </main>
      <footer>
        <Contact />
      </footer>
    </Shell>
  );
}
