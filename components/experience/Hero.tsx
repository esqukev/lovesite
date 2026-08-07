"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useExperience } from "./ExperienceProvider";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export function Hero() {
  const rootRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const holdTimer = useRef<number | null>(null);
  const { discoverEgg } = useExperience();

  useGSAP(
    () => {
      gsap.from(".hero-reveal", {
        opacity: 0,
        y: 40,
        filter: "blur(8px)",
        duration: 1.2,
        stagger: 0.18,
        ease: "power3.out",
        delay: 0.2,
      });

      gsap.to(".hero-parallax", {
        yPercent: 18,
        ease: "none",
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    },
    { scope: rootRef },
  );

  const onHoldStart = () => {
    holdTimer.current = window.setTimeout(() => {
      discoverEgg("title-hold");
      const el = titleRef.current?.querySelector(".secret-msg");
      if (el) {
        gsap.fromTo(
          el,
          { opacity: 0, y: 8 },
          { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
        );
      }
    }, 3000);
  };

  const onHoldEnd = () => {
    if (holdTimer.current) window.clearTimeout(holdTimer.current);
  };

  return (
    <section
      ref={rootRef}
      className="relative flex min-h-[100svh] items-center justify-center overflow-hidden px-6 pb-24 pt-28"
    >
      <div className="hero-parallax pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/4 h-[40vw] w-[40vw] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(232,180,184,0.18),transparent_65%)] blur-2xl" />
        <div className="absolute bottom-1/4 right-1/5 h-[28vw] w-[28vw] rounded-full bg-[radial-gradient(circle,rgba(196,165,116,0.12),transparent_70%)] blur-2xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <p className="hero-reveal mb-6 text-xs uppercase tracking-[0.4em] text-[var(--gold)]">
          Solo nosotros
        </p>
        <h1
          ref={titleRef}
          className="hero-reveal font-display text-4xl leading-[1.1] text-[var(--cream)] sm:text-6xl md:text-7xl"
          onPointerDown={onHoldStart}
          onPointerUp={onHoldEnd}
          onPointerLeave={onHoldEnd}
          data-cursor="hover"
        >
          Nuestra pequeña esquina del universo
          <span className="secret-msg mt-4 block text-base font-sans font-normal tracking-normal text-[var(--accent)] opacity-0 sm:text-lg">
            Si sostienes esto, es porque ya sabes que eres mi hogar.
          </span>
        </h1>
        <p className="hero-reveal mx-auto mt-8 max-w-2xl text-base leading-relaxed text-white/65 sm:text-lg">
          Este lugar existe únicamente para nosotros. Aquí quiero guardar cada
          recuerdo, cada fotografía, cada aventura y cada pequeño momento que
          haga que esta historia siga creciendo.
        </p>

        <div className="hero-reveal mt-16 flex flex-col items-center gap-3 text-white/40">
          <span className="text-[10px] uppercase tracking-[0.35em]">
            Desliza
          </span>
          <div className="scroll-indicator h-12 w-[1px] overflow-hidden bg-white/15">
            <div className="h-full w-full origin-top animate-[scrollPulse_1.8s_ease-in-out_infinite] bg-[var(--accent)]" />
          </div>
        </div>
      </div>
    </section>
  );
}
