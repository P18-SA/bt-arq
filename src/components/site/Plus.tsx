import type { ReactNode } from "react";

/** El "+" de la marca, dibujado con dos trazos para que escale con el texto. */
export function Plus({ className = "" }: { className?: string }) {
  return (
    <span aria-hidden="true" className={`relative inline-block size-[0.62em] shrink-0 ${className}`}>
      <span className="absolute inset-x-0 top-[calc(50%-0.03em)] h-[0.06em] bg-current" />
      <span className="absolute inset-y-0 left-[calc(50%-0.03em)] w-[0.06em] bg-current" />
    </span>
  );
}

/** Enlace "+ Texto": el "+" gira un cuarto de vuelta al pasar el cursor. */
export function PlusLabel({ children }: { children: ReactNode }) {
  return (
    <>
      <Plus className="transition-transform duration-700 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:rotate-90 group-focus-visible:rotate-90" />
      <span className="link-draw pb-0.5">{children}</span>
    </>
  );
}
