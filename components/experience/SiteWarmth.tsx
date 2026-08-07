"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

function CatMini({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      <path
        fill="currentColor"
        d="M12 22c0-8 6-14 14-14 3 0 6 1 8 3 2-2 5-3 8-3 8 0 14 6 14 14v18c0 10-8 18-18 18H30C20 58 12 50 12 40V22z"
      />
      <path fill="#2a1c22" d="M18 10l6 10H14l4-10zm28 0l4 10H40l6-10z" />
      <circle cx="26" cy="30" r="2" fill="#2a1c22" />
      <circle cx="38" cy="30" r="2" fill="#2a1c22" />
    </svg>
  );
}

function DogMini({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      <ellipse cx="32" cy="36" rx="16" ry="14" fill="currentColor" />
      <path fill="currentColor" d="M16 28c-6-2-10 4-8 8l8-2M48 28c6-2 10 4 8 8l-8-2" />
      <circle cx="26" cy="34" r="2" fill="#2a1c22" />
      <circle cx="38" cy="34" r="2" fill="#2a1c22" />
    </svg>
  );
}

function FrogMini({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      <ellipse cx="32" cy="38" rx="18" ry="14" fill="currentColor" />
      <circle cx="20" cy="24" r="8" fill="currentColor" />
      <circle cx="44" cy="24" r="8" fill="currentColor" />
      <circle cx="20" cy="24" r="3.5" fill="#fff" />
      <circle cx="44" cy="24" r="3.5" fill="#fff" />
      <circle cx="21" cy="24" r="1.6" fill="#2a1c22" />
      <circle cx="45" cy="24" r="1.6" fill="#2a1c22" />
    </svg>
  );
}

/** Animals only — no polaroids over section text */
export function SiteWarmth() {
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.utils.toArray<HTMLElement>(".scroll-critter").forEach((el, i) => {
        gsap.fromTo(
          el,
          { y: 60, opacity: 0.2, rotate: i % 2 ? -16 : 16 },
          {
            y: -120 - i * 18,
            opacity: 0.85,
            rotate: i % 2 ? 12 : -12,
            ease: "none",
            scrollTrigger: {
              trigger: document.documentElement,
              start: "top top",
              end: "bottom bottom",
              scrub: 1.15,
            },
          },
        );
      });
    },
    { scope: rootRef },
  );

  return (
    <div
      ref={rootRef}
      className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-full overflow-hidden"
      aria-hidden
    >
      <div className="scroll-critter absolute left-[3%] top-[20%] text-[var(--accent)]">
        <CatMini className="h-9 w-9 sm:h-11 sm:w-11" />
      </div>
      <div className="scroll-critter absolute right-[3%] top-[24%] text-[#7a9e6a]">
        <FrogMini className="h-10 w-10 sm:h-12 sm:w-12" />
      </div>
      <div className="scroll-critter absolute left-[2%] top-[36%] text-[var(--gold)]">
        <DogMini className="h-9 w-9 sm:h-11 sm:w-11" />
      </div>
      <div className="scroll-critter absolute right-[2%] top-[40%] text-[var(--accent)]">
        <CatMini className="h-8 w-8 sm:h-10 sm:w-10" />
      </div>
      <div className="scroll-critter absolute left-[4%] top-[55%] text-[#7a9e6a]">
        <FrogMini className="h-9 w-9 sm:h-11 sm:w-11" />
      </div>
      <div className="scroll-critter absolute right-[4%] top-[58%] text-[var(--gold)]">
        <DogMini className="h-8 w-8 sm:h-10 sm:w-10" />
      </div>
      <div className="scroll-critter absolute left-[3%] top-[70%] text-[var(--accent)]">
        <CatMini className="h-9 w-9 sm:h-11 sm:w-11" />
      </div>
      <div className="scroll-critter absolute right-[3%] top-[74%] text-[#7a9e6a]">
        <FrogMini className="h-10 w-10 sm:h-12 sm:w-12" />
      </div>
      <div className="scroll-critter absolute left-[5%] top-[86%] text-[var(--gold)]">
        <DogMini className="h-9 w-9 sm:h-11 sm:w-11" />
      </div>
      <div className="scroll-critter absolute right-[5%] top-[88%] text-[var(--accent)]">
        <CatMini className="h-8 w-8 sm:h-10 sm:w-10" />
      </div>
    </div>
  );
}
