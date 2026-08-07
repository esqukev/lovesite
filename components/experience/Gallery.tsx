"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { X } from "lucide-react";
import { GALLERY_IMAGES } from "@/lib/data";
import { useExperience } from "./ExperienceProvider";

gsap.registerPlugin(useGSAP, ScrollTrigger);

function TiltImage({
  src,
  alt,
  className,
  onOpen,
  onDouble,
}: {
  src: string;
  alt: string;
  className?: string;
  onOpen: () => void;
  onDouble: (e: React.MouseEvent) => void;
}) {
  const ref = useRef<HTMLButtonElement>(null);

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    gsap.to(el, {
      rotateY: px * 10,
      rotateX: -py * 10,
      transformPerspective: 800,
      duration: 0.35,
      ease: "power2.out",
    });
  };

  const onLeave = () => {
    gsap.to(ref.current, {
      rotateY: 0,
      rotateX: 0,
      duration: 0.5,
      ease: "power3.out",
    });
  };

  return (
    <button
      ref={ref}
      type="button"
      data-cursor="hover"
      onClick={onOpen}
      onDoubleClick={onDouble}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={`group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] ${className ?? ""}`}
      style={{ transformStyle: "preserve-3d" }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover transition-transform duration-700 group-hover:scale-105"
        sizes="(max-width: 768px) 100vw, 33vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      <span className="absolute bottom-4 left-4 translate-y-2 text-sm text-white opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
        {alt}
      </span>
    </button>
  );
}

export function Gallery() {
  const rootRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState<number | null>(null);
  const { discoverEgg } = useExperience();
  const burstRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from(".gallery-item", {
        opacity: 0,
        y: 40,
        scale: 0.96,
        duration: 0.9,
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top 75%",
        },
      });
    },
    { scope: rootRef },
  );

  const spawnParticles = (e: React.MouseEvent) => {
    discoverEgg("photo-particles");
    const host = burstRef.current;
    if (!host) return;
    const rect = host.getBoundingClientRect();
    for (let i = 0; i < 14; i++) {
      const p = document.createElement("span");
      p.className = "pointer-events-none absolute h-1.5 w-1.5 rounded-full bg-[var(--accent)]";
      p.style.left = `${e.clientX - rect.left}px`;
      p.style.top = `${e.clientY - rect.top}px`;
      host.appendChild(p);
      gsap.to(p, {
        x: (Math.random() - 0.5) * 120,
        y: (Math.random() - 0.5) * 120,
        opacity: 0,
        scale: 0,
        duration: 0.8,
        ease: "power2.out",
        onComplete: () => p.remove(),
      });
    }
  };

  return (
    <section ref={rootRef} id="galeria" className="relative px-6 py-28">
      <div ref={burstRef} className="pointer-events-none absolute inset-0 z-20" />
      <div className="mx-auto max-w-6xl">
        <div className="mb-14 max-w-xl">
          <p className="mb-3 text-xs uppercase tracking-[0.35em] text-[var(--gold)]">
            Galería
          </p>
          <h2 data-cinema="title" className="font-display text-4xl text-[var(--cream)] sm:text-5xl">
            Nuestras fotos
          </h2>
          <p className="mt-4 text-white/55">
            Incluye Avocat — la pintura que me hiciste. Un pedazo de tu arte
            viviendo aquí con nosotros.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {GALLERY_IMAGES.map((img, index) => (
            <div
              key={img.src + index}
              className={`gallery-item ${
                img.span === "tall"
                  ? "h-[380px] sm:row-span-2 sm:h-auto sm:min-h-[500px]"
                  : img.span === "wide"
                    ? "h-[280px] sm:col-span-2 lg:col-span-1 lg:h-[320px]"
                    : "h-[300px]"
              }`}
            >
              <TiltImage
                src={img.src}
                alt={img.alt}
                className="h-full w-full"
                onOpen={() => {
                  setActive(index);
                }}
                onDouble={spawnParticles}
              />
            </div>
          ))}
        </div>
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
              className="relative flex h-[78vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl"
              initial={{ scale: 0.88, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ type: "spring", stiffness: 180, damping: 22 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative min-h-0 flex-1">
                <Image
                  src={GALLERY_IMAGES[active].src}
                  alt={GALLERY_IMAGES[active].alt}
                  fill
                  className="object-contain"
                  sizes="100vw"
                  priority
                />
              </div>
              <p className="shrink-0 bg-black/70 px-4 py-3 text-center font-display text-lg text-[var(--cream)] backdrop-blur-md">
                {GALLERY_IMAGES[active].alt}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
