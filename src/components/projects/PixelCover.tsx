"use client";

import { useEffect, useRef } from "react";

type Props = {
  /** La misma foto que muestra la tarjeta, en su tamaño original */
  src: string;
  /** Proporción de la tarjeta, para que el mosaico caiga cuadrado */
  ratio?: number;
};

// Resolución del canvas: arranca tan fina que no se distingue de la foto y baja hasta el mosaico.
const FINE = 180;
const COARSE = 22;
const MS = 420;

// Salida suave, la misma curva que usa el resto del sitio (expo.out)
const ease = (t: number) => 1 - Math.pow(2, -10 * t);

/**
 * Hover de la galería: la foto se pixela de verdad, no cruza a una miniatura ya pixelada.
 * El canvas redibuja la misma foto a menos y menos columnas —con el suavizado apagado, así cada
 * paso es un mosaico limpio— y al salir el mosaico se vuelve a afinar hasta desaparecer.
 * Solo se redibuja cuando cambia la cantidad de columnas: son unos veinte cuadros, no sesenta.
 */
export function PixelCover({ src, ratio = 4 / 3 }: Props) {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const el = canvas.current;
    if (!el) return;
    const card = el.closest("[data-pixel-card]");
    if (!card) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // En pantallas táctiles no hay hover: la foto queda nítida y no se descarga nada de más.
    if (!matchMedia("(hover: hover)").matches) return;

    const ctx = el.getContext("2d");
    const photo = new Image();
    photo.decoding = "async";
    let ready = false;
    photo.onload = () => (ready = true);
    photo.src = src;

    let frame = 0;
    let cols = 0;
    const draw = (next: number) => {
      if (!ctx || !ready || next === cols) return;
      cols = next;
      el.width = next;
      el.height = Math.round(next / ratio);
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(photo, 0, 0, el.width, el.height);
    };

    // level 0 = foto nítida, 1 = mosaico
    let level = 0;
    const run = (to: number) => {
      cancelAnimationFrame(frame);
      const from = level;
      const start = performance.now();
      const step = (now: number) => {
        const t = Math.min(1, (now - start) / MS);
        level = from + (to - from) * ease(t);
        draw(Math.round(FINE + (COARSE - FINE) * level));
        el.style.opacity = level > 0.001 ? "1" : "0";
        if (t < 1) frame = requestAnimationFrame(step);
      };
      frame = requestAnimationFrame(step);
    };

    const enter = () => run(1);
    const leave = () => run(0);
    card.addEventListener("pointerenter", enter);
    card.addEventListener("pointerleave", leave);
    card.addEventListener("focusin", enter);
    card.addEventListener("focusout", leave);
    return () => {
      cancelAnimationFrame(frame);
      card.removeEventListener("pointerenter", enter);
      card.removeEventListener("pointerleave", leave);
      card.removeEventListener("focusin", enter);
      card.removeEventListener("focusout", leave);
    };
  }, [src, ratio]);

  return (
    <canvas
      ref={canvas}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full opacity-0"
      style={{ imageRendering: "pixelated" }}
    />
  );
}
