"use client";

import { useRef, useState } from "react";
import { gsap } from "gsap";
import { REASONS } from "@/lib/data";
import { useExperience } from "./ExperienceProvider";

const ANIMATIONS = [
  { y: -20, rotate: -4, scale: 1.05 },
  { x: 24, rotate: 3, scale: 1.02 },
  { y: 18, scale: 0.95 },
  { x: -18, rotate: -6 },
  { scale: 1.12, rotate: 2 },
  { y: -12, x: 12, rotate: 5 },
  { y: 16, x: -10, scale: 1.08 },
  { rotate: -8, scale: 1.04 },
  { y: -24, scale: 1.01 },
  { x: 16, y: 10, rotate: 4 },
];

export function Reasons() {
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(0);
  const cardRef = useRef<HTMLButtonElement>(null);
  const { discoverEgg } = useExperience();

  const next = () => {
    const el = cardRef.current;
    const anim = ANIMATIONS[index % ANIMATIONS.length];
    if (el) {
      gsap.fromTo(
        el,
        { ...anim, opacity: 0.25 },
        {
          x: 0,
          y: 0,
          rotate: 0,
          scale: 1,
          opacity: 1,
          duration: 0.65,
          ease: "back.out(1.6)",
        },
      );
    }
    const nextIndex = (index + 1) % REASONS.length;
    setIndex(nextIndex);
    const count = revealed + 1;
    setRevealed(count);
    if (count >= REASONS.length) {
      discoverEgg("all-reasons", {
        title: "Corazón completo",
        detail: "Descubriste todas las razones",
      });
    }
  };

  return (
    <section id="razones" className="relative px-6 py-28">
      <div className="mx-auto max-w-3xl text-center">
        <p className="mb-3 text-xs uppercase tracking-[0.35em] text-[var(--gold)]">
          Pequeñas cosas
        </p>
        <h2
          data-cinema="title"
          className="font-display text-4xl text-[var(--cream)] sm:text-5xl"
        >
          Cosas que amo de ti
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-white/55">
          Cada toque revela una razón distinta. Puedes seguir descubriendo…
          siempre hay más.
        </p>

        <div className="relative mx-auto mt-10 flex justify-center">
          <button
            ref={cardRef}
            type="button"
            data-cursor="hover"
            onClick={next}
            aria-label="Revelar razón"
            className="heart-reason group relative touch-manipulation"
          >
            <svg
              className="heart-reason-svg"
              viewBox="0 0 200 180"
              aria-hidden
            >
              <defs>
                <linearGradient id="heartFill" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f0c4c7" />
                  <stop offset="45%" stopColor="#e8b4b8" />
                  <stop offset="100%" stopColor="#c98a92" />
                </linearGradient>
                <filter id="heartGlow" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="6" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <path
                d="M100 162C28 112 18 58 62 34c22-12 38-4 38 12 0-16 16-24 38-12 44 24 34 78-38 128z"
                fill="url(#heartFill)"
                filter="url(#heartGlow)"
                className="transition-transform duration-500 group-hover:scale-[1.02]"
              />
              <path
                d="M100 162C28 112 18 58 62 34c22-12 38-4 38 12 0-16 16-24 38-12 44 24 34 78-38 128z"
                fill="none"
                stroke="rgba(255,255,255,0.35)"
                strokeWidth="1.5"
              />
            </svg>

            <div className="heart-reason-content">
              <span className="mb-2 block text-[10px] uppercase tracking-[0.28em] text-[var(--ink)]/55">
                Toca el corazón
              </span>
              <p className="font-display text-lg leading-snug text-[var(--ink)] sm:text-xl">
                {REASONS[index]}
              </p>
              <span className="mt-3 block text-[11px] text-[var(--ink)]/45">
                {Math.min(revealed + 1, REASONS.length)} / {REASONS.length}
              </span>
            </div>
          </button>
        </div>
      </div>
    </section>
  );
}
