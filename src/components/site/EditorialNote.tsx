import type { ReactNode } from "react";
import { Media } from "@/components/site/Media";
import type { Tone } from "@/components/site/content";

type Shot = { src?: string; label: string; tone: Tone };

type Props = {
  /** Rótulo en mayúscula, arriba a la izquierda */
  eyebrow: string;
  /** Línea grande que abre el bloque */
  lead: string | null;
  /** Cuerpo en letra chica, una entrada por párrafo */
  paragraphs: string[];
  /** Qué mostrar si no hay párrafos (en el wireframe, el hueco pendiente) */
  fallback?: ReactNode;
  /** Reemplaza la línea grande cuando el proyecto todavía no tiene frase */
  leadFallback?: ReactNode;
  /** Foto chica, arriba a la izquierda, a la altura del cuerpo */
  aside: Shot;
  /** Foto de cierre, a todo el ancho y casi la altura de la pantalla */
  wide: Shot;
};

/**
 * Nota editorial: banda compacta con la foto chica y el texto arriba, hombro con hombro, y la foto
 * a sangre pegada abajo (ver DESIGN.md §5). El bloque entra casi entero en una pantalla: los
 * separadores van en rem y no en vh, para que no se estire en monitores altos.
 * El contraste lo hace la mezcla de cuerpos: una línea grande y el resto en letra chica.
 */
export function EditorialNote({ eyebrow, lead, paragraphs, fallback, leadFallback, aside, wide }: Props) {
  return (
    <section className="bg-fog pt-[clamp(3rem,9vh,6rem)]">
      <div className="grid grid-cols-12 gap-x-(--gutter) gap-y-8 px-(--gutter) pb-[clamp(5rem,14vh,10rem)]">
        <p className="col-span-12 text-label text-graphite uppercase md:col-span-3">{eyebrow}</p>

        {/* Foto chica: al costado del texto, no encima */}
        <div data-reveal className="col-span-8 flex h-full flex-col justify-end md:col-span-3 md:col-start-1 md:row-start-2">
          <Media
            src={aside.src}
            label={aside.label}
            tone={aside.tone}
            ratio="4 / 3"
            bleed="y"
            speed="auto"
            sizes="(min-width: 768px) 25vw, 66vw"
            marks
          />
        </div>

        {/* Columna de texto, angosta y arrancando en el tope de la banda */}
        <div className="col-span-12 md:col-span-5 md:col-start-5 md:row-start-2">
          {lead ? (
            <p data-statement className="max-w-[18ch] text-heading text-balance">
              {lead}
            </p>
          ) : (
            leadFallback
          )}
          <div className="mt-8 max-w-[46ch] space-y-4 text-body text-graphite">
            {paragraphs.length ? paragraphs.map((text) => <p key={text}>{text}</p>) : fallback}
          </div>
        </div>
      </div>

      {/* Cierre a sangre, casi una pantalla de alto */}
      <div data-reveal className="h-[68svh] md:h-[76svh]">
        <Media
          src={wide.src}
          label={wide.label}
          tone={wide.tone}
          bleed="y"
          speed="auto"
          sizes="100vw"
          className="h-full w-full"
        />
      </div>
    </section>
  );
}
