export type WordSvg = { w: number; h: number; inner: string };

type Props = {
  svg: WordSvg;
  /** Alto de la caja del SVG (ej. "0.66em"); el ancho sale de la proporción del viewBox */
  height: string;
  className?: string;
  /** Condensa la palabra: 1 = ancho natural, 0.94 = 6% más angosta (el alto no cambia) */
  condense?: number | string;
};

export function Word({ svg, height, className = "", condense = 1 }: Props) {
  return (
    <svg
      viewBox={`0 0 ${svg.w} ${svg.h}`}
      // Condensada, el SVG se estira dentro de su caja en vez de recortarse
      preserveAspectRatio={condense === 1 ? undefined : "none"}
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      className={`block overflow-visible ${className}`}
      style={{ height, width: `calc(${height} * ${svg.w / svg.h} * ${condense})` }}
      dangerouslySetInnerHTML={{ __html: svg.inner }}
    />
  );
}
