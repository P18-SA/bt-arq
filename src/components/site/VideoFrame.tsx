import { Media } from "./Media";

type Props = {
  label: string;
  /** Con src se muestra el video real; sin src, un placeholder */
  src?: string;
  ratio?: string;
  /** Animación de entrada (máscara); en el detalle de proyecto va sin ella */
  reveal?: boolean;
  /** Parallax de ScrollSmoother para el fondo del placeholder */
  speed?: string;
  className?: string;
};

/** Video del proyecto. Mientras no haya archivo, muestra un cuadro oscuro con el botón de reproducir. */
export function VideoFrame({ label, src, ratio = "16 / 9", reveal = true, speed, className = "" }: Props) {
  if (src) {
    return (
      <figure className={`m-0 ${className}`}>
        <video src={src} controls playsInline preload="metadata" className="block w-full bg-ink" style={{ aspectRatio: ratio }}>
          <track kind="captions" />
        </video>
      </figure>
    );
  }

  return (
    <div data-reveal={reveal || undefined} className={`relative ${className}`}>
      <Media label={label} tone="shadow" placeholder="blank" ratio={ratio} bleed="y" speed={speed} />
      <div
        role="img"
        aria-label={`${label} (video pendiente)`}
        className="pointer-events-none absolute inset-0 flex flex-col justify-between p-[clamp(1rem,2vw,1.75rem)] text-paper"
      >
        <p className="text-sm text-paper/60">Video</p>
        <span className="flex size-[clamp(4rem,7vw,6rem)] items-center justify-center self-center rounded-full border border-paper/35 bg-paper/5 backdrop-blur-sm">
          <svg viewBox="0 0 24 24" className="ml-[8%] size-[34%]" aria-hidden="true">
            <path d="M6 4.5v15l13-7.5z" fill="currentColor" />
          </svg>
        </span>
        <div className="flex items-center gap-4 text-xs text-paper/60 tabular-nums">
          <span>0:00</span>
          <span className="h-px flex-1 bg-paper/25" />
          <span>1:30</span>
        </div>
      </div>
    </div>
  );
}
