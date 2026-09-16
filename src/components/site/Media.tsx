import Image from "next/image";
import type { CSSProperties } from "react";
import type { Tone } from "./content";

const tones: Record<Tone, { bg: string; ink: string }> = {
  fog: { bg: "bg-fog", ink: "text-ink/35" },
  concrete: { bg: "bg-concrete", ink: "text-ink/40" },
  graphite: { bg: "bg-graphite", ink: "text-white/45" },
  shadow: { bg: "bg-shadow", ink: "text-white/40" },
};

// Cuánto sobresale la capa interior, para poder moverla (parallax) sin mostrar bordes
const bleeds = {
  none: "inset-0",
  y: "inset-x-0 -inset-y-[12%]",
  x: "inset-y-0 -inset-x-[10%]",
};

type Props = {
  /** Texto alternativo de la imagen, o rótulo del placeholder */
  label: string;
  /** Con src muestra la imagen; sin src, el placeholder (rectángulo cruzado) */
  src?: string;
  /** Dibujo del placeholder: "void" (rectángulo cruzado, obras), "person" (silueta, retratos) o "blank" (liso, p. ej. debajo de un video) */
  placeholder?: "void" | "person" | "blank";
  /** object-position de la imagen */
  crop?: string;
  sizes?: string;
  preload?: boolean;
  tone?: Tone;
  ratio?: string;
  bleed?: keyof typeof bleeds;
  marks?: boolean;
  speed?: string;
  labelAt?: "bottom" | "top";
  className?: string;
  style?: CSSProperties;
};

export function Media({
  label,
  src,
  placeholder = "void",
  crop,
  sizes = "100vw",
  preload = false,
  tone = "concrete",
  ratio,
  bleed = "none",
  marks = false,
  speed,
  labelAt = "bottom",
  className = "",
  style,
}: Props) {
  const t = tones[tone];
  return (
    <figure data-ph-wrap className={`relative m-0 ${className}`} style={{ aspectRatio: ratio, ...style }}>
      <div data-ph className="absolute inset-0 overflow-hidden">
        <div
          data-ph-inner
          data-speed={speed}
          className={`absolute ${bleeds[bleed]} ${src ? "bg-shadow" : `${t.bg} ${t.ink}`} will-change-transform`}
        >
          {src ? (
            <Image
              src={src}
              alt={label}
              fill
              sizes={sizes}
              preload={preload}
              className="object-cover"
              style={{ objectPosition: crop }}
            />
          ) : placeholder === "person" ? (
            <svg
              className="absolute inset-x-0 bottom-[6%] h-[64%] w-full"
              viewBox="0 0 100 100"
              preserveAspectRatio="xMidYMax meet"
              role="img"
              aria-label={label}
            >
              <circle cx="50" cy="34" r="17" fill="currentColor" />
              <path d="M12 100 C12 70 28 58 50 58 C72 58 88 70 88 100 Z" fill="currentColor" />
            </svg>
          ) : placeholder === "blank" ? null : (
            <svg
              className="ph-x absolute inset-0 h-full w-full"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <line x1="0" y1="0" x2="100" y2="100" stroke="currentColor" strokeWidth="1" />
              <line x1="100" y1="0" x2="0" y2="100" stroke="currentColor" strokeWidth="1" />
            </svg>
          )}
        </div>
        {!src && placeholder === "void" && (
          <figcaption className={`absolute left-3 text-label ${labelAt === "top" ? "top-20" : "bottom-3"} ${t.ink}`}>
            {label}
          </figcaption>
        )}
      </div>
      {marks && (
        <span aria-hidden="true" className="text-ink">
          <span data-ph-mark className="ph-mark -top-1.5 -left-1.5" />
          <span data-ph-mark className="ph-mark -top-1.5 -right-1.5" />
          <span data-ph-mark className="ph-mark -bottom-1.5 -left-1.5" />
          <span data-ph-mark className="ph-mark -bottom-1.5 -right-1.5" />
        </span>
      )}
    </figure>
  );
}
