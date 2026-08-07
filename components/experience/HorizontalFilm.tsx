"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { GALLERY_IMAGES } from "@/lib/data";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/** Horizontal scrub filmstrip — strong scroll interaction */
export function HorizontalFilm() {
  const rootRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      const track = trackRef.current;
      if (!root || !track) return;

      const amount = () => Math.max(0, track.scrollWidth - window.innerWidth + 48);

      gsap.to(track, {
        x: () => -amount(),
        ease: "none",
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: () => `+=${amount()}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });
    },
    { scope: rootRef },
  );

  return (
    <section ref={rootRef} className="relative overflow-hidden bg-[#0a0807]">
      <div className="px-6 pb-4 pt-16">
        <p className="text-xs uppercase tracking-[0.35em] text-[var(--gold)]">
          Scroll horizontal
        </p>
        <h2 className="mt-2 font-display text-4xl text-[var(--cream)] sm:text-5xl">
          Un paseo por nosotros
        </h2>
      </div>
      <div
        ref={trackRef}
        className="flex w-max gap-4 px-6 pb-20 pt-8 will-change-transform"
      >
        {GALLERY_IMAGES.map((img) => (
          <div
            key={img.src}
            className="relative h-[55vh] w-[70vw] max-w-[420px] shrink-0 overflow-hidden rounded-[1.5rem] border border-white/10 sm:h-[60vh] sm:w-[38vw]"
          >
            <Image
              src={img.src}
              alt=""
              fill
              className="object-cover"
              sizes="40vw"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
