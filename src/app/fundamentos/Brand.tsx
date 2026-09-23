import { Plus } from "@/components/site/Plus";
import { Word } from "@/components/site/Word";
import { wordmark } from "@/components/site/wordmark";

/**
 * El logotipo del sitio, dibujado con los mismos SVG que usa la web y en `currentColor`: así la
 * lámina que lo muestra sobre un fondo no es una captura ni un PNG aparte, es la marca misma.
 */
export function Lockup({ size = "1.5rem", stacked = false }: { size?: string; stacked?: boolean }) {
  return (
    <span
      className={`f-lockup inline-flex ${stacked ? "flex-col items-center gap-[0.3em]" : "items-center gap-[0.4em]"}`}
      style={{ fontSize: size }}
    >
      <span className="inline-flex items-center gap-[0.4em]">
        <Word svg={wordmark.berthet} height="0.62em" />
        <Plus thin className="text-[1em]" />
        <Word svg={wordmark.taranto} height="0.62em" />
      </span>
      {stacked ? <Word svg={wordmark.arquitectas} height="0.34em" /> : null}
    </span>
  );
}

/**
 * Lámina de marca sobre un fondo: el logotipo en el color que contrasta, con el nombre del tono y
 * su valor al pie. Es la pieza que se mira para decidir sobre qué fondos puede ir la marca.
 */
export function BrandPlate({
  bg,
  ink,
  label,
  value,
  note,
  size = "1.6rem",
  ratio = "4 / 3",
}: {
  bg: string;
  ink: string;
  label: string;
  value?: string;
  note?: string;
  size?: string;
  ratio?: string;
}) {
  return (
    <figure className="m-0">
      <div
        className="f-plate f-rule flex items-center justify-center border"
        style={{ background: bg, color: ink, aspectRatio: ratio }}
      >
        <Lockup size={size} />
      </div>
      <figcaption className="mt-3 flex items-baseline justify-between gap-4">
        <span className="d-meta">{label}</span>
        {value ? <span className="f-muted d-meta tabular-nums uppercase">{value}</span> : null}
      </figcaption>
      {note ? <p className="f-muted mt-1 max-w-[30ch] d-body">{note}</p> : null}
    </figure>
  );
}
