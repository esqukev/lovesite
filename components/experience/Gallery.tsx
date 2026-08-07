"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
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
  const [mounted, setMounted] = useState(false);
  const { discoverEgg, setLightboxOpen } = useExperience();
  const spots = useRef(buildSpots(GALLERY_IMAGES.length)).current;
  const dragMoved = useRef(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    setLightboxOpen(active !== null);
    return () => setLightboxOpen(false);
  }, [active, setLightboxOpen]);

  useEffect(() => {
    const board = boardRef.current;
    if (!board) return;
    const cards = gsap.utils.toArray<HTMLElement>(".polaroid", board);

    const onEnter = (e: Event) => {
      gsap.to(e.currentTarget as HTMLElement, {
        scale: 1.14,
        duration: 0.28,
        ease: "power2.out",
        zIndex: 40,
      });
    };
    const onLeave = (e: Event) => {
      gsap.to(e.currentTarget as HTMLElement, {
        scale: 1,
        duration: 0.28,
        ease: "power2.out",
      });
    };

    cards.forEach((card) => {
      card.addEventListener("pointerenter", onEnter);
      card.addEventListener("pointerleave", onLeave);
    });

    const draggables = Draggable.create(cards, {
      bounds: board,
      edgeResistance: 0.75,
      type: "x,y",
      inertia: true,
      onPress() {
        dragMoved.current = false;
        gsap.to(this.target, { scale: 1.12, duration: 0.2, zIndex: 50 });
      },
      onDrag() {
        dragMoved.current = true;
      },
      onRelease() {
        gsap.to(this.target, { scale: 1, duration: 0.28, ease: "power2.out" });
      },
      onDragEnd() {
        discoverEgg("photo-particles", {
          title: "Foto movida",
          detail: "Estás jugando con nuestros recuerdos",
        });
      },
    });

    return () => {
      cards.forEach((card) => {
        card.removeEventListener("pointerenter", onEnter);
        card.removeEventListener("pointerleave", onLeave);
      });
      draggables.forEach((d) => d.kill());
    };
  }, [discoverEgg]);

  const close = () => {
    setActive(null);
    setOrigin(null);
  };

  useEffect(() => {
    if (active === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active]);

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

  const lightbox =
    mounted &&
    active !== null &&
    origin &&
    createPortal(
      <AnimatePresence>
        <motion.div
          key="gallery-lightbox"
          className="fixed inset-0 z-[100000] flex items-center justify-center bg-[rgba(42,28,34,0.82)] p-4"
          style={{ pointerEvents: "auto" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onPointerDown={(e) => {
            if (e.target === e.currentTarget) close();
          }}
        >
          <button
            type="button"
            className="fixed right-5 top-5 z-[100001] flex h-12 w-12 items-center justify-center rounded-full bg-black/60 text-white shadow-lg"
            style={{ pointerEvents: "auto" }}
            onPointerDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              close();
            }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              close();
            }}
            aria-label="Cerrar"
          >
            <X size={22} />
          </button>

          <motion.div
            className="relative h-[78vh] w-full max-w-4xl"
            style={{ pointerEvents: "none" }}
            initial={{
              opacity: 0.7,
              scale: Math.min(origin.w / 480, 0.28),
              x: origin.x - window.innerWidth / 2,
              y: origin.y - window.innerHeight / 2,
            }}
            animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, scale: 0.4, y: 40 }}
            transition={{ type: "spring", stiffness: 160, damping: 20 }}
          >
            <Image
              src={GALLERY_IMAGES[active].src}
              alt=""
              fill
              className="pointer-events-none object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.45)]"
              sizes="100vw"
              priority
            />
          </motion.div>
        </motion.div>
      </AnimatePresence>,
      document.body,
    );

  return (
    <section
      id="galeria"
      className="section-soft relative z-10 px-4 py-16 sm:px-6 sm:py-20"
    >
      <div className="relative z-10 mx-auto mb-8 max-w-3xl text-center">
        <p className="mb-3 text-xs uppercase tracking-[0.35em] text-[var(--gold)]">
          Mesa de recuerdos
        </p>
        <h2 className="font-display text-4xl text-[var(--ink)] sm:text-6xl">
          Arrástralas
        </h2>
        <p className="muted mt-3">
          Pasa el mouse para agrandarlas. Muévelas. Ábrelas.
        </p>
      </div>

      <div
        ref={boardRef}
        className="relative z-10 mx-auto h-[min(120vw,720px)] max-w-5xl touch-none sm:h-[640px]"
      >
        {GALLERY_IMAGES.map((img, index) => {
          const spot = spots[index];
          return (
            <button
              key={img.src + index}
              type="button"
              className="polaroid absolute w-[42%] max-w-[180px] origin-center cursor-grab touch-manipulation will-change-transform active:cursor-grabbing sm:w-[22%] sm:max-w-[200px]"
              style={{
                left: `${spot.x}%`,
                top: `${spot.y}%`,
                rotate: `${spot.rotate}deg`,
                zIndex: spot.z,
              }}
              onClick={(e) => openPhoto(index, e.currentTarget)}
              aria-label="Foto"
            >
              <span className="block overflow-hidden rounded-lg bg-white p-1.5 shadow-[0_18px_40px_rgba(42,28,34,0.2)] ring-1 ring-black/5">
                <span className="relative block aspect-square overflow-hidden rounded-sm">
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

      {lightbox}
    </section>
  );
}
