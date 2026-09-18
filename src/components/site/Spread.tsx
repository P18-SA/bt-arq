import type { ReactNode } from "react";
import { Media, tones } from "@/components/site/Media";
import type { Tone } from "@/components/site/content";

export type SpreadRow = {
  title: string;
  note?: string | null;
  href?: string;
};

type Props = {
  /** Rótulo en mayúscula sobre la foto grande (columna izquierda); se omite si no se pasa */
  eyebrow?: string;
  /** Rótulo en mayúscula del índice (columna derecha) */
  indexLabel: string;
  /** Dato corto al final de la fila del rótulo: año, cantidad, etc. */
  indexMeta?: string;
  /** Filas numeradas con guía punteada */
  rows: SpreadRow[];
  /** Foto grande de la izquierda */
  cover: { src?: string; label: string; tone: Tone };
  /** Foto chica que cierra abajo a la derecha, alineada al borde del índice */
  inset?: { src?: string; label: string; tone: Tone };
  /** Texto opcional debajo del índice, antes de la foto chica */
  children?: ReactNode;
  /** Apertura a pantalla completa: la foto de la izquierda ocupa el viewport entero */
  full?: boolean;
};

/**
 * Doble página editorial: foto a sangre a la izquierda, índice numerado a la derecha y una foto
 * chica que cierra abajo, alineada al borde derecho (ver referencia en DESIGN.md §5).
 * Los rótulos van en mayúscula y chicos; los textos grandes quedan en caja baja.
 */
export function Spread({ eyebrow, indexLabel, indexMeta, rows, cover, inset, children, full = false }: Props) {
  return (
    <section className={`grid grid-cols-1 items-stretch md:grid-cols-2 ${full ? "md:h-svh" : ""}`}>
      {/* Izquierda: la obra, a sangre contra el borde de la sección */}
      <div data-reveal className={`relative ${full ? "h-svh md:h-full" : ""}`}>
        <Media
          src={cover.src}
          label={cover.label}
          tone={cover.tone}
          placeholder="blank"
          ratio={full ? undefined : "3 / 4"}
          sizes="(min-width: 768px) 50vw, 100vw"
          className="h-full w-full"
        />
        {eyebrow && (
          <p
            className={`absolute left-[calc(var(--gutter)+var(--edge))] text-label uppercase ${
              full ? "top-[calc(env(safe-area-inset-top,0px)+1.1rem)]" : "top-4"
            } ${tones[cover.tone].ink}`}
          >
            {eyebrow}
          </p>
        )}
      </div>

      {/* Derecha: el índice */}
      <div
        className={`flex flex-col px-(--gutter) pb-8 ${
          full
            ? "pt-[calc(env(safe-area-inset-top,0px)+1.1rem)] md:pt-[calc(env(safe-area-inset-top,0px)+1.1rem)]"
            : "pt-6 md:pt-8"
        }`}
      >
        <div
          className={`flex items-baseline gap-3 text-label text-graphite uppercase ${
            full ? "w-full" : "w-full max-w-md justify-between gap-6 md:ml-auto"
          }`}
        >
          <span>{indexLabel}</span>
          {indexMeta && <span className="tabular-nums">{indexMeta}</span>}
        </div>

        <ol className="mt-[6vh] w-full max-w-md md:mt-[8vh] md:ml-auto">
          {rows.map((row, i) => (
            <li key={row.title} className="py-[clamp(0.5rem,1.4vh,0.9rem)]">
              <span className="flex items-baseline gap-3">
                <span className="text-lead">{row.title}</span>
                {/* Guía punteada: ocupa el sobrante entre el título y el numeral */}
                <span aria-hidden="true" className="min-w-6 flex-1 translate-y-[-0.25em] border-b border-dotted border-ink/30" />
                <span className="shrink-0 text-meta text-graphite tabular-nums">{String(i + 1).padStart(2, "0")}</span>
              </span>
              {row.note && <span className="mt-1 block max-w-[34ch] text-meta text-graphite">{row.note}</span>}
            </li>
          ))}
        </ol>

        {children}

        {inset && (
          <div
            data-reveal
            // Ajuste manual: bajar/subir la foto chica cambiando el margen inferior (md:mb)
            className={`mt-[12vh] self-end ${
              full
                ? "w-[min(58%,19rem)] md:mt-auto md:mb-[1vh]"
                : "w-[min(50%,16rem)] md:mt-auto md:mb-[10vh]"
            }`}
          >
            <Media
              src={inset.src}
              label={inset.label}
              tone={inset.tone}
              ratio={full ? "3 / 4.4" : "3 / 4"}
              sizes="(min-width: 768px) 22vw, 50vw"
              marks
            />
          </div>
        )}
      </div>
    </section>
  );
}
