"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { grouped, num, sections } from "./sections";

/**
 * Cromo del documento: índice a la izquierda, clavado mientras se scrollea, y el contenido a la
 * derecha. El índice ocupa una columna compacta dentro del margen, con un filete que corre a
 * su izquierda y un tramo negro que avanza marcando la sección que se está leyendo.
 *
 * En celular el índice pasa a una fila de anclas arriba. Fondo blanco y nada más: no hay header, ni
 * scroll suave, ni modo oscuro, para que la página se lea como una hoja.
 */
export function Chrome({ children }: { children: React.ReactNode }) {
  const [active, setActive] = useState<string>(sections[0].id);
  const [tick, setTick] = useState<{ top: number; height: number } | null>(null);
  const navRef = useRef<HTMLElement>(null);

  // El tramo negro se coloca sobre el ítem activo, medido en el DOM: así no depende de que todas
  // las filas midan lo mismo ni de cuántos grupos haya.
  const place = useCallback((id: string) => {
    const nav = navRef.current;
    const item = nav?.querySelector<HTMLElement>(`[data-nav="${id}"]`);
    if (!nav || !item) return;
    setTick({ top: item.offsetTop, height: item.offsetHeight });
  }, []);

  useEffect(() => {
    const seen = new Map<string, number>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) seen.set(e.target.id, e.intersectionRatio);
        const best = [...seen.entries()].sort((a, b) => b[1] - a[1])[0];
        if (best && best[1] > 0) setActive(best[0]);
      },
      { threshold: [0, 0.25, 0.5, 0.75, 1] },
    );
    for (const s of sections) {
      const el = document.getElementById(s.id);
      if (el) io.observe(el);
    }
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    place(active);
  }, [active, place]);

  return (
    <div className="fnd min-h-svh">
      <div className="grid grid-cols-4 gap-x-(--gutter) px-(--gutter) md:grid-cols-[14rem_minmax(0,1fr)] md:px-[calc(var(--gutter)*2)]">
        <aside className="f-screen-only col-span-4 pt-8 md:sticky md:top-0 md:col-span-1 md:flex md:h-svh md:flex-col md:self-start md:py-14">
          <div className="f-rule border-b pb-4 md:border-0 md:pb-0">
            <p className="d-label">Berthet + Taranto</p>
            <p className="f-muted mt-1 d-meta">Sistema visual · documento interno</p>
          </div>

          <nav ref={navRef} className="f-index relative mt-6 min-h-0 md:mt-14" aria-label="Secciones">
            <span aria-hidden className="f-index-rail" />
            {tick ? <span aria-hidden className="f-index-tick" style={{ top: tick.top, height: tick.height }} /> : null}

            {grouped.map((block) => (
              <div key={block.group} className="mb-5 last:mb-0">
                <p className="f-muted mb-2 hidden d-label md:block">{block.group}</p>
                <ol className="flex flex-wrap gap-x-5 gap-y-1 md:block">
                  {block.items.map(({ section, index }) => (
                    <li key={section.id}>
                      <a
                        data-nav={section.id}
                        href={`#${section.id}`}
                        aria-current={active === section.id ? "true" : undefined}
                        className="f-nav-item f-muted flex gap-3 py-1 d-meta"
                      >
                        <span className="tabular-nums">{num(index)}</span>
                        <span>{section.title}</span>
                      </a>
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </nav>

          <button
            type="button"
            onClick={() => window.print()}
            className="f-muted mt-6 self-start d-meta underline-offset-4 hover:underline md:mt-auto"
          >
            Descargar PDF
          </button>
        </aside>

        <main className="col-span-4 min-w-0 md:col-span-1 md:max-w-7xl print:max-w-none">{children}</main>
      </div>
    </div>
  );
}
