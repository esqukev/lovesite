"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import Image from "next/image";
import { PLACES } from "@/lib/data";
import { MapPin, X } from "lucide-react";

const MapInner = dynamic(() => import("./PlacesMapInner"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[520px] items-center justify-center rounded-[2rem] border border-white/10 bg-white/[0.03] text-white/40">
      Cargando nuestro mapa...
    </div>
  ),
});

export function PlacesMap() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const active = useMemo(
    () => PLACES.find((p) => p.id === activeId) ?? null,
    [activeId],
  );

  return (
    <section id="mapa" className="relative px-6 py-28">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 max-w-xl">
          <p className="mb-3 text-xs uppercase tracking-[0.35em] text-[var(--gold)]">
            Lugares
          </p>
          <h2 className="font-display text-4xl text-[var(--cream)] sm:text-5xl">
            Nuestro mapa
          </h2>
          <p className="mt-4 text-white/55">
            Coordenadas de momentos. Cada punto guarda un pedacito de nuestra
            historia.
          </p>
        </div>

        <div className="relative overflow-hidden rounded-[2rem] border border-white/10 shadow-[0_40px_100px_-50px_rgba(0,0,0,0.8)]">
          <MapInner activeId={activeId} onSelect={setActiveId} />

          {active && (
            <div className="absolute bottom-4 left-4 right-4 z-[500] overflow-hidden rounded-2xl border border-white/15 bg-black/70 shadow-2xl backdrop-blur-xl sm:left-auto sm:right-4 sm:w-80">
              <button
                type="button"
                className="absolute right-3 top-3 z-10 rounded-full bg-white/10 p-1.5 text-white"
                onClick={() => setActiveId(null)}
                aria-label="Cerrar"
              >
                <X size={14} />
              </button>
              <div className="relative h-36 w-full">
                <Image
                  src={active.image}
                  alt={active.name}
                  fill
                  className="object-cover"
                  sizes="320px"
                />
              </div>
              <div className="p-4">
                <div className="mb-1 flex items-center gap-2 text-[var(--accent)]">
                  <MapPin size={14} />
                  <span className="text-xs uppercase tracking-[0.2em]">
                    Lugar
                  </span>
                </div>
                <h3 className="font-display text-2xl text-[var(--cream)]">
                  {active.name}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-white/65">
                  {active.description}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
