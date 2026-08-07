"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ReactiveWord } from "./AmbientEffects";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export function VideoMoment() {
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.from(".video-frame", {
        opacity: 0,
        scale: 0.94,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top 75%",
        },
      });
    },
    { scope: rootRef },
  );

  return (
    <section ref={rootRef} className="relative px-6 py-24">
      <div className="mx-auto max-w-4xl text-center">
        <p className="mb-3 text-xs uppercase tracking-[0.35em] text-[var(--gold)]">
          Un instante
        </p>
        <h2 data-cinema="title" className="font-display text-4xl text-[var(--cream)] sm:text-5xl">
          Un pedacito en movimiento
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-white/55">
          Porque a veces un video guarda lo que una foto no alcanza a decir.{" "}
          <ReactiveWord>Gracias por existir.</ReactiveWord>
        </p>

        <div className="video-frame relative mx-auto mt-12 overflow-hidden rounded-[2rem] border border-white/10 bg-black shadow-[0_40px_100px_-40px_rgba(0,0,0,0.9)]">
          <video
            src="/video.mp4"
            controls
            playsInline
            className="aspect-video w-full object-cover"
            preload="metadata"
          />
        </div>
      </div>
    </section>
  );
}
