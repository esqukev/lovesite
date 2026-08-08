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
      const items = root.querySelectorAll<HTMLElement>("[data-reveal]");
      if (!items.length) return;

      gsap.from(items, {
        y: 40,
        opacity: 0,
        filter: "blur(6px)",
        duration: 0.9,
        stagger: 0.11,
        delay,
        ease: "power3.out",
        scrollTrigger: {
          trigger: root,
          start: "top 80%",
          once: true,
        },
      });
    },
    { scope: rootRef },
  );

  return (
    <div ref={rootRef} className={className}>
      {children}
    </div>
  );
}
