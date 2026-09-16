import { steps, type Tone } from "./content";
import { Media } from "./Media";

type Item = { title: string; text: string; tone: Tone };

type Props = {
  id?: string;
  title?: string;
  /** Texto chico a la derecha del título */
  aside?: string;
  items?: Item[];
  /** Numerar solo cuando los ítems son una secuencia (etapas); no para fotos sueltas */
  numbered?: boolean;
  /** Prefijo del texto alternativo de cada imagen */
  mediaLabel?: string;
};

/**
 * Tira horizontal fijada al scroll (en escritorio): nació como "Cómo trabajamos" y se reutiliza,
 * por ejemplo, para las fotos de antes de una reforma. La animación está en motion.process.
 */
export function Process({
  id = "proceso",
  title = "Cómo trabajamos",
  aside = "Tres etapas",
  items = steps,
  numbered = true,
  mediaLabel = "Imagen de la etapa",
}: Props) {
  return (
    <section id={id} data-process className="relative overflow-hidden bg-fog md:h-svh">
      <div className="flex h-full flex-col px-(--gutter) pt-[12vh] pb-[8vh] md:pt-[14vh]">
        <div className="flex items-baseline justify-between gap-6">
          <h2 className="text-heading">{title}</h2>
          <p className="hidden text-meta text-graphite md:block">({aside})</p>
        </div>

        <div className="relative mt-8 hidden h-px bg-ink/15 md:block">
          <span data-process-progress className="absolute inset-0 origin-left bg-ink" />
        </div>

        <ol
          data-process-track
          className="mt-10 flex flex-1 flex-col gap-16 md:mt-[7vh] md:w-max md:flex-row md:gap-[6vw]"
        >
          {items.map((s, i) => (
            <li
              key={s.title}
              data-process-step
              className="flex flex-col gap-6 md:w-[min(62vw,52rem)] md:flex-row md:gap-[3vw]"
            >
              <div className="md:w-[42%]">
                {numbered && (
                  <p className="mb-6 text-title tabular-nums">{String(i + 1).padStart(2, "0")}</p>
                )}
                <h3 className="text-subheading">{s.title}</h3>
                <p className="mt-3 max-w-[34ch] text-body text-graphite">{s.text}</p>
              </div>
              <Media
                label={`${mediaLabel}, ${s.title.toLowerCase()}`}
                tone={s.tone}
                bleed="x"
                className="aspect-[4/3] w-full md:aspect-auto md:h-[min(46vh,30rem)] md:flex-1"
              />
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
