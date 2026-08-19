import type { Metadata } from "next";
import { Work_Sans } from "next/font/google";
import "./globals.css";

const workSans = Work_Sans({
  variable: "--font-work-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "BT Arquitectas",
  description: "Nuestra nueva web está en construcción. Volvé pronto.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${workSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
