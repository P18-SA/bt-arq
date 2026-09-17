import { Featured, Hero, IndexPreview, ProjectIndex, StudioBreak } from "@/components/home/Sections";
import { Contact } from "@/components/site/Contact";
import { EditorialNote } from "@/components/site/EditorialNote";
import { bySlug, note, photo } from "@/components/site/content";
import { Shell } from "@/components/site/Shell";

// Obras con fotos en alta, para que la nota no baje la calidad de la home.
const noteAside = bySlug("casa-en-carrasco-iii");
const noteWide = bySlug("casa-en-punta-del-este");

export default function Home() {
  return (
    <Shell intro fixed={<IndexPreview />}>
      <main>
        <Hero />
        <Featured />
        <StudioBreak />
        <EditorialNote
          eyebrow={note.eyebrow}
          lead={note.lead}
          paragraphs={note.paragraphs}
          aside={{ src: photo(noteAside), label: `${noteAside.name}, ${noteAside.place}`, tone: noteAside.tone }}
          wide={{ src: photo(noteWide, 1), label: `${noteWide.name}, ${noteWide.place}`, tone: noteWide.tone }}
        />
        <ProjectIndex />
      </main>
      <footer>
        <Contact />
      </footer>
    </Shell>
  );
}
