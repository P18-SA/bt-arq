"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { gsap, ScrollSmoother, useGSAP } from "@/lib/gsap";
import { contact, nav } from "./content";
import { Clock } from "./Clock";
import { ContactModal } from "./ContactModal";
import { CircleButton } from "./CircleButton";
import { Plus } from "./Plus";
import { Word, type WordSvg } from "./Word";

type Props = {
  words: { berthet: WordSvg; taranto: WordSvg };
  /** En la home, el logo y los enlaces esperan a la intro del hero */
  intro?: boolean;
};

// Cada dato del header entra desde su propia línea: el wrapper recorta, el interior sube.
function Rise({ children }: { children: ReactNode }) {
  return (
    <span className="block overflow-hidden pb-[0.2em]">
      <span data-header-rise className="block">
        {children}
      </span>
    </span>
  );
}

export function Header({ words, intro = false }: Props) {
  const [open, setOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const pathname = usePathname();
  const scope = useRef<HTMLDivElement>(null);
  const menu = useRef<gsap.core.Timeline | null>(null);
  const introAttr = (name: "data-header-item" | "data-header-logo") => (intro ? { [name]: "" } : {});
  // "Proyectos" también queda marcado dentro de la página de un proyecto
  const isCurrent = (href: string) =>
    pathname === href || (href === "/todos-los-proyectos" && pathname.startsWith("/proyectos/"));

  useGSAP(
    () => {
      menu.current = gsap
        .timeline({ paused: true, defaults: { ease: "expo.inOut" } })
        .set("[data-menu-panel]", { autoAlpha: 1 })
        .fromTo(
          "[data-menu-panel]",
          { clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)" },
          { clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)", duration: 0.9 },
        )
        .fromTo("[data-menu-link]", { yPercent: 110 }, { yPercent: 0, duration: 0.9, ease: "expo.out", stagger: 0.06 }, 0.35)
        .fromTo("[data-menu-meta]", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.6, ease: "power1.out" }, 0.7);
    },
    { scope },
  );

  // Abrir/cerrar el panel del menú móvil
  useGSAP(
    () => {
      const tl = menu.current;
      if (!tl) return;
      const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce) tl.progress(open ? 1 : 0);
      else if (open) tl.timeScale(1).play();
      else tl.timeScale(1.7).reverse();
      ScrollSmoother.get()?.paused(open);
    },
    { dependencies: [open], scope },
  );

  // Red de seguridad al navegar: el header se esconde esperando a la intro del hero, que se juega
  // una sola vez por visita. Si al llegar a la home ya se jugó (marca `intro-done`), nace visible,
  // sin depender de que el timeline del hero vuelva a correr ni de en qué orden revierte GSAP los
  // estilos de la página que se desmonta. Va en un frame posterior, después de esos dos.
  // Va fuera de un contexto de GSAP a propósito: si quedara registrado, al revertirse (cambio de
  // ruta, desmontaje) GSAP devolvería los estilos previos, que pueden ser los del header escondido.
  // Se limpian los estilos en línea: con `intro-done` el CSS ya los deja visibles en su lugar.
  useEffect(() => {
    let frame = 0;
    const reset = () => {
      if (!document.documentElement.classList.contains("intro-done")) return;
      const el = scope.current;
      if (!el) return;
      gsap.set(el.querySelectorAll("[data-header-item], [data-header-menu], [data-header-logo], [data-header-rise], [data-header-clock]"), {
        clearProps: "opacity,visibility,transform",
      });
    };
    // Dos frames: después de que la página nueva monte sus animaciones y la vieja revierta las suyas
    frame = requestAnimationFrame(() => (frame = requestAnimationFrame(reset)));
    return () => cancelAnimationFrame(frame);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div ref={scope}>
      {/* Velo bajo el header: va por fuera del mix-blend-difference, y solo se enciende cuando
          pasa por debajo un bloque a sangre (ver [data-header-over] en motion.ts). */}
      <span
        aria-hidden="true"
        data-header-scrim
        className="pointer-events-none invisible fixed inset-x-0 top-0 z-40 h-[clamp(5rem,9vw,8rem)] bg-linear-to-b from-black/45 via-black/20 to-transparent opacity-0"
      />
      <header data-header className="pointer-events-none fixed inset-x-0 top-0 z-50 text-white mix-blend-difference">
        <div className="flex items-center justify-between gap-6 px-[calc(var(--gutter)+var(--edge))] pt-[calc(env(safe-area-inset-top,0px)+1.1rem)]">
          <Link
            href="/"
            {...introAttr("data-header-logo")}
            onClick={() => setOpen(false)}
            aria-label="Berthet + Taranto, inicio"
            className="pointer-events-auto flex items-center gap-[0.15em] text-[clamp(1.1rem,1.3vw,1.4rem)]"
          >
            <Word svg={words.berthet} height="0.66em" />
            <Plus />
            <Word svg={words.taranto} height={`${(0.66 * words.taranto.h) / 154}em`} />
          </Link>

          <span
            data-header-clock
            {...introAttr("data-header-item")}
            // AJUSTE A MANO — aire entre el logo y la hora cuando el hero ya está abierto
            className="pointer-events-none hidden translate-y-[0.12em] lg:block lg:ml-[clamp(1.5rem,4vw,5.5rem)]"
          >
            <Rise>
              <Clock className="text-[clamp(1rem,1.15vw,1.25rem)]" />
            </Rise>
          </span>

          <nav aria-label="Principal" className="pointer-events-auto ml-auto hidden translate-y-[0.12em] md:block">
            <ul className="flex gap-[clamp(1rem,2.6vw,2.5rem)] text-[clamp(1rem,1.15vw,1.25rem)]">
              {nav.map((item) =>
                item.href === "/contacto" ? (
                  <li key={item.href} {...introAttr("data-header-item")}>
                    <Rise>
                      <button
                        type="button"
                        aria-expanded={contactOpen}
                        onClick={() => setContactOpen(true)}
                        className="link-draw pb-0.5"
                      >
                        {item.label}
                      </button>
                    </Rise>
                  </li>
                ) : (
                  <li key={item.href} {...introAttr("data-header-item")}>
                    <Rise>
                      <Link
                        href={item.href}
                        aria-current={isCurrent(item.href) ? "page" : undefined}
                        className="link-draw pb-0.5"
                      >
                        {item.label}
                      </Link>
                    </Rise>
                  </li>
                ),
              )}
            </ul>
          </nav>

          <div {...introAttr("data-header-item")} {...(intro ? { "data-header-menu": "" } : {})} className="md:hidden">
            <CircleButton
              aria-expanded={open}
              aria-controls="menu-movil"
              onClick={() => setOpen((v) => !v)}
              filled={open}
              className="-mr-2 p-2 text-[0.9rem]"
            >
              {open ? "Cerrar" : "Menú"}
            </CircleButton>
          </div>
        </div>
      </header>

      <div
        id="menu-movil"
        data-menu-panel
        className="invisible fixed inset-0 z-40 flex flex-col justify-between bg-ink px-(--gutter) pt-[22vh] pb-[calc(env(safe-area-inset-bottom,0px)+1.5rem)] text-paper md:hidden"
      >
        <nav aria-label="Menú">
          <ul className="flex flex-col gap-1">
            {[{ href: "/", label: "Inicio" }, ...nav].map((item) =>
              item.href === "/contacto" ? (
                <li key={item.href} className="overflow-hidden">
                  <button
                    type="button"
                    data-menu-link
                    tabIndex={open ? 0 : -1}
                    onClick={() => {
                      setOpen(false);
                      setContactOpen(true);
                    }}
                    className="block py-1 text-title"
                  >
                    {item.label}
                  </button>
                </li>
              ) : (
              <li key={item.href} className="overflow-hidden">
                <Link
                  href={item.href}
                  data-menu-link
                  tabIndex={open ? 0 : -1}
                  aria-current={isCurrent(item.href) ? "page" : undefined}
                  onClick={() => setOpen(false)}
                  className="block py-1 text-title aria-[current=page]:text-paper/45"
                >
                  {item.label}
                </Link>
              </li>
              ),
            )}
          </ul>
        </nav>
        <div data-menu-meta className="grid gap-1 text-meta text-paper/60">
          <a href={`mailto:${contact.email}`} tabIndex={open ? 0 : -1} className="text-paper">
            {contact.email}
          </a>
          <p>{contact.city}</p>
        </div>
      </div>

      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />
    </div>
  );
}
