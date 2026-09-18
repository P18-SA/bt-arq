import { Fragment, type CSSProperties } from "react";
import { Media } from "./Media";
import { work } from "./content";

const numeral = (i: number) => String(i + 1).padStart(2, "0");

/**
 * Etapas del trabajo del estudio, en el patrón de la página "cómo trabajamos" de un catálogo:
 * las obras van una debajo de la otra, a pantalla por etapa, y **nada se mueve dentro del cuadro**.
 * Lo que queda fijo es el texto: la pila de etapas se clava arriba y va creciendo, y el párrafo
 * acompaña a su obra hasta que entra la siguiente. La etapa ya leída se queda en la pila pero
 * reducida a su numeral: **solo la etapa en la que estamos dice su nombre**, para que siempre se
 * sepa qué se está leyendo. Lo resuelve `motion.work` con pines de ScrollTrigger: `position: sticky`
 * no sirve acá, porque con ScrollSmoother la página no scrollea de verdad.
 * En mobile no hay nada fijo: rótulo, texto y obra se leen uno debajo del otro.
 */
export function HowWeWork() {
  const { steps } = work;

  return (
    <div data-work className="grid grid-cols-4 gap-x-(--gutter) px-(--gutter) md:grid-cols-12">
      {/* La pila: una sola lista para las cuatro etapas, que se clava y crece (solo escritorio) */}
      <div data-work-cell style={{ "--row": 1 } as CSSProperties} className="hidden md:col-span-3 md:block">
        <ol data-work-stack className="bg-paper">
          {steps.map((step, i) => (
            <li key={step.title} data-work-row className="overflow-hidden">
              <div className="pb-4">
                <p className="text-meta text-graphite tabular-nums">Etapa {numeral(i)}</p>
                <div data-work-title className="overflow-hidden">
                  <h2 className="mt-1 text-lead font-medium">{step.title}</h2>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>

      {steps.map((step, i) => (
        <Fragment key={step.title}>
          {/* En mobile no hay pila: cada etapa lleva su rótulo arriba */}
          <div className="col-span-4 md:hidden">
            <p className="text-meta text-graphite tabular-nums">Etapa {numeral(i)}</p>
            <h2 className="mt-1 text-lead font-medium">{step.title}</h2>
          </div>

          {/* Texto: acompaña a su obra y se suelta cuando entra la siguiente */}
          <div
            data-work-cell
            style={{ "--row": i + 1 } as CSSProperties}
            className="col-span-4 mt-5 mb-6 md:col-span-3 md:col-start-4 md:mt-0 md:mb-0"
          >
            <p data-work-copy className="max-w-[42ch] bg-paper text-body text-graphite">
              {step.text}
            </p>
          </div>

          {/* La obra: quieta, a pantalla completa, pegada a la de arriba y a la de abajo */}
          <div
            data-work-cell
            style={{ "--row": i + 1 } as CSSProperties}
            className="col-span-4 mb-16 aspect-[3/4] md:col-span-5 md:col-start-8 md:mb-0 md:aspect-auto md:h-svh"
          >
            <Media
              src={step.shot()}
              label={`Obra del estudio, etapa de ${step.title.toLowerCase()}`}
              tone={step.tone}
              sizes="(min-width: 768px) 42vw, 100vw"
              grain
              className="h-full w-full"
            />
          </div>
        </Fragment>
      ))}
    </div>
  );
}
