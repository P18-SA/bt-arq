import Image from "next/image";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col bg-background text-foreground">
      <div className="flex flex-1 items-center justify-center px-6 py-16">
        <Image
          src="/logo.png"
          alt="Berthet + Taranto"
          width={547}
          height={92}
          priority
          className="h-auto w-full max-w-md"
        />
      </div>

      <footer className="flex flex-col items-center gap-2 px-6 pb-10 text-center text-sm leading-relaxed sm:text-base">
        <p>nuestra nueva web esta en construccion</p>
        <p>volve pronto</p>
        <p>
          <a
            href="https://www.instagram.com/bmarquitectas/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-inherit no-underline hover:underline"
          >
            visitanos en instagram
          </a>
        </p>
        <p>
          <a
            href="mailto:info@bmarquitectas.com.uy"
            className="text-inherit no-underline hover:underline"
          >
            info@bmarquitectas.com.uy
          </a>
        </p>
      </footer>
    </main>
  );
}
