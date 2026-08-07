"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

const HEARTS = ["♡", "♥", "♡", "♥", "♡"];

export function FloatingHearts({ active }: { active: boolean }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!active || !rootRef.current) return;
    const root = rootRef.current;
    let alive = true;
    let timeout: number;

    const spawn = () => {
      if (!alive) return;
      const heart = document.createElement("span");
      heart.className = "float-heart";
      heart.textContent = HEARTS[Math.floor(Math.random() * HEARTS.length)];
      const left = 4 + Math.random() * 92;
      heart.style.left = `${left}%`;
      heart.style.bottom = "-4%";
      heart.style.fontSize = `${12 + Math.random() * 18}px`;
      root.appendChild(heart);

      gsap.to(heart, {
        y: -(window.innerHeight * (0.55 + Math.random() * 0.4)),
        x: (Math.random() - 0.5) * 120,
        opacity: 0,
        rotation: (Math.random() - 0.5) * 60,
        duration: 7 + Math.random() * 5,
        ease: "sine.out",
        onComplete: () => heart.remove(),
      });

      timeout = window.setTimeout(spawn, 380 + Math.random() * 900);
    };

    spawn();
    return () => {
      alive = false;
      window.clearTimeout(timeout);
      root.innerHTML = "";
    };
  }, [active]);

  if (!active) return null;
  return (
    <div
      ref={rootRef}
      className="pointer-events-none fixed inset-0 z-[5] overflow-hidden"
      aria-hidden
    />
  );
}
