"use client";

import { useEffect, useMemo, useState } from "react";
import { addMonths, differenceInMonths, intervalToDuration, setYear } from "date-fns";

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
  { key: "months", label: "Meses" },
  { key: "days", label: "Días" },
  { key: "hours", label: "Horas" },
  { key: "minutes", label: "Minutos" },
  { key: "seconds", label: "Segundos" },
] as const;

export function Countdown() {
  const target = useMemo(() => nextJune23(), []);
  const values = useCountdown(target);

  return (
    <section id="countdown" className="relative px-6 py-28">
      <div className="mx-auto max-w-5xl text-center">
        <p className="mb-3 text-xs uppercase tracking-[0.35em] text-[var(--gold)]">
          Contador
        </p>
        <h2 data-cinema="title" className="font-display text-4xl text-[var(--cream)] sm:text-5xl">
          Próximo 23 de junio
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-white/55">
          Un día marcado. El tiempo avanza… y yo solo quiero llegar ahí contigo.
        </p>

        <div className="mt-14 grid grid-cols-2 gap-3 sm:grid-cols-5">
          {UNITS.map((unit) => (
            <div
              key={unit.key}
              className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] px-4 py-6 backdrop-blur-md"
            >
              <div className="font-display text-4xl tabular-nums text-[var(--cream)] sm:text-5xl">
                {String(values[unit.key]).padStart(2, "0")}
              </div>
              <div className="mt-2 text-[10px] uppercase tracking-[0.25em] text-white/40">
                {unit.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
