"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { Flip, gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { projectHref, programs, type Program, type Project } from "@/components/site/content";
import { Media } from "@/components/site/Media";

type Filter = Program | "Todos";

/** Grilla de proyectos con filtro por programa; las tarjetas se reacomodan con Flip. */
export function ProjectGrid({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState<Filter>("Todos");
  const scope = useRef<HTMLDivElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const flipState = useRef<Flip.FlipState | null>(null);
  const barSlot = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);

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
   * La barra de filtros queda fija debajo del header mientras se recorre la grilla y el pie la empuja
   * hacia arriba al entrar, para no quedar encima del cierre de contacto.
   * Se mueve con transform y no con position:fixed: dentro del contenedor de scroll suave (que usa
   * transform) un elemento fijo se posiciona contra ese contenedor, no contra la ventana.
   */
  useGSAP(
    () => {
      const slot = barSlot.current;
      const el = bar.current;
      if (!slot || !el) return;

      const header = document.querySelector("header");
      const footer = document.querySelector("footer");
      const setY = gsap.quickSetter(el, "y", "px");
      const gap = 10;
      let last = 0;

      const update = () => {
        const slotBox = slot.getBoundingClientRect();
        const under = (header?.getBoundingClientRect().height ?? 0) + gap;
        // Con el pie a la vista, el tope baja hasta sacar la barra de pantalla
        const ceiling = footer ? footer.getBoundingClientRect().top - slotBox.height - gap : Infinity;
        const y = Math.max(0, Math.min(under, ceiling) - slotBox.top);
        if (Math.abs(y - last) < 0.5) return;
        last = y;
        setY(y);
        if (y > 0.5) el.setAttribute("data-stuck", "");
        else el.removeAttribute("data-stuck");
      };

      gsap.ticker.add(update);
      return () => gsap.ticker.remove(update);
    },
    { scope },
  );

  return (
    <div ref={scope}>
      {/*
        El hueco conserva el lugar de la barra en el flujo mientras ella se mueve.
        La barra va sin fondo y se invierte contra lo que tenga detrás, igual que el header. Para que
        eso funcione, entre ella y el contenedor del scroll suave no puede haber ningún elemento que
        aísle la mezcla (transform, opacidad o filtro): por eso el hueco queda limpio y la animación
        de entrada la lleva la fila de botones, adentro.
      */}
      <div ref={barSlot} className="mb-[8vh]">
        <div
          ref={bar}
          className="relative z-30 border-b border-paper/25 pt-3 pb-4 text-white mix-blend-difference"
        >
          <div data-page-in className="flex flex-wrap gap-x-6 gap-y-2">
            {options.map((o) => (
              <button
                key={o.label}
                type="button"
                aria-pressed={filter === o.label}
                onClick={() => choose(o.label)}
                className="group flex items-start gap-1 text-[clamp(1rem,1.4vw,1.25rem)] text-white/55 transition-colors duration-300 hover:text-white aria-pressed:text-white"
              >
                <span className="link-draw pb-0.5">{o.label}</span>
                <sup className="text-[0.6em] tabular-nums">{o.count}</sup>
              </button>
            ))}
          </div>
        </div>
      </div>

      <ul ref={list} className="grid gap-x-(--gutter) gap-y-[8vh] sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((p) => {
          const visible = filter === "Todos" || p.program === filter;
          return (
            <li key={p.name} data-card data-reveal className={visible ? "" : "hidden"}>
              <Link href={projectHref(p)} className="group block">
                <Media label={`Imagen, ${p.name}`} tone={p.tone} ratio="4 / 5" bleed="y" />
                <div className="mt-4 flex items-baseline justify-between gap-4">
                  <h2 className="overflow-hidden text-[clamp(1.1rem,1.5vw,1.35rem)]">
                    <span data-reveal-line className="link-draw block w-fit pb-0.5">
                      {p.name}
                    </span>
                  </h2>
                  <p className="overflow-hidden text-sm text-graphite tabular-nums">
                    <span data-reveal-line className="block">
                      {p.year}
                    </span>
                  </p>
                </div>
                <p className="overflow-hidden text-sm text-graphite">
                  <span data-reveal-line className="block">
                    {p.program}, {p.place}
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
