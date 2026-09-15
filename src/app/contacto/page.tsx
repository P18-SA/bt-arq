import type { Metadata } from "next";
import Image from "next/image";
import { EmailLink } from "@/components/site/Contact";
import { contact, VILLA } from "@/components/site/content";
import { LocationCard } from "@/components/site/LocationCard";
import { Shell } from "@/components/site/Shell";

export const metadata: Metadata = {
  title: "Contacto",
  description: `Escribinos a ${contact.email} y coordinamos una primera charla.`,
};

export default function Contacto() {
  return (
    <Shell smooth={false}>
      <main data-contact-page className="@container relative min-h-svh overflow-hidden bg-ink text-paper md:h-svh">
        {/* Foto de fondo: más tenue, medio desaturada y algo más oscura, sin perder el color */}
        <div data-contact-bg aria-hidden="true" className="absolute inset-0">
          <Image
            src={VILLA}
            alt=""
            fill
            loading="eager"
            fetchPriority="high"
            sizes="100vw"
            className="object-cover opacity-75 brightness-[0.8] grayscale-[45%]"
          />
          <div className="absolute inset-0 bg-linear-to-t from-ink/75 via-ink/15 to-ink/35" />
        </div>

        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <span data-contact-v className="absolute inset-y-0 left-[62%] w-px origin-top bg-paper/25" />
        </div>

        <div className="relative flex min-h-svh flex-col px-(--gutter) pt-[calc(env(safe-area-inset-top,0px)+15vh)] pb-[calc(env(safe-area-inset-bottom,0px)+1.5rem)] md:h-full md:min-h-0">
          <div>
            <h1
              data-page-title
              className="max-w-[16ch] text-[clamp(2.4rem,6vw,6.5rem)] leading-[1.02] font-light tracking-[-0.025em]"
            >
              Contanos qué querés construir.
            </h1>
            <p data-page-in className="mt-6 max-w-[40ch] text-paper/75">
              Escribinos con una idea de lo que buscás y coordinamos una primera charla.
            </p>
          </div>

          {/* Línea horizontal en el flujo: la separación con el texto de arriba no depende del alto de pantalla */}
          <span
            data-contact-h
            aria-hidden="true"
            className="mx-[calc(-1_*_var(--gutter))] mt-[clamp(2rem,6svh,4.5rem)] block h-px origin-left bg-paper/25"
          />

          {/* Mail a la izquierda de la línea vertical; card contra el borde derecho, a la altura del mail */}
          <div className="grid flex-1 content-center gap-10 py-10 md:grid-cols-[calc(62cqw_-_var(--gutter))_1fr] md:items-center md:gap-0 md:py-6">
            <div>
              <EmailLink />
            </div>
            <LocationCard className="w-[calc(62cqw_-_2_*_var(--gutter))] justify-self-end md:w-[min(calc(38cqw_-_2_*_var(--gutter)),22rem,34svh)]" />
          </div>

          <div data-page-in className="grid gap-4 border-t border-paper/25 pt-5 text-sm sm:grid-cols-3">
            <p className="text-paper/75">{contact.city}</p>
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
