"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export function Loader({ onDone }: { onDone: () => void }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const path = root.querySelector<SVGPathElement>(".loader-path");
    const tl = gsap.timeline({
      onComplete: () => {
        gsap.to(root, {
          opacity: 0,
          duration: 0.7,
          ease: "power2.inOut",
          onComplete: onDone,
        });
      },
    });

    if (path) {
      const len = path.getTotalLength();
      gsap.set(path, {
        strokeDasharray: len,
        strokeDashoffset: len,
      });
      tl.to(path, {
        strokeDashoffset: 0,
        duration: 1.6,
        ease: "power2.inOut",
      });
    }

    tl.fromTo(
      ".loader-word",
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.08, duration: 0.7, ease: "power3.out" },
      0.3,
    ).to({}, { duration: 0.55 });

    return () => {
      tl.kill();
    };
  }, [onDone]);

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#f3e8ea] px-6"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(232,170,176,0.35),transparent_55%)]" />
      <svg
        viewBox="0 0 320 120"
        className="relative mb-8 h-24 w-[min(80vw,320px)]"
        fill="none"
        aria-hidden
      >
        <path
          className="loader-path"
          d="M20 70 C60 20, 100 110, 160 55 S260 20, 300 65"
          stroke="#c86b78"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
      <p className="relative overflow-hidden font-display text-4xl text-[var(--ink)] sm:text-5xl">
        <span className="loader-word inline-block">Nuestro</span>{" "}
        <span className="loader-word inline-block text-[var(--accent)]">
          universo
        </span>
      </p>
      <p className="loader-word relative mt-3 text-[10px] uppercase tracking-[0.4em] text-[var(--ink)]/40">
        Cargando pedacitos
      </p>
    </div>
  );
}
