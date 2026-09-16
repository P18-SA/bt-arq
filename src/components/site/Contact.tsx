import Link from "next/link";
import { contact } from "./content";
import { PlusLabel } from "./Plus";

/** Texto duplicado para el giro de letras al pasar el cursor (ver motion.rollLinks). */
export function RollText({ text }: { text: string }) {
  return (
    <span aria-hidden="true" className="relative block overflow-hidden">
      <span data-roll-a className="block">
        {text}
      </span>
      <span data-roll-b className="absolute inset-x-0 top-full block">
        {text}
      </span>
    </span>
  );
}

export function EmailLink({ className = "" }: { className?: string }) {
  return (
    <a
      href={`mailto:${contact.email}`}
      data-roll
      className={`email-fit inline-block leading-[1.05] ${className}`}
    >
      <span className="sr-only">Escribinos a {contact.email}</span>
      <RollText text={contact.email} />
    </a>
  );
}

/** Cierre negro al pie de las páginas, con las líneas de la cruz. */
export function Contact() {
  return (
    <section id="contacto" data-contact className="@container relative overflow-hidden bg-ink text-paper">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <span data-contact-h className="absolute inset-x-0 top-[38%] h-px origin-left bg-paper/20" />
        <span data-contact-v className="absolute inset-y-0 left-[62%] w-px origin-top bg-paper/20" />
      </div>

      <div className="relative flex min-h-svh flex-col justify-between px-(--gutter) pt-[16vh] pb-[calc(env(safe-area-inset-bottom,0px)+1.5rem)]">
        <div className="flex flex-wrap items-baseline justify-between gap-6">
          <div>
            <h2 className="text-label text-paper/60">(Contacto)</h2>
            <p className="mt-6 max-w-[18ch] text-heading">
              Contanos qué querés construir.
            </p>
          </div>
          <Link href="/contacto" className="group flex items-center gap-2 text-meta">
            <PlusLabel>Ir a contacto</PlusLabel>
          </Link>
        </div>

        <div className="py-[10vh]">
          <EmailLink />
        </div>

        <div className="grid gap-8 border-t border-paper/20 pt-6 text-meta sm:grid-cols-4">
          <p className="text-paper/60">
            {contact.address.street}
            <br />
            {contact.address.city}
          </p>
          <p>
            <a href={`tel:+598${contact.phone.replace(/\s/g, "")}`} className="link-draw pb-0.5">
              Tel. {contact.phone}
            </a>
          </p>
          <p>
            <a href={contact.instagram.href} target="_blank" rel="noopener noreferrer" className="link-draw pb-0.5">
              Instagram, {contact.instagram.handle}
            </a>
          </p>
          <p className="text-paper/60 sm:text-right">© 2026 Berthet + Taranto Arquitectas</p>
        </div>
      </div>
    </section>
  );
}
