"use client";

import { useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useExperience } from "./ExperienceProvider";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export function Footer() {
  const rootRef = useRef<HTMLElement>(null);
  const clicks = useRef(0);
  const resetTimer = useRef<number | null>(null);
  const [secret, setSecret] = useState(false);
  const { discoverEgg, allEggsFound } = useExperience();

  useGSAP(
    () => {
      gsap.from(".footer-reveal", {
        opacity: 0,
        y: 50,
        duration: 1.1,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top 70%",
        },
      });
    },
    { scope: rootRef },
  );

  const onFooterClick = () => {
    clicks.current += 1;
    if (resetTimer.current) window.clearTimeout(resetTimer.current);
    resetTimer.current = window.setTimeout(() => {
      clicks.current = 0;
    }, 1200);

    if (clicks.current >= 5) {
      clicks.current = 0;
      setSecret(true);
      discoverEgg("footer-secret");
      }
  };

  return (
    <footer
      ref={rootRef}
      onClick={onFooterClick}
      className="relative flex min-h-[100svh] flex-col items-center justify-center px-6 py-28 text-center"
      data-cursor="hover"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(232,180,184,0.12),transparent_55%)]" />
      <div className="relative z-10 mx-auto max-w-4xl">
        <h2 className="footer-reveal font-display text-4xl leading-tight text-[var(--cream)] sm:text-6xl md:text-7xl">
          Gracias por traer tanto brillo a mi vida.
        </h2>
        <p className="footer-reveal mx-auto mt-8 max-w-xl text-lg text-white/55">
          Hasta las cosas más sencillas las volvemos especiales.
        </p>
        <p className="footer-reveal mt-10 font-display text-3xl text-[var(--accent)]">
          Te amo ❤️
        </p>

        {secret && (
          <p className="mt-10 rounded-2xl border border-white/10 bg-white/[0.04] px-6 py-4 text-sm text-white/70">
            Encontraste un pequeño secreto.
            <br />
            Te amo infinitamente. ❤️
          </p>
        )}

        {allEggsFound && (
          <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-[var(--gold)]/40 bg-[var(--gold)]/10 px-5 py-2 text-xs uppercase tracking-[0.25em] text-[var(--gold)]">
            Insignia secreta desbloqueada
          </div>
        )}
      </div>
    </footer>
  );
}
