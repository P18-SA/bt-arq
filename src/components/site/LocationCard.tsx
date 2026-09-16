import type { ReactNode } from "react";
import { contact } from "./content";
import { PlusLabel } from "./Plus";

const { address } = contact;
const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address.mapsQuery)}`;

/** Línea de texto con máscara, para que suba al aparecer la card. */
function Line({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span className={`block overflow-hidden ${className}`}>
      <span data-location-line className="block">
        {children}
      </span>
    </span>
  );
}

/**
 * Card cuadrada con la ubicación del estudio, en vidrio oscuro sobre la foto de fondo.
 * Muestra una foto en vez del mapa; al hacer click abre Google Maps.
 */
export function LocationCard({ className = "" }: { className?: string }) {
  return (
    <a
      href={mapsHref}
      target="_blank"
      rel="noopener noreferrer"
      data-location-card
      className={`group flex aspect-square flex-col gap-[clamp(0.6rem,1cqw,0.9rem)] border border-paper/15 bg-ink/45 p-[clamp(0.5rem,0.8cqw,0.75rem)] text-paper shadow-[0_1.5rem_4rem_-1rem_rgb(0_0_0/0.6)] backdrop-blur-xl backdrop-saturate-150 ${className}`}
    >
      <div className="relative flex-1 overflow-hidden">
        {/* Wireframe: foto del edificio pendiente */}
        <div data-location-photo className="absolute inset-y-0 -inset-x-[12%] bg-paper/10 text-paper/30 will-change-transform">
          <svg className="ph-x absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            <line x1="0" y1="0" x2="100" y2="100" stroke="currentColor" strokeWidth="1" />
            <line x1="100" y1="0" x2="0" y2="100" stroke="currentColor" strokeWidth="1" />
          </svg>
        </div>
      </div>

      <div className="flex flex-col gap-3 px-[clamp(0.25rem,0.5cqw,0.5rem)] pb-[clamp(0.25rem,0.5cqw,0.5rem)] text-[clamp(0.8rem,1cqw,0.95rem)] leading-snug">
        <address className="not-italic">
          <Line className="text-paper/55">Estudio</Line>
          <Line>{address.street}</Line>
          <Line>{address.detail}</Line>
          <Line>{address.city}</Line>
        </address>
        <Line>
          <span className="flex items-center gap-2">
            <PlusLabel>Ver en el mapa</PlusLabel>
            <span className="sr-only">(se abre en otra pestaña)</span>
          </span>
        </Line>
      </div>
    </a>
  );
}
