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
      const tl = gsap.timeline({ delay: 0.15 });
      tl.from(".hero-reveal", {
        opacity: 0,
        y: 50,
        filter: "blur(10px)",
        duration: 1.25,
        stagger: 0.16,
        ease: "power3.out",
      });

      gsap.to(".hero-parallax", {
        yPercent: 28,
        ease: "none",
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      gsap.to(".hero-content", {
        yPercent: -12,
        opacity: 0.15,
        scale: 0.94,
        ease: "none",
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });

      gsap.to(".hero-orb-a", {
        xPercent: -20,
        yPercent: 30,
        ease: "none",
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      gsap.to(".hero-orb-b", {
        xPercent: 25,
        yPercent: -20,
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
      className="relative flex min-h-[110svh] items-center justify-center overflow-hidden px-6 pb-28 pt-32"
    >
      <div className="hero-parallax pointer-events-none absolute inset-0">
        <div className="hero-orb-a absolute left-1/2 top-1/4 h-[48vw] w-[48vw] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(232,180,184,0.22),transparent_65%)] blur-2xl" />
        <div className="hero-orb-b absolute bottom-1/4 right-1/5 h-[32vw] w-[32vw] rounded-full bg-[radial-gradient(circle,rgba(196,165,116,0.16),transparent_70%)] blur-2xl" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(12,10,9,0.85)_85%)]" />
      </div>

      <div className="hero-content relative z-10 mx-auto max-w-4xl text-center">
        <p className="hero-reveal mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/35 px-3 py-1.5 text-[10px] uppercase tracking-[0.35em] text-[var(--gold)] backdrop-blur-md">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--accent)]" />
          Nivel 01 · Solo nosotros
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
            Empieza el recorrido
          </span>
          <div className="scroll-indicator h-12 w-[1px] overflow-hidden bg-white/15">
            <div className="h-full w-full origin-top animate-[scrollPulse_1.8s_ease-in-out_infinite] bg-[var(--accent)]" />
          </div>
        </div>
      </div>
    </section>
  );
}
