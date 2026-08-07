"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useExperience } from "./ExperienceProvider";
import { softClick } from "@/lib/sounds";

export function AmbientEffects({ active }: { active: boolean }) {
  const layerRef = useRef<HTMLDivElement>(null);
  const last = useRef({ x: 0, y: 0, t: 0 });
  const { discoverEgg } = useExperience();

  useEffect(() => {
    if (!active) return;
    const layer = layerRef.current;
    if (!layer) return;

    const onMove = (e: MouseEvent) => {
      const now = performance.now();
      const dx = e.clientX - last.current.x;
      const dy = e.clientY - last.current.y;
      const dt = now - last.current.t || 16;
      const speed = Math.hypot(dx, dy) / dt;
      last.current = { x: e.clientX, y: e.clientY, t: now };

      if (speed < 0.08 && speed > 0.005) {
        discoverEgg("slow-particles");
        const p = document.createElement("span");
        p.className =
          "pointer-events-none absolute h-1 w-1 rounded-full bg-[var(--accent)]/70";
        p.style.left = `${e.clientX}px`;
        p.style.top = `${e.clientY}px`;
        layer.appendChild(p);
        gsap.to(p, {
          y: -24 - Math.random() * 20,
          x: (Math.random() - 0.5) * 20,
          opacity: 0,
          duration: 1.1,
          ease: "power1.out",
          onComplete: () => p.remove(),
        });
      }
    };

    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [active, discoverEgg]);

  return (
    <div ref={layerRef} className="pointer-events-none fixed inset-0 z-[60]" />
  );
}

export function HeartButton({ className }: { className?: string }) {
  const { discoverEgg } = useExperience();
  const hostRef = useRef<HTMLButtonElement>(null);

  const burst = () => {
    softClick();
    discoverEgg("heart-float");
    const host = hostRef.current;
    if (!host) return;
    for (let i = 0; i < 8; i++) {
      const h = document.createElement("span");
      h.textContent = "♥";
      h.className = "pointer-events-none absolute text-[var(--accent)] text-sm";
      h.style.left = "50%";
      h.style.top = "50%";
      host.appendChild(h);
      gsap.to(h, {
        x: (Math.random() - 0.5) * 80,
        y: -40 - Math.random() * 60,
        opacity: 0,
        scale: 0.4 + Math.random(),
        duration: 0.9,
        ease: "power2.out",
        onComplete: () => h.remove(),
      });
    }
  };

  return (
    <button
      ref={hostRef}
      type="button"
      aria-label="Corazón"
      data-cursor="hover"
      onClick={burst}
      className={`relative text-[var(--accent)] transition-transform hover:scale-110 ${className ?? ""}`}
    >
      ♥
    </button>
  );
}

export function ReactiveWord({
  children,
  className,
}: {
  children: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const { discoverEgg } = useExperience();

  return (
    <span
      ref={ref}
      data-cursor="hover"
      className={`inline-block cursor-default transition-colors duration-300 hover:text-[var(--accent)] ${className ?? ""}`}
      onMouseEnter={() => {
        discoverEgg("word-react");
        gsap.fromTo(
          ref.current,
          { y: 0 },
          { y: -4, duration: 0.25, yoyo: true, repeat: 1, ease: "power2.out" },
        );
      }}
    >
      {children}
    </span>
  );
}
