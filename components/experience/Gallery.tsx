"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";
import { InertiaPlugin } from "gsap/InertiaPlugin";
import { X } from "lucide-react";
import { GALLERY_IMAGES } from "@/lib/data";
import { useExperience } from "./ExperienceProvider";

gsap.registerPlugin(Draggable, InertiaPlugin);

type Spot = { x: number; y: number; rotate: number; z: number };

function buildSpots(count: number): Spot[] {
  return Array.from({ length: count }, (_, i) => ({
    x: (i % 5) * 16 + (i % 3) * 4 - 8 + Math.sin(i) * 6,
    y: Math.floor(i / 5) * 22 + (i % 2) * 8 + 4,
    rotate: (i % 2 === 0 ? -1 : 1) * (4 + (i % 5) * 2),
    z: i,
  }));
}

export function Gallery() {
  const boardRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number | null>(null);
  const { discoverEgg } = useExperience();
  const spots = useRef(buildSpots(GALLERY_IMAGES.length)).current;

  useEffect(() => {
    const board = boardRef.current;
    if (!board) return;
    const cards = gsap.utils.toArray<HTMLElement>(".polaroid", board);

    const draggables = Draggable.create(cards, {
      bounds: board,
      edgeResistance: 0.75,
      type: "x,y",
      inertia: true,
      onPress() {
        gsap.to(this.target, { scale: 1.06, duration: 0.2, zIndex: 50 });
      },
      onRelease() {
        gsap.to(this.target, { scale: 1, duration: 0.25 });
      },
      onDragEnd() {
        discoverEgg("photo-particles", {
          title: "Foto movida",
          detail: "Estás jugando con nuestros recuerdos",
        });
      },
    });

    return () => {
      draggables.forEach((d) => d.kill());
    };
  }, [discoverEgg]);

  return (
    <section id="galeria" className="relative px-4 py-24 sm:px-6">
      <div className="mx-auto mb-8 max-w-3xl text-center">
        <p className="mb-3 text-xs uppercase tracking-[0.35em] text-[var(--gold)]">
          Mesa de recuerdos
        </p>
        <h2 className="font-display text-4xl text-[var(--cream)] sm:text-6xl">
          Arrástralas
        </h2>
        <p className="mt-3 text-white/50">
          Muévelas. Ábrelas. Esto no es una galería quieta.
        </p>
      </div>

      <div
        ref={boardRef}
        className="relative mx-auto h-[min(120vw,720px)] max-w-5xl overflow-hidden rounded-[2rem] border border-white/10 bg-[#1a1410]/80 shadow-[inset_0_0_80px_rgba(0,0,0,0.35)] touch-none sm:h-[640px]"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(232,180,184,0.08),transparent_45%)]" />

        {GALLERY_IMAGES.map((img, index) => {
          const spot = spots[index];
          return (
            <button
              key={img.src + index}
              type="button"
              className="polaroid absolute w-[42%] max-w-[180px] cursor-grab touch-manipulation active:cursor-grabbing sm:w-[22%] sm:max-w-[200px]"
              style={{
                left: `${spot.x}%`,
                top: `${spot.y}%`,
                rotate: `${spot.rotate}deg`,
                zIndex: spot.z,
              }}
              onDoubleClick={() => setActive(index)}
              onClick={() => {
                if (window.matchMedia("(pointer: coarse)").matches) {
                  setActive(index);
                }
              }}
              aria-label="Foto"
            >
              <span className="block rounded-md bg-[#f3ebe3] p-2 pb-6 shadow-[0_12px_30px_rgba(0,0,0,0.35)]">
                <span className="relative block aspect-square overflow-hidden bg-black/10">
                  <Image
                    src={img.src}
                    alt=""
                    fill
                    className="object-cover pointer-events-none"
                    sizes="200px"
                    draggable={false}
                  />
                </span>
              </span>
            </button>
          );
        })}
      </div>

      <AnimatePresence>
        {active !== null && (
          <motion.div
            className="fixed inset-0 z-[80] flex items-center justify-center bg-black/85 p-4 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActive(null)}
          >
            <button
              type="button"
              className="absolute right-5 top-5 rounded-full border border-white/15 bg-white/10 p-2 text-white"
              onClick={() => setActive(null)}
              aria-label="Cerrar"
            >
              <X size={18} />
            </button>
            <motion.div
              className="relative h-[75vh] w-full max-w-4xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={GALLERY_IMAGES[active].src}
                alt=""
                fill
                className="object-contain"
                sizes="100vw"
                priority
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
