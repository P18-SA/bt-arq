import Link from "next/link";
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
  const label = (
    <div
      className={
        full
          ? // Mismo tamaño, peso e interlínea que los ítems de la nav del header
            "flex shrink-0 items-baseline gap-0 font-medium normal-case text-[clamp(1rem,1.15vw,1.25rem)] text-ink"
          : "flex w-full max-w-md items-baseline justify-between gap-6 text-label text-graphite uppercase md:ml-auto"
      }
    >
      <span>{indexLabel}</span>
      {indexMeta &&
        (full ? (
          <span className="ml-[0.12em] inline-block translate-y-[-0.42em] text-[0.62em] font-medium tabular-nums text-graphite">
            {indexMeta}
          </span>
        ) : (
          <span className="tabular-nums">{indexMeta}</span>
        ))}
    </div>
  );

  const list = (
    <ol className={`w-full max-w-md md:ml-auto ${full ? "" : "mt-[6vh] md:mt-[8vh]"}`}>
      {rows.map((row, i) => {
        const body = (
          <>
            <span className="flex items-baseline gap-3">
              <span className="link-draw text-lead">{row.title}</span>
              {/* Guía punteada: ocupa el sobrante entre el título y el numeral */}
              <span aria-hidden="true" className="min-w-6 flex-1 translate-y-[-0.25em] border-b border-dotted border-ink/30" />
              <span className="shrink-0 text-meta text-graphite tabular-nums">{String(i + 1).padStart(2, "0")}</span>
            </span>
            {row.note && <span className="mt-0.5 block max-w-[34ch] text-meta text-graphite">{row.note}</span>}
          </>
        );
        return (
          // Interlínea ajustada a mano: filas apretadas, sin perder el área de click
          <li key={row.title} className="py-[clamp(0.25rem,0.7vh,0.5rem)]">
            {row.href ? (
              <Link href={row.href} className="group block">
                {body}
              </Link>
            ) : (
              body
            )}
          </li>
        );
      })}
    </ol>
  );

  return (
    <section className={`grid grid-cols-1 items-stretch md:grid-cols-2 ${full ? "md:min-h-[124svh]" : ""}`}>
      {/* Izquierda: la obra, a sangre contra el borde de la sección */}
      <div data-reveal className={`relative ${full ? "h-[124svh] md:h-full" : ""}`}>
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
        {full ? (
          // El rótulo cae en la misma línea que el título de la fila 01 (en mobile va arriba)
          <div className="mt-[6vh] flex flex-col gap-6 md:mt-[8vh] md:flex-row md:items-baseline md:gap-(--gutter)">
            {label}
            {list}
          </div>
        ) : (
          <>
            {label}
            {list}
          </>
        )}

        {children}

        {inset && (
          <div
            data-reveal
            // Ajuste manual: bajar/subir la foto chica cambiando el margen inferior (md:mb)
            className={`mt-[12vh] self-end ${
              full
                ? "w-[min(58%,19rem)] md:mt-auto md:mb-[2vh]"
                : "w-[min(54%,17.5rem)] md:mt-auto md:mb-[3vh]"
            }`}
          >
            <Media
              src={inset.src}
              label={inset.label}
              tone={inset.tone}
              ratio={full ? "3 / 4.4" : "3 / 4.3"}
              sizes="(min-width: 768px) 22vw, 50vw"
              marks
            />
          </div>
        )}
      </div>
    </section>
  );
}
