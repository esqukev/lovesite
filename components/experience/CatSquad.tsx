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

export function CatSquad({ active }: { active: boolean }) {
  const { discoverEgg } = useExperience();
  const catA = useRef<HTMLButtonElement>(null);
  const catB = useRef<HTMLButtonElement>(null);
  const [bubble, setBubble] = useState<{ text: string; x: number; y: number } | null>(
    null,
  );

  useEffect(() => {
    if (!active) return;
    const a = catA.current;
    const b = catB.current;
    if (!a || !b) return;

    const tl = gsap.timeline({ repeat: -1 });
    tl.to(a, {
      x: () => window.innerWidth * 0.55,
      duration: 14,
      ease: "sine.inOut",
    })
      .to(a, { scaleX: -1, duration: 0.2 }, ">")
      .to(a, { x: 0, duration: 14, ease: "sine.inOut" })
      .to(a, { scaleX: 1, duration: 0.2 });

    gsap.to(b, {
      y: -14,
      duration: 1.1,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut",
    });
    gsap.to(b, {
      rotation: 6,
      duration: 2.2,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut",
    });

    return () => {
      tl.kill();
      gsap.killTweensOf([a, b]);
    };
  }, [active]);

  const meow = (el: HTMLElement | null) => {
    if (!el) return;
    discoverEgg("cat-meow");
    const rect = el.getBoundingClientRect();
    setBubble({
      text: CAT_LINES[Math.floor(Math.random() * CAT_LINES.length)],
      x: rect.left + rect.width / 2,
      y: rect.top,
    });
    gsap.fromTo(
      el,
      { scale: 1 },
      { scale: 1.2, duration: 0.15, yoyo: true, repeat: 1 },
    );
    window.setTimeout(() => setBubble(null), 2400);
  };

  if (!active) return null;

  return (
    <>
      <button
        ref={catA}
        type="button"
        aria-label="Gatito explorador"
        data-cursor="hover"
        onClick={() => meow(catA.current)}
        className="fixed bottom-8 left-4 z-[45] text-[var(--accent)] drop-shadow-[0_8px_24px_rgba(232,180,184,0.45)]"
      >
        <CatSvg className="h-12 w-12 sm:h-14 sm:w-14" />
      </button>

      <button
        ref={catB}
        type="button"
        aria-label="Gatito saltarín"
        data-cursor="hover"
        onClick={() => meow(catB.current)}
        className="fixed bottom-24 right-6 z-[45] text-[var(--gold)] drop-shadow-[0_8px_24px_rgba(196,165,116,0.4)]"
      >
        <CatSvg className="h-10 w-10 sm:h-12 sm:w-12" />
      </button>

      <AnimatePresence>
        {bubble && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6 }}
            className="pointer-events-none fixed z-[70] max-w-[200px] -translate-x-1/2 -translate-y-full rounded-2xl border border-white/15 bg-black/75 px-3 py-2 text-center text-xs text-[var(--cream)] backdrop-blur-md"
            style={{ left: bubble.x, top: bubble.y - 8 }}
          >
            {bubble.text}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
