import type { Metadata } from "next";
import { Caveat, Figtree, Instrument_Serif } from "next/font/google";
import "./globals.css";

const display = Instrument_Serif({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
});

const body = Figtree({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const letter = Caveat({
  variable: "--font-letter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Nuestro pequeño universo",
  description:
    "Un lugar al que solamente dos personas tienen acceso. Hecho para Motzy.",
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
  },
  openGraph: {
    title: "Nuestro pequeño universo",
    description:
      "Existe un pequeño lugar al que solamente dos personas tienen acceso.",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${display.variable} ${body.variable} ${letter.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[var(--void)] text-[var(--ink)]">
        {children}
      </body>
    </html>
  );
}
