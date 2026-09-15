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

  return (
    <div ref={scope}>
      <div data-page-in className="mb-[8vh] flex flex-wrap gap-x-6 gap-y-2 border-b border-ink/15 pb-4">
        {options.map((o) => (
          <button
            key={o.label}
            type="button"
            aria-pressed={filter === o.label}
            onClick={() => choose(o.label)}
            className="group flex items-start gap-1 text-[clamp(1rem,1.4vw,1.25rem)] text-graphite transition-colors duration-300 hover:text-ink aria-pressed:text-ink"
          >
            <span className="link-draw pb-0.5">{o.label}</span>
            <sup className="text-[0.6em] tabular-nums">{o.count}</sup>
          </button>
        ))}
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
