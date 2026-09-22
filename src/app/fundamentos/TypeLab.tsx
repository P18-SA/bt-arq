"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Eje variable en vivo. ABC Areal va de 400 a 700: el control recorre ese rango y muestra el valor.
 * El input es un range nativo, así que anda con teclado sin código extra.
 */
export function WeightAxis({ min, max, line }: { min: number; max: number; line: string }) {
  const [weight, setWeight] = useState(min);
  return (
    <div>
      <p
        className="d-sample"
        style={{ fontSize: "2rem", lineHeight: 1.1, letterSpacing: "-0.02em", fontWeight: weight, fontVariationSettings: `"wght" ${weight}` }}
      >
        {line}
      </p>
      <div className="mt-6 flex items-center gap-4">
        <label htmlFor="wght" className="f-muted d-label">
          Peso
        </label>
        <input
          id="wght"
          type="range"
          min={min}
          max={max}
          step={1}
          value={weight}
          onChange={(e) => setWeight(Number(e.target.value))}
          className="f-range w-full max-w-[22rem] flex-1"
        />
        <output htmlFor="wght" className="w-[4ch] d-meta tabular-nums">
          {weight}
        </output>
      </div>
      <p className="f-muted mt-3 max-w-[60ch] d-body">
        El eje arranca en {min} y llega a {max}. No hay peso más fino que {min}: por eso el sistema nunca usa
        `font-light`, y el énfasis en cuerpos chicos se consigue subiendo el peso, no bajándolo.
      </p>
    </div>
  );
}

type Metrics = { cap: number; x: number; asc: number; desc: number; size: number };

const terms = [
  { key: "asc", label: "Ascendente", note: "Lo que sube por encima de la altura de x, como la ‘t’ o la ‘h’." },
  { key: "cap", label: "Altura de mayúscula", note: "Del pie a la cabeza de la ‘B’." },
  { key: "x", label: "Altura de x", note: "El cuerpo de las minúsculas sin astas; es lo que se lee de lejos." },
  { key: "desc", label: "Descendente", note: "Lo que baja de la línea de base, como la ‘p’." },
] as const;

/**
 * Anatomía sobre una palabra. Las alturas no están escritas a mano: se miden en el navegador con
 * `measureText` sobre la fuente ya cargada, así el dibujo no se desfasa si la fuente cambia.
 */
export function Anatomy({ word }: { word: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [m, setM] = useState<Metrics | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let cancelled = false;

    const measure = () => {
      const style = getComputedStyle(el);
      const size = parseFloat(style.fontSize);
      const ctx = document.createElement("canvas").getContext("2d");
      if (!ctx || cancelled) return;
      ctx.font = `${style.fontWeight} ${size}px ${style.fontFamily}`;
      const up = (t: string) => ctx.measureText(t).actualBoundingBoxAscent;
      const down = (t: string) => ctx.measureText(t).actualBoundingBoxDescent;
      const cap = up("B");
      if (!cap) return;
      setM({ cap, x: up("x"), asc: up("h"), desc: down("p"), size });
    };

    document.fonts.ready.then(measure).catch(() => undefined);
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => {
      cancelled = true;
      ro.disconnect();
    };
  }, [word]);

  // La línea de base cae a `desc` del pie de la caja que dibujamos.
  const baseline = m ? m.desc : 0;
  // Si dos medidas coinciden (en ABC Areal la ascendente llega a la altura de mayúscula), se
  // dibuja una sola línea: dos guías superpuestas parecen un error de dibujo.
  const guides = m
    ? [...new Set([m.asc, m.cap, m.x, 0, -m.desc].map((v) => Math.round(v)))].map((top) => ({
        key: String(top),
        top,
      }))
    : [];

  return (
    <div>
      <div className="relative inline-block">
        <p ref={ref} style={{ fontSize: "clamp(3.5rem, 9vw, 5.5rem)", lineHeight: 1, letterSpacing: "-0.03em" }}>
          {word}
        </p>
        {m &&
          guides.map((g) => (
            <span
              key={g.key}
              aria-hidden
              className="f-hair pointer-events-none absolute right-0 -left-8 border-t"
              style={{ bottom: `${baseline + g.top}px` }}
            />
          ))}
      </div>

      <dl className="mt-8 grid gap-x-(--gutter) gap-y-4 sm:grid-cols-2">
        {terms.map((t) => (
          <div key={t.key}>
            <dt className="d-meta">
              {t.label}
              {m ? <span className="f-muted"> · {Math.round((m[t.key] / m.size) * 1000)}/1000 em</span> : null}
            </dt>
            <dd className="f-muted mt-1 max-w-[46ch] d-body">{t.note}</dd>
          </div>
        ))}
      </dl>
      {m && Math.round(m.asc) === Math.round(m.cap) ? (
        <p className="f-muted mt-4 max-w-[60ch] d-body">
          En esta fuente la ascendente llega justo a la altura de mayúscula: por eso hay una guía menos que términos.
        </p>
      ) : null}
      {!m && (
        <p className="f-muted mt-4 d-meta">
          Medidas pendientes: se calculan en el navegador cuando la fuente termina de cargar.
        </p>
      )}
    </div>
  );
}
