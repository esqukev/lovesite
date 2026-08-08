"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { WELCOME_LETTER } from "@/lib/data";

export function PaperLetter({ onStart }: { onStart: () => void }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const openedRef = useRef(false);
  const startedRef = useRef(false);
  const doneRef = useRef(false);
  const [open, setOpen] = useState(false);
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    doneRef.current = done;
  }, [done]);

  useEffect(() => {
    const shell = rootRef.current?.querySelector(".paper-shell");
    if (!shell) return;
    gsap.fromTo(
      shell,
      { y: 24, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.65,
        ease: "power3.out",
        clearProps: "transform",
      },
    );
  }, []);

  useEffect(() => {
    if (!open) return;
    let i = 0;
    const step = window.matchMedia("(pointer: coarse)").matches ? 4 : 1;
    const id = window.setInterval(() => {
      i = Math.min(WELCOME_LETTER.length, i + step);
      setDisplayed(WELCOME_LETTER.slice(0, i));
      if (i >= WELCOME_LETTER.length) {
        window.clearInterval(id);
        doneRef.current = true;
        setDone(true);
      }
    }, 14);
    return () => window.clearInterval(id);
  }, [open]);

  const openLetter = useCallback(() => {
    if (openedRef.current) return;
    openedRef.current = true;
    setOpen(true);
  }, []);

  const start = useCallback(() => {
    if (!doneRef.current || startedRef.current) return;
    startedRef.current = true;
    onStart();
  }, [onStart]);

  useEffect(() => {
    if (!open) return;
    const sheet = rootRef.current?.querySelector(".paper-sheet");
    if (!sheet) return;
    gsap.fromTo(
      sheet,
      { y: 10, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.3,
        ease: "power3.out",
        clearProps: "transform",
      },
    );
  }, [open]);

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[200] overflow-y-auto overscroll-contain bg-[#f3e8ea]"
      style={{ WebkitOverflowScrolling: "touch" }}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(232,170,176,0.45),transparent_50%),radial-gradient(ellipse_at_bottom,rgba(255,214,188,0.35),transparent_55%)]" />

      <div className="relative flex min-h-full flex-col items-center px-4 py-8 sm:justify-center sm:py-12">
        <div className="paper-shell w-full max-w-lg">
          <h2 className="mb-5 text-center font-display text-[clamp(1.6rem,5vw,2.6rem)] italic leading-tight tracking-[-0.02em] text-[var(--ink)] sm:mb-6">
            Una carta para mi amor
          </h2>

          {!open && (
            <div className="mx-auto w-full max-w-md">
              {/*
                iOS: never put pointer-events-none children INSIDE the tap button.
                Use a sibling decoration + a full-size hit button with a tiny fill.
              */}
              <div className="relative h-56 w-full">
                <div
                  className="absolute inset-0 overflow-hidden rounded-sm bg-[#c9a27a] shadow-[0_30px_80px_rgba(0,0,0,0.45)]"
                  aria-hidden
                >
                  <div className="absolute inset-x-0 top-0 h-28 bg-[#d4b08a]" />
                  <div className="absolute inset-x-8 bottom-8 top-16 rounded-sm bg-[#f7efe3] opacity-90 shadow-inner" />
                  <div className="absolute bottom-6 left-1/2 flex h-14 w-14 -translate-x-1/2 items-center justify-center rounded-full bg-[var(--accent)] font-display text-lg text-[var(--ink)] shadow-lg">
                    ♥
                  </div>
                </div>

                <button
                  type="button"
                  aria-label="Abrir carta"
                  onPointerDown={(e) => {
                    e.preventDefault();
                    openLetter();
                  }}
                  onClick={openLetter}
                  className="absolute inset-0 z-20 h-full w-full rounded-sm border-0"
                  style={{
                    // Non-zero alpha so iOS registers the full box as tappable
                    backgroundColor: "rgba(255,255,255,0.02)",
                    touchAction: "manipulation",
                    WebkitTapHighlightColor: "transparent",
                    cursor: "pointer",
                  }}
                />
              </div>
              <p className="mt-4 text-center text-sm text-[var(--ink)]/50">
                Toca el sobre para abrirla
              </p>
            </div>
          )}

          {open && (
            <div className="paper-sheet relative mx-auto w-full max-w-md pb-28">
              <div className="paper-texture relative rounded-sm px-6 py-8 sm:px-10 sm:py-11">
                <div className="pointer-events-none absolute left-0 top-0 h-full w-2 bg-gradient-to-r from-black/10 to-transparent" />
                <p className="font-display text-[1.1rem] leading-[1.7] text-[#2c211c] whitespace-pre-wrap sm:text-[1.35rem] sm:leading-[1.75]">
                  {displayed}
                  {!done && (
                    <span className="ml-0.5 inline-block h-4 w-[2px] animate-pulse bg-[#2c211c]/50" />
                  )}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Fixed CTA — outside scroll quirks, always on top */}
      {done && (
        <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[220] flex justify-center px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-4">
          <button
            type="button"
            onPointerDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              start();
            }}
            onClick={(e) => {
              e.preventDefault();
              start();
            }}
            className="pointer-events-auto min-h-[56px] min-w-[12rem] rounded-full border border-[rgba(196,165,116,0.45)] px-10 py-3.5 font-display text-xl tracking-wide text-[#f7efe6] shadow-[0_14px_40px_rgba(168,90,100,0.45)]"
            style={{
              background:
                "linear-gradient(145deg, #c98a92 0%, #a86570 45%, #8d4f5a 100%)",
              touchAction: "manipulation",
              WebkitTapHighlightColor: "transparent",
              cursor: "pointer",
            }}
          >
            Entrar
          </button>
        </div>
      )}
    </div>
  );
}
