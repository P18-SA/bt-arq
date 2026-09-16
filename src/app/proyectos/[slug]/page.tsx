import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectDetail } from "@/components/projects/ProjectDetail";
import { projects } from "@/components/site/content";

// Exportación estática: solo existen las páginas de los proyectos listados
export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

async function findProject(params: PageProps<"/proyectos/[slug]">["params"]) {
  const { slug } = await params;
  return projects.find((p) => p.slug === slug);
}

export async function generateMetadata({ params }: PageProps<"/proyectos/[slug]">): Promise<Metadata> {
  const project = await findProject(params);
  if (!project) return {};
  return {
    title: project.name,
    description: project.statement ?? `${project.program} en ${project.place}. Proyecto de Berthet + Taranto Arquitectas.`,
  };
}

export default async function ProyectoPage({ params }: PageProps<"/proyectos/[slug]">) {
  const project = await findProject(params);
  if (!project) notFound();
  return <ProjectDetail project={project} />;
}
