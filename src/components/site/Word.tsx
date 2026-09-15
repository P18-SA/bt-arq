export type WordSvg = { w: number; h: number; inner: string };

type Props = {
  svg: WordSvg;
  /** Alto de la caja del SVG (ej. "0.66em"); el ancho sale de la proporción del viewBox */
  height: string;
  className?: string;
};

export function Word({ svg, height, className = "" }: Props) {
  return (
    <svg
      viewBox={`0 0 ${svg.w} ${svg.h}`}
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      className={`block overflow-visible ${className}`}
      style={{ height, width: `calc(${height} * ${svg.w / svg.h})` }}
      dangerouslySetInnerHTML={{ __html: svg.inner }}
    />
  );
}
