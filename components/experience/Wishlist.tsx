"use client";

import { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import { Check } from "lucide-react";
import { WISHLIST } from "@/lib/data";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "motzy-wishlist";

export function Wishlist() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [celebrated, setCelebrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setChecked(JSON.parse(raw) as Record<string, boolean>);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    if (Object.keys(checked).length === 0) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(checked));
  }, [checked]);

  const completed = WISHLIST.every((item) => checked[item.id]);

  useEffect(() => {
    if (completed && !celebrated) {
      setCelebrated(true);
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.65 },
        colors: ["#e8b4b8", "#c4a574", "#f3ebe3", "#ffffff"],
      });
    }
  }, [completed, celebrated]);

  const toggle = (id: string) => {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <section id="sueves" className="relative px-6 py-28">
      <div className="mx-auto max-w-3xl">
        <div className="mb-12 text-center">
          <p className="mb-3 text-xs uppercase tracking-[0.35em] text-[var(--gold)]">
            Por vivir
          </p>
          <h2 data-cinema="title" className="font-display text-4xl text-[var(--cream)] sm:text-5xl">
            Cosas que quiero vivir contigo
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-white/55">
            Una lista viva. Márcalas cuando las hagamos realidad.
          </p>
        </div>

        <ul className="space-y-3">
          {WISHLIST.map((item) => {
            const on = !!checked[item.id];
            return (
              <li key={item.id}>
                <button
                  type="button"
                  data-cursor="hover"
                  onClick={() => toggle(item.id)}
                  className={cn(
                    "flex w-full items-center gap-4 rounded-2xl border px-5 py-4 text-left transition-all duration-300",
                    on
                      ? "border-[var(--accent)]/40 bg-[var(--accent)]/10"
                      : "border-white/10 bg-white/[0.03] hover:bg-white/[0.06]",
                  )}
                >
                  <span
                    className={cn(
                      "flex h-7 w-7 items-center justify-center rounded-full border transition-all",
                      on
                        ? "border-[var(--accent)] bg-[var(--accent)] text-[var(--ink)]"
                        : "border-white/20 text-transparent",
                    )}
                  >
                    <Check size={14} />
                  </span>
                  <span
                    className={cn(
                      "font-display text-xl transition-all",
                      on ? "text-[var(--cream)] line-through opacity-70" : "text-[var(--cream)]",
                    )}
                  >
                    {item.label}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        {completed && (
          <p className="mt-8 text-center font-display text-xl text-[var(--accent)]">
            Lo vivimos todo… y aún así quiero seguir creando más contigo.
          </p>
        )}
      </div>
    </section>
  );
}
