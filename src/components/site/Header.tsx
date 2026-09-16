"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { gsap, ScrollSmoother, useGSAP } from "@/lib/gsap";
import { contact, nav } from "./content";
import { Plus } from "./Plus";
import { Word, type WordSvg } from "./Word";

type Props = {
  words: { berthet: WordSvg; taranto: WordSvg };
  /** En la home, el logo y los enlaces esperan a la intro del hero */
  intro?: boolean;
};

export function Header({ words, intro = false }: Props) {
  const [open, setOpen] = useState(false);
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

  // Abrir/cerrar: el "+" gira 45° y se vuelve una "×"
  useGSAP(
    () => {
      const tl = menu.current;
      if (!tl) return;
      const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce) tl.progress(open ? 1 : 0);
      else if (open) tl.timeScale(1).play();
      else tl.timeScale(1.7).reverse();
      gsap.to("[data-menu-icon]", { rotation: open ? 45 : 0, duration: reduce ? 0 : 0.8, ease: "expo.inOut" });
      ScrollSmoother.get()?.paused(open);
    },
    { dependencies: [open], scope },
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div ref={scope}>
      <header className="pointer-events-none fixed inset-x-0 top-0 z-50 text-white mix-blend-difference">
        <div className="flex items-center justify-between gap-6 px-(--gutter) pt-[calc(env(safe-area-inset-top,0px)+1.1rem)]">
          <Link
            href="/"
            {...introAttr("data-header-logo")}
            onClick={() => setOpen(false)}
            aria-label="Berthet + Taranto, inicio"
            className="pointer-events-auto flex items-center gap-[0.15em] text-[1.05rem]"
          >
            <Word svg={words.berthet} height="0.66em" />
            <Plus />
            <Word svg={words.taranto} height={`${(0.66 * words.taranto.h) / 154}em`} />
          </Link>

          <nav aria-label="Principal" className="pointer-events-auto hidden md:block">
            <ul className="flex gap-[clamp(0.9rem,2.4vw,2.25rem)] text-[0.9rem]">
              {nav.map((item) => (
                <li key={item.href} {...introAttr("data-header-item")}>
                  <Link
                    href={item.href}
                    aria-current={isCurrent(item.href) ? "page" : undefined}
                    className="link-draw pb-0.5"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <button
            type="button"
            {...introAttr("data-header-item")}
            aria-expanded={open}
            aria-controls="menu-movil"
            onClick={() => setOpen((v) => !v)}
            className="pointer-events-auto -mr-2 flex items-center gap-2 p-2 text-[0.9rem] md:hidden"
          >
            {open ? "Cerrar" : "Menú"}
            <span data-menu-icon className="inline-flex text-[1.35rem]">
              <Plus />
            </span>
          </button>
        </div>
      </header>

      <div
        id="menu-movil"
        data-menu-panel
        className="invisible fixed inset-0 z-40 flex flex-col justify-between bg-ink px-(--gutter) pt-[22vh] pb-[calc(env(safe-area-inset-bottom,0px)+1.5rem)] text-paper md:hidden"
      >
        <nav aria-label="Menú">
          <ul className="flex flex-col gap-1">
            {[{ href: "/", label: "Inicio" }, ...nav].map((item) => (
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
            ))}
          </ul>
        </nav>
        <div data-menu-meta className="grid gap-1 text-meta text-paper/60">
          <a href={`mailto:${contact.email}`} tabIndex={open ? 0 : -1} className="text-paper">
            {contact.email}
          </a>
          <p>{contact.city}</p>
        </div>
      </div>
    </div>
  );
}
