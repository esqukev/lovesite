"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MEMORIES } from "@/lib/data";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export function Memories() {
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.utils.toArray<HTMLElement>(".memory-card").forEach((card, i) => {
        gsap.from(card, {
          opacity: 0,
          y: 60,
          x: i % 2 === 0 ? -40 : 40,
          rotate: i % 2 === 0 ? -1.5 : 1.5,
          duration: 1.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
          },
        });
      });
    },
    { scope: rootRef },
  );

  return (
    <section ref={rootRef} id="recuerdos" className="relative px-6 py-28">
      <div className="mx-auto max-w-5xl">
        <div className="mb-16 max-w-xl">
          <p className="mb-3 text-xs uppercase tracking-[0.35em] text-[var(--gold)]">
            Recuerdos
          </p>
          <h2 className="font-display text-4xl text-[var(--cream)] sm:text-5xl">
            Pedacitos de nosotros
          </h2>
          <p className="mt-4 text-white/55">
            Momentos que merecen quedarse. No por lo grandes que fueron, sino
            por cómo nos hicieron sentir.
          </p>
        </div>

        <div className="relative space-y-10 before:absolute before:left-4 before:top-0 before:h-full before:w-px before:bg-gradient-to-b before:from-transparent before:via-white/15 before:to-transparent sm:before:left-1/2">
          {MEMORIES.map((memory, index) => (
            <article
              key={memory.id}
              className={`memory-card relative grid items-center gap-6 sm:grid-cols-2 ${
                index % 2 === 1 ? "sm:[&>*:first-child]:order-2" : ""
              }`}
            >
              <div className="relative ml-10 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] sm:ml-0">
                <div className="relative aspect-[4/3]">
                  <Image
                    src={memory.image}
                    alt={memory.title}
                    fill
                    className="object-cover transition-transform duration-700 hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 40vw"
                  />
                </div>
              </div>
              <div className="ml-10 sm:ml-0 sm:px-6">
                <div className="absolute left-2.5 top-8 h-3 w-3 rounded-full bg-[var(--accent)] shadow-[0_0_20px_rgba(232,180,184,0.8)] sm:left-1/2 sm:-translate-x-1/2" />
                <p className="text-xs uppercase tracking-[0.25em] text-[var(--gold)]">
                  {memory.date}
                </p>
                <h3 className="mt-2 font-display text-3xl text-[var(--cream)]">
                  {memory.title}
                </h3>
                <p className="mt-3 max-w-md text-white/60 leading-relaxed">
                  {memory.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
