"use client";

import { useEffect, useRef } from "react";

type Props = {
  /** La misma foto que muestra la tarjeta, en su tamaño original */
  src: string;
  /** Proporción de la tarjeta, para que el mosaico caiga cuadrado */
  ratio?: number;
};

// Columnas del mosaico: un solo valor, no una animación. Menos columnas = bloques más grandes.
const COLS = 30;

/**
 * Hover de la galería: la foto se pixela. El canvas redibuja la misma foto a pocas columnas, con
 * el suavizado apagado, y se enciende y apaga de una: no hay barrido progresivo ni vuelta atrás.
 * El recorte replica el `object-cover` de la foto de abajo, así al aparecer no se nota ningún salto
 * de encuadre ni de tamaño.
 */
export function PixelCover({ src, ratio = 4 / 3 }: Props) {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const el = canvas.current;
    const card = el?.closest("[data-pixel-card]");
    if (!el || !card) return;
    // En pantallas táctiles no hay hover: la foto queda nítida y no se descarga nada de más.
    if (!matchMedia("(hover: hover)").matches) return;

    const ctx = el.getContext("2d");
    const photo = new Image();
    photo.decoding = "async";
    let drawn = false;

    const draw = () => {
      if (!ctx || drawn || !photo.naturalWidth) return;
      el.width = COLS;
      el.height = Math.round(COLS / ratio);
      // Mismo recorte que object-cover: se toma del centro la franja que llena el cuadro
      const scale = Math.max(el.width / photo.naturalWidth, el.height / photo.naturalHeight);
      const w = el.width / scale;
      const h = el.height / scale;
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(photo, (photo.naturalWidth - w) / 2, (photo.naturalHeight - h) / 2, w, h, 0, 0, el.width, el.height);
      drawn = true;
    };
    photo.onload = draw;
    photo.src = src;

    const enter = () => {
      draw();
      el.style.opacity = "1";
    };
    const leave = () => (el.style.opacity = "0");
    card.addEventListener("pointerenter", enter);
    card.addEventListener("pointerleave", leave);
    card.addEventListener("focusin", enter);
    card.addEventListener("focusout", leave);
    return () => {
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
