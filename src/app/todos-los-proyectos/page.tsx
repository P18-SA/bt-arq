import type { Metadata } from "next";
import { ProjectGrid } from "@/components/projects/ProjectGrid";
import { Contact } from "@/components/site/Contact";
import { projects } from "@/components/site/content";
import { Shell } from "@/components/site/Shell";

export const metadata: Metadata = {
  title: "Todos los proyectos",
  description: "Casas, espacios de trabajo, reformas y lugares públicos proyectados por Berthet + Taranto.",
};

export default function TodosLosProyectos() {
  return (
    <Shell>
      <main className="px-(--gutter) pt-[20vh] pb-[18vh]">
        <div className="mb-[6vh] flex flex-wrap items-end justify-between gap-x-10 gap-y-4">
          <h1
            data-page-title
            className="max-w-[12ch] text-[clamp(3rem,9vw,11rem)] leading-[0.98] font-light tracking-[-0.03em]"
          >
            Todos los proyectos
          </h1>
          <p data-page-in className="pb-[1.2vw] text-sm text-graphite tabular-nums">
            {projects.length} proyectos
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
