"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useExperience } from "./ExperienceProvider";

const ICONS = ["✦", "♡", "✧", "★", "♥"];

export function Collectibles({ active }: { active: boolean }) {
  const layerRef = useRef<HTMLDivElement>(null);
  const { addCollectible } = useExperience();
  const spawnCount = useRef(0);

  useEffect(() => {
    if (!active || !layerRef.current) return;
    const layer = layerRef.current;
    let alive = true;
    let timer: number;

    const spawn = () => {
      if (!alive || spawnCount.current > 40) {
        timer = window.setTimeout(spawn, 4000);
        return;
      }

      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "collectible-orb";
      btn.setAttribute("aria-label", "Coleccionable");
      btn.textContent = ICONS[Math.floor(Math.random() * ICONS.length)];
      const left = 8 + Math.random() * 84;
      const top = 12 + Math.random() * 70;
      btn.style.left = `${left}%`;
      btn.style.top = `${top}%`;
      layer.appendChild(btn);
      spawnCount.current += 1;

      gsap.fromTo(
        btn,
        { opacity: 0, scale: 0.4, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.55, ease: "back.out(1.8)" },
      );
      gsap.to(btn, {
        y: "-=10",
        duration: 1.6 + Math.random(),
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
      });

      const collect = () => {
        addCollectible();
        gsap.to(btn, {
          scale: 1.8,
          opacity: 0,
          y: -30,
          duration: 0.45,
          ease: "power2.out",
          onComplete: () => btn.remove(),
        });
      };

      btn.addEventListener("click", collect, { once: true });
      btn.addEventListener("touchend", (e) => {
        e.preventDefault();
        collect();
      }, { once: true });

      // Auto fade if ignored
      window.setTimeout(() => {
        if (!btn.isConnected) return;
        gsap.to(btn, {
          opacity: 0,
          duration: 0.6,
          onComplete: () => btn.remove(),
        });
      }, 9000);

      timer = window.setTimeout(spawn, 1800 + Math.random() * 2200);
    };

    timer = window.setTimeout(spawn, 1200);
    return () => {
      alive = false;
      window.clearTimeout(timer);
      layer.innerHTML = "";
    };
  }, [active, addCollectible]);

  if (!active) return null;
  return (
    <div
      ref={layerRef}
      className="pointer-events-none fixed inset-0 z-[35] overflow-hidden"
    />
  );
}
