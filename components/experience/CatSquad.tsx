"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { gsap } from "gsap";
import { useExperience } from "./ExperienceProvider";

const CAT_LINES = [
  "miau… ella es tu persona favorita",
  "este gatito aprueba esta relación",
  "¿ya le dijiste que la amas hoy?",
  "si esto fuera un juego, ella sería el final bueno",
  "arrastra las fotos… se sienten vivas",
  "shh… no le digas a nadie que estoy aquí",
  "solo aparezco cuando nadie me busca",
];

type Spot = { top: string; left?: string; right?: string; side: "left" | "right" };

const SPOTS: Spot[] = [
  { top: "18%", left: "4%", side: "left" },
  { top: "32%", right: "5%", side: "right" },
  { top: "58%", left: "6%", side: "left" },
  { top: "72%", right: "4%", side: "right" },
  { top: "22%", left: "42%", side: "left" },
  { top: "48%", right: "18%", side: "right" },
  { top: "78%", left: "28%", side: "left" },
  { top: "14%", right: "28%", side: "right" },
];

function CatSvg({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      <path
        fill="currentColor"
        d="M12 22c0-8 6-14 14-14 3 0 6 1 8 3 2-2 5-3 8-3 8 0 14 6 14 14v18c0 10-8 18-18 18H30C20 58 12 50 12 40V22z"
        opacity="0.95"
      />
      <path fill="#0c0a09" d="M18 10l6 10H14l4-10zm28 0l4 10H40l6-10z" />
      <circle cx="26" cy="30" r="2.2" fill="#0c0a09" />
      <circle cx="38" cy="30" r="2.2" fill="#0c0a09" />
      <path
        d="M32 36c2 2 4 2 6 0"
        stroke="#0c0a09"
        strokeWidth="1.6"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M20 34h-8M44 34h8M22 38h-6M42 38h6"
        stroke="currentColor"
        strokeWidth="1.2"
        opacity="0.55"
      />
    </svg>
  );
}

type Bubble = {
  text: string;
  left: number;
  top: number;
  side: "left" | "right";
};

function clampBubble(side: "left" | "right", catRect: DOMRect) {
  const width = Math.min(window.innerWidth * 0.86, 280);
  const margin = 12;
  let left: number;
  let top = catRect.top - 12;

  if (side === "right") {
    left = catRect.left - width - 8;
  } else {
    left = catRect.left + catRect.width / 2 - width / 2;
  }

  left = Math.max(margin, Math.min(left, window.innerWidth - width - margin));
  top = Math.max(margin + 40, Math.min(top, window.innerHeight - 160));

  return { left, top };
}

type CatInstance = {
  id: number;
  spotIndex: number;
  tint: "accent" | "gold";
};

export function CatSquad({ active }: { active: boolean }) {
  const { discoverEgg } = useExperience();
  const catRef = useRef<HTMLButtonElement>(null);
  const [cat, setCat] = useState<CatInstance | null>(null);
  const [bubble, setBubble] = useState<Bubble | null>(null);
  const hideTimer = useRef<number | null>(null);
  const cycleTimer = useRef<number | null>(null);
  const usedSpots = useRef<number[]>([]);
  const idRef = useRef(0);

  const pickSpot = useCallback(() => {
    const available = SPOTS.map((_, i) => i).filter(
      (i) => !usedSpots.current.includes(i),
    );
    const pool = available.length ? available : SPOTS.map((_, i) => i);
    const idx = pool[Math.floor(Math.random() * pool.length)];
    usedSpots.current = [...usedSpots.current.slice(-3), idx];
    return idx;
  }, []);

  const spawn = useCallback(() => {
    idRef.current += 1;
    setBubble(null);
    setCat({
      id: idRef.current,
      spotIndex: pickSpot(),
      tint: Math.random() > 0.5 ? "accent" : "gold",
    });
  }, [pickSpot]);

  useEffect(() => {
    if (!active) {
      setCat(null);
      setBubble(null);
      return;
    }

    const first = window.setTimeout(spawn, 2800);

    const loop = () => {
      const visibleMs = 5500 + Math.random() * 4500;
      const gapMs = 2200 + Math.random() * 4000;
      cycleTimer.current = window.setTimeout(() => {
        setCat(null);
        setBubble(null);
        cycleTimer.current = window.setTimeout(() => {
          spawn();
          loop();
        }, gapMs);
      }, visibleMs);
    };

    cycleTimer.current = window.setTimeout(loop, 2800);

    return () => {
      window.clearTimeout(first);
      if (cycleTimer.current) window.clearTimeout(cycleTimer.current);
      if (hideTimer.current) window.clearTimeout(hideTimer.current);
    };
  }, [active, spawn]);

  useEffect(() => {
    const el = catRef.current;
    if (!el || !cat) return;
    gsap.fromTo(
      el,
      { opacity: 0, y: 18, scale: 0.7 },
      { opacity: 1, y: 0, scale: 1, duration: 0.55, ease: "back.out(1.7)" },
    );
    const bob = gsap.to(el, {
      y: -10,
      duration: 1.2,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut",
      delay: 0.55,
    });
    return () => {
      bob.kill();
      gsap.killTweensOf(el);
    };
  }, [cat]);

  const meow = () => {
    const el = catRef.current;
    if (!el || !cat) return;
    const spot = SPOTS[cat.spotIndex];
    discoverEgg("cat-meow", {
      title: "Gatito encontrado",
      detail: "Un easter egg con bigotes",
    });
    const rect = el.getBoundingClientRect();
    const pos = clampBubble(spot.side, rect);
    if (hideTimer.current) window.clearTimeout(hideTimer.current);
    setBubble({
      text: CAT_LINES[Math.floor(Math.random() * CAT_LINES.length)],
      ...pos,
      side: spot.side,
    });
    gsap.fromTo(
      el,
      { scale: 1 },
      { scale: 1.2, duration: 0.15, yoyo: true, repeat: 1 },
    );
    hideTimer.current = window.setTimeout(() => setBubble(null), 10000);
  };

  if (!active) return null;

  const spot = cat ? SPOTS[cat.spotIndex] : null;

  return (
    <>
      <AnimatePresence mode="wait">
        {cat && spot && (
          <motion.button
            key={cat.id}
            ref={catRef}
            type="button"
            aria-label="Gatito escondido"
            data-cursor="hover"
            onClick={meow}
            initial={{ opacity: 0 }}
            exit={{ opacity: 0, scale: 0.6, y: 12 }}
            transition={{ duration: 0.35 }}
            className={`fixed z-[46] touch-manipulation rounded-full p-2 drop-shadow-[0_8px_24px_rgba(232,180,184,0.4)] ${
              cat.tint === "accent" ? "text-[var(--accent)]" : "text-[var(--gold)]"
            }`}
            style={{
              top: spot.top,
              left: spot.left,
              right: spot.right,
            }}
          >
            <CatSvg className="h-12 w-12 sm:h-14 sm:w-14" />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {bubble && (
          <div
            className="pointer-events-none fixed z-[80] w-[min(86vw,280px)] -translate-y-full"
            style={{ left: bubble.left, top: bubble.top }}
          >
            <motion.div
              key={bubble.text + bubble.left}
              initial={{ opacity: 0, y: 14, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.94 }}
              transition={{ type: "spring", stiffness: 240, damping: 18 }}
            >
              <div className="speech-bubble speech-bubble-pop">
                <p className="text-[15px] leading-relaxed text-[var(--ink)] sm:text-base">
                  {bubble.text}
                </p>
                <span
                  className={`speech-tail ${
                    bubble.side === "right" ? "speech-tail-right" : ""
                  }`}
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
