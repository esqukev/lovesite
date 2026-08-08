"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

function HeartCursorSvg() {
  return (
    <svg viewBox="0 0 32 30" className="h-full w-full" aria-hidden>
      <defs>
        <linearGradient id="cursorHeartGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffe4e8" />
          <stop offset="45%" stopColor="#e8a0a8" />
          <stop offset="100%" stopColor="#c86b78" />
        </linearGradient>
      </defs>
      <path
        d="M16 27.2C5.2 19.4 3.6 11.4 9.8 7.2c3.2-2.2 5.6-.7 6.2 1.6.6-2.3 3-3.8 6.2-1.6 6.2 4.2 4.6 12.2-6.2 20z"
        fill="url(#cursorHeartGrad)"
        stroke="rgba(255,255,255,0.95)"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CustomCursor({ active }: { active: boolean }) {
  const heartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!active) return;
    const fine = window.matchMedia("(pointer: fine)").matches;
    if (!fine) return;

    const heart = heartRef.current;
    if (!heart) return;

    document.documentElement.classList.add("custom-cursor");
    gsap.set(heart, { xPercent: -50, yPercent: -50, opacity: 1 });

    const move = (e: MouseEvent) => {
      gsap.to(heart, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.18,
        ease: "power3.out",
      });
    };

    const over = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const interactive = target?.closest(
        "a, button, input, textarea, [data-cursor='hover']",
      );
      gsap.to(heart, {
        scale: interactive ? 1.35 : 1,
        duration: 0.22,
        ease: "power2.out",
      });
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", over);

    return () => {
      document.documentElement.classList.remove("custom-cursor");
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
    };
  }, [active]);

  if (!active) return null;

  return (
    <div ref={heartRef} className="cursor-heart" aria-hidden>
      <HeartCursorSvg />
    </div>
  );
}
