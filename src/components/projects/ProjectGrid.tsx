"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Flip, gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { photo, projectHref, programs, type Program, type Project } from "@/components/site/content";
import { Media } from "@/components/site/Media";
import { PixelCover } from "@/components/projects/PixelCover";

type Filter = Program | "Todos";

/** Grilla de proyectos con filtro por programa; las tarjetas se reacomodan con Flip. */
export function ProjectGrid({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState<Filter>("Todos");
  const scope = useRef<HTMLDivElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const flipState = useRef<Flip.FlipState | null>(null);
  const barSlot = useRef<HTMLDivElement>(null);
  const [stuck, setStuck] = useState(false);
  const [stuckTop, setStuckTop] = useState(0);

  const options: { label: Filter; count: number }[] = [
    { label: "Todos", count: projects.length },
    ...programs.map((p) => ({ label: p, count: projects.filter((x) => x.program === p).length })),
  ];

  const choose = (next: Filter) => {
    if (next === filter || !list.current) return;
    flipState.current = Flip.getState(list.current.querySelectorAll("[data-card]"));
    // Mientras las tarjetas se mueven en absoluto, la grilla conserva su alto y el pie no salta
    list.current.style.minHeight = `${list.current.offsetHeight}px`;
    setFilter(next);
  };

  useGSAP(
    () => {
      const state = flipState.current;
      if (!state) return;
      flipState.current = null;
      const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

      Flip.from(state, {
        duration: reduce ? 0 : 0.9,
        ease: "expo.inOut",
        absolute: true,
        stagger: reduce ? 0 : 0.02,
        onEnter: (els) =>
          gsap.fromTo(els, { autoAlpha: 0, scale: 0.94 }, { autoAlpha: 1, scale: 1, duration: reduce ? 0 : 0.8, delay: reduce ? 0 : 0.3, ease: "expo.out" }),
        onLeave: (els) => gsap.to(els, { autoAlpha: 0, scale: 0.94, duration: reduce ? 0 : 0.4, ease: "power2.in" }),
        onComplete: () => {
          if (list.current) list.current.style.minHeight = "";
          ScrollTrigger.refresh();
        },
      });
    },
    { dependencies: [filter], scope },
  );

  /**
   * La barra de filtros acompaña la grilla pegada debajo del header y se retira al llegar el pie.
   * Mientras está pegada se dibuja en un portal a <body>: dentro del contenedor de scroll suave
   * (que usa transform) un position:fixed se posicionaría contra ese contenedor y, si en cambio se
   * moviera con transform cuadro a cuadro, quedaría un cuadro atrasada respecto del scroll suave y
   * temblaría. Fuera del contenedor no hay nada que seguir: el navegador la deja quieta.
   */
  useGSAP(
    () => {
      const slot = barSlot.current;
      if (!slot) return;

      const header = document.querySelector("header");
      const footer = document.querySelector("footer");
      const gap = 10;
      const under = () => (header?.getBoundingClientRect().height ?? 0) + gap;

      const trigger = ScrollTrigger.create({
        trigger: slot,
        start: () => `top ${under()}px`,
        endTrigger: footer ?? undefined,
        end: () => `top ${under() + slot.offsetHeight}px`,
        onToggle: (self) => {
          setStuckTop(under());
          setStuck(self.isActive);
        },
      });

      return () => trigger.kill();
    },
    { scope },
  );

  /*
    La barra va sin fondo y se invierte contra lo que tenga detrás, igual que el header: entre ella
    y la página no puede haber ningún elemento que aísle la mezcla (transform, opacidad o filtro).
  */
  const filterBar = (intro: boolean) => (
    <div className="relative border-b border-paper/25 pt-3 pb-4 text-white mix-blend-difference">
      {/* La animación de entrada solo la lleva la copia en el flujo: la del portal nace ya visible */}
      <div {...(intro ? { "data-page-in": "" } : {})} className="flex flex-wrap gap-x-6 gap-y-2">
        {options.map((o) => (
          <button
            key={o.label}
            type="button"
            aria-pressed={filter === o.label}
            onClick={() => choose(o.label)}
            className="group flex items-start gap-1 text-lead text-white/55 transition-colors duration-300 hover:text-white aria-pressed:text-white"
          >
            <span className="link-draw pb-0.5">{o.label}</span>
            <sup className="text-[0.6em] tabular-nums">{o.count}</sup>
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div ref={scope}>
      {/* El hueco conserva el lugar de la barra en el flujo mientras la copia fija está en pantalla */}
      <div ref={barSlot} className="mb-[8vh]" style={{ visibility: stuck ? "hidden" : undefined }}>
        {filterBar(true)}
      </div>

      {stuck &&
        createPortal(
          <div className="pointer-events-none fixed inset-x-0 z-30 px-(--gutter) mix-blend-difference" style={{ top: stuckTop }}>
            <div className="pointer-events-auto">{filterBar(false)}</div>
          </div>,
          document.body,
        )}

      <ul ref={list} className="grid gap-x-(--gutter) gap-y-[clamp(2rem,5vh,3.5rem)] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {projects.map((p) => {
          const visible = filter === "Todos" || p.program === filter;
          return (
            <li key={p.name} data-card data-reveal className={visible ? "" : "hidden"}>
              <Link href={projectHref(p)} className="group block">
                {/* Hover: la foto se pixela sobre un canvas (ver PixelCover) */}
                <div data-pixel-card className="relative">
                  <Media
                    src={photo(p)}
                    label={`${p.name}, portada`}
                    tone={p.tone}
                    ratio="4 / 3"
                    // Sin sangrado: la capa interior queda a ras del cuadro, así el mosaico del
                    // hover cae sobre el mismo encuadre y no se ve un salto de tamaño al aparecer.
                    sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  />
                  {photo(p) && <PixelCover src={photo(p)!} />}
                </div>
                <div className="mt-4 flex items-baseline justify-between gap-4">
                  <h2 className="overflow-hidden text-lead">
                    <span data-reveal-line className="link-draw block w-fit pb-0.5">
                      {p.name}
                    </span>
                  </h2>
                  <p className="overflow-hidden text-meta text-graphite">
                    <span data-reveal-line className="block">
                      {p.program}
                    </span>
                  </p>
                </div>
                <p className="overflow-hidden text-meta text-graphite">
                  <span data-reveal-line className="block">
                    {p.place}
                  </span>
                </p>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
