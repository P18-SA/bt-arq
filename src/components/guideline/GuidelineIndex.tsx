"use client";

import { useEffect, useState, type MouseEvent } from "react";

type Item = { id: string; label: string };

const numeral = (i: number) => String(i + 1).padStart(2, "0");

/**
 * Índice de la guía de diseño. Marca la sección que cruza la mitad de la pantalla: el numeral y el
 * nombre pasan a `ink`, una raya se dibuja delante y la guía vertical se llena hasta ese punto.
 * La página no usa ScrollSmoother, así que acá `position: sticky` sí funciona.
 */
export function GuidelineIndex({ items }: { items: Item[] }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(items.findIndex((item) => item.id === entry.target.id));
        }
      },
      // Una franja fina a media pantalla: la sección activa es la que la está cruzando
      { rootMargin: "-45% 0px -54% 0px" },
    );
    for (const item of items) {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [items]);

  const go = (e: MouseEvent<HTMLAnchorElement>, id: string) => {
    const target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    target.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    history.replaceState(null, "", `#${id}`);
  };

  return (
    <nav aria-label="Índice de la guía" className="flex flex-col md:h-full">
      <p className="text-label text-graphite uppercase">Índice</p>

      <div className="relative mt-6">
        {/* Guía vertical: se llena hasta la sección activa */}
        <span aria-hidden="true" className="absolute inset-y-0 left-0 hidden w-px bg-concrete md:block" />
        <span
          aria-hidden="true"
          className="absolute inset-y-0 left-0 hidden w-px origin-top bg-ink transition-transform duration-700 ease-[cubic-bezier(0.65,0,0.35,1)] md:block"
          style={{ transform: `scaleY(${(active + 1) / items.length})` }}
        />

        <ol className="grid gap-2.5 md:pl-5">
          {items.map((item, i) => {
            const on = i === active;
            return (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  onClick={(e) => go(e, item.id)}
                  aria-current={on ? "location" : undefined}
                  className={`flex items-center text-meta transition-colors duration-500 ${on ? "text-ink" : "text-graphite hover:text-ink"}`}
                >
                  <span className="w-7 shrink-0 tabular-nums">{numeral(i)}</span>
                  <span
                    aria-hidden="true"
                    className="h-px shrink-0 bg-current transition-[width,margin] duration-700 ease-[cubic-bezier(0.65,0,0.35,1)]"
                    style={{ width: on ? "1.25rem" : 0, marginRight: on ? "0.6rem" : 0 }}
                  />
                  <span>{item.label}</span>
                </a>
              </li>
            );
          })}
        </ol>
      </div>

      <p className="mt-auto hidden pt-8 text-label text-graphite tabular-nums md:block">
        ({numeral(active)} / {numeral(items.length - 1)})
      </p>
    </nav>
  );
}
