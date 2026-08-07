import type { Metadata } from "next";
import { Cormorant_Garamond, Outfit } from "next/font/google";
import "./globals.css";

const display = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const body = Outfit({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Nuestro pequeño universo",
  description:
    "Un lugar al que solamente dos personas tienen acceso. Hecho para Motzy.",
  openGraph: {
    title: "Nuestro pequeño universo",
    description: "Existe un pequeño lugar al que solamente dos personas tienen acceso.",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${display.variable} ${body.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[var(--void)] text-[var(--cream)]">
        {children}
      </body>
    </html>
  );
}
