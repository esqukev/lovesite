"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useExperience } from "./ExperienceProvider";

function FrogSvg({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      <ellipse cx="32" cy="38" rx="18" ry="14" fill="currentColor" />
      <circle cx="20" cy="24" r="8" fill="currentColor" />
      <circle cx="44" cy="24" r="8" fill="currentColor" />
      <circle cx="20" cy="24" r="3.5" fill="#fff" />
      <circle cx="44" cy="24" r="3.5" fill="#fff" />
      <circle cx="21" cy="24" r="1.6" fill="#2a1c22" />
      <circle cx="45" cy="24" r="1.6" fill="#2a1c22" />
      <path
        d="M24 42c4 3 12 3 16 0"
        stroke="#2a1c22"
        strokeWidth="1.5"
        fill="none"
      />
    </svg>
  );
}

const AUDIO_SRC = "/Motzy%20motz.m4a";

export function SecretFrog({ active }: { active: boolean }) {
  const { lightboxOpen, discoverEgg } = useExperience();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [hint, setHint] = useState(true);
  const [bubble, setBubble] = useState(false);

  useEffect(() => {
    if (!active) return;
    const show = window.setTimeout(() => setHint(true), 1200);
    const hide = window.setTimeout(() => setHint(false), 3200);
    return () => {
      window.clearTimeout(show);
      window.clearTimeout(hide);
    };
  }, [active]);

  useEffect(() => {
    audioRef.current = new Audio(AUDIO_SRC);
    audioRef.current.preload = "auto";
    return () => {
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, []);

  if (!active || lightboxOpen) return null;

  const play = () => {
    discoverEgg("cat-meow", {
      title: "Sonido secreto",
      detail: "Motzy motz",
    });
    setBubble(true);
    setHint(false);
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = 0;
      void audio.play().catch(() => {
        /* autoplay policies */
      });
    }
    window.setTimeout(() => setBubble(false), 3500);
  };

  return (
    <div className="fixed bottom-6 left-4 z-[45] sm:bottom-8 sm:left-6">
      <AnimatePresence>
        {hint && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="mb-2 rounded-full bg-white/90 px-3 py-1.5 text-[11px] text-[var(--ink)] shadow-md"
          >
            Dame click para el sonido secreto
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {bubble && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6 }}
            className="speech-bubble mb-2 max-w-[200px] text-center text-sm"
          >
            Motzy motz 🐸
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        data-cursor="hover"
        aria-label="Ranita secreta"
        onClick={play}
        className="rounded-full p-2 text-[#7a9e6a] drop-shadow-[0_8px_20px_rgba(122,158,106,0.45)] transition hover:scale-110"
      >
        <FrogSvg className="h-14 w-14 sm:h-16 sm:w-16" />
      </button>
    </div>
  );
}
