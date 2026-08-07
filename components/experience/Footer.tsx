"use client";

import { useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useExperience } from "./ExperienceProvider";

gsap.registerPlugin(useGSAP, ScrollTrigger);

function splitWords(text: string) {
  return text.split(" ").map((word, i, arr) => (
    <span key={`${word}-${i}`} className="footer-word inline-block will-change-transform">
      {word}
      {i < arr.length - 1 ? "\u00A0" : ""}
    </span>
  ));
}

export function Footer() {
  const rootRef = useRef<HTMLElement>(null);
  const clicks = useRef(0);
  const resetTimer = useRef<number | null>(null);
  const [secret, setSecret] = useState(false);
  const { discoverEgg, allEggsFound } = useExperience();

  useGSAP(
    () => {
      const words = gsap.utils.toArray<HTMLElement>(".footer-word", rootRef.current);
      const lines = gsap.utils.toArray<HTMLElement>(".footer-line", rootRef.current);

      gsap.set(words, { yPercent: 110, opacity: 0, rotate: 4 });
      gsap.set(lines, { y: 24, opacity: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top 65%",
        },
      });

      tl.to(words, {
        yPercent: 0,
        opacity: 1,
        rotate: 0,
        duration: 0.85,
        stagger: 0.035,
        ease: "power3.out",
      }).to(
        lines,
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.18,
          ease: "power3.out",
        },
        "-=0.35",
      );
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
      className="section-soft relative flex min-h-[85svh] flex-col items-center justify-center px-6 py-24 text-center"
      data-cursor="hover"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(200,107,120,0.14),transparent_55%)]" />
      <div className="relative z-10 mx-auto max-w-4xl">
        <h2 className="overflow-hidden font-display text-4xl leading-[1.15] text-[var(--ink)] sm:text-6xl md:text-7xl">
          {splitWords("Gracias por traer tanto brillo a mi vida.")}
        </h2>
        <p className="footer-line muted mx-auto mt-8 max-w-xl text-lg sm:text-xl">
          Hasta las cosas más sencillas las volvemos especiales.
        </p>
        <p className="footer-line mt-10 font-display text-3xl text-[var(--accent)] sm:text-4xl">
          Te amo ❤️
        </p>

        {secret && (
          <p className="footer-line mt-10 text-sm text-[var(--ink)]/70">
            Encontraste un pequeño secreto.
            <br />
            Te amo infinitamente. ❤️
          </p>
        )}

        {allEggsFound && (
          <div className="footer-line mt-8 inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[var(--gold)]">
            Insignia secreta desbloqueada
          </div>
        )}
      </div>
    </footer>
  );
}
