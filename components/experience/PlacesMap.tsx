"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { PLACES } from "@/lib/data";
import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { SectionPolaroid } from "./SectionPolaroid";
import { SectionReveal } from "./SectionReveal";

const MapInner = dynamic(() => import("./PlacesMapInner"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[560px] items-center justify-center rounded-[1.5rem] bg-white/50 text-[var(--ink)]/40">
      Cargando nuestro mapa...
    </div>
  ),
});

export function PlacesMap() {
  const [activeId, setActiveId] = useState<string | null>(null);

  return (
    <section
      id="mapa"
      className="section-soft relative z-10 px-5 py-16 sm:px-8 sm:py-20"
    >
      <SectionPolaroid
        src="/foto8.jpeg"
        className="right-[4%] top-24 hidden w-16 lg:block"
        rotate="7deg"
      />
      <div className="relative z-10 mx-auto max-w-6xl">
        <SectionReveal className="mb-10 max-w-xl">
          <p
            data-reveal
            className="mb-3 text-xs uppercase tracking-[0.35em] text-[var(--gold)]"
          >
            Lugares
          </p>
          <h2
            data-reveal
            className="font-display text-4xl text-[var(--ink)] sm:text-5xl"
          >
            Nuestro mapa
          </h2>
          <p data-reveal className="muted mt-4">
            Cada punto tiene su descripción. Dale click para leerla.
          </p>
        </SectionReveal>

        <div className="relative overflow-hidden rounded-[1.5rem] shadow-[0_30px_80px_-40px_rgba(42,28,34,0.35)] ring-1 ring-[var(--line)]">
          <MapInner
            activeId={activeId}
            onSelect={setActiveId}
            onClear={() => setActiveId(null)}
          />
          {activeId && (
            <button
              type="button"
              onClick={() => setActiveId(null)}
              className="absolute left-4 top-4 z-[500] rounded-full bg-white/90 px-4 py-2 text-xs uppercase tracking-[0.2em] text-[var(--ink)] shadow-md backdrop-blur-md transition hover:bg-white"
            >
              Volver al mapa
            </button>
          )}
        </div>

        <ul className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {PLACES.map((place) => (
            <li key={place.id}>
              <button
                type="button"
                data-cursor="hover"
                onClick={() =>
                  setActiveId((prev) => (prev === place.id ? null : place.id))
                }
                className={cn(
                  "flex w-full origin-center items-start gap-2 rounded-2xl px-3 py-3 text-left transition-all duration-300 ease-in-out will-change-transform hover:scale-[1.04] hover:bg-white/50",
                  activeId === place.id
                    ? "scale-[1.03] bg-[var(--accent)]/15"
                    : "",
                )}
              >
                <MapPin
                  size={14}
                  className="mt-0.5 shrink-0 text-[var(--accent)]"
                />
                <span>
                  <span className="block text-sm text-[var(--ink)]">
                    {place.name}
                  </span>
                  <span className="muted mt-1 block text-xs leading-relaxed">
                    {place.description}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
