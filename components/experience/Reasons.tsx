"use client";

import { useRef, useState } from "react";
import { gsap } from "gsap";
import { REASONS } from "@/lib/data";
import { useExperience } from "./ExperienceProvider";
import { softClick } from "@/lib/sounds";

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
    softClick();
    const el = cardRef.current;
    const anim = ANIMATIONS[index % ANIMATIONS.length];
    if (el) {
      gsap.fromTo(
        el,
        { ...anim, opacity: 0.2 },
        { x: 0, y: 0, rotate: 0, scale: 1, opacity: 1, duration: 0.65, ease: "back.out(1.6)" },
      );
    }
    const nextIndex = (index + 1) % REASONS.length;
    setIndex(nextIndex);
    const count = revealed + 1;
    setRevealed(count);
    if (count >= REASONS.length) discoverEgg("all-reasons");
  };

  return (
    <section id="razones" className="relative px-6 py-28">
      <div className="mx-auto max-w-3xl text-center">
        <p className="mb-3 text-xs uppercase tracking-[0.35em] text-[var(--gold)]">
          Pequeñas cosas
        </p>
        <h2 className="font-display text-4xl text-[var(--cream)] sm:text-5xl">
          Cosas que amo de ti
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-white/55">
          Cada toque revela una razón distinta. Puedes seguir descubriendo…
          siempre hay más.
        </p>

        <button
          ref={cardRef}
          type="button"
          data-cursor="hover"
          onClick={next}
          className="group relative mx-auto mt-14 flex min-h-[240px] w-full max-w-xl flex-col items-center justify-center overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/[0.07] to-white/[0.02] px-8 py-12 text-center shadow-[0_30px_80px_-40px_rgba(232,180,184,0.35)] backdrop-blur-xl transition-shadow hover:shadow-[0_40px_100px_-40px_rgba(232,180,184,0.55)]"
        >
          <span className="mb-4 text-[10px] uppercase tracking-[0.35em] text-white/35">
            Toca para revelar
          </span>
          <p className="font-display text-2xl leading-snug text-[var(--cream)] sm:text-3xl">
            {REASONS[index]}
          </p>
          <span className="mt-8 text-xs text-white/30">
            {Math.min(revealed + 1, REASONS.length)} / {REASONS.length}
          </span>
        </button>
      </div>
    </section>
  );
}
