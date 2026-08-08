import type { Metadata, Viewport } from "next";
import { Caveat, Figtree, Instrument_Serif } from "next/font/google";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

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

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
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
    locale: "es_CR",
    siteName: "Nuestro pequeño universo",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nuestro pequeño universo",
    description:
      "Existe un pequeño lugar al que solamente dos personas tienen acceso.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${display.variable} ${body.variable} ${letter.variable} antialiased`}
    >
      <body className="min-h-dvh bg-[var(--void)] text-[var(--ink)]">
        {children}
      </body>
    </html>
  );
}
