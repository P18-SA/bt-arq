import { Featured, Hero, IndexPreview, ProjectIndex, StudioBreak } from "@/components/home/Sections";
import { Contact } from "@/components/site/Contact";
import { bySlug, photo } from "@/components/site/content";
import { Media } from "@/components/site/Media";
import { Shell } from "@/components/site/Shell";

// Obra con fotos en alta, para que el respiro no baje la calidad de la home.
const noteWide = bySlug("casa-en-punta-del-este");

export default function Home() {
  return (
    <Shell intro fixed={<IndexPreview />}>
      <main>
        <Hero />
        <Featured />
        <StudioBreak />
        {/* Por ahora la nota editorial ("El oficio") sale de la home: queda solo la foto grande. */}
        <section className="bg-fog">
          <div data-reveal className="h-[68svh] md:h-[76svh]">
            <Media
              src={photo(noteWide, 4)}
              label={`${noteWide.name}, ${noteWide.place}`}
              tone={noteWide.tone}
              bleed="y"
              speed="auto"
              sizes="100vw"
              className="h-full w-full"
            />
          </div>
        </section>
        <ProjectIndex />
      </main>
      <footer>
        <Contact />
      </footer>
    </Shell>
  );
}
