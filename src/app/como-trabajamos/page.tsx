import type { Metadata } from "next";
import Link from "next/link";
import { Contact } from "@/components/site/Contact";
import { work } from "@/components/site/content";
import { HowWeWork } from "@/components/site/HowWeWork";
import { PlusLabel } from "@/components/site/Plus";
import { Shell } from "@/components/site/Shell";

export const metadata: Metadata = {
  title: "Cómo trabajamos",
  description: work.summary,
};

export default function ComoTrabajamos() {
  return (
    <Shell>
      <main>
        {/* La página no abre con un título: abre con la frase, que es lo que dice cómo trabajamos */}
        <section className="grid grid-cols-12 gap-x-(--gutter) px-(--gutter) pt-[24vh] pb-[16vh]">
          <h1 data-page-title className="col-span-12 text-heading text-nowrap md:col-span-9">
            {work.intro}
          </h1>
        </section>

        <HowWeWork />

        <section className="px-(--gutter) py-[20vh]">
          <Link href="/contacto" className="group inline-flex items-center gap-3 text-subheading">
            <PlusLabel>Empezar un proyecto</PlusLabel>
          </Link>
        </section>
      </main>
      <footer>
        <Contact />
      </footer>
    </Shell>
  );
}
