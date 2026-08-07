"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { STAR_PHRASES } from "@/lib/data";
import { useExperience } from "./ExperienceProvider";
import { softClick } from "@/lib/sounds";

type Star = { id: number; x: number; y: number; size: number; delay: number };

export function StarField() {
  const { discoverEgg } = useExperience();
  const [phrase, setPhrase] = useState<string | null>(null);
  const [pos, setPos] = useState({ x: 50, y: 50 });

  const stars = useMemo<Star[]>(
    () =>
      Array.from({ length: 28 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 1.5 + Math.random() * 2.5,
        delay: Math.random() * 4,
      })),
    [],
  );

  const onStarClick = (e: React.MouseEvent<HTMLButtonElement>, star: Star) => {
    e.stopPropagation();
    softClick();
    discoverEgg("star-phrase");
    setPos({ x: star.x, y: star.y });
    setPhrase(STAR_PHRASES[Math.floor(Math.random() * STAR_PHRASES.length)]);
    window.setTimeout(() => setPhrase(null), 2800);
  };

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {stars.map((star) => (
        <button
          key={star.id}
          type="button"
          aria-label="Estrella"
          data-cursor="hover"
          className="pointer-events-auto absolute rounded-full bg-[#f3ebe3]/70 transition-transform hover:scale-150"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.size,
            height: star.size,
            animation: `twinkle 3.5s ease-in-out ${star.delay}s infinite`,
          }}
          onClick={(e) => onStarClick(e, star)}
        />
      ))}

      <AnimatePresence>
        {phrase && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="pointer-events-none absolute z-10 rounded-full border border-white/10 bg-black/50 px-4 py-2 text-xs text-[var(--cream)] backdrop-blur-md"
            style={{ left: `${pos.x}%`, top: `${pos.y}%`, transform: "translate(-50%, -140%)" }}
          >
            {phrase}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
