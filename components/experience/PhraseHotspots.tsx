"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { gsap } from "gsap";
import { HIDDEN_PHRASES } from "@/lib/data";
import { useExperience } from "./ExperienceProvider";

const SPOTS = [
  { id: "s1", top: "16%", left: "7%", phrase: HIDDEN_PHRASES[0] },
  { id: "s2", top: "30%", left: "86%", phrase: HIDDEN_PHRASES[1] },
  { id: "s3", top: "48%", left: "5%", phrase: HIDDEN_PHRASES[2] },
  { id: "s4", top: "63%", left: "88%", phrase: HIDDEN_PHRASES[3] },
  { id: "s5", top: "78%", left: "10%", phrase: HIDDEN_PHRASES[4] },
  { id: "s6", top: "40%", left: "48%", phrase: HIDDEN_PHRASES[5] },
  { id: "s7", top: "90%", left: "70%", phrase: HIDDEN_PHRASES[6] },
];

export function PhraseHotspots() {
  const { discoverEgg } = useExperience();
  const [open, setOpen] = useState<string | null>(null);
  const [found, setFound] = useState<Set<string>>(new Set());

  const reveal = (id: string, el: HTMLButtonElement) => {
    discoverEgg("phrase-orb", {
      title: "Frase secreta",
      detail: "Una pista de nuestro universo",
    });
    setOpen(id);
    setFound((prev) => new Set(prev).add(id));
    gsap.fromTo(
      el,
      { scale: 1 },
      {
        scale: 1.7,
        duration: 0.35,
        yoyo: true,
        repeat: 1,
        ease: "power2.out",
      },
    );
    window.setTimeout(() => setOpen(null), 6500);
  };

  return (
    <div className="pointer-events-none absolute inset-0 z-[6]">
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
            className={`relative flex h-11 w-11 items-center justify-center touch-manipulation rounded-full ${
              found.has(spot.id) ? "opacity-80" : "animate-pulse"
            }`}
          >
            <span
              className={`h-4 w-4 rounded-full border border-white/35 ${
                found.has(spot.id)
                  ? "bg-[var(--gold)] shadow-[0_0_18px_rgba(196,165,116,0.75)]"
                  : "bg-[var(--accent)] shadow-[0_0_18px_rgba(232,180,184,0.55)]"
              }`}
            />
          </button>
          <AnimatePresence>
            {open === spot.id && (
              <motion.div
                initial={{ opacity: 0, y: 12, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8 }}
                className="absolute left-1/2 top-12 z-10 w-[min(70vw,220px)] -translate-x-1/2"
              >
                <div className="speech-bubble speech-bubble-dark">
                  <p className="text-sm leading-relaxed">{spot.phrase}</p>
                  <span className="speech-tail speech-tail-dark" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}
