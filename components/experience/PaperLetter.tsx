"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { WELCOME_LETTER } from "@/lib/data";

const HEARTS = ["♡", "♥", "♡", "♥"];

export function PaperLetter({ onStart }: { onStart: () => void }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const rainRef = useRef<HTMLDivElement>(null);
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

  // Subtle heart rain while the letter screen is up
  useEffect(() => {
    const root = rainRef.current;
    if (!root) return;
    let alive = true;
    let timeout: number;

    const spawn = () => {
      if (!alive) return;
      const heart = document.createElement("span");
      heart.className = "float-heart";
      heart.textContent = HEARTS[Math.floor(Math.random() * HEARTS.length)];
      heart.style.left = `${6 + Math.random() * 88}%`;
      heart.style.top = "-6%";
      heart.style.fontSize = `${10 + Math.random() * 12}px`;
      heart.style.opacity = "0.55";
      root.appendChild(heart);

      gsap.fromTo(
        heart,
        { y: 0, x: 0, opacity: 0.5 + Math.random() * 0.25, rotation: 0 },
        {
          y: window.innerHeight * (0.85 + Math.random() * 0.25),
          x: (Math.random() - 0.5) * 80,
          opacity: 0,
          rotation: (Math.random() - 0.5) * 40,
          duration: 8 + Math.random() * 5,
          ease: "sine.in",
          onComplete: () => heart.remove(),
        },
      );

      timeout = window.setTimeout(spawn, 520 + Math.random() * 900);
    };

    timeout = window.setTimeout(spawn, 400);
    return () => {
      alive = false;
      window.clearTimeout(timeout);
      root.innerHTML = "";
    };
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
      className="fixed inset-0 z-40 flex items-center justify-center bg-[#f3e8ea] px-4 py-10"
      style={{ perspective: 1200 }}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(232,170,176,0.45),transparent_50%),radial-gradient(ellipse_at_bottom,rgba(255,214,188,0.35),transparent_55%)]" />
      <div
        ref={rainRef}
        className="letter-heart-rain pointer-events-none absolute inset-0 z-[1] overflow-hidden"
        aria-hidden
      />

      <div className="paper-shell relative z-[2] w-full max-w-lg" style={{ transformStyle: "preserve-3d" }}>
        <h2 className="mb-6 text-center font-display text-[clamp(1.85rem,5vw,2.6rem)] italic leading-tight tracking-[-0.02em] text-[var(--ink)]">
          Una carta para mi amor
        </h2>

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
            <p className="mt-4 text-center text-sm text-[var(--ink)]/50">
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
            <p className="font-display text-[1.2rem] leading-[1.75] text-[#2c211c] whitespace-pre-wrap sm:text-[1.35rem]">
              {displayed}
              {open && !done && (
                <span className="ml-0.5 inline-block h-4 w-[2px] animate-pulse bg-[#2c211c]/50" />
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
                <span className="relative z-[1] px-10 py-3.5 font-display text-xl tracking-wide text-[#f7efe6]">
                  Entrar
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
