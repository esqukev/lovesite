"use client";

import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/** Global cinematic scroll treatments for section titles and depth layers */
export function CinemaScroll({ enabled }: { enabled: boolean }) {
  useGSAP(
    () => {
      if (!enabled) return;

      const titles = gsap.utils.toArray<HTMLElement>("[data-cinema='title']");
      titles.forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0.2, y: 70, filter: "blur(8px)" },
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top 92%",
              end: "top 48%",
              scrub: 1,
            },
          },
        );
      });

      gsap.utils.toArray<HTMLElement>("[data-cinema='fade-up']").forEach((el) => {
        gsap.from(el, {
          opacity: 0,
          y: 60,
          duration: 1.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
          },
        });
      });

      gsap.utils.toArray<HTMLElement>("[data-cinema='scale']").forEach((el) => {
        gsap.fromTo(
          el,
          { scale: 1.1 },
          {
            scale: 1,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      });

      ScrollTrigger.refresh();
    },
    { dependencies: [enabled], revertOnUpdate: true },
  );

  return null;
}
