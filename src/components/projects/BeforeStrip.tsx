import type { BeforeShot } from "@/components/site/content";
import { Media } from "@/components/site/Media";

type Props = { project: string; shots: BeforeShot[] };

/**
 * "Antes de la reforma": tira horizontal de fotos del estado original. En escritorio la sección se
 * fija y las fotos avanzan en horizontal con el scroll, con una línea que marca el recorrido
 * (motion.beforeStrip). En mobile no se fija nada: la tira se desliza con el dedo.
 * Sin foto, cada ambiente muestra su placeholder en el tono del proyecto.
 */
export function BeforeStrip({ project, shots }: Props) {
  return (
    <section data-before className="overflow-hidden md:h-svh">
      <div className="flex h-full flex-col px-(--gutter) pt-[12vh] pb-[8vh] md:pt-[14vh]">
        <h2 className="flex items-baseline justify-between border-t border-ink pt-5 text-heading">
          Antes de la reforma <span className="text-meta text-graphite tabular-nums">({shots.length} ambientes)</span>
        </h2>

        <div aria-hidden="true" className="relative mt-8 hidden h-px bg-ink/15 md:block">
          <span data-before-progress className="absolute inset-0 origin-left bg-ink" />
        </div>

        <ol
          data-before-track
          className="-mx-(--gutter) mt-10 flex snap-x snap-mandatory scroll-px-(--gutter) gap-(--gutter) overflow-x-auto px-(--gutter) md:mx-0 md:mt-[7vh] md:w-max md:flex-1 md:snap-none md:gap-[4vw] md:overflow-visible md:px-0"
        >
          {shots.map((shot, i) => (
            <li
              key={shot.title}
              data-before-shot
              className="flex w-[82vw] shrink-0 snap-start flex-col md:w-[min(52vw,46rem)]"
            >
              <Media
                src={shot.src}
                label={`${project}, antes: ${shot.title.toLowerCase()}`}
                tone={shot.tone}
                bleed="x"
                sizes="(min-width: 768px) 52vw, 82vw"
                className="aspect-[4/3] w-full md:aspect-auto md:min-h-0 md:flex-1"
              />
              <p className="mt-3 flex justify-between text-meta text-graphite tabular-nums">
                <span className="text-ink">{shot.title}</span>
                <span>({String(i + 1).padStart(2, "0")})</span>
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
