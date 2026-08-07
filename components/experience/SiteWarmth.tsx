"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

function Polaroid({
  src,
  sizeClass,
  rotate,
}: {
  src: string;
  sizeClass: string;
  rotate: string;
}) {
  return (
    <div
      className={`overflow-hidden rounded-md bg-white p-1 shadow-[0_12px_28px_rgba(42,28,34,0.14)] ring-1 ring-black/5 ${sizeClass}`}
      style={{ rotate }}
    >
      <div className="relative aspect-square w-full overflow-hidden rounded-sm">
        <Image src={src} alt="" fill className="object-cover" sizes="100px" />
      </div>
    </div>
  );
}

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
      <ellipse cx="32" cy="40" rx="3" ry="2" fill="#2a1c22" opacity="0.5" />
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
      <path d="M24 42c4 3 12 3 16 0" stroke="#2a1c22" strokeWidth="1.5" fill="none" />
    </svg>
  );
}

/** Decorative polaroids + animals; move with scroll */
export function SiteWarmth() {
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.utils.toArray<HTMLElement>(".scroll-critter").forEach((el, i) => {
        gsap.fromTo(
          el,
          { y: 50, opacity: 0.15, rotate: i % 2 ? -14 : 14 },
          {
            y: -100 - i * 24,
            opacity: 0.9,
            rotate: i % 2 ? 10 : -10,
            ease: "none",
            scrollTrigger: {
              trigger: document.documentElement,
              start: "top top",
              end: "bottom bottom",
              scrub: 1.2,
            },
          },
        );
      });

      gsap.utils.toArray<HTMLElement>(".warm-polaroid").forEach((el) => {
        gsap.fromTo(
          el,
          { y: 40, opacity: 0 },
          {
            y: -50,
            opacity: 1,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top 95%",
              end: "top 35%",
              scrub: true,
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
      className="pointer-events-none absolute inset-x-0 top-0 z-[2] h-full overflow-hidden"
      aria-hidden
    >
      <div className="warm-polaroid absolute left-[3%] top-[18%]">
        <Polaroid src="/foto4.jpeg" sizeClass="w-16 sm:w-20" rotate="-9deg" />
      </div>
      <div className="warm-polaroid absolute right-[4%] top-[26%]">
        <Polaroid src="/foto8.jpeg" sizeClass="w-[4.5rem] sm:w-24" rotate="7deg" />
      </div>
      <div className="warm-polaroid absolute left-[5%] top-[42%]">
        <Polaroid src="/foto6.jpeg" sizeClass="w-[4.25rem] sm:w-20" rotate="5deg" />
      </div>
      <div className="warm-polaroid absolute right-[6%] top-[52%]">
        <Polaroid src="/foto11.jpeg" sizeClass="w-16 sm:w-20" rotate="-7deg" />
      </div>
      <div className="warm-polaroid absolute left-[8%] top-[68%]">
        <Polaroid src="/foto15.jpeg" sizeClass="w-[4.5rem] sm:w-24" rotate="6deg" />
      </div>
      <div className="warm-polaroid absolute right-[5%] top-[78%]">
        <Polaroid src="/foto9.jpeg" sizeClass="w-16 sm:w-20" rotate="-5deg" />
      </div>

      <div className="scroll-critter absolute left-[12%] top-[22%] text-[var(--accent)]">
        <CatMini className="h-10 w-10 sm:h-12 sm:w-12" />
      </div>
      <div className="scroll-critter absolute right-[12%] top-[38%] text-[#7a9e6a]">
        <FrogMini className="h-10 w-10 sm:h-12 sm:w-12" />
      </div>
      <div className="scroll-critter absolute left-[18%] top-[58%] text-[var(--gold)]">
        <DogMini className="h-10 w-10 sm:h-12 sm:w-12" />
      </div>
      <div className="scroll-critter absolute right-[16%] top-[72%] text-[var(--accent)]">
        <CatMini className="h-9 w-9 sm:h-11 sm:w-11" />
      </div>
      <div className="scroll-critter absolute left-[10%] top-[85%] text-[#7a9e6a]">
        <FrogMini className="h-9 w-9 sm:h-11 sm:w-11" />
      </div>
    </div>
  );
}
