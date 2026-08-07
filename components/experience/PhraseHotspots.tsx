"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { gsap } from "gsap";
import { HIDDEN_PHRASES } from "@/lib/data";
import { useExperience } from "./ExperienceProvider";

const SPOTS = [
  { id: "s1", top: "18%", left: "8%", phrase: HIDDEN_PHRASES[0] },
  { id: "s2", top: "34%", left: "88%", phrase: HIDDEN_PHRASES[1] },
  { id: "s3", top: "52%", left: "6%", phrase: HIDDEN_PHRASES[2] },
  { id: "s4", top: "68%", left: "90%", phrase: HIDDEN_PHRASES[3] },
  { id: "s5", top: "82%", left: "12%", phrase: HIDDEN_PHRASES[4] },
  { id: "s6", top: "44%", left: "50%", phrase: HIDDEN_PHRASES[5] },
  { id: "s7", top: "92%", left: "72%", phrase: HIDDEN_PHRASES[6] },
];

export function PhraseHotspots() {
  const { discoverEgg } = useExperience();
  const [open, setOpen] = useState<string | null>(null);
  const [found, setFound] = useState<Set<string>>(new Set());

  const reveal = (id: string, el: HTMLButtonElement) => {
    discoverEgg("phrase-orb");
    setOpen(id);
    setFound((prev) => new Set(prev).add(id));
    gsap.fromTo(
      el,
      { scale: 1 },
      {
        scale: 1.6,
        boxShadow: "0 0 40px rgba(232,180,184,0.7)",
        duration: 0.35,
        yoyo: true,
        repeat: 1,
      },
    );
    window.setTimeout(() => setOpen(null), 2800);
  };

  return (
    <div className="pointer-events-none absolute inset-0 z-[6]" aria-hidden={false}>
      {SPOTS.map((spot) => (
        <div
          key={spot.id}
          className="pointer-events-auto absolute"
          style={{ top: spot.top, left: spot.left }}
        >
          <button
            type="button"
            data-cursor="hover"
            aria-label="Frase secreta"
            onClick={(e) => reveal(spot.id, e.currentTarget)}
            className={`h-3.5 w-3.5 rounded-full border border-white/30 transition-all ${
              found.has(spot.id)
                ? "bg-[var(--gold)]/80 shadow-[0_0_18px_rgba(196,165,116,0.7)]"
                : "bg-[var(--accent)]/50 shadow-[0_0_16px_rgba(232,180,184,0.45)] animate-pulse"
            }`}
          />
          <AnimatePresence>
            {open === spot.id && (
              <motion.p
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8 }}
                className="absolute left-1/2 top-5 z-10 w-48 -translate-x-1/2 rounded-2xl border border-white/15 bg-black/75 px-3 py-2 text-center text-xs leading-relaxed text-[var(--cream)] backdrop-blur-md"
              >
                {spot.phrase}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}
