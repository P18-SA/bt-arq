import Image from "next/image";

function InstagramIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="h-[1.15em] w-[1.15em] shrink-0"
    >
      <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.5" cy="6.5" r="1.15" fill="currentColor" stroke="none" />
    </svg>
  );
}

export default function Home() {
  return (
    <main className="flex flex-1 flex-col bg-background text-foreground">
      <div className="flex flex-1 items-center justify-center pt-[5vw]">
        <Image
          src="/logo.png"
          alt="Berthet + Taranto"
          width={547}
          height={92}
          priority
          className="h-auto w-full max-w-[min(88vw,clamp(20rem,52vw,46rem))]"
        />
      </div>

      <footer className="flex flex-col items-center gap-[0.1em] pt-[6vw] pb-[max(1.5rem,1.5vh)] text-center text-[clamp(0.8125rem,0.7rem+0.55vw,1.0625rem)] leading-[1.25]">
        <p>Nuestra nueva web esta en construcción</p>
        <p>¡volve pronto!</p>
        <p>
          <a
            href="https://www.instagram.com/btarquitectas/"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-[0.4em] text-inherit no-underline"
          >
            <span className="group-hover:underline">visitanos en</span>
            <InstagramIcon />
            <span className="group-hover:underline">btarquitectas</span>
          </a>
        </p>
        <p>
          <a
            href="mailto:info@btarquitectas.com.uy"
            className="text-inherit no-underline hover:underline"
          >
            info@btarquitectas.com.uy
          </a>
        </p>
      </footer>
    </main>
  );
}
