"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { addMonths, differenceInMonths, intervalToDuration, setYear } from "date-fns";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SectionPolaroid } from "./SectionPolaroid";
import { SectionReveal } from "./SectionReveal";

gsap.registerPlugin(useGSAP, ScrollTrigger);

function nextJune23(from = new Date()) {
  const year = from.getFullYear();
  let target = setYear(new Date(year, 5, 23, 0, 0, 0, 0), year);
  if (target.getTime() <= from.getTime()) {
    target = setYear(target, year + 1);
  }
  return target;
}

function useCountdown(target: Date) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  return useMemo(() => {
    if (now >= target) {
      return { months: 0, days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    const months = Math.max(0, differenceInMonths(target, now));
    const restStart = addMonths(now, months);
    const duration = intervalToDuration({ start: restStart, end: target });

    return {
      months,
      days: duration.days ?? 0,
      hours: duration.hours ?? 0,
      minutes: duration.minutes ?? 0,
      seconds: duration.seconds ?? 0,
    };
  }, [now, target]);
}

const UNITS = [
  { key: "months", label: "meses" },
  { key: "days", label: "días" },
  { key: "hours", label: "horas" },
  { key: "minutes", label: "min" },
  { key: "seconds", label: "seg" },
] as const;

function FloatingDigit({
  value,
  label,
}: {
  value: number;
  label: string;
}) {
  const numRef = useRef<HTMLSpanElement>(null);
  const prev = useRef(value);

  useEffect(() => {
    const el = numRef.current;
    if (!el || prev.current === value) return;
    gsap.fromTo(
      el,
      { y: 18, opacity: 0.35, filter: "blur(4px)" },
      { y: 0, opacity: 1, filter: "blur(0px)", duration: 0.45, ease: "power3.out" },
    );
    prev.current = value;
  }, [value]);

  return (
    <div className="count-float flex flex-col items-center px-2 sm:px-4">
      <span
        ref={numRef}
        className="font-display text-[clamp(2.8rem,8vw,5.5rem)] leading-none tabular-nums tracking-[-0.04em] text-[var(--ink)]"
      >
        {String(value).padStart(2, "0")}
      </span>
      <span className="mt-2 text-[10px] uppercase tracking-[0.28em] text-[var(--ink)]/40">
        {label}
      </span>
    </div>
  );
}

export function Countdown() {
  const rootRef = useRef<HTMLElement>(null);
  const target = useMemo(() => nextJune23(), []);
  const values = useCountdown(target);

  useGSAP(
    () => {
      gsap.from(".count-float", {
        y: 40,
        opacity: 0,
        stagger: 0.08,
        duration: 0.9,
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
    <section
      ref={rootRef}
      id="countdown"
      className="section-soft relative px-5 py-20 sm:px-8 sm:py-24"
    >
      <SectionPolaroid
        src="/foto5.jpeg"
        className="left-[4%] top-20 hidden w-16 sm:block sm:w-[4.5rem]"
        rotate="-6deg"
      />
      <SectionPolaroid
        src="/foto16.jpeg"
        className="right-[4%] bottom-16 hidden w-16 md:block"
        rotate="8deg"
      />
      <div className="relative z-10 mx-auto max-w-5xl text-center">
        <SectionReveal>
          <p
            data-reveal
            className="mb-3 text-xs uppercase tracking-[0.35em] text-[var(--gold)]"
          >
            Contador
          </p>
          <h2
            data-reveal
            className="font-display text-4xl text-[var(--ink)] sm:text-5xl"
          >
            Próximo 23 de junio
          </h2>
          <p data-reveal className="muted mx-auto mt-4 max-w-lg">
            Un día marcado. El tiempo avanza… y yo solo quiero llegar ahí
            contigo.
          </p>
        </SectionReveal>

        <div className="mt-14 flex flex-wrap items-end justify-center gap-y-8">
          {UNITS.map((unit, i) => (
            <div key={unit.key} className="flex items-end">
              <FloatingDigit value={values[unit.key]} label={unit.label} />
              {i < UNITS.length - 1 && (
                <span
                  className="mb-8 hidden font-display text-3xl text-[var(--accent)]/50 sm:mb-10 sm:inline"
                  aria-hidden
                >
                  :
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
