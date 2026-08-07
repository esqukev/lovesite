"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MEMORIES } from "@/lib/data";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/** Scroll-pinned memory chapters — text only, no photo cards */
export function StackedMemories() {
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;

      const panels = gsap.utils.toArray<HTMLElement>(".memory-panel", root);
      const progress = root.querySelector<HTMLElement>(".memory-progress-fill");
      const indexEl = root.querySelector<HTMLElement>(".memory-index");

      gsap.set(panels, { autoAlpha: 0, y: 36 });
      gsap.set(panels[0], { autoAlpha: 1, y: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: () => `+=${panels.length * 90}%`,
          pin: true,
          scrub: 0.85,
          anticipatePin: 1,
          onUpdate: (self) => {
            if (progress) gsap.set(progress, { scaleY: self.progress });
            const i = Math.min(
              panels.length - 1,
              Math.floor(self.progress * panels.length),
            );
            if (indexEl) {
              indexEl.textContent = String(i + 1).padStart(2, "0");
            }
          },
        },
      });

      panels.forEach((panel, i) => {
        if (i === 0) return;
        const prev = panels[i - 1];
        const at = i;
        tl.to(
          prev,
          { autoAlpha: 0, y: -28, duration: 0.45, ease: "power2.inOut" },
          at,
        );
        tl.fromTo(
          panel,
          { autoAlpha: 0, y: 36 },
          { autoAlpha: 1, y: 0, duration: 0.55, ease: "power2.out" },
          at + 0.05,
        );
      });
    },
    { scope: rootRef },
  );

  return (
    <section
      ref={rootRef}
      id="recuerdos"
      className="relative flex min-h-[100svh] items-center overflow-hidden px-5 py-24 sm:px-10"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[70vmax] w-[70vmax] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(232,180,184,0.08),transparent_62%)]" />
      </div>

      <div className="relative z-10 mx-auto grid w-full max-w-5xl gap-10 lg:grid-cols-[auto_1fr_auto] lg:items-center lg:gap-16">
        <div className="hidden flex-col items-center gap-4 lg:flex">
          <span className="memory-index font-display text-5xl tabular-nums text-[var(--cream)]/90">
            01
          </span>
          <div className="relative h-40 w-px overflow-hidden bg-white/10">
            <div
              className="memory-progress-fill absolute inset-x-0 top-0 h-full origin-top bg-[var(--accent)]"
              style={{ transform: "scaleY(0)" }}
            />
          </div>
          <span className="text-[10px] uppercase tracking-[0.3em] text-white/35">
            {String(MEMORIES.length).padStart(2, "0")}
          </span>
        </div>

        <div className="relative min-h-[320px] sm:min-h-[380px]">
          <p className="mb-4 text-xs uppercase tracking-[0.35em] text-[var(--gold)]">
            Pedacitos de nosotros
          </p>

          {MEMORIES.map((memory, i) => (
            <article
              key={memory.id}
              className="memory-panel absolute inset-0 flex flex-col justify-center"
              aria-hidden={i !== 0}
            >
              <p className="mb-3 font-display text-sm italic tracking-[0.08em] text-[var(--accent)] sm:text-base">
                {memory.date}
              </p>
              <h2 className="max-w-[14ch] font-display text-[clamp(2.4rem,7vw,4.5rem)] leading-[0.95] text-[var(--cream)]">
                {memory.title}
              </h2>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-white/60 sm:text-lg">
                {memory.description}
              </p>
              <p className="mt-8 text-[11px] uppercase tracking-[0.28em] text-white/30 lg:hidden">
                {String(i + 1).padStart(2, "0")} /{" "}
                {String(MEMORIES.length).padStart(2, "0")}
              </p>
            </article>
          ))}
        </div>

        <p className="hidden max-w-[10ch] text-right text-xs leading-relaxed tracking-[0.08em] text-white/30 lg:block">
          Baja despacio. Cada pedacito aparece a su tiempo.
        </p>
      </div>
    </section>
  );
}
