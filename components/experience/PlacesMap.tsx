"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { PLACES } from "@/lib/data";
import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

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
      className="section-soft relative px-5 py-16 sm:px-8 sm:py-20"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 max-w-xl">
          <p className="mb-3 text-xs uppercase tracking-[0.35em] text-[var(--gold)]">
            Lugares
          </p>
          <h2 className="font-display text-4xl text-[var(--ink)] sm:text-5xl">
            Nuestro mapa
          </h2>
          <p className="muted mt-4">
            Cada punto ya muestra su nombre. Toca uno para leer el recuerdo —
            y toca el mapa vacío para volver a verlo completo.
          </p>
        </div>

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
                  "flex w-full items-start gap-2 rounded-2xl px-3 py-3 text-left transition-all",
                  activeId === place.id
                    ? "bg-[var(--accent)]/15"
                    : "hover:bg-white/40",
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
