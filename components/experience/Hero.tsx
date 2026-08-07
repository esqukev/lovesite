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
      gsap.from(".hero-big", {
        yPercent: 30,
        opacity: 0,
        duration: 1.4,
        stagger: 0.12,
        ease: "power4.out",
      });

      gsap.to(".hero-big", {
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
          { opacity: 1, y: 0, duration: 0.6 },
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
      className="relative flex min-h-[100svh] items-end overflow-hidden px-5 pb-16 pt-36 sm:px-10"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-10%] top-[10%] h-[50vw] w-[50vw] rounded-full bg-[radial-gradient(circle,rgba(232,180,184,0.2),transparent_65%)] blur-2xl" />
        <div className="absolute bottom-[5%] right-[-5%] h-[40vw] w-[40vw] rounded-full bg-[radial-gradient(circle,rgba(196,165,116,0.14),transparent_70%)] blur-2xl" />
      </div>

      <div className="relative z-10 w-full max-w-6xl">
        <p className="hero-big mb-4 text-xs uppercase tracking-[0.4em] text-[var(--gold)]">
          Solo nosotros
        </p>
        <h1
          ref={titleRef}
          className="hero-big max-w-[12ch] font-display text-[clamp(3.2rem,12vw,8rem)] leading-[0.9] tracking-[-0.04em] text-[var(--cream)]"
          onPointerDown={onHoldStart}
          onPointerUp={onHoldEnd}
          onPointerLeave={onHoldEnd}
          data-cursor="hover"
        >
          Nuestra pequeña esquina del universo
          <span className="secret-msg mt-6 block font-sans text-base font-normal tracking-normal text-[var(--accent)] opacity-0 sm:text-lg">
            Si sostienes esto, es porque ya sabes que eres mi hogar.
          </span>
        </h1>
        <p className="hero-big mt-8 max-w-md text-base text-white/55 sm:text-lg">
          Este lugar existe únicamente para nosotros. Baja. Toca. Quédate.
        </p>
      </div>
    </section>
  );
}
