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
type Origin = { x: number; y: number; w: number; h: number };

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
  const [origin, setOrigin] = useState<Origin | null>(null);
  const { discoverEgg } = useExperience();
  const spots = useRef(buildSpots(GALLERY_IMAGES.length)).current;
  const dragMoved = useRef(false);

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
        dragMoved.current = false;
        gsap.to(this.target, { scale: 1.06, duration: 0.2, zIndex: 50 });
      },
      onDrag() {
        dragMoved.current = true;
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

  const openPhoto = (index: number, el: HTMLElement) => {
    if (dragMoved.current) return;
    const rect = el.getBoundingClientRect();
    setOrigin({
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
      w: rect.width,
      h: rect.height,
    });
    setActive(index);
  };

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
          Muévelas. Ábrelas. Flotan libremente.
        </p>
      </div>

      <div
        ref={boardRef}
        className="relative mx-auto h-[min(120vw,720px)] max-w-5xl touch-none sm:h-[640px]"
      >
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
              onClick={(e) => openPhoto(index, e.currentTarget)}
              aria-label="Foto"
            >
              <span className="block overflow-hidden rounded-lg shadow-[0_18px_40px_rgba(0,0,0,0.45)] ring-1 ring-white/10">
                <span className="relative block aspect-square">
                  <Image
                    src={img.src}
                    alt=""
                    fill
                    className="pointer-events-none object-cover"
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
        {active !== null && origin && (
          <motion.div
            className="fixed inset-0 z-[80] flex items-center justify-center bg-black/80 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActive(null)}
          >
            <button
              type="button"
              className="absolute right-5 top-5 z-10 rounded-full border border-white/15 bg-white/10 p-2 text-white"
              onClick={() => setActive(null)}
              aria-label="Cerrar"
            >
              <X size={18} />
            </button>
            <motion.div
              className="relative h-[78vh] w-full max-w-4xl overflow-hidden rounded-2xl"
              initial={{
                opacity: 0.7,
                scale: Math.min(origin.w / 480, 0.28),
                x: origin.x - window.innerWidth / 2,
                y: origin.y - window.innerHeight / 2,
                borderRadius: 12,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                x: 0,
                y: 0,
                borderRadius: 24,
              }}
              exit={{
                opacity: 0,
                scale: 0.4,
                y: 40,
              }}
              transition={{ type: "spring", stiffness: 160, damping: 20 }}
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
