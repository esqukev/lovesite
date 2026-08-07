"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/** A scroll-pinned moment between sections — fills the “algo con el scroll” need */
export function ScrollRevealBand() {
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const words = gsap.utils.toArray<HTMLElement>(".band-word", rootRef.current);
      gsap.set(words, { yPercent: 120, opacity: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top top",
          end: "+=120%",
          pin: true,
          scrub: 0.8,
        },
      });

      tl.to(words, {
        yPercent: 0,
        opacity: 1,
        stagger: 0.08,
        ease: "power2.out",
      }).to(".band-line", { scaleX: 1, duration: 0.6, ease: "power2.out" }, "-=0.3");
    },
    { scope: rootRef },
  );

  const line = "Contigo hasta lo simple se siente especial.";

  return (
    <section
      ref={rootRef}
      className="section-soft relative flex min-h-[70svh] items-center justify-center overflow-hidden px-6"
    >
      <div className="relative z-10 max-w-3xl text-center">
        <p className="font-display text-[clamp(1.8rem,5vw,3.4rem)] leading-[1.2] text-[var(--ink)]">
          {line.split(" ").map((word, i) => (
            <span key={`${word}-${i}`} className="inline-block overflow-hidden align-bottom">
              <span className="band-word inline-block will-change-transform">
                {word}
                {i < line.split(" ").length - 1 ? "\u00A0" : ""}
              </span>
            </span>
          ))}
        </p>
        <div className="band-line mx-auto mt-8 h-px w-40 origin-left scale-x-0 bg-[var(--accent)]" />
      </div>
    </section>
  );
}
