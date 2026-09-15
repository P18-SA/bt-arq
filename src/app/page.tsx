import { Featured, Hero, IndexPreview, ProjectIndex } from "@/components/home/Sections";
import { Contact } from "@/components/site/Contact";
import { Shell } from "@/components/site/Shell";

export default function Home() {
  return (
    <Shell intro fixed={<IndexPreview />}>
      <main>
        <Hero />
        <Featured />
        <ProjectIndex />
      </main>
      <footer>
        <Contact />
      </footer>
    </Shell>
  );
}
