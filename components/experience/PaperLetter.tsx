"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { WELCOME_LETTER } from "@/lib/data";

const HEARTS = ["♡", "♥", "♡", "♥"];

export function PaperLetter({ onStart }: { onStart: () => void }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const rainRef = useRef<HTMLDivElement>(null);
  const openedRef = useRef(false);
  const startedRef = useRef(false);
  const [open, setOpen] = useState(false);
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    const shell = rootRef.current?.querySelector(".paper-shell");
    if (!shell) return;
    gsap.fromTo(
      shell,
      { y: 28, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.7,
        ease: "power3.out",
        // Transforms on parents break iOS hit-testing — clear when done
        clearProps: "transform",
      },
    );
  }, []);

  useEffect(() => {
    if (open) return;
    const root = rainRef.current;
    if (!root) return;
    let alive = true;
    let timeout: number;

    const spawn = () => {
      if (!alive) return;
      const heart = document.createElement("span");
      heart.className = "float-heart";
      heart.setAttribute("aria-hidden", "true");
      heart.style.pointerEvents = "none";
      heart.textContent = HEARTS[Math.floor(Math.random() * HEARTS.length)];
      heart.style.left = `${6 + Math.random() * 88}%`;
      heart.style.top = "-6%";
      heart.style.fontSize = `${10 + Math.random() * 12}px`;
      heart.style.opacity = "0.55";
      root.appendChild(heart);

      gsap.fromTo(
        heart,
        { y: 0, x: 0, opacity: 0.5 + Math.random() * 0.25, rotate: 0 },
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
  }, [open]);

  useEffect(() => {
    if (!open) return;
    let i = 0;
    const step = window.matchMedia("(pointer: coarse)").matches ? 4 : 1;
    const id = window.setInterval(() => {
      i = Math.min(WELCOME_LETTER.length, i + step);
      setDisplayed(WELCOME_LETTER.slice(0, i));
      if (i >= WELCOME_LETTER.length) {
        window.clearInterval(id);
        setDone(true);
      }
    }, 14);
    return () => window.clearInterval(id);
  }, [open]);

  const openLetter = () => {
    if (openedRef.current) return;
    openedRef.current = true;
    setOpen(true);
  };

  useEffect(() => {
    if (!open) return;
    const sheet = rootRef.current?.querySelector(".paper-sheet");
    if (sheet) {
      gsap.fromTo(
        sheet,
        { y: 12, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.35,
          ease: "power3.out",
          clearProps: "transform",
        },
      );
    }
  }, [open]);

  const start = () => {
    if (!done || startedRef.current) return;
    startedRef.current = true;
    onStart();
  };

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-40 overflow-y-auto overscroll-contain bg-[#f3e8ea]"
    >
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_top,rgba(232,170,176,0.45),transparent_50%),radial-gradient(ellipse_at_bottom,rgba(255,214,188,0.35),transparent_55%)]" />
      {!open && (
        <div
          ref={rainRef}
          className="letter-heart-rain pointer-events-none fixed inset-0 z-[1] overflow-hidden"
          aria-hidden
        />
      )}

      <div className="relative z-[2] flex min-h-full items-start justify-center px-4 py-8 sm:items-center sm:py-12">
        <div className="paper-shell w-full max-w-lg">
          <h2 className="mb-5 text-center font-display text-[clamp(1.6rem,5vw,2.6rem)] italic leading-tight tracking-[-0.02em] text-[var(--ink)] sm:mb-6">
            Una carta para mi amor
          </h2>

          {!open && (
            <div className="mx-auto w-full max-w-md">
              {/* Flat hit target — no 3D / perspective (breaks taps on iOS) */}
              <button
                type="button"
                onClick={openLetter}
                onTouchEnd={(e) => {
                  e.preventDefault();
                  openLetter();
                }}
                className="relative block w-full touch-manipulation select-none [-webkit-tap-highlight-color:transparent]"
                aria-label="Abrir carta"
              >
                <span className="pointer-events-none relative block h-56 overflow-hidden rounded-sm bg-[#c9a27a] shadow-[0_30px_80px_rgba(0,0,0,0.45)]">
                  <span className="absolute inset-x-0 top-0 h-28 bg-[#d4b08a]" />
                  <span className="absolute inset-x-8 bottom-8 top-16 rounded-sm bg-[#f7efe3] opacity-90 shadow-inner" />
                  <span className="absolute bottom-6 left-1/2 flex h-14 w-14 -translate-x-1/2 items-center justify-center rounded-full bg-[var(--accent)] font-display text-lg text-[var(--ink)] shadow-lg">
                    ♥
                  </span>
                </span>
              </button>
              <p className="mt-4 text-center text-sm text-[var(--ink)]/50">
                Toca el sobre para abrirla
              </p>
            </div>
          )}

          {open && (
            <div className="paper-sheet relative mx-auto w-full max-w-md">
              <div className="paper-texture relative rounded-sm px-6 py-8 sm:px-10 sm:py-11">
                <div className="pointer-events-none absolute left-0 top-0 h-full w-2 bg-gradient-to-r from-black/10 to-transparent" />
                <p className="font-display text-[1.1rem] leading-[1.7] text-[#2c211c] whitespace-pre-wrap sm:text-[1.35rem] sm:leading-[1.75]">
                  {displayed}
                  {!done && (
                    <span className="ml-0.5 inline-block h-4 w-[2px] animate-pulse bg-[#2c211c]/50" />
                  )}
                </p>

                {done && (
                  <div className="relative z-30 mt-8 flex justify-center sm:mt-9">
                    <button
                      type="button"
                      onClick={start}
                      onTouchEnd={(e) => {
                        e.preventDefault();
                        start();
                      }}
                      className="letter-seal-btn relative min-h-[52px] min-w-[11rem] touch-manipulation select-none [-webkit-tap-highlight-color:transparent]"
                    >
                      <span className="letter-seal-glow" aria-hidden />
                      <span className="relative z-[1] px-10 py-3.5 font-display text-xl tracking-wide text-[#f7efe6]">
                        Entrar
                      </span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
