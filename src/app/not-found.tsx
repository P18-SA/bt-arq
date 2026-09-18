import type { Metadata } from "next";
import Link from "next/link";
import { bySlug, contact, photo } from "@/components/site/content";
import { Media } from "@/components/site/Media";
import { PlusLabel } from "@/components/site/Plus";
import { Shell } from "@/components/site/Shell";

export const metadata: Metadata = {
  title: "Página no encontrada",
  description: "La dirección que buscaste no existe o cambió de lugar.",
};

const bg = bySlug("casa-en-carrasco-iii");

const links = [
  { href: "/", label: "Volver al inicio" },
  { href: "/todos-los-proyectos", label: "Ver proyectos" },
  { href: "/estudio", label: "Conocé el estudio" },
  { href: "/contacto", label: "Escribinos" },
];

/** 404: misma armadura que Contacto (foto oscurecida, cruz de líneas) y un glitch breve en textos y líneas al entrar. */
export default function NotFound() {
  return (
    <Shell smooth={false}>
      <main data-notfound-page className="@container relative min-h-svh overflow-hidden bg-ink text-paper md:h-svh">
        {/* Foto de fondo: más oscura y desaturada que en Contacto, para que el texto mande */}
        <div data-notfound-bg aria-hidden="true" className="absolute inset-0">
          <Media
            src={photo(bg)}
            tone="shadow"
            label=""
            placeholder={photo(bg) ? "void" : "blank"}
            className="h-full w-full opacity-70 brightness-[0.72] grayscale-[50%]"
          />
          <div className="absolute inset-0 bg-linear-to-t from-ink/80 via-ink/25 to-ink/45" />
        </div>

        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <span data-notfound-v className="absolute inset-y-0 left-[62%] w-px origin-top bg-paper/25" />
        </div>

        <div className="relative flex min-h-svh flex-col px-(--gutter) pt-[calc(env(safe-area-inset-top,0px)+15vh)] pb-[calc(env(safe-area-inset-bottom,0px)+1.5rem)] md:h-full md:min-h-0">
          <div>
            <p data-page-in data-glitch-text className="text-label text-paper/60 uppercase">
              Error 404 <span className="text-paper/40">(Página no encontrada)</span>
            </p>
            <h1 data-page-title data-glitch-text className="mt-5 max-w-[16ch] text-title">
              Esta página no está en el plano.
            </h1>
            <p data-page-in data-glitch-text className="mt-6 max-w-[40ch] text-lead text-paper/75">
              La dirección que buscaste no existe o cambió de lugar. Seguí por alguno de estos caminos.
            </p>
          </div>

          <span
            data-notfound-h
            aria-hidden="true"
            className="mx-[calc(-1_*_var(--gutter))] mt-[clamp(2rem,6svh,4.5rem)] block h-px origin-left bg-paper/25"
          />

          {/* Caminos a la izquierda de la línea vertical; el numeral contra el borde derecho */}
          <div className="grid flex-1 content-center gap-10 py-10 md:grid-cols-[calc(62cqw_-_var(--gutter))_1fr] md:items-end md:gap-0 md:py-6">
            <ul data-page-in data-glitch-text className="grid gap-3 text-subheading">
              {links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="group inline-flex items-center gap-[0.3em]">
                    <PlusLabel>{link.label}</PlusLabel>
                  </Link>
                </li>
              ))}
            </ul>

            {/* Las dos capas repiten el numeral y solo se ven durante el glitch */}
            <p data-glitch className="relative justify-self-end text-display tabular-nums">
              <span data-glitch-base className="block">
                404
              </span>
              <span data-glitch-layer aria-hidden="true" className="invisible absolute inset-0 text-paper/60">
                404
              </span>
              <span data-glitch-layer aria-hidden="true" className="invisible absolute inset-0 text-concrete/70">
                404
              </span>
            </p>
          </div>

          <div data-page-in className="grid gap-4 border-t border-paper/25 pt-5 text-meta sm:grid-cols-3">
            <p>
              <a href={`mailto:${contact.email}`} className="link-draw pb-0.5">
                {contact.email}
              </a>
            </p>
            <p>
              <a href={contact.instagram.href} target="_blank" rel="noopener noreferrer" className="link-draw pb-0.5">
                Instagram, {contact.instagram.handle}
              </a>
            </p>
            <p className="text-paper/60 sm:text-right">© 2026 Berthet + Taranto Arquitectas</p>
          </div>
        </div>
      </main>
    </Shell>
  );
}
