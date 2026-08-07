"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { gsap } from "gsap";
import { useExperience } from "./ExperienceProvider";

const CAT_LINES = [
  "miau… ella es tu persona favorita",
  "este gatito aprueba esta relación",
  "ronroneo activado por Motzy",
  "¿ya le dijiste que la amas hoy?",
  "misión: hacerla sonreír ✓",
  "si esto fuera un juego, ella sería el final bueno",
  "tip: toca las estrellitas para ganar XP",
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
  x: number;
  y: number;
  side: "left" | "right";
};

export function CatSquad({ active }: { active: boolean }) {
  const { discoverEgg } = useExperience();
  const catA = useRef<HTMLButtonElement>(null);
  const catB = useRef<HTMLButtonElement>(null);
  const [bubble, setBubble] = useState<Bubble | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const hideTimer = useRef<number | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    const sync = () => setIsMobile(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (!active) return;
    const a = catA.current;
    const b = catB.current;
    if (!a || !b) return;

    const mm = window.matchMedia("(max-width: 640px)");
    const walkX = () => (mm.matches ? window.innerWidth * 0.42 : window.innerWidth * 0.55);

    const tl = gsap.timeline({ repeat: -1 });
    tl.to(a, { x: walkX, duration: 12, ease: "sine.inOut" })
      .to(a, { scaleX: -1, duration: 0.2 })
      .to(a, { x: 0, duration: 12, ease: "sine.inOut" })
      .to(a, { scaleX: 1, duration: 0.2 });

    gsap.to(b, {
      y: -16,
      duration: 1.05,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut",
    });
    gsap.to(b, {
      rotation: 8,
      duration: 2,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut",
    });

    return () => {
      tl.kill();
      gsap.killTweensOf([a, b]);
    };
  }, [active]);

  const meow = (el: HTMLElement | null, side: "left" | "right") => {
    if (!el) return;
    discoverEgg("cat-meow", {
      title: "Gatito activado",
      detail: "Te dejó un mensaje ♥",
    });
    const rect = el.getBoundingClientRect();
    if (hideTimer.current) window.clearTimeout(hideTimer.current);
    setBubble({
      text: CAT_LINES[Math.floor(Math.random() * CAT_LINES.length)],
      x: rect.left + rect.width / 2,
      y: rect.top,
      side,
    });
    gsap.fromTo(
      el,
      { scale: 1 },
      { scale: 1.22, duration: 0.16, yoyo: true, repeat: 1 },
    );
    // Long enough to read comfortably on mobile
    hideTimer.current = window.setTimeout(() => setBubble(null), 12000);
  };

  if (!active) return null;

  return (
    <>
      <button
        ref={catA}
        type="button"
        aria-label="Gatito explorador"
        data-cursor="hover"
        onClick={() => meow(catA.current, "left")}
        className="fixed bottom-[5.5rem] left-3 z-[46] touch-manipulation rounded-full p-2 text-[var(--accent)] drop-shadow-[0_8px_24px_rgba(232,180,184,0.45)] sm:bottom-8 sm:left-4"
      >
        <CatSvg className="h-14 w-14 sm:h-16 sm:w-16" />
      </button>

      <button
        ref={catB}
        type="button"
        aria-label="Gatito saltarín"
        data-cursor="hover"
        onClick={() => meow(catB.current, "right")}
        className="fixed bottom-[9.5rem] right-3 z-[46] touch-manipulation rounded-full p-2 text-[var(--gold)] drop-shadow-[0_8px_24px_rgba(196,165,116,0.4)] sm:bottom-28 sm:right-6"
      >
        <CatSvg className="h-12 w-12 sm:h-14 sm:w-14" />
      </button>

      <AnimatePresence>
        {bubble && (
          <motion.div
            key={bubble.text + bubble.x}
            initial={{ opacity: 0, y: 22, scale: 0.7, rotate: -4 }}
            animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, y: -14, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 240, damping: 16 }}
            className="pointer-events-none fixed z-[80] w-[min(86vw,280px)]"
            style={
              isMobile
                ? { left: "50%", top: "18%", transform: "translateX(-50%)" }
                : {
                    left: bubble.x,
                    top: bubble.y,
                    transform: "translate(-50%, -118%)",
                  }
            }
          >
            <div className="speech-bubble speech-bubble-pop">
              <div className="mb-1 flex items-center justify-between gap-2">
                <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--ink)]/45">
                  Gatito dice
                </span>
                <span className="text-[10px] text-[var(--ink)]/35">12s</span>
              </div>
              <p className="text-[15px] leading-relaxed text-[var(--ink)] sm:text-base">
                {bubble.text}
              </p>
              <span className="speech-pop-dot speech-pop-dot-a" />
              <span className="speech-pop-dot speech-pop-dot-b" />
              <span
                className={`speech-tail ${bubble.side === "right" ? "speech-tail-right" : ""} ${isMobile ? "hidden" : ""}`}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
