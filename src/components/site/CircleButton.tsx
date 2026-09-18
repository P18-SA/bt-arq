"use client";

import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  /** El círculo arranca relleno (para el estado "Cerrar" sobre fondo oscuro) */
  filled?: boolean;
  className?: string;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "type" | "onClick" | "className" | "children">;

/**
 * Botón circular del sistema: un círculo vacío al lado del texto que se rellena
 * al pasar el cursor. Con `filled` ya viene relleno y se vacía al hover.
 */
export function CircleButton({ children, onClick, type = "button", filled = false, className = "", ...rest }: Props) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`group pointer-events-auto flex items-center gap-2 text-meta ${className}`}
      {...rest}
    >
      <span
        className={`size-[0.9em] shrink-0 rounded-full border border-current transition-colors duration-300 ease-[cubic-bezier(0.65,0,0.35,1)] ${
          filled
            ? "bg-current group-hover:bg-transparent group-focus-visible:bg-transparent"
            : "bg-transparent group-hover:bg-current group-focus-visible:bg-current"
        }`}
      />
      <span className="link-draw pb-0.5">{children}</span>
    </button>
  );
}
