import type { Metadata } from "next";
import { Work_Sans } from "next/font/google";
import "./globals.css";

const workSans = Work_Sans({
  variable: "--font-work-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "BT Arquitectas", template: "%s | BT Arquitectas" },
  description:
    "Berthet + Taranto, estudio de arquitectura. Casas, espacios de trabajo y lugares compartidos.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${workSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        <noscript>
          <style>{`[data-hero-media],[data-hero-intro],[data-header-item],[data-header-logo],[data-page-title],[data-page-in],[data-contact-bg],[data-location-card]{visibility:visible!important}`}</style>
        </noscript>
        {children}
      </body>
    </html>
  );
}
