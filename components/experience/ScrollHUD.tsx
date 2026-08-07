"use client";

import { useEffect, useState } from "react";
import { useExperience } from "./ExperienceProvider";
import { EASTER_EGG_IDS } from "@/lib/data";

export function ScrollHUD({ active }: { active: boolean }) {
  const [progress, setProgress] = useState(0);
  const { eggsFound, allEggsFound } = useExperience();
  const love = Math.round((eggsFound.size / EASTER_EGG_IDS.length) * 100);

  useEffect(() => {
    if (!active) return;
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [active]);

  if (!active) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[55]">
      <div className="h-[3px] w-full bg-white/5">
        <div
          className="h-full bg-gradient-to-r from-[var(--accent)] via-[var(--gold)] to-[var(--accent)] transition-[width] duration-150"
          style={{ width: `${progress * 100}%` }}
        />
      </div>
      <div className="mt-3 flex justify-end px-4">
        <div className="rounded-full border border-white/10 bg-black/45 px-3 py-1.5 text-[10px] uppercase tracking-[0.22em] text-white/70 backdrop-blur-md">
          Amor {love}%
          {allEggsFound ? " · insignia" : ""}
        </div>
      </div>
    </div>
  );
}
