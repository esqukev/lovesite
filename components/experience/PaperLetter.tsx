"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { WELCOME_LETTER } from "@/lib/data";

export function PaperLetter({ onStart }: { onStart: () => void }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    gsap.from(".paper-shell", {
      y: 50,
      opacity: 0,
      rotateX: 12,
      duration: 1.1,
      ease: "power3.out",
    });
  }, []);

  useEffect(() => {
    if (!open) return;
    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      setDisplayed(WELCOME_LETTER.slice(0, i));
      if (i >= WELCOME_LETTER.length) {
        window.clearInterval(id);
        setDone(true);
      }
    }, 18);
    return () => window.clearInterval(id);
  }, [open]);

  const openLetter = () => {
    if (open) return;
    setOpen(true);
    gsap.to(".envelope-flap", {
      rotateX: 180,
      duration: 0.7,
      ease: "power2.inOut",
      transformOrigin: "top center",
    });
    gsap.to(".paper-sheet", {
      y: -18,
      opacity: 1,
      duration: 0.8,
      delay: 0.25,
      ease: "power3.out",
    });
  };

  const start = () => {
    gsap.to(rootRef.current, {
      opacity: 0,
      scale: 1.04,
      filter: "blur(8px)",
      duration: 0.85,
      ease: "power2.inOut",
      onComplete: onStart,
    });
  };

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-40 flex items-center justify-center bg-[#120e0c] px-4 py-10"
      style={{ perspective: 1200 }}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(232,180,184,0.14),transparent_45%)]" />

      <div className="paper-shell relative w-full max-w-lg" style={{ transformStyle: "preserve-3d" }}>
        <p className="mb-5 text-center text-[10px] uppercase tracking-[0.35em] text-[var(--gold)]">
          Una carta para ti
        </p>

        {!open && (
          <button
            type="button"
            onClick={openLetter}
            className="group relative mx-auto block w-full max-w-md touch-manipulation"
            aria-label="Abrir carta"
          >
            <div className="relative h-56 overflow-hidden rounded-sm bg-[#c9a27a] shadow-[0_30px_80px_rgba(0,0,0,0.45)]">
              <div className="envelope-flap absolute inset-x-0 top-0 h-28 origin-top bg-[#d4b08a]" />
              <div className="absolute inset-x-8 bottom-8 top-16 rounded-sm bg-[#f7efe3] opacity-90 shadow-inner" />
              <div className="absolute bottom-6 left-1/2 flex h-14 w-14 -translate-x-1/2 items-center justify-center rounded-full bg-[var(--accent)] font-display text-lg text-[var(--ink)] shadow-lg transition group-hover:scale-105">
                ♥
              </div>
            </div>
            <p className="mt-4 text-center text-sm text-white/55">
              Toca el sobre para abrirla
            </p>
          </button>
        )}

        <div
          className={`paper-sheet relative mx-auto w-full max-w-md transition-opacity ${
            open ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        >
          <div className="paper-texture relative rounded-sm px-7 py-9 sm:px-10 sm:py-11">
            <div className="absolute left-0 top-0 h-full w-2 bg-gradient-to-r from-black/10 to-transparent" />
            <p className="font-letter text-[1.15rem] leading-relaxed text-[#3a2a22] whitespace-pre-wrap sm:text-[1.25rem]">
              {displayed}
              {open && !done && (
                <span className="ml-0.5 inline-block h-4 w-[2px] animate-pulse bg-[#3a2a22]/50" />
              )}
            </p>

            <div
              className={`mt-9 flex justify-center transition-all duration-700 ${
                done ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
              }`}
            >
              <button
                type="button"
                onClick={start}
                className="letter-seal-btn group relative touch-manipulation"
              >
                <span className="letter-seal-glow" aria-hidden />
                <span className="relative z-[1] flex flex-col items-center px-8 py-4">
                  <span className="font-display text-lg tracking-wide text-[#f7efe6] sm:text-xl">
                    Comenzar nuestro recorrido
                  </span>
                  <span className="mt-1 text-[10px] uppercase tracking-[0.28em] text-[#f7efe6]/65">
                    Abre el universo
                  </span>
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
