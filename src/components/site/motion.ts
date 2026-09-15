import { gsap, ScrollSmoother, ScrollTrigger, SplitText } from "@/lib/gsap";

type Ctx = gsap.Context;

// Se usa polygon() y no inset(): el navegador abrevia inset(50% 50% 50% 50%) a inset(50%)
// y GSAP no puede interpolar entre cantidades distintas de valores.
const poly = (...pts: [number, number][]) => `polygon(${pts.map(([x, y]) => `${x}% ${y}%`).join(", ")})`;
const FULL = poly([0, 0], [100, 0], [100, 100], [0, 100]);
const POINT = poly([50, 50], [50, 50], [50, 50], [50, 50]);
const FLOOR = poly([0, 100], [100, 100], [100, 100], [0, 100]);

const all = <T extends Element = HTMLElement>(root: ParentNode, sel: string) =>
  Array.from(root.querySelectorAll<T>(sel)) as unknown as T[];
const one = <T extends Element = HTMLElement>(root: ParentNode, sel: string) =>
  root.querySelector<T>(sel)!;

/**
 * Hero de la home. Intro: una cruz ocupa toda la pantalla, se repliega hasta ser el "+" del logo,
 * los dos nombres salen desde ahí y, tras una pausa corta, la foto se abre sola desde el mismo punto.
 * Scroll: sin pin; el hero se va con la página mientras el logo grande se desvanece.
 * Hay dos copias del logo: negra sobre el blanco y blanca dentro de la foto (recortada con ella).
 */
export function hero(root: HTMLElement, smoother: ScrollSmoother, playIntro: boolean, onIntroDone: () => void) {
  const section = one(root, "[data-hero]");
  const plus = one(root, "[data-plus]");
  const lineH = all(root, "[data-plus-h]");
  const lineV = all(root, "[data-plus-v]");
  const left = all(root, "[data-name-left]");
  const right = all(root, "[data-name-right]");
  const blocks = all(root, "[data-hero-block]");
  const wordmarks = all(root, "[data-hero-block] [data-hero-intro]");
  const hint = one(root, "[data-hero-hint]");
  const media = one(root, "[data-hero-media]");
  const mediaInner = one(media, "[data-ph-inner]");
  const caption = one(root, "[data-hero-caption]");
  const headerItems = all(root, "[data-header-item]");
  const logo = one(root, "[data-header-logo]");
  // Cada letra de ARQUITECTAS es un <g data-glyph> dentro del SVG
  const glyphs = all<SVGGElement>(root, "[data-hero-sub] [data-glyph]");
  const glyphDrop = (_: number, g: SVGGElement) => g.ownerSVGElement!.viewBox.baseVal.height;

  // Estado inicial: la foto reducida a un punto en el centro del "+" (que siempre queda al centro de la pantalla)
  gsap.set(media, { clipPath: POINT, autoAlpha: 1 });
  gsap.set([caption, logo], { autoAlpha: 0 });

  // --- Scroll (sin pin): el hero se va con la página; el logo grande sube y se desvanece mientras sale
  gsap.fromTo(
    blocks,
    { yPercent: 0, autoAlpha: 1 },
    {
      yPercent: -30,
      autoAlpha: 0,
      ease: "power1.in",
      immediateRender: false,
      scrollTrigger: { trigger: section, start: "top top", end: "60% top", scrub: true },
    },
  );
  // "Deslizá para entrar" se va al empezar a scrollear (con callbacks: un scrub lo mostraría antes de la intro)
  ScrollTrigger.create({
    trigger: section,
    start: "12% top",
    onEnter: () => gsap.to(hint, { autoAlpha: 0, duration: 0.3, overwrite: true }),
    onLeaveBack: () => gsap.to(hint, { autoAlpha: 1, duration: 0.4, overwrite: true }),
  });
  // El logo del header aparece cuando el hero ya casi salió
  ScrollTrigger.create({
    trigger: section,
    start: "70% top",
    onEnter: () => gsap.to(logo, { autoAlpha: 1, duration: 0.5, overwrite: true }),
    onLeaveBack: () => gsap.to(logo, { autoAlpha: 0, duration: 0.3, overwrite: true }),
  });

  // --- Intro: cruz → "+" → nombres → pausa corta con el logo → la foto se abre sola desde el "+"
  const cover = (axis: "x" | "y") => () =>
    axis === "x" ? (innerWidth * 2.2) / plus.offsetWidth : (innerHeight * 2.2) / plus.offsetHeight;

  const intro = gsap
    .timeline({ defaults: { ease: "expo.inOut" }, onComplete: onIntroDone })
    .set(wordmarks, { autoAlpha: 1 })
    .fromTo(lineH, { scaleX: 0 }, { scaleX: cover("x"), duration: 1.0 })
    .fromTo(lineV, { scaleY: 0 }, { scaleY: cover("y"), duration: 1.0 }, 0.08)
    .to(lineH, { scaleX: 1, duration: 0.95 }, "+=0.05")
    .to(lineV, { scaleY: 1, duration: 0.95 }, "<0.06")
    .addLabel("names", "-=0.4")
    .fromTo(left, { xPercent: 102 }, { xPercent: 0, duration: 1.35, ease: "expo.out" }, "names")
    .fromTo(right, { xPercent: -102 }, { xPercent: 0, duration: 1.35, ease: "expo.out" }, "names")
    .fromTo(glyphs, { y: glyphDrop }, { y: 0, duration: 0.95, ease: "power3.out", stagger: 0.035 }, "names+=0.25")
    .fromTo(
      headerItems,
      { autoAlpha: 0, y: -10 },
      { autoAlpha: 1, y: 0, duration: 0.7, ease: "power2.out", stagger: 0.05 },
      "names+=0.4",
    )
    // ARQUITECTAS termina de subir en names+1.55; la foto arranca apenas antes, sin pausa con el logo quieto
    .addLabel("expand", "names+=1.45")
    .fromTo(media, { clipPath: POINT }, { clipPath: FULL, duration: 1.1 }, "expand")
    .fromTo(mediaInner, { scale: 1.35 }, { scale: 1, duration: 1.6, ease: "expo.out" }, "expand")
    .fromTo(caption, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.6, ease: "power1.out" }, "expand+=0.8")
    .fromTo(hint, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.6, ease: "power1.out" }, "expand+=0.9");

  if (playIntro && smoother.scrollTop() < 10) {
    smoother.paused(true);
    // El scroll se libera cuando la foto ya casi terminó de abrirse
    intro.call(() => smoother.paused(false), [], "expand+=0.75");
  } else {
    intro.progress(1);
    onIntroDone();
    smoother.paused(false);
  }
}

/** Páginas interiores: el título sube línea por línea y lo acompañan sus datos. */
export function pageIntro(root: HTMLElement) {
  all(root, "[data-page-title]").forEach((title) => {
    gsap.set(title, { autoAlpha: 1 });
    SplitText.create(title, {
      type: "lines",
      mask: "lines",
      autoSplit: true,
      onSplit: (self) =>
        gsap.from(self.lines, { yPercent: 110, duration: 1.3, ease: "expo.out", stagger: 0.09, delay: 0.1 }),
    });
  });

  const items = all(root, "[data-page-in]");
  if (items.length) {
    gsap.fromTo(
      items,
      { autoAlpha: 0, y: 18 },
      { autoAlpha: 1, y: 0, duration: 1, ease: "power3.out", stagger: 0.07, delay: 0.45 },
    );
  }
}

/** Marco que se descubre de abajo hacia arriba, con las marcas "+" apareciendo en las esquinas. */
function revealFrame(item: HTMLElement) {
  const frame = one(item, "[data-ph]");
  const inner = one(item, "[data-ph-inner]");
  const marks = all(item, "[data-ph-mark]");
  const lines = all(item, "[data-reveal-line]");

  const tl = gsap
    // Arranca apenas el marco asoma, para que se vea aunque se scrollee rápido
    .timeline({ scrollTrigger: { trigger: item, start: "top bottom" } })
    .fromTo(frame, { clipPath: FLOOR }, { clipPath: FULL, duration: 1.2, ease: "expo.inOut" })
    .fromTo(inner, { scale: 1.2 }, { scale: 1, duration: 1.8, ease: "expo.out" }, 0.25);
  if (marks.length) {
    tl.fromTo(marks, { scale: 0, rotation: -90 }, { scale: 1, rotation: 0, duration: 1, ease: "expo.out", stagger: 0.06 }, 0.6);
  }
  if (lines.length) {
    tl.fromTo(lines, { yPercent: 105 }, { yPercent: 0, duration: 1, ease: "power3.out", stagger: 0.08 }, 0.8);
  }
}

export function reveals(root: HTMLElement) {
  all(root, "[data-reveal]").forEach(revealFrame);
}

/** Frases que se "encienden" palabra por palabra al ritmo del scroll. */
export function statements(root: HTMLElement) {
  all(root, "[data-statement]").forEach((p) => {
    const split = SplitText.create(p, { type: "words" });
    gsap.fromTo(
      split.words,
      { opacity: 0.12 },
      {
        opacity: 1,
        ease: "none",
        stagger: 0.08,
        scrollTrigger: { trigger: p, start: "top 78%", end: "bottom 50%", scrub: true },
      },
    );
  });
}

/** Proceso (escritorio): la sección se fija y las etapas avanzan en horizontal. */
export function process(root: HTMLElement) {
  const section = one(root, "[data-process]");
  const track = one(section, "[data-process-track]");
  const progress = one(section, "[data-process-progress]");
  const distance = () => Math.max(0, track.scrollWidth - (section.clientWidth - track.offsetLeft * 2));

  const tl = gsap
    .timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: () => `+=${distance()}`,
        pin: true,
        scrub: true,
        invalidateOnRefresh: true,
      },
    })
    .to(track, { x: () => -distance() }, 0)
    .fromTo(progress, { scaleX: 0 }, { scaleX: 1 }, 0);

  all(section, "[data-process-step]").forEach((step) => {
    gsap.fromTo(
      one(step, "[data-ph-inner]"),
      { xPercent: -7 },
      {
        xPercent: 7,
        ease: "none",
        scrollTrigger: { trigger: step, containerAnimation: tl, start: "left right", end: "right left", scrub: true },
      },
    );
  });
}

/** Índice: una ventana sigue al cursor y desliza la tira de imágenes hasta el proyecto señalado. */
export function indexPreview(root: HTMLElement, ctx: Ctx) {
  const list = one(root, "[data-index-list]");
  const preview = one(root, "[data-index-preview]");
  const strip = one(preview, "[data-index-strip]");
  const rows = all(list, "[data-row]");

  gsap.set(preview, { xPercent: -50, yPercent: -50, scale: 0.4, autoAlpha: 0 });
  const xTo = gsap.quickTo(preview, "x", { duration: 0.8, ease: "power3" });
  const yTo = gsap.quickTo(preview, "y", { duration: 0.8, ease: "power3" });
  const tilt = gsap.quickTo(preview, "rotation", { duration: 1, ease: "power3" });
  let lastX = 0;

  const onMove = ctx.add("indexMove", (e: PointerEvent) => {
    xTo(e.clientX);
    yTo(e.clientY);
    tilt(gsap.utils.clamp(-4, 4, (e.clientX - lastX) * 0.25));
    lastX = e.clientX;
  }) as (e: PointerEvent) => void;

  const onEnterList = ctx.add("indexEnter", (e: PointerEvent) => {
    gsap.set(preview, { x: e.clientX, y: e.clientY });
    lastX = e.clientX;
    gsap.to(preview, { autoAlpha: 1, scale: 1, duration: 0.6, ease: "expo.out", overwrite: "auto" });
  }) as (e: PointerEvent) => void;

  const onLeaveList = ctx.add("indexLeave", () => {
    gsap.to(preview, { autoAlpha: 0, scale: 0.4, duration: 0.45, ease: "power3.in", overwrite: "auto" });
  }) as () => void;

  const onEnterRow = ctx.add("indexRow", (e: PointerEvent) => {
    const i = Number((e.currentTarget as HTMLElement).dataset.rowIndex);
    gsap.to(strip, { yPercent: (-100 * i) / rows.length, duration: 0.9, ease: "expo.out", overwrite: true });
  }) as (e: PointerEvent) => void;

  // Si se scrollea fuera del índice sin mover el mouse, no llega pointerleave: se oculta igual
  ScrollTrigger.create({ trigger: list, start: "top bottom", end: "bottom top", onLeave: onLeaveList, onLeaveBack: onLeaveList });

  list.addEventListener("pointermove", onMove);
  list.addEventListener("pointerenter", onEnterList);
  list.addEventListener("pointerleave", onLeaveList);
  rows.forEach((r) => r.addEventListener("pointerenter", onEnterRow));

  return () => {
    list.removeEventListener("pointermove", onMove);
    list.removeEventListener("pointerenter", onEnterList);
    list.removeEventListener("pointerleave", onLeaveList);
    rows.forEach((r) => r.removeEventListener("pointerenter", onEnterRow));
  };
}

/** Sección de contacto al pie: las líneas de la cruz se trazan al entrar. */
export function contactLines(root: HTMLElement) {
  all(root, "[data-contact]").forEach((section) => {
    const scrub = { trigger: section, start: "top 85%", end: "top 5%", scrub: true };
    gsap.fromTo(one(section, "[data-contact-h]"), { scaleX: 0 }, { scaleX: 1, ease: "none", scrollTrigger: scrub });
    gsap.fromTo(one(section, "[data-contact-v]"), { scaleY: 0 }, { scaleY: 1, ease: "none", scrollTrigger: { ...scrub } });
  });
}

/** Página de contacto: la foto aparece de a poco, se trazan las líneas y sube el correo. */
export function contactPage(root: HTMLElement) {
  const page = one(root, "[data-contact-page]");
  const tl = gsap
    .timeline({ defaults: { ease: "expo.out" } })
    .fromTo(one(page, "[data-contact-bg]"), { autoAlpha: 0, scale: 1.12 }, { autoAlpha: 1, scale: 1, duration: 2.4 }, 0)
    .fromTo(one(page, "[data-contact-h]"), { scaleX: 0 }, { scaleX: 1, duration: 1.6, ease: "expo.inOut" }, 0.2)
    .fromTo(one(page, "[data-contact-v]"), { scaleY: 0 }, { scaleY: 1, duration: 1.6, ease: "expo.inOut" }, 0.3)
    .fromTo(all(page, "[data-roll-a]"), { yPercent: 105 }, { yPercent: 0, duration: 1.3 }, 0.55);

  // Card de ubicación: una máscara la descubre de derecha a izquierda; la foto y el texto la acompañan
  const card = page.querySelector<HTMLElement>("[data-location-card]");
  if (card) {
    tl.fromTo(
      card,
      { autoAlpha: 1, clipPath: poly([100, 0], [100, 0], [100, 100], [100, 100]) },
      { autoAlpha: 1, clipPath: FULL, duration: 1.6, ease: "expo.inOut" },
      0.7,
    )
      .fromTo(one(card, "[data-location-photo]"), { xPercent: -8, scale: 1.2 }, { xPercent: 0, scale: 1, duration: 2.2 }, "<0.25")
      .fromTo(all(card, "[data-location-line]"), { yPercent: 105 }, { yPercent: 0, duration: 1.1, stagger: 0.07 }, "<0.55");
  }
}

/**
 * Limita la velocidad del scroll con rueda o trackpad para que un scroll muy rápido no saltee las animaciones.
 * Cada evento suma a un destino que no puede adelantarse más de `maxLead` pantallas; el scroll se acerca
 * a ese destino frenando suave (`ease`, por segundo) y sin superar `screensPerSecond` pantallas por segundo.
 * Si se cambia de dirección, se descarta lo pendiente y el giro es inmediato.
 * Teclado, barra de scroll y touch quedan nativos.
 */
export function capWheelSpeed(
  smoother: ScrollSmoother,
  { screensPerSecond = 2.6, maxLead = 0.6, ease = 9 } = {},
) {
  let target = smoother.scrollTop();
  let active = false;

  const onWheel = (e: WheelEvent) => {
    if (e.ctrlKey || Math.abs(e.deltaX) > Math.abs(e.deltaY) || smoother.paused()) return;
    e.preventDefault();
    const unit = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? innerHeight : 1;
    const delta = e.deltaY * unit;
    const current = smoother.scrollTop();
    const pending = target - current;
    // Sin movimiento en curso, o girando: se parte desde donde está la página ahora
    if (!active || (pending !== 0 && Math.sign(pending) !== Math.sign(delta))) target = current;
    const lead = innerHeight * maxLead;
    target = gsap.utils.clamp(
      Math.max(0, current - lead),
      Math.min(ScrollTrigger.maxScroll(window), current + lead),
      target + delta,
    );
    active = true;
  };

  const tick = (_time: number, deltaMs: number) => {
    if (!active) return;
    const current = smoother.scrollTop();
    const diff = target - current;
    if (Math.abs(diff) < 0.5) {
      smoother.scrollTop(target);
      active = false;
      return;
    }
    const dt = Math.min(deltaMs, 50) / 1000;
    const maxStep = innerHeight * screensPerSecond * dt;
    const eased = diff * (1 - Math.exp(-ease * dt));
    smoother.scrollTop(current + gsap.utils.clamp(-maxStep, maxStep, eased));
  };

  window.addEventListener("wheel", onWheel, { passive: false });
  gsap.ticker.add(tick);
  return () => {
    window.removeEventListener("wheel", onWheel);
    gsap.ticker.remove(tick);
  };
}

/** Correos y enlaces grandes: las letras giran hacia arriba al pasar el cursor o enfocar. */
export function rollLinks(root: HTMLElement, ctx: Ctx) {
  const cleanups = all<HTMLAnchorElement>(root, "[data-roll]").map((link, i) => {
    const a = SplitText.create(one(link, "[data-roll-a]"), { type: "chars" });
    const b = SplitText.create(one(link, "[data-roll-b]"), { type: "chars" });

    const roll = (to: number) => () => {
      const vars = { yPercent: to, duration: 0.7, ease: "expo.out", stagger: 0.014, overwrite: true };
      gsap.to(a.chars, vars);
      gsap.to(b.chars, vars);
    };
    const over = ctx.add(`rollOver${i}`, roll(-100)) as () => void;
    const out = ctx.add(`rollOut${i}`, roll(0)) as () => void;

    link.addEventListener("pointerenter", over);
    link.addEventListener("focus", over);
    link.addEventListener("pointerleave", out);
    link.addEventListener("blur", out);
    return () => {
      link.removeEventListener("pointerenter", over);
      link.removeEventListener("focus", over);
      link.removeEventListener("pointerleave", out);
      link.removeEventListener("blur", out);
    };
  });
  return () => cleanups.forEach((fn) => fn());
}
