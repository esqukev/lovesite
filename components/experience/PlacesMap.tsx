"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { PLACES } from "@/lib/data";
import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

const MapInner = dynamic(() => import("./PlacesMapInner"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[560px] items-center justify-center rounded-[2rem] border border-white/10 bg-white/[0.03] text-white/40">
      Cargando nuestro mapa...
    </div>
  ),
});

export function PlacesMap() {
  const [activeId, setActiveId] = useState<string | null>(null);

  return (
    <section id="mapa" className="relative px-6 py-28">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 max-w-xl">
          <p className="mb-3 text-xs uppercase tracking-[0.35em] text-[var(--gold)]">
            Lugares
          </p>
          <h2 data-cinema="title" className="font-display text-4xl text-[var(--cream)] sm:text-5xl">
            Nuestro mapa
          </h2>
          <p className="mt-4 text-white/55">
            Cada punto ya muestra su nombre. Toca uno para leer el recuerdo —
            y toca el mapa vacío para volver a verlo completo.
          </p>
        </div>

        <div className="relative overflow-hidden rounded-[2rem] border border-white/10 shadow-[0_40px_100px_-50px_rgba(0,0,0,0.8)]">
          <MapInner
            activeId={activeId}
            onSelect={setActiveId}
            onClear={() => setActiveId(null)}
          />
          {activeId && (
            <button
              type="button"
              onClick={() => setActiveId(null)}
              className="absolute left-4 top-4 z-[500] rounded-full border border-white/15 bg-black/70 px-4 py-2 text-xs uppercase tracking-[0.2em] text-white/80 backdrop-blur-md transition hover:bg-black/85"
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
                  "flex w-full items-start gap-2 rounded-2xl border px-3 py-3 text-left transition-all",
                  activeId === place.id
                    ? "border-[var(--accent)]/50 bg-[var(--accent)]/10"
                    : "border-white/10 bg-white/[0.03] hover:bg-white/[0.06]",
                )}
              >
                <MapPin
                  size={14}
                  className="mt-0.5 shrink-0 text-[var(--accent)]"
                />
                <span>
                  <span className="block text-sm text-[var(--cream)]">
                    {place.name}
                  </span>
                  <span className="mt-1 block text-xs leading-relaxed text-white/45">
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
