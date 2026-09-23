import { gsap, ScrollSmoother, ScrollTrigger, SplitText } from "@/lib/gsap";

type Ctx = gsap.Context;

// Se usa polygon() y no inset(): el navegador abrevia inset(50% 50% 50% 50%) a inset(50%)
// y GSAP no puede interpolar entre cantidades distintas de valores.
const poly = (...pts: [number, number][]) => `polygon(${pts.map(([x, y]) => `${x}% ${y}%`).join(", ")})`;
const FULL = poly([0, 0], [100, 0], [100, 100], [0, 100]);
const FLOOR = poly([0, 100], [100, 100], [100, 100], [0, 100]);

const all = <T extends Element = HTMLElement>(root: ParentNode, sel: string) =>
  Array.from(root.querySelectorAll<T>(sel)) as unknown as T[];
const one = <T extends Element = HTMLElement>(root: ParentNode, sel: string) =>
  root.querySelector<T>(sel)!;

/**
 * Hero de la home. Carga: la banda negra ocupa toda la pantalla, la cruz se abre de lado a lado
 * y se repliega hasta ser el "+" del logo (en el centro de la pantalla), los nombres salen desde ahí
 * con ARQUITECTAS debajo por un momento, y el logo sube rápido con el negro hasta su posición de titular.
 * Apertura: al primer scroll se dispara sola, de una y sin vuelta atrás: la banda se cierra,
 * la foto crece hasta ocupar la sección y el header baja a su lugar con el logo chico.
 */
export function hero(root: HTMLElement, smoother: ScrollSmoother, playIntro: boolean, onIntroDone: () => void) {
  const section = one(root, "[data-hero]");
  const band = one(root, "[data-hero-band]");
  const word = one(root, "[data-hero-word]");
  const meta = one(root, "[data-hero-meta]");
  const count = one(root, "[data-hero-count]");
  const plus = one(root, "[data-plus]");
  const lineH = one(root, "[data-plus-h]");
  const lineV = one(root, "[data-plus-v]");
  const left = one(root, "[data-name-left]");
  const right = one(root, "[data-name-right]");
  // Letras de ARQUITECTAS. Se mueven en unidades del viewBox: el alto del SVG entero es 124.
  const sub = all<SVGGElement>(root, "[data-hero-sub] [data-glyph]");
  const subDrop = 130;
  const frame = one(root, "[data-hero-frame]");
  const frameInner = one(frame, "[data-ph-scale]");
  const caption = one(root, "[data-hero-caption]");
  const hint = one(root, "[data-hero-hint]");
  const header = one(root, "[data-header]");
  // El botón de menú (mobile) no entra con los enlaces: aparece con el logo chico, al abrirse la foto.
  // Sin logo al lado, quedaba solo arriba antes de tiempo.
  const menuButton = root.querySelector<HTMLElement>("[data-header-menu]");
  const headerItems = all(root, "[data-header-item]").filter((el) => el !== menuButton);
  const headerRise = all(root, "[data-header-rise]");
  const logo = one(root, "[data-header-logo]");
  const clock = root.querySelector<HTMLElement>("[data-header-clock]");
  // El CSS esconde el header hasta que la intro lo levanta. Una vez jugada (o salteada),
  // se marca el documento para que al volver a la home el header ya nazca visible.
  const introDone = () => document.documentElement.classList.add("intro-done");
  // Mientras dura la intro el documento no scrollea. ScrollSmoother en pausa rechaza el scroll
  // devolviendo la página a su lugar, pero en touch el scroll nativo llega a moverla antes: la foto
  // daba un salto al abrirse. Con la traba (ver globals.css) el dedo no mueve nada.
  const lock = () => document.documentElement.classList.add("hero-lock");
  const unlock = () => document.documentElement.classList.remove("hero-lock");

  // La banda se anima en altura. Su medida final es la del logo con sus márgenes mínimos:
  // no sirve medir la banda, que arranca a pantalla completa (los datos de carga van absolutos).
  const bandHeight = word.offsetHeight;
  // Un par de píxeles de más: innerHeight es entero y, con escala de pantalla (DPR 1.05, 1.25…),
  // queda por debajo del alto real y asoma un hilo del card blanco abajo durante la intro.
  gsap.set(band, { height: innerHeight + 2 });
  gsap.set(header, { y: bandHeight });
  gsap.set([caption, logo], { autoAlpha: 0 });
  if (menuButton) gsap.set(menuButton, { autoAlpha: 0 });
  // Cada dato del header espera bajo su línea hasta que sube el lettering
  gsap.set(headerRise, { yPercent: 115 });
  // El reloj arranca en el lugar del logo (pegado a la izquierda) y se corre a su sitio
  // cuando aparece el logo chico del header. Se mide contra el logo, así el aire entre ambos
  // se puede cambiar solo con las clases del header.
  if (clock) gsap.set(clock, { x: logo.getBoundingClientRect().left - clock.getBoundingClientRect().left });

  // Con la banda a pantalla completa, el logo baja al centro: ahí se arma la cruz
  const wordBox = word.getBoundingClientRect();
  const drop = innerHeight / 2 - (wordBox.top + wordBox.height / 2);
  gsap.set(word, { y: drop, autoAlpha: 1 });

  // --- Apertura: se reproduce sola, una sola vez (no la maneja el scroll, no vuelve atrás)
  const open = gsap
    .timeline({
      paused: true,
      defaults: { ease: "expo.inOut", duration: 1.3 },
      onComplete: () => {
        unlock();
        smoother.paused(false);
        ScrollTrigger.refresh();
      },
    })
    .to(hint, { autoAlpha: 0, duration: 0.3, ease: "power2.in" }, 0)
    .to(band, { height: 0 }, 0)
    .to(header, { y: 0 }, 0)
    // La foto termina midiendo la ventana entera, no el 100% del card (que todavía es más angosto
    // mientras corre el tween): así nunca asoma blanco al costado. Lo que sobra lo recorta el stage.
    // Un par de píxeles de más: innerWidth y clientHeight son enteros redondeados y, con zoom o escala
    // de pantalla, pueden quedar por debajo del ancho real y dejar asomar un hilo blanco al costado.
    // El tamaño de partida se mide al arrancar: el marco lo define con min(), que GSAP no sabe
    // interpolar (toma el primer valor). En mobile eso hacía saltar la foto en el primer cuadro.
    .fromTo(
      frame,
      { width: () => frame.offsetWidth, height: () => frame.offsetHeight },
      { width: () => innerWidth + 4, height: () => section.clientHeight + 2, immediateRender: false },
      0,
    )
    // El card se abre a sangre junto con la foto: el negro lateral existe solo durante la apertura
    .to(section, { marginLeft: 0, marginRight: 0 }, 0)
    .fromTo(frameInner, { scale: 1.18 }, { scale: 1, duration: 1.5, ease: "expo.out" }, 0)
    .to(logo, { autoAlpha: 1, duration: 0.5, ease: "power2.out" }, 0.8)
    .to(menuButton, { autoAlpha: 1, duration: 0.5, ease: "power2.out" }, 0.8)
    .to(caption, { autoAlpha: 1, duration: 0.5, ease: "power2.out" }, 0.65);
  if (clock) open.to(clock, { x: 0, duration: 0.8 }, 0.15);

  // El primer gesto de scroll la dispara; después el scroll vuelve a ser normal
  // Escala justa para que cada trazo llegue apenas más allá del borde de pantalla más lejano:
  // con más, la cruz pasa un buen rato quieta fuera de cuadro antes de replegarse.
  const cover = (axis: "x" | "y") => () => {
    const box = plus.getBoundingClientRect();
    const [center, size, screen] =
      axis === "x" ? [box.left + box.width / 2, plus.offsetWidth, innerWidth] : [box.top + box.height / 2, plus.offsetHeight, innerHeight];
    return (2 * Math.max(center, screen - center) * 1.04) / size;
  };

  const counter = { v: 0 };
  const intro = gsap
    .timeline({ defaults: { ease: "expo.inOut" }, onComplete: onIntroDone })
    .fromTo(meta, { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.6, ease: "expo.out" })
    .to(counter, {
      v: 100,
      duration: 1.8,
      ease: "power1.inOut",
      onUpdate: () => (count.textContent = String(Math.round(counter.v))),
    }, 0)
    // La cruz es lo rápido de la intro; lo que sigue respira más
    // Crece y vuelve como un rebote, sin frenar en la punta: la subida acelera hasta el borde
    // y el repliegue sale a toda velocidad y solo frena al llegar a su tamaño de logo.
    .fromTo(lineH, { scaleX: 0 }, { scaleX: cover("x"), duration: 0.3, ease: "power2.in" }, 0.05)
    .fromTo(lineV, { scaleY: 0 }, { scaleY: cover("y"), duration: 0.3, ease: "power2.in" }, 0.05)
    .to(lineH, { scaleX: 1, duration: 0.75, ease: "power3.out" })
    .to(lineV, { scaleY: 1, duration: 0.75, ease: "power3.out" }, "<")
    .addLabel("names", "-=0.45")
    .fromTo(left, { xPercent: 102 }, { xPercent: 0, duration: 1.45, ease: "expo.out" }, "names")
    .fromTo(right, { xPercent: -102 }, { xPercent: 0, duration: 1.45, ease: "expo.out" }, "names")
    // ARQUITECTAS sube letra por letra desde su línea, apenas detrás de los nombres
    .fromTo(sub, { y: subDrop }, { y: 0, duration: 1.1, ease: "expo.out", stagger: 0.035 }, "names+=0.3")
    // Ya armado, el logo sube rápido con el negro hasta su posición final
    .addLabel("lift", "names+=1.6")
    // ARQUITECTAS se va hacia arriba al arrancar la subida: el titular queda solo con los nombres
    .to(sub, { y: -subDrop, duration: 0.5, ease: "power3.in", stagger: 0.015 }, "lift-=0.1")
    .to(meta, { autoAlpha: 0, y: -8, duration: 0.35, ease: "power2.in" }, "lift-=0.2")
    .to(word, { y: 0, duration: 0.95 }, "lift")
    .to(band, { height: bandHeight, duration: 0.95 }, "lift")
    .fromTo(headerItems, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.45, ease: "power1.out" }, "lift+=0.4")
    // Suben desde su propia línea, uno detrás de otro
    .to(headerRise, { yPercent: 0, duration: 1.05, ease: "expo.out", stagger: 0.06 }, "lift+=0.4")
    .fromTo(hint, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.55, ease: "power1.out" }, "lift+=0.6")
    .call(introDone, [], "lift+=0.4");

  const events = ["wheel", "touchmove", "keydown"] as const;
  const trigger = (e: Event) => {
    if (e.type === "wheel" && (e as WheelEvent).deltaY <= 0) return;
    if (e.type === "keydown" && !["ArrowDown", "PageDown", " ", "End"].includes((e as KeyboardEvent).key)) return;
    disarm();
    open.play();
  };
  const disarm = () => events.forEach((type) => window.removeEventListener(type, trigger));
  const arm = () => events.forEach((type) => window.addEventListener(type, trigger, { passive: true }));

  if (playIntro && smoother.scrollTop() < 10) {
    // El scroll queda tomado hasta que termina la apertura: es un solo movimiento, sin vuelta atrás
    smoother.paused(true);
    lock();
    intro.call(arm, [], "lift+=0.6");
  } else {
    introDone();
    intro.progress(1);
    onIntroDone();
    open.progress(1);
    smoother.paused(false);
    // Sin intro que los levante, el header queda en su posicion de descanso sin residuos
    // de la pagina anterior (React reusa estos nodos al navegar).
    gsap.set(headerItems, { autoAlpha: 1 });
    if (menuButton) gsap.set(menuButton, { autoAlpha: 1 });
    gsap.set(headerRise, { yPercent: 0 });
    gsap.set(logo, { autoAlpha: 1 });
    if (clock) gsap.set(clock, { x: 0 });
  }

  return () => {
    disarm();
    unlock();
  };
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
  const inner = one(item, "[data-ph-scale]");
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

/**
 * El header va en mix-blend-difference: sobre una foto de tono medio el logo y el nav se apagan.
 * Los bloques a sangre que le pasan por debajo se marcan con [data-header-over] y encienden un
 * velo oscuro, que es lo que devuelve el contraste sin tocar el resto de las páginas.
 */
export function headerScrim(root: HTMLElement) {
  const scrim = root.querySelector<HTMLElement>("[data-header-scrim]");
  const zones = all(root, "[data-header-over]");
  if (!scrim || !zones.length) return;

  let over = 0;
  gsap.set(scrim, { autoAlpha: 0 });
  const sync = () =>
    gsap.to(scrim, { autoAlpha: over > 0 ? 1 : 0, duration: 0.35, ease: "power2.out", overwrite: true });

  zones.forEach((zone) =>
    ScrollTrigger.create({
      trigger: zone,
      start: "top top",
      end: "bottom top",
      onToggle: (self) => {
        over = Math.max(0, over + (self.isActive ? 1 : -1));
        sync();
      },
    }),
  );
}

export function reveals(root: HTMLElement) {
  all(root, "[data-reveal]").forEach(revealFrame);
}

/** "+" grandes que se dibujan al entrar: primero el trazo horizontal, después el vertical. */
export function plusDraws(root: HTMLElement) {
  all(root, "[data-plus-draw]").forEach((plus) => {
    gsap
      .timeline({ defaults: { ease: "expo.inOut", duration: 1.1 }, scrollTrigger: { trigger: plus, start: "top 85%" } })
      .fromTo(one(plus, "[data-plus-draw-h]"), { scaleX: 0 }, { scaleX: 1 })
      .fromTo(one(plus, "[data-plus-draw-v]"), { scaleY: 0 }, { scaleY: 1 }, 0.15);
  });
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

/**
 * Cómo trabajamos (escritorio). Las obras no se mueven: cada una ocupa su pantalla y se scrollea
 * como cualquier foto. Lo que se fija es la columna de texto:
 * - la pila de etapas se clava arriba y va creciendo. La etapa ya leída se queda, pero se cierra
 *   hasta su numeral: **solo la etapa en la que estamos dice su nombre**, así siempre se sabe qué
 *   se está leyendo. Las que faltan todavía no están en la pila;
 * - el párrafo acompaña a su obra y se suelta justo cuando entra la siguiente.
 * Se hace con pines de ScrollTrigger y no con `position: sticky`: con ScrollSmoother la página no
 * scrollea de verdad (el contenido se mueve por transform) y el sticky nunca se dispara.
 */
export function work(root: HTMLElement) {
  const block = one(root, "[data-work]");
  const stack = one(block, "[data-work-stack]");
  const rows = all(stack, "[data-work-row]");
  const titles = all(stack, "[data-work-title]");
  const copies = all(block, "[data-work-copy]");
  const shots = all(block, "[data-work-cell] [data-ph-wrap]");
  if (!rows.length) return;

  // El primer renglón arranca debajo del header
  const top = () => innerHeight * 0.14;

  // Los altos se miden una sola vez, con todo abierto: animar contra `height: "auto"` obliga al
  // navegador a medir en cada cuadro y es lo que hace que el cierre del título se trabe.
  const rowH = rows.map((row) => row.offsetHeight);
  const titleH = titles.map((title) => title.offsetHeight);

  let active = -1;
  const setActive = (i: number, instant = false) => {
    if (i === active) return;
    active = i;
    const vars = instant
      ? { duration: 0 }
      : { duration: 0.55, ease: "power3.inOut" as const, overwrite: true as const };
    // La etapa en curso va entera; las pasadas quedan reducidas a su numeral; las que faltan, fuera
    rows.forEach((row, j) =>
      gsap.to(row, { height: j > i ? 0 : rowH[j] - (j === i ? 0 : titleH[j]), autoAlpha: j > i ? 0 : 1, ...vars }),
    );
    titles.forEach((title, j) => gsap.to(title, { height: j === i ? titleH[j] : 0, autoAlpha: j === i ? 1 : 0, ...vars }));
  };
  setActive(0, true);

  // La pila se clava arriba y no se suelta hasta que la última obra terminó de pasar: con
  // `bottom bottom` se soltaba una pantalla antes, justo cuando la última foto recién llegaba.
  ScrollTrigger.create({
    trigger: stack,
    start: () => `top top+=${top()}`,
    endTrigger: block,
    end: () => `bottom top+=${top() + stack.offsetHeight}`,
    pin: true,
    pinSpacing: false,
    anticipatePin: 1,
    invalidateOnRefresh: true,
  });

  shots.forEach((shot, i) => {
    // Mientras esta obra pasa por el renglón de arriba, la etapa es esta
    ScrollTrigger.create({
      trigger: shot,
      start: () => `top top+=${top()}`,
      end: () => `bottom top+=${top()}`,
      invalidateOnRefresh: true,
      onToggle: (self) => self.isActive && setActive(i),
    });

    const copy = copies[i];
    ScrollTrigger.create({
      trigger: copy,
      start: () => `top top+=${top()}`,
      // Hasta que la obra de esta etapa termina de pasar: ahí entra el párrafo siguiente
      endTrigger: shot,
      end: () => `bottom top+=${top() + copy.offsetHeight}`,
      pin: true,
      pinSpacing: false,
      anticipatePin: 1,
      invalidateOnRefresh: true,
    });
  });
}

/**
 * "Antes de la reforma" (escritorio): la sección se fija y las fotos avanzan en horizontal con el
 * scroll, mientras la línea de arriba se completa. Dentro de cada foto, un parallax leve en x.
 */
export function beforeStrip(root: HTMLElement) {
  const section = one(root, "[data-before]");
  const track = one(section, "[data-before-track]");
  const progress = one(section, "[data-before-progress]");
  // El track mide lo que miden las fotos (w-max): se corre hasta que la última toca el margen derecho
  const frame = track.parentElement!;
  const distance = () => {
    const { paddingLeft, paddingRight } = getComputedStyle(frame);
    return Math.max(0, track.scrollWidth - (frame.clientWidth - parseFloat(paddingLeft) - parseFloat(paddingRight)));
  };

  const tl = gsap
    .timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: () => `+=${distance()}`,
        pin: true,
        scrub: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    })
    .to(track, { x: () => -distance() }, 0)
    .fromTo(progress, { scaleX: 0 }, { scaleX: 1 }, 0);

  all(section, "[data-before-shot] [data-ph-inner]").forEach((inner) => {
    gsap.fromTo(
      inner,
      { xPercent: -5 },
      {
        xPercent: 5,
        ease: "none",
        scrollTrigger: { trigger: inner, containerAnimation: tl, start: "left right", end: "right left", scrub: true },
      },
    );
  });
}

/** Índice: una ventana sigue al cursor y cada obra se abre desde el centro hacia afuera. */
export function indexPreview(root: HTMLElement, ctx: Ctx) {
  const list = one(root, "[data-index-list]");
  const preview = one(root, "[data-index-preview]");
  const items = all(preview, "[data-index-item]");
  const inners = items.map((it) => one(it, "[data-ph-scale]"));
  const OPEN = "inset(0% 0% 0% 0%)";
  const SHUT = "inset(50% 50% 50% 50%)";

  // Sin rotación: la ventana se mantiene recta, sólo sigue al cursor
  gsap.set(preview, { xPercent: -50, yPercent: -50, autoAlpha: 0, rotation: 0, clipPath: SHUT });
  gsap.set(items, { clipPath: SHUT, zIndex: 0 });
  gsap.set(inners, { scale: 1.16 });

  const xTo = gsap.quickTo(preview, "x", { duration: 0.9, ease: "power3" });
  const yTo = gsap.quickTo(preview, "y", { duration: 0.9, ease: "power3" });
  let current = -1;
  let z = 1;

  const reveal = (i: number, duration: number) => {
    if (i === current || !items[i]) return;
    current = i;
    gsap.set(items[i], { zIndex: z++ });
    gsap.to(items[i], { clipPath: OPEN, duration, ease: "expo.out", overwrite: "auto" });
    gsap.to(inners[i], { scale: 1, duration: duration * 1.3, ease: "expo.out", overwrite: "auto" });
    // las anteriores vuelven a cerrarse por debajo, listas para reabrirse
    items.forEach((it, j) => {
      if (j === i) return;
      gsap.to(it, { clipPath: SHUT, duration: duration * 0.9, ease: "expo.inOut", overwrite: "auto" });
      gsap.to(inners[j], { scale: 1.16, duration: duration * 0.9, ease: "expo.inOut", overwrite: "auto" });
    });
  };

  const onMove = ctx.add("indexMove", (e: PointerEvent) => {
    xTo(e.clientX);
    yTo(e.clientY);
  }) as (e: PointerEvent) => void;

  const onEnterList = ctx.add("indexEnter", (e: PointerEvent) => {
    gsap.set(preview, { x: e.clientX, y: e.clientY });
    // se abre ya con una obra dentro, para que nunca se vea la ventana vacía
    const row = (e.target as HTMLElement)?.closest?.("[data-row]") as HTMLElement | null;
    reveal(Number(row?.dataset.rowIndex ?? 0) || 0, 1.1);
    gsap.to(preview, { autoAlpha: 1, clipPath: OPEN, duration: 1.1, ease: "expo.out", overwrite: "auto" });
  }) as (e: PointerEvent) => void;

  const onLeaveList = ctx.add("indexLeave", () => {
    gsap.to(preview, { clipPath: SHUT, duration: 0.7, ease: "expo.inOut", overwrite: "auto" });
    gsap.to(preview, { autoAlpha: 0, duration: 0.5, ease: "power2.in", delay: 0.2, overwrite: "auto" });
    current = -1;
  }) as () => void;

  const onEnterRow = ctx.add("indexRow", (e: PointerEvent) => {
    reveal(Number((e.currentTarget as HTMLElement).dataset.rowIndex), 1);
  }) as (e: PointerEvent) => void;

  // Si se scrollea fuera del índice sin mover el mouse, no llega pointerleave: se oculta igual
  ScrollTrigger.create({ trigger: list, start: "top bottom", end: "bottom top", onLeave: onLeaveList, onLeaveBack: onLeaveList });

  list.addEventListener("pointermove", onMove);
  list.addEventListener("pointerenter", onEnterList);
  list.addEventListener("pointerleave", onLeaveList);
  const rows = all(list, "[data-row]");
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
 * 404: entra como Contacto (foto que aparece, cruz que se traza) y durante los primeros dos
 * segundos tiene unos pocos cortes de señal en los textos y las líneas: el numeral se desfasa en
 * franjas, algún texto se corre y se tuerce, las líneas saltan. La foto de fondo no se toca.
 * Cada corte dura un par de cuadros; después todo queda quieto.
 */
export function notFoundPage(root: HTMLElement) {
  const page = one(root, "[data-notfound-page]");
  const lineH = one(page, "[data-notfound-h]");
  const lineV = one(page, "[data-notfound-v]");
  const base = one(page, "[data-glitch-base]");
  const layers = all(page, "[data-glitch-layer]");
  const texts = all(page, "[data-glitch-text]");
  const { random, shuffle } = gsap.utils;

  const tl = gsap
    .timeline({ defaults: { ease: "expo.out" } })
    .fromTo(one(page, "[data-notfound-bg]"), { autoAlpha: 0, scale: 1.12 }, { autoAlpha: 1, scale: 1, duration: 2.4 }, 0)
    .fromTo(lineH, { scaleX: 0 }, { scaleX: 1, duration: 1.6, ease: "expo.inOut" }, 0.2)
    .fromTo(lineV, { scaleY: 0 }, { scaleY: 1, duration: 1.6, ease: "expo.inOut" }, 0.3);

  // Una franja horizontal al azar del numeral
  const slice = () => {
    const top = random(0, 78);
    const h = random(8, 24);
    return poly([0, top], [100, top], [100, top + h], [0, top + h]);
  };

  // Cortes agrupados al principio y más espaciados hacia el final, como una señal que se estabiliza
  // Arrancan cuando los textos ya están asomando (pageIntro los sube desde 0.45 s)
  [0.6, 0.7, 1.1, 1.5, 1.58, 2.2].forEach((at) => {
    const hold = random(0.05, 0.1);
    // En cada corte se mueven uno o dos textos, nunca todos juntos
    const hit = shuffle([...texts]).slice(0, Math.round(random(1, 2)));
    layers.forEach((layer, i) =>
      tl.set(layer, { autoAlpha: 1, xPercent: random(-5, 5), clipPath: slice() }, at + i * 0.02),
    );
    tl.set(base, { xPercent: random(-1.5, 1.5), skewX: random(-4, 4) }, at)
      .set(hit, { x: () => random(-10, 10), skewX: () => random(-5, 5) }, at)
      .set(lineH, { y: random(-6, 6), opacity: random(0.3, 1) }, at)
      .set(lineV, { x: random(-8, 8), opacity: random(0.3, 1) }, at)
      .set(layers, { autoAlpha: 0 }, at + hold)
      .set([base, ...hit], { x: 0, xPercent: 0, skewX: 0 }, at + hold)
      .set([lineH, lineV], { x: 0, y: 0, opacity: 1 }, at + hold);
  });
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
