"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export function FrostHeart({
  message,
  submessage,
  onDone,
}: {
  message: string;
  submessage: string;
  onDone: () => void;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const flakesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const flakes = flakesRef.current;
    if (!root || !flakes) return;

    // spawn frost particles
    for (let i = 0; i < 48; i++) {
      const flake = document.createElement("span");
      flake.className = "frost-flake";
      flake.style.left = `${20 + Math.random() * 60}%`;
      flake.style.top = `${25 + Math.random() * 50}%`;
      flake.style.width = `${2 + Math.random() * 5}px`;
      flake.style.height = flake.style.width;
      flakes.appendChild(flake);
    }

    const flakeEls = flakes.querySelectorAll(".frost-flake");
    const heart = root.querySelector(".frost-heart");
    const text = root.querySelector(".frost-text");

    const tl = gsap.timeline({
      onComplete: onDone,
    });

    gsap.set(flakeEls, { opacity: 0, scale: 0 });

    tl.fromTo(
      root,
      { opacity: 0 },
      { opacity: 1, duration: 0.35 },
    )
      .fromTo(
        heart,
        { scale: 0.4, opacity: 0, filter: "blur(12px)" },
        {
          scale: 1,
          opacity: 1,
          filter: "blur(0px)",
          duration: 0.85,
          ease: "back.out(1.6)",
        },
        0.1,
      )
      .fromTo(
        text,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" },
        0.45,
      )
      .to({}, { duration: 2.2 })
      // frost dissolve
      .to(
        flakeEls,
        {
          opacity: 1,
          scale: 1,
          duration: 0.35,
          stagger: { each: 0.01, from: "center" },
        },
        "dissolve",
      )
      .to(
        heart,
        {
          scale: 1.15,
          opacity: 0,
          filter: "blur(18px)",
          duration: 1.4,
          ease: "power2.in",
        },
        "dissolve",
      )
      .to(
        text,
        { opacity: 0, y: -10, filter: "blur(8px)", duration: 0.9 },
        "dissolve+=0.15",
      )
      .to(
        flakeEls,
        {
          y: () => -40 - Math.random() * 120,
          x: () => (Math.random() - 0.5) * 160,
          opacity: 0,
          scale: 0,
          duration: 1.5,
          stagger: 0.01,
          ease: "power1.out",
        },
        "dissolve+=0.2",
      )
      .to(root, { opacity: 0, duration: 0.5 }, "-=0.4");

    return () => {
      tl.kill();
    };
  }, [onDone]);

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[95] flex items-center justify-center bg-black/55 px-6 backdrop-blur-sm"
    >
      <div ref={flakesRef} className="pointer-events-none absolute inset-0" />
      <div className="relative flex flex-col items-center text-center">
        <div className="frost-heart relative mb-6">
          <svg viewBox="0 0 200 180" className="h-44 w-44 sm:h-52 sm:w-52" aria-hidden>
            <defs>
              <linearGradient id="frostHeartGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffe8ea" />
                <stop offset="40%" stopColor="#e8b4b8" />
                <stop offset="100%" stopColor="#c98a92" />
              </linearGradient>
              <filter id="frostGlow">
                <feGaussianBlur stdDeviation="4" result="b" />
                <feMerge>
                  <feMergeNode in="b" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <path
              d="M100 162C28 112 18 58 62 34c22-12 38-4 38 12 0-16 16-24 38-12 44 24 34 78-38 128z"
              fill="url(#frostHeartGrad)"
              filter="url(#frostGlow)"
            />
          </svg>
          <div className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.35),transparent_55%)] mix-blend-screen" />
        </div>
        <div className="frost-text max-w-sm">
          <p className="font-display text-2xl text-[var(--cream)] sm:text-3xl">
            {message}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-white/65 sm:text-base">
            {submessage}
          </p>
        </div>
      </div>
    </div>
  );
}
