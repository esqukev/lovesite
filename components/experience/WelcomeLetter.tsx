"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { WELCOME_LETTER } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { useExperience } from "./ExperienceProvider";

export function WelcomeLetter({ onStart }: { onStart: () => void }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  const { setPhase } = useExperience();

  useEffect(() => {
    let i = 0;
    const speed = 22;
    const id = window.setInterval(() => {
      i += 1;
      setDisplayed(WELCOME_LETTER.slice(0, i));
      if (i >= WELCOME_LETTER.length) {
        window.clearInterval(id);
        setDone(true);
      }
    }, speed);
    return () => window.clearInterval(id);
  }, []);

  const handleStart = () => {
    gsap.to(rootRef.current, {
      opacity: 0,
      y: -30,
      filter: "blur(8px)",
      duration: 0.9,
      ease: "power2.inOut",
      onComplete: () => {
        setPhase("main");
        onStart();
      },
    });
  };

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-40 flex items-center justify-center bg-[var(--void)] px-6"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(196,165,116,0.12),transparent_50%),radial-gradient(ellipse_at_bottom,rgba(232,180,184,0.1),transparent_45%)]" />
      <div className="relative w-full max-w-2xl">
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 shadow-[0_40px_120px_-40px_rgba(0,0,0,0.8)] backdrop-blur-xl sm:p-12">
          <p className="mb-6 text-xs uppercase tracking-[0.35em] text-[var(--gold)]">
            Una carta para ti
          </p>
          <div className="font-display text-lg leading-relaxed text-[#f3ebe3] whitespace-pre-wrap sm:text-xl">
            {displayed}
            <span className="ml-0.5 inline-block h-5 w-[2px] translate-y-1 animate-pulse bg-[var(--accent)]" />
          </div>
          <div
            className={`mt-10 flex justify-center transition-all duration-700 ${
              done ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
            }`}
          >
            <Button size="lg" onClick={handleStart}>
              Comenzar nuestro recorrido
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
