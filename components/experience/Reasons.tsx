"use client";

import { useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { REASONS } from "@/lib/data";
import { useExperience } from "./ExperienceProvider";

gsap.registerPlugin(useGSAP);

const HEART_COLORS = [
  { a: "#f0c4c7", b: "#e8b4b8", c: "#c98a92" },
  { a: "#f6d4a8", b: "#e8b87a", c: "#c4894a" },
  { a: "#d4c4f0", b: "#b8a0e0", c: "#8a6fc0" },
  { a: "#c4e8d8", b: "#8ecfb4", c: "#5aa88a" },
  { a: "#f0c4e0", b: "#e0a0c8", c: "#c070a0" },
  { a: "#f5e6c8", b: "#e8d4a0", c: "#c4a574" },
  { a: "#c8d8f0", b: "#a0b8e0", c: "#6a8cc0" },
  { a: "#f0b8b0", b: "#e09088", c: "#c06058" },
];

export function Reasons() {
  const [index, setIndex] = useState(0);
  const [colorIndex, setColorIndex] = useState(0);
  const [revealed, setRevealed] = useState(0);
  const rootRef = useRef<HTMLElement>(null);
  const heartRef = useRef<HTMLButtonElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const hintRef = useRef<HTMLSpanElement>(null);
  const { discoverEgg } = useExperience();

  useGSAP(
    () => {
      const heart = heartRef.current;
      const hint = hintRef.current;
      if (!heart || !hint) return;

      gsap.to(heart, {
        scale: 1.035,
        duration: 1.4,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
      });

      gsap.to(hint, {
        opacity: 0.35,
        duration: 1.1,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
      });
    },
    { scope: rootRef },
  );

  const next = () => {
    const heart = heartRef.current;
    const text = textRef.current;
    const nextIndex = (index + 1) % REASONS.length;
    const nextColor = (colorIndex + 1) % HEART_COLORS.length;

    if (text) {
      gsap.fromTo(
        text,
        { opacity: 0, y: 14, scale: 0.96 },
        { opacity: 1, y: 0, scale: 1, duration: 0.55, ease: "power3.out" },
      );
    }

    if (heart) {
      gsap.fromTo(
        heart,
        { scale: 0.92, rotate: -4 },
        { scale: 1, rotate: 0, duration: 0.55, ease: "back.out(2)" },
      );
    }

    setIndex(nextIndex);
    setColorIndex(nextColor);
    const count = revealed + 1;
    setRevealed(count);
    if (count >= REASONS.length) {
      discoverEgg("all-reasons", {
        title: "Corazón completo",
        detail: "Descubriste todas las razones",
      });
    }
  };

  const colors = HEART_COLORS[colorIndex];

  return (
    <section ref={rootRef} id="razones" className="relative px-6 py-28">
      <div className="mx-auto max-w-3xl text-center">
        <p className="mb-3 text-xs uppercase tracking-[0.35em] text-[var(--gold)]">
          Dale click
        </p>
        <h2
          data-cinema="title"
          className="font-display text-4xl text-[var(--cream)] sm:text-5xl"
        >
          Cosas que amo de ti
        </h2>
        <p className="mx-auto mt-4 max-w-md text-white/50">
          El corazón cambia con cada toque. Hay una razón distinta cada vez.
        </p>

        <div className="relative mx-auto mt-12 flex flex-col items-center">
          <button
            ref={heartRef}
            type="button"
            data-cursor="hover"
            onClick={next}
            aria-label="Siguiente razón"
            className="heart-reason group relative touch-manipulation"
          >
            <svg
              className="heart-reason-svg"
              viewBox="0 0 200 180"
              aria-hidden
            >
              <defs>
                <linearGradient
                  id="heartFill"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor={colors.a} />
                  <stop offset="45%" stopColor={colors.b} />
                  <stop offset="100%" stopColor={colors.c} />
                </linearGradient>
                <filter
                  id="heartGlow"
                  x="-30%"
                  y="-30%"
                  width="160%"
                  height="160%"
                >
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
              />
              <path
                d="M100 162C28 112 18 58 62 34c22-12 38-4 38 12 0-16 16-24 38-12 44 24 34 78-38 128z"
                fill="none"
                stroke="rgba(255,255,255,0.4)"
                strokeWidth="1.5"
              />
            </svg>

            <div className="heart-reason-content">
              <p
                ref={textRef}
                className="font-letter text-[1.35rem] leading-[1.25] text-[var(--ink)] sm:text-[1.65rem]"
              >
                {REASONS[index]}
              </p>
            </div>
          </button>

          <span
            ref={hintRef}
            className="mt-6 flex items-center gap-2 text-[11px] uppercase tracking-[0.32em] text-[var(--cream)]/55"
          >
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
            Toca para otra razón
            <span className="tabular-nums text-white/35">
              {Math.min(revealed + 1, REASONS.length)}/{REASONS.length}
            </span>
          </span>
        </div>
      </div>
    </section>
  );
}
