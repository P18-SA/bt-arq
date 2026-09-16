import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

// ABC Areal (Dinamo), variable. El eje de peso va de 400 a 700: no hay cortes light.
const areal = localFont({
  src: "../fonts/ABCArealVariable.woff2",
  variable: "--font-areal",
  weight: "400 700",
  style: "normal",
  display: "swap",
  fallback: ["Arial", "Helvetica", "sans-serif"],
});

export const metadata: Metadata = {
  title: { default: "BT Arquitectas", template: "%s | BT Arquitectas" },
  description:
    "Berthet + Taranto, estudio de arquitectura. Casas, espacios de trabajo y lugares compartidos.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${areal.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        <noscript>
          <style>{`[data-hero-media],[data-hero-intro],[data-header-item],[data-header-logo],[data-page-title],[data-page-in],[data-contact-bg],[data-location-card]{visibility:visible!important}`}</style>
        </noscript>
        {children}
      </body>
    </html>
  );
}
