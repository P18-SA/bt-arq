"use client";

import { useRef, type ReactNode } from "react";
import { gsap, ScrollSmoother, useGSAP } from "@/lib/gsap";
import * as motion from "./motion";

type Props = {
  /** Elementos fijos: van fuera del contenedor con scroll suave (que usa transform) */
  fixed: ReactNode;
  children: ReactNode;
  /** Scroll suave con ScrollSmoother (la página de contacto no scrollea y no lo necesita) */
  smooth?: boolean;
};

// La intro del hero se ve una vez por visita, no cada vez que se vuelve a la home
let introPlayed = false;

export default function SiteMotion({ fixed, children, smooth = true }: Props) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    (_, contextSafe) => {
      const el = root.current!;
      const has = (sel: string) => el.querySelector(sel) !== null;
      const mm = gsap.matchMedia();

      mm.add(
        {
          motion: "(prefers-reduced-motion: no-preference)",
          desktop: "(min-width: 768px)",
          finePointer: "(hover: hover) and (pointer: fine)",
        },
        (ctx) => {
          const { motion: allowMotion, desktop, finePointer } = ctx.conditions!;
          if (!allowMotion) return;

          const smoother = smooth
            ? ScrollSmoother.create({ wrapper: "#smooth-wrapper", content: "#smooth-content", smooth: 1.1, effects: true })
            : null;

          // Primero las secciones fijadas (pin): los demás triggers calculan su posición contando ese espacio.
          // En dev, Strict Mode monta dos veces: la intro solo se marca como vista al completarse.
          let heroCleanup: (() => void) | undefined;
          if (smoother && has("[data-hero]")) {
            heroCleanup = motion.hero(el, smoother, !introPlayed, () => (introPlayed = true));
          }
          if (desktop && has("[data-work]")) motion.work(el);

          if (has("[data-page-title]") || has("[data-page-in]")) motion.pageIntro(el);
          if (has("[data-contact-page]")) motion.contactPage(el);
          motion.statements(el);
          motion.reveals(el);
          motion.plusDraws(el);
          motion.contactLines(el);

          const cleanups = [
            heroCleanup,
            smoother ? motion.capWheelSpeed(smoother) : undefined,
            finePointer && has("[data-index-list]") ? motion.indexPreview(el, ctx) : undefined,
            motion.rollLinks(el, ctx),
          ];
          return () => cleanups.forEach((fn) => fn?.());
        },
      );

      // Anclas dentro de la misma página: con scroll suave cuando está activo
      const onClick = contextSafe!((e: MouseEvent) => {
        const link = (e.target as Element).closest<HTMLAnchorElement>("a[href^='#']");
        const hash = link?.getAttribute("href");
        const target = hash && hash.length > 1 ? document.querySelector(hash) : null;
        if (!target) return;
        e.preventDefault();
        const smoother = ScrollSmoother.get();
        if (smoother) smoother.scrollTo(target, true, "top top");
        else target.scrollIntoView();
        history.replaceState(null, "", hash);
      });
      el.addEventListener("click", onClick);

      return () => {
        el.removeEventListener("click", onClick);
        mm.revert();
      };
    },
    { scope: root },
  );

  return (
    <div ref={root}>
      {fixed}
      {smooth ? (
        <div id="smooth-wrapper">
          <div id="smooth-content">{children}</div>
        </div>
      ) : (
        children
      )}
    </div>
  );
}
