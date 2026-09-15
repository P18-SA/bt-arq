import type { ReactNode } from "react";

type PlusProps = {
  className?: string;
  /** Trazo fino, con la proporción del "+" del logo del hero (para tamaños grandes) */
  thin?: boolean;
  /** Los trazos se dibujan al entrar en pantalla (motion.plusDraws) */
  draw?: boolean;
};

/** El "+" de la marca, dibujado con dos trazos para que escale con el texto. */
export function Plus({ className = "", thin = false, draw = false }: PlusProps) {
  return (
    <span
      aria-hidden="true"
      data-plus-draw={draw || undefined}
      className={`relative inline-block size-[0.62em] shrink-0 ${className}`}
    >
      <span
        data-plus-draw-h={draw || undefined}
        className={`absolute inset-x-0 bg-current ${thin ? "top-[calc(50%-0.02em)] h-[0.04em]" : "top-[calc(50%-0.03em)] h-[0.06em]"}`}
      />
      <span
        data-plus-draw-v={draw || undefined}
        className={`absolute inset-y-0 bg-current ${thin ? "left-[calc(50%-0.02em)] w-[0.04em]" : "left-[calc(50%-0.03em)] w-[0.06em]"}`}
      />
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
