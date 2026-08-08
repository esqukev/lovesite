"use client";

import { useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/** Soft scroll-in for section headings / blocks. Mark children with data-reveal. */
export function SectionReveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;
      const items = gsap.utils.toArray<HTMLElement>("[data-reveal]", root);
      if (!items.length) return;

      let played = false;
      gsap.set(items, {
        y: 36,
        opacity: 0,
        filter: "blur(5px)",
      });

      const play = () => {
        if (played) return;
        played = true;
        gsap.to(items, {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 0.85,
          stagger: 0.12,
          delay,
          ease: "power3.out",
          overwrite: true,
        });
      };

      ScrollTrigger.create({
        trigger: root,
        start: "top 88%",
        once: true,
        onEnter: play,
      });

      // Catch sections already on screen after layout / pin refresh
      const check = () => {
        const top = root.getBoundingClientRect().top;
        if (top < window.innerHeight * 0.9) play();
      };
      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
        check();
      });
      const t = window.setTimeout(() => {
        ScrollTrigger.refresh();
        check();
      }, 700);

      return () => window.clearTimeout(t);
    },
    { scope: rootRef },
  );

  return (
    <div ref={rootRef} className={className}>
      {children}
    </div>
  );
}
