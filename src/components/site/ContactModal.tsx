"use client";

import { useEffect, useId, useRef, useState } from "react";
import { gsap, ScrollSmoother, useGSAP } from "@/lib/gsap";
import { CircleButton } from "./CircleButton";
import { contact } from "./content";

const { address } = contact;
const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address.mapsQuery)}`;

/** Campo con label arriba y línea inferior, al estilo de la grilla editorial. */
function Field({
  name,
  label,
  type = "text",
  required = false,
  area = false,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  area?: boolean;
}) {
  const id = useId();
  const shared =
    "w-full border-0 border-b border-ink/20 bg-transparent pt-2 pb-3 text-meta text-ink outline-none transition-colors placeholder:text-ink/35 focus:border-ink";

  return (
    <p data-contact-field className="grid gap-1">
      <label htmlFor={id} className="text-label text-ink/55">
        {label}
        {required ? "*" : ""}
      </label>
      {area ? (
        <textarea id={id} name={name} required={required} rows={4} className={`${shared} resize-none`} />
      ) : (
        <input id={id} name={name} type={type} required={required} className={shared} />
      )}
    </p>
  );
}

type Props = {
  open: boolean;
  onClose: () => void;
};

/** Panel blanco que entra desde la derecha con el formulario y los datos del estudio. */
export function ContactModal({ open, onClose }: Props) {
  const scope = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const [sent, setSent] = useState(false);

  useGSAP(
    () => {
      tl.current = gsap
        .timeline({ paused: true, defaults: { ease: "expo.inOut" } })
        .set("[data-contact-modal]", { autoAlpha: 1 })
        .fromTo("[data-contact-scrim]", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.6, ease: "power1.out" }, 0)
        .fromTo("[data-contact-panel]", { xPercent: 100 }, { xPercent: 0, duration: 0.9 }, 0)
        .fromTo(
          "[data-contact-in]",
          { autoAlpha: 0, y: 18 },
          { autoAlpha: 1, y: 0, duration: 0.7, ease: "power2.out", stagger: 0.05 },
          0.4,
        );
    },
    { scope },
  );

  useGSAP(
    () => {
      const timeline = tl.current;
      if (!timeline) return;
      const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce) timeline.progress(open ? 1 : 0);
      else if (open) timeline.timeScale(1).play();
      else timeline.timeScale(1.6).reverse();
      ScrollSmoother.get()?.paused(open);
    },
    { dependencies: [open], scope },
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Sin backend todavía: el envío arma un mail con lo cargado.
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const get = (k: string) => String(data.get(k) ?? "").trim();
    const body = [
      `Nombre: ${get("nombre")}`,
      `Email: ${get("email")}`,
      `Teléfono: ${get("telefono")}`,
      `Ubicación: ${get("ubicacion")}`,
      "",
      get("mensaje"),
    ].join("\n");
    window.location.href = `mailto:${contact.email}?subject=${encodeURIComponent(
      `Consulta de ${get("nombre")}`,
    )}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };

  return (
    <div ref={scope} aria-hidden={!open}>
      <div
        data-contact-modal
        className="invisible fixed inset-0 z-[60]"
        role="dialog"
        aria-modal="true"
        aria-label="Contacto"
      >
        <button
          type="button"
          data-contact-scrim
          tabIndex={-1}
          aria-hidden="true"
          onClick={onClose}
          className="absolute inset-0 h-full w-full cursor-default bg-ink/35 backdrop-blur-xl backdrop-saturate-[0.85]"
        />

        <div
          data-contact-panel
          inert={!open}
          className="absolute inset-y-0 right-0 flex w-full flex-col overflow-y-auto bg-paper text-ink shadow-[0_0_6rem_rgb(0_0_0/0.35)] md:w-[72vw] lg:w-[66vw]"
        >
          <div className="flex items-start justify-end px-(--gutter) pt-[calc(env(safe-area-inset-top,0px)+1.1rem)]">
            {/* Mismo "Cerrar" que el menú de mano: círculo relleno que se vacía al hover */}
            <CircleButton onClick={onClose} filled className="text-ink">
              Cerrar
            </CircleButton>
          </div>

          <div className="grid flex-1 content-start gap-[clamp(2.5rem,6vw,4.5rem)] px-(--gutter) pt-[clamp(4rem,14vh,9rem)] pb-[calc(env(safe-area-inset-bottom,0px)+3rem)] lg:grid-cols-[minmax(0,1fr)_max-content] lg:gap-x-[clamp(2.5rem,6vw,5rem)]">
            <div>
              <h2 data-contact-in className="text-subheading">
                Consultas generales
              </h2>

              <form onSubmit={onSubmit} className="mt-[clamp(2.5rem,6vh,4rem)] grid max-w-[32rem] gap-[clamp(1.4rem,3vh,2rem)]">
                <div data-contact-in className="grid gap-[clamp(1.4rem,3vh,2rem)]">
                  <Field name="nombre" label="Nombre" required />
                  <Field name="email" label="Email" type="email" required />
                  <Field name="telefono" label="Teléfono" type="tel" />
                  <Field name="ubicacion" label="Ubicación" />
                </div>
                <div data-contact-in>
                  <Field name="mensaje" label="Contanos sobre tu proyecto o qué estás buscando" required area />
                </div>
                <div data-contact-in className="pt-[clamp(0.75rem,2vh,1.5rem)]">
                  <CircleButton type="submit" className="text-ink">
                    Enviar
                  </CircleButton>
                  <p aria-live="polite" className="mt-4 text-meta text-ink/55">
                    {sent
                      ? "Se abre tu cliente de mail con la consulta cargada."
                      : "Te respondemos dentro de las 48 horas hábiles."}
                  </p>
                </div>
              </form>
            </div>

            <div data-contact-in className="grid grid-cols-2 content-start gap-x-(--gutter) gap-y-8 text-lead lg:grid-cols-1 lg:gap-y-[clamp(1.75rem,4vh,2.75rem)] lg:justify-self-end lg:mr-[clamp(2.5rem,7vw,7rem)] lg:pt-[clamp(6rem,16vh,11rem)]">
              <div>
                <p className="text-meta text-ink/55">Email</p>
                <a href={`mailto:${contact.email}`} className="link-draw pb-0.5 lg:whitespace-nowrap">
                  {contact.email}
                </a>
              </div>

              <div>
                <p className="text-meta text-ink/55">Teléfono</p>
                <a href={`tel:+598${contact.phone.replace(/\s/g, "")}`} className="link-draw pb-0.5">
                  {contact.phone}
                </a>
              </div>

              <div>
                <p className="text-meta text-ink/55">Estudio</p>
                <address className="not-italic lg:whitespace-nowrap">
                  {address.street}
                  <br />
                  {address.detail}
                  <br />
                  {address.city}
                </address>
                <a
                  href={mapsHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-draw mt-2 inline-block pb-0.5 text-ink/55"
                >
                  Ver en el mapa
                </a>
              </div>

              <div>
                <p className="text-meta text-ink/55">Instagram</p>
                <a
                  href={contact.instagram.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-draw pb-0.5"
                >
                  {contact.instagram.handle}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
