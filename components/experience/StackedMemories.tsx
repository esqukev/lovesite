"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MEMORIES } from "@/lib/data";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/** MindMarket-inspired stacked cards on scroll */
export function StackedMemories() {
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const cards = gsap.utils.toArray<HTMLElement>(".stack-card");
      cards.forEach((card, i) => {
        const isLast = i === cards.length - 1;
        ScrollTrigger.create({
          trigger: card,
          start: "top 18%",
          end: isLast ? "+=40%" : "top top",
          endTrigger: isLast ? card : cards[i + 1],
          pin: true,
          pinSpacing: false,
          scrub: true,
          onUpdate: (self) => {
            if (isLast) return;
            const p = self.progress;
            gsap.set(card, {
              scale: 1 - p * 0.08,
              y: -p * 28,
              filter: `brightness(${1 - p * 0.25})`,
            });
          },
        });
      });
    },
    { scope: rootRef },
  );

  return (
    <section ref={rootRef} id="recuerdos" className="relative px-4 py-24 sm:px-6">
      <div className="mx-auto mb-14 max-w-3xl text-center">
        <p className="mb-3 text-xs uppercase tracking-[0.35em] text-[var(--gold)]">
          Capítulo · Recuerdos
        </p>
        <h2 className="font-display text-4xl text-[var(--cream)] sm:text-6xl">
          Pedacitos de nosotros
        </h2>
      </div>

      <div className="relative mx-auto max-w-2xl space-y-[70vh] pb-[30vh]">
        {MEMORIES.map((memory, index) => (
          <article
            key={memory.id}
            className="stack-card game-panel overflow-hidden will-change-transform"
          >
            <div className="relative aspect-[16/10] w-full">
              <Image
                src={memory.image}
                alt={memory.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 640px"
                priority={index < 2}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-7">
                <p className="text-[10px] uppercase tracking-[0.28em] text-[var(--gold)]">
                  {memory.date}
                </p>
                <h3 className="mt-1 font-display text-3xl text-[var(--cream)] sm:text-4xl">
                  {memory.title}
                </h3>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/75 sm:text-base">
                  {memory.description}
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
