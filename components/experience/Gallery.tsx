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
  const dragging = useRef(false);

  useEffect(() => {
    const board = boardRef.current;
    if (!board) return;
    const cards = gsap.utils.toArray<HTMLElement>(".polaroid", board);
    const setters = cards.map((card) =>
      gsap.quickTo(card, "scale", { duration: 0.35, ease: "power3.out" }),
    );

    const radius = 240;
    const mapScale = gsap.utils.mapRange(0, radius, 1.38, 1);

    const onMove = (e: PointerEvent) => {
      if (dragging.current || active !== null) return;
      cards.forEach((card, i) => {
        const r = card.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const dist = Math.hypot(e.clientX - cx, e.clientY - cy);
        const scale = mapScale(gsap.utils.clamp(0, radius, dist));
        setters[i](scale);
        card.style.zIndex = String(Math.round((1.38 - scale) * -100 + spots[i].z));
      });
    };

    const onLeave = () => {
      if (dragging.current) return;
      setters.forEach((set) => set(1));
    };

    board.addEventListener("pointermove", onMove);
    board.addEventListener("pointerleave", onLeave);

    const draggables = Draggable.create(cards, {
      bounds: board,
      edgeResistance: 0.75,
      type: "x,y",
      inertia: true,
      onPress() {
        dragMoved.current = false;
        dragging.current = true;
        gsap.to(this.target, { scale: 1.12, duration: 0.2, zIndex: 50 });
      },
      onDrag() {
        dragMoved.current = true;
      },
      onRelease() {
        dragging.current = false;
        gsap.to(this.target, { scale: 1, duration: 0.25 });
      },
      onDragEnd() {
        dragging.current = false;
        discoverEgg("photo-particles", {
          title: "Foto movida",
          detail: "Estás jugando con nuestros recuerdos",
        });
      },
    });

    return () => {
      board.removeEventListener("pointermove", onMove);
      board.removeEventListener("pointerleave", onLeave);
      draggables.forEach((d) => d.kill());
    };
  }, [discoverEgg, active, spots]);

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
    <section
      id="galeria"
      className="section-soft relative px-4 py-16 sm:px-6 sm:py-20"
    >
      <div className="mx-auto mb-8 max-w-3xl text-center">
        <p className="mb-3 text-xs uppercase tracking-[0.35em] text-[var(--gold)]">
          Mesa de recuerdos
        </p>
        <h2 className="font-display text-4xl text-[var(--ink)] sm:text-6xl">
          Arrástralas
        </h2>
        <p className="muted mt-3">
          Acerca el cursor — crecen cerca de ti. Muévelas. Ábrelas.
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

      <AnimatePresence>
        {active !== null && origin && (
          <motion.div
            className="fixed inset-0 z-[80] flex items-center justify-center bg-[rgba(42,28,34,0.72)] p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActive(null)}
          >
            <button
              type="button"
              className="absolute right-5 top-5 z-10 rounded-full border border-white/20 bg-white/15 p-2 text-white"
              onClick={() => setActive(null)}
              aria-label="Cerrar"
            >
              <X size={18} />
            </button>
            <motion.div
              className="relative h-[78vh] w-full max-w-4xl overflow-hidden rounded-2xl bg-white p-2"
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
              <div className="relative h-full w-full overflow-hidden rounded-xl">
                <Image
                  src={GALLERY_IMAGES[active].src}
                  alt=""
                  fill
                  className="object-contain"
                  sizes="100vw"
                  priority
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
