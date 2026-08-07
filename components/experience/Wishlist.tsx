"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import confetti from "canvas-confetti";
import { Check, Plus, Trash2 } from "lucide-react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { WISHLIST } from "@/lib/data";
import { cn } from "@/lib/utils";
import { useExperience } from "./ExperienceProvider";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type Item = { id: string; label: string; custom?: boolean };

const CHECKED_KEY = "motzy-wishlist-checked";
const CUSTOM_KEY = "motzy-wishlist-custom";

export function Wishlist() {
  const rootRef = useRef<HTMLElement>(null);
  const { pushToast } = useExperience();
  const [custom, setCustom] = useState<Item[]>([]);
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [draft, setDraft] = useState("");
  const [celebrated, setCelebrated] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const checkedRaw = localStorage.getItem(CHECKED_KEY);
      const customRaw = localStorage.getItem(CUSTOM_KEY);
      if (checkedRaw) setChecked(JSON.parse(checkedRaw) as Record<string, boolean>);
      if (customRaw) setCustom(JSON.parse(customRaw) as Item[]);
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(CHECKED_KEY, JSON.stringify(checked));
  }, [checked, ready]);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(CUSTOM_KEY, JSON.stringify(custom));
  }, [custom, ready]);

  const items = useMemo(
    () => [...WISHLIST.map((i) => ({ ...i, custom: false })), ...custom],
    [custom],
  );

  const doneCount = items.filter((i) => checked[i.id]).length;
  const allDone = items.length > 0 && doneCount === items.length;

  useGSAP(
    () => {
      gsap.from(".wish-row", {
        opacity: 0,
        y: 28,
        stagger: 0.08,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top 70%",
        },
      });
    },
    { scope: rootRef, dependencies: [ready, items.length] },
  );

  useEffect(() => {
    if (allDone && !celebrated && items.length > 0) {
      setCelebrated(true);
      confetti({
        particleCount: 140,
        spread: 76,
        origin: { y: 0.65 },
        colors: ["#e8b4b8", "#c4a574", "#f3ebe3", "#ffffff"],
      });
      pushToast("Lista completa", "Todo lo que queríamos… y aún falta más");
    }
  }, [allDone, celebrated, items.length, pushToast]);

  const toggle = (id: string) => {
    setChecked((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      if (!prev[id]) pushToast("Hecho", "Una más juntos");
      return next;
    });
  };

  const addItem = (e: FormEvent) => {
    e.preventDefault();
    const label = draft.trim();
    if (!label) return;
    const item: Item = {
      id: `custom-${Date.now()}`,
      label,
      custom: true,
    };
    setCustom((prev) => [...prev, item]);
    setDraft("");
    pushToast("Añadido", label);
  };

  const removeCustom = (id: string) => {
    setCustom((prev) => prev.filter((i) => i.id !== id));
    setChecked((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  return (
    <section ref={rootRef} id="cosas-por-hacer" className="relative px-6 py-28">
      <div className="mx-auto max-w-2xl">
        <div className="mb-12 text-center">
          <p className="mb-3 text-xs uppercase tracking-[0.35em] text-[var(--gold)]">
            Cosas por hacer
          </p>
          <h2
            data-cinema="title"
            className="font-display text-4xl text-[var(--cream)] sm:text-5xl"
          >
            Lo que todavía nos falta
          </h2>
          <p className="mx-auto mt-4 max-w-md text-white/50">
            Márcalo cuando lo vivamos. Tú también puedes escribir lo tuyo —
            se guarda aquí.
          </p>
          <p className="mt-5 font-letter text-xl text-[var(--accent)]/80">
            {doneCount} de {items.length}
          </p>
        </div>

        <form
          onSubmit={addItem}
          className="wish-row mb-8 flex flex-col gap-3 border-b border-white/10 pb-8 sm:flex-row sm:items-end"
        >
          <label className="flex-1">
            <span className="mb-2 block text-[10px] uppercase tracking-[0.28em] text-white/35">
              Añadir algo
            </span>
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Ej. Ver el atardecer en…"
              maxLength={80}
              className="h-12 w-full border-0 border-b border-white/20 bg-transparent px-0 text-[var(--cream)] outline-none placeholder:text-white/25 focus:border-[var(--accent)]"
            />
          </label>
          <button
            type="submit"
            data-cursor="hover"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/15 px-5 text-sm text-[var(--cream)] transition hover:border-[var(--accent)]/50 hover:bg-white/5"
          >
            <Plus size={16} />
            Añadir
          </button>
        </form>

        <ul className="space-y-1">
          {items.map((item, i) => {
            const on = !!checked[item.id];
            return (
              <li key={item.id} className="wish-row flex items-stretch gap-2">
                <button
                  type="button"
                  data-cursor="hover"
                  onClick={() => toggle(item.id)}
                  className={cn(
                    "group flex min-h-[56px] flex-1 items-center gap-4 px-1 py-3.5 text-left transition-colors",
                    on && "opacity-55",
                  )}
                >
                  <span
                    className={cn(
                      "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-all",
                      on
                        ? "border-[var(--accent)] bg-[var(--accent)] text-[var(--ink)]"
                        : "border-white/25 text-transparent group-hover:border-[var(--accent)]/60",
                    )}
                  >
                    <Check size={13} />
                  </span>
                  <span className="flex min-w-0 flex-1 items-baseline gap-3">
                    <span className="hidden text-[10px] tabular-nums text-white/25 sm:inline">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={cn(
                        "font-display text-xl leading-snug sm:text-2xl",
                        on && "line-through decoration-white/30",
                      )}
                    >
                      {item.label}
                    </span>
                  </span>
                  {item.custom && (
                    <span className="shrink-0 font-letter text-base text-[var(--gold)]">
                      Motzy
                    </span>
                  )}
                </button>
                {item.custom && (
                  <button
                    type="button"
                    aria-label="Eliminar"
                    onClick={() => removeCustom(item.id)}
                    className="flex w-10 items-center justify-center text-white/30 transition hover:text-[var(--accent)]"
                  >
                    <Trash2 size={15} />
                  </button>
                )}
              </li>
            );
          })}
        </ul>

        {allDone && (
          <p className="mt-10 text-center font-letter text-2xl text-[var(--accent)]">
            Lo vivimos todo… y aún quiero inventar más contigo.
          </p>
        )}
      </div>
    </section>
  );
}
