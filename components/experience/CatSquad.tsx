"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type MouseEvent,
} from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
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
  { top: "18%", left: "3%", side: "left" },
  { top: "30%", right: "3%", side: "right" },
  { top: "54%", left: "4%", side: "left" },
  { top: "68%", right: "4%", side: "right" },
  { top: "42%", right: "10%", side: "right" },
  { top: "76%", left: "12%", side: "left" },
];

function CatSvg({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      <path
        fill="currentColor"
        d="M12 22c0-8 6-14 14-14 3 0 6 1 8 3 2-2 5-3 8-3 8 0 14 6 14 14v18c0 10-8 18-18 18H30C20 58 12 50 12 40V22z"
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
  const top = Math.max(
    margin + 40,
    Math.min(catRect.top - 12, window.innerHeight - 160),
  );

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
  const [mounted, setMounted] = useState(false);
  const [cat, setCat] = useState<CatInstance | null>(null);
  const [bubble, setBubble] = useState<Bubble | null>(null);
  const hideTimer = useRef<number | null>(null);
  const cycleTimer = useRef<number | null>(null);
  const usedSpots = useRef<number[]>([]);
  const idRef = useRef(0);
  const busy = useRef(false);
  const ignoreOutsideUntil = useRef(0);

  useEffect(() => setMounted(true), []);

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
          scheduleNext(900);
          return;
        }
        setCat(null);
        cycleTimer.current = window.setTimeout(() => {
          if (cancelled) return;
          spawn();
          scheduleNext(6500 + Math.random() * 4500);
        }, 1200 + Math.random() * 1000);
      }, delay);
    };

    const first = window.setTimeout(() => {
      spawn();
      scheduleNext(7500 + Math.random() * 3500);
    }, 800);

    return () => {
      cancelled = true;
      window.clearTimeout(first);
      if (cycleTimer.current) window.clearTimeout(cycleTimer.current);
      if (hideTimer.current) window.clearTimeout(hideTimer.current);
    };
  }, [active, lightboxOpen, spawn, closePopupAndCat]);

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
    return () =>
      document.removeEventListener("pointerdown", onPointerDown, true);
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

    hideTimer.current = window.setTimeout(() => {
      closePopupAndCat();
    }, 3000);
  };

  if (!mounted || !active || lightboxOpen) return null;

  const spot = cat ? SPOTS[cat.spotIndex] : null;

  return createPortal(
    <>
      <AnimatePresence>
        {cat && spot && (
          <motion.div
            key={cat.id}
            initial={{ opacity: 0, y: 12, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.8 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="pointer-events-auto fixed z-[120]"
            style={{
              top: spot.top,
              left: spot.left,
              right: spot.right,
            }}
          >
            <AnimatePresence>
              {!bubble && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: [0.7, 1, 0.7], y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{
                    opacity: {
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    },
                  }}
                  className="absolute bottom-full left-1/2 mb-1 -translate-x-1/2 whitespace-nowrap rounded-full bg-white px-2.5 py-1 text-[10px] font-medium text-[var(--ink)] shadow-md ring-1 ring-black/10"
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
              className={`animate-bounce touch-manipulation rounded-full p-2 drop-shadow-[0_10px_28px_rgba(200,107,120,0.55)] [animation-duration:2.2s] ${
                cat.tint === "accent"
                  ? "text-[var(--accent)]"
                  : "text-[var(--gold)]"
              }`}
            >
              <CatSvg className="h-14 w-14 sm:h-16 sm:w-16" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {bubble && (
          <div
            ref={bubbleRef}
            className="pointer-events-auto fixed z-[130] w-[min(86vw,260px)] -translate-y-full"
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
    </>,
    document.body,
  );
}
