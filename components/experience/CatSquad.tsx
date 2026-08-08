"use client";

import { useCallback, useEffect, useRef, useState, type MouseEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { gsap } from "gsap";
import { useExperience } from "./ExperienceProvider";

const CAT_LINES = [
  "Te amo.",
  "Eres mi gordi",
  "Motzy motz",
  "Quiero pijama real",
  "Vamos por un cafecito",
  "miau… ella es tu persona favorita",
  "¿ya le dijiste que la amas hoy?",
];

type Spot = { top: string; left?: string; right?: string; side: "left" | "right" };

const SPOTS: Spot[] = [
  { top: "16%", left: "3%", side: "left" },
  { top: "28%", right: "3%", side: "right" },
  { top: "52%", left: "4%", side: "left" },
  { top: "66%", right: "4%", side: "right" },
  { top: "40%", right: "12%", side: "right" },
  { top: "74%", left: "14%", side: "left" },
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
  const width = Math.min(window.innerWidth * 0.86, 260);
  const margin = 12;
  let left: number;
  const top = Math.max(margin + 40, Math.min(catRect.top - 12, window.innerHeight - 160));

  if (side === "right") {
    left = catRect.left - width - 8;
  } else {
    left = catRect.left + catRect.width / 2 - width / 2;
  }

  left = Math.max(margin, Math.min(left, window.innerWidth - width - margin));
  return { left, top };
}

type CatInstance = {
  id: number;
  spotIndex: number;
  tint: "accent" | "gold";
};

export function CatSquad({ active }: { active: boolean }) {
  const { discoverEgg, lightboxOpen } = useExperience();
  const catRef = useRef<HTMLButtonElement>(null);
  const bubbleRef = useRef<HTMLDivElement>(null);
  const [cat, setCat] = useState<CatInstance | null>(null);
  const [bubble, setBubble] = useState<Bubble | null>(null);
  const hideTimer = useRef<number | null>(null);
  const cycleTimer = useRef<number | null>(null);
  const usedSpots = useRef<number[]>([]);
  const idRef = useRef(0);
  const busy = useRef(false);
  const ignoreOutsideUntil = useRef(0);

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
    busy.current = false;
    setCat({
      id: idRef.current,
      spotIndex: pickSpot(),
      tint: Math.random() > 0.5 ? "accent" : "gold",
    });
  }, [pickSpot]);

  const closePopupAndCat = useCallback(() => {
    if (hideTimer.current) window.clearTimeout(hideTimer.current);
    hideTimer.current = null;
    setBubble(null);
    setCat(null);
    busy.current = false;
  }, []);

  useEffect(() => {
    // Solo se pausan con el lightbox de fotos — la invitación ya no los apaga
    if (!active || lightboxOpen) {
      closePopupAndCat();
      if (cycleTimer.current) window.clearTimeout(cycleTimer.current);
      return;
    }

    let cancelled = false;

    const scheduleNext = (delay: number) => {
      if (cycleTimer.current) window.clearTimeout(cycleTimer.current);
      cycleTimer.current = window.setTimeout(() => {
        if (cancelled) return;
        if (busy.current) {
          scheduleNext(800);
          return;
        }
        setCat(null);
        cycleTimer.current = window.setTimeout(() => {
          if (cancelled) return;
          spawn();
          scheduleNext(7000 + Math.random() * 5000);
        }, 1400 + Math.random() * 1200);
      }, delay);
    };

    const first = window.setTimeout(() => {
      spawn();
      scheduleNext(8000 + Math.random() * 4000);
    }, 900);

    return () => {
      cancelled = true;
      window.clearTimeout(first);
      if (cycleTimer.current) window.clearTimeout(cycleTimer.current);
      if (hideTimer.current) window.clearTimeout(hideTimer.current);
    };
  }, [active, lightboxOpen, spawn, closePopupAndCat]);

  useEffect(() => {
    const el = catRef.current;
    if (!el || !cat) return;
    gsap.fromTo(
      el,
      { autoAlpha: 0, y: 16, scale: 0.75 },
      { autoAlpha: 1, y: 0, scale: 1, duration: 0.5, ease: "back.out(1.6)" },
    );
    const bob = gsap.to(el, {
      y: -8,
      duration: 1.2,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut",
      delay: 0.5,
    });
    return () => {
      bob.kill();
      gsap.killTweensOf(el);
    };
  }, [cat?.id]);

  useEffect(() => {
    if (!bubble) return;
    const onPointerDown = (e: PointerEvent) => {
      if (performance.now() < ignoreOutsideUntil.current) return;
      const t = e.target as Node;
      if (catRef.current?.contains(t)) return;
      if (bubbleRef.current?.contains(t)) return;
      closePopupAndCat();
    };
    document.addEventListener("pointerdown", onPointerDown, true);
    return () => document.removeEventListener("pointerdown", onPointerDown, true);
  }, [bubble, closePopupAndCat]);

  const meow = (e: MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
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

    busy.current = true;
    ignoreOutsideUntil.current = performance.now() + 350;

    setBubble({
      text: CAT_LINES[Math.floor(Math.random() * CAT_LINES.length)],
      ...pos,
      side: spot.side,
    });

    gsap.fromTo(
      el.querySelector("svg"),
      { scale: 1 },
      {
        scale: 1.15,
        duration: 0.14,
        yoyo: true,
        repeat: 1,
        transformOrigin: "50% 50%",
      },
    );

    hideTimer.current = window.setTimeout(() => {
      closePopupAndCat();
    }, 3000);
  };

  if (!active || lightboxOpen) return null;
  const spot = cat ? SPOTS[cat.spotIndex] : null;

  return (
    <>
      <AnimatePresence>
        {cat && spot && (
          <motion.div
            key={cat.id}
            initial={{ opacity: 0 }}
            exit={{ opacity: 0, scale: 0.7, y: 10 }}
            transition={{ duration: 0.3 }}
            className="fixed z-[72]"
            style={{
              top: spot.top,
              left: spot.left,
              right: spot.right,
            }}
          >
            {/* Hint stays while the cat is visible (until popup opens) */}
            <AnimatePresence>
              {!bubble && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: [0.75, 1, 0.75], y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{
                    opacity: {
                      duration: 2.2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    },
                  }}
                  className="absolute bottom-full left-1/2 mb-1 -translate-x-1/2 whitespace-nowrap rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-medium text-[var(--ink)] shadow-md ring-1 ring-black/5"
                >
                  Dame click
                </motion.div>
              )}
            </AnimatePresence>
            <button
              ref={catRef}
              type="button"
              aria-label="Gatito escondido"
              data-cursor="hover"
              onClick={meow}
              className={`touch-manipulation rounded-full p-2 drop-shadow-[0_8px_24px_rgba(232,180,184,0.55)] ${
                cat.tint === "accent"
                  ? "text-[var(--accent)]"
                  : "text-[var(--gold)]"
              }`}
            >
              <CatSvg className="h-12 w-12 sm:h-14 sm:w-14" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {bubble && (
          <div
            ref={bubbleRef}
            className="fixed z-[80] w-[min(86vw,260px)] -translate-y-full"
            style={{ left: bubble.left, top: bubble.top }}
          >
            <motion.div
              key={bubble.text + bubble.left}
              initial={{ opacity: 0, y: 12, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.94 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
            >
              <div className="speech-bubble speech-bubble-pop text-center">
                <p className="text-center text-[15px] leading-relaxed text-[var(--ink)] sm:text-base">
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
