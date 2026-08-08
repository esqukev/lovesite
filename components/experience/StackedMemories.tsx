"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MEMORIES } from "@/lib/data";

gsap.registerPlugin(useGSAP, ScrollTrigger);

function MiniCritter({
  kind,
  className,
}: {
  kind: "cat" | "frog" | "dog";
  className?: string;
}) {
  if (kind === "frog") {
    return (
      <svg viewBox="0 0 64 64" className={className} aria-hidden>
        <ellipse cx="32" cy="38" rx="18" ry="14" fill="currentColor" />
        <circle cx="20" cy="24" r="8" fill="currentColor" />
        <circle cx="44" cy="24" r="8" fill="currentColor" />
        <circle cx="20" cy="24" r="3.5" fill="#fff" />
        <circle cx="44" cy="24" r="3.5" fill="#fff" />
        <circle cx="21" cy="24" r="1.6" fill="#2a1c22" />
        <circle cx="45" cy="24" r="1.6" fill="#2a1c22" />
      </svg>
    );
  }
  if (kind === "dog") {
    return (
      <svg viewBox="0 0 64 64" className={className} aria-hidden>
        <ellipse cx="32" cy="36" rx="16" ry="14" fill="currentColor" />
        <path fill="currentColor" d="M16 28c-6-2-10 4-8 8l8-2M48 28c6-2 10 4 8 8l-8-2" />
        <circle cx="26" cy="34" r="2" fill="#2a1c22" />
        <circle cx="38" cy="34" r="2" fill="#2a1c22" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      <path
        fill="currentColor"
        d="M12 22c0-8 6-14 14-14 3 0 6 1 8 3 2-2 5-3 8-3 8 0 14 6 14 14v18c0 10-8 18-18 18H30C20 58 12 50 12 40V22z"
      />
      <path fill="#2a1c22" d="M18 10l6 10H14l4-10zm28 0l4 10H40l6-10z" />
      <circle cx="26" cy="30" r="2" fill="#2a1c22" />
      <circle cx="38" cy="30" r="2" fill="#2a1c22" />
    </svg>
  );
}

export function StackedMemories() {
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;

      const panels = gsap.utils.toArray<HTMLElement>(".memory-panel", root);
      const progress = root.querySelector<HTMLElement>(".memory-progress-fill");
      const indexEl = root.querySelector<HTMLElement>(".memory-index");
      const sidePhotos = gsap.utils.toArray<HTMLElement>(".memory-side-photo", root);

      gsap.set(panels, { autoAlpha: 0, y: 28, visibility: "hidden" });
      gsap.set(panels[0], { autoAlpha: 1, y: 0, visibility: "visible" });

      gsap.to(sidePhotos, {
        y: -30,
        rotate: 4,
        ease: "none",
        stagger: 0.05,
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "+=500%",
          scrub: true,
        },
      });

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
          {
            autoAlpha: 0,
            y: -24,
            visibility: "hidden",
            duration: 0.4,
            ease: "power2.inOut",
          },
          at,
        );
        tl.fromTo(
          panel,
          { autoAlpha: 0, y: 28, visibility: "hidden" },
          {
            autoAlpha: 1,
            y: 0,
            visibility: "visible",
            duration: 0.5,
            ease: "power2.out",
          },
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
      className="section-soft relative flex min-h-[100svh] items-center overflow-hidden px-5 py-16 sm:px-10"
    >
      {/* companions so the section doesn't feel empty */}
      <div className="pointer-events-none absolute inset-0 z-[1]" aria-hidden>
        <div className="memory-side-photo absolute right-[6%] top-[18%] hidden w-24 rotate-[8deg] sm:block lg:right-[10%] lg:w-28">
          <div className="overflow-hidden rounded-md bg-white p-1.5 shadow-[0_14px_32px_rgba(42,28,34,0.16)]">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-sm">
              <Image src="/foto2.jpeg" alt="" fill className="object-cover" sizes="120px" />
            </div>
          </div>
        </div>
        <div className="memory-side-photo absolute right-[4%] bottom-[20%] hidden w-20 rotate-[-7deg] sm:block lg:right-[8%] lg:w-24">
          <div className="overflow-hidden rounded-md bg-white p-1.5 shadow-[0_14px_32px_rgba(42,28,34,0.16)]">
            <div className="relative aspect-square w-full overflow-hidden rounded-sm">
              <Image src="/foto10.jpeg" alt="" fill className="object-cover" sizes="100px" />
            </div>
          </div>
        </div>
        <div className="memory-side-photo absolute left-[4%] bottom-[16%] hidden w-[4.5rem] rotate-[6deg] md:block">
          <div className="overflow-hidden rounded-md bg-white p-1 shadow-[0_12px_28px_rgba(42,28,34,0.14)]">
            <div className="relative aspect-square w-full overflow-hidden rounded-sm">
              <Image src="/foto6.jpeg" alt="" fill className="object-cover" sizes="80px" />
            </div>
          </div>
        </div>

        <MiniCritter
          kind="frog"
          className="absolute right-[22%] top-[28%] hidden h-10 w-10 text-[#7a9e6a] opacity-80 sm:block lg:right-[28%]"
        />
        <MiniCritter
          kind="cat"
          className="absolute right-[14%] top-[55%] hidden h-11 w-11 text-[var(--accent)] opacity-80 sm:block"
        />
        <MiniCritter
          kind="dog"
          className="absolute left-[8%] top-[30%] hidden h-10 w-10 text-[var(--gold)] opacity-75 md:block"
        />
        <MiniCritter
          kind="frog"
          className="absolute bottom-[28%] left-[12%] hidden h-9 w-9 text-[#7a9e6a] opacity-70 sm:block"
        />
      </div>

      <div className="relative z-10 mx-auto grid w-full max-w-5xl gap-10 lg:grid-cols-[auto_1fr_auto] lg:items-center lg:gap-16">
        <div className="hidden flex-col items-center gap-4 lg:flex">
          <span className="memory-index font-display text-5xl tabular-nums text-[var(--ink)]">
            01
          </span>
          <div className="relative h-40 w-px overflow-hidden bg-[var(--ink)]/10">
            <div
              className="memory-progress-fill absolute inset-x-0 top-0 h-full origin-top bg-[var(--accent)]"
              style={{ transform: "scaleY(0)" }}
            />
          </div>
          <span className="text-[10px] uppercase tracking-[0.3em] text-[var(--ink)]/35">
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
              style={{ visibility: i === 0 ? "visible" : "hidden" }}
              aria-hidden={i !== 0}
            >
              <p className="mb-3 font-display text-sm italic tracking-[0.08em] text-[var(--accent)] sm:text-base">
                {memory.date}
              </p>
              <h2 className="max-w-[14ch] font-display text-[clamp(2.4rem,7vw,4.5rem)] leading-[0.95] text-[var(--ink)]">
                {memory.title}
              </h2>
              <p className="muted mt-6 max-w-xl text-base leading-relaxed sm:text-lg">
                {memory.description}
              </p>
              <p className="mt-8 text-[11px] uppercase tracking-[0.28em] text-[var(--ink)]/30 lg:hidden">
                {String(i + 1).padStart(2, "0")} /{" "}
                {String(MEMORIES.length).padStart(2, "0")}
              </p>
            </article>
          ))}
        </div>

        <p className="muted hidden max-w-[10ch] text-right text-xs leading-relaxed tracking-[0.08em] lg:block">
          Baja despacio. Cada pedacito aparece a su tiempo.
        </p>
      </div>
    </section>
  );
}
