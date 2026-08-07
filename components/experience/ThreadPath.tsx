"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/** MindMarket-style scroll-drawn thread that guides the page */
export function ThreadPath() {
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const main = rootRef.current?.querySelector<SVGPathElement>(".thread-main");
      const soft = rootRef.current?.querySelector<SVGPathElement>(".thread-soft");
      if (!main || !soft) return;

      const len = main.getTotalLength();
      gsap.set([main, soft], {
        strokeDasharray: len,
        strokeDashoffset: len,
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top 10%",
          end: "bottom bottom",
          scrub: 1.1,
        },
      });

      tl.to(main, { strokeDashoffset: 0, ease: "none", duration: 1 }, 0).to(
        soft,
        { strokeDashoffset: 0, ease: "none", duration: 1 },
        0.05,
      );
    },
    { scope: rootRef },
  );

  return (
    <div
      ref={rootRef}
      className="pointer-events-none absolute inset-x-0 top-0 z-[2] h-full"
      aria-hidden
    >
      <svg
        className="sticky top-0 h-[220vh] w-full"
        viewBox="0 0 100 2200"
        preserveAspectRatio="none"
        fill="none"
      >
        <path
          className="thread-soft"
          d="M48 40 C70 180, 25 320, 55 480 S20 700, 60 880 S30 1100, 52 1280 S75 1500, 40 1680 S65 1900, 50 2100"
          stroke="rgba(232,180,184,0.22)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          className="thread-main"
          d="M48 40 C70 180, 25 320, 55 480 S20 700, 60 880 S30 1100, 52 1280 S75 1500, 40 1680 S65 1900, 50 2100"
          stroke="#e8b4b8"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
