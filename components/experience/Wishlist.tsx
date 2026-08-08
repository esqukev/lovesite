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
import { SectionPolaroid } from "./SectionPolaroid";
import { SectionReveal } from "./SectionReveal";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type Item = { id: string; label: string; custom?: boolean };

const CHECKED_KEY = "motzy-wishlist-checked-v2";
const CUSTOM_KEY = "motzy-wishlist-custom-v2";

function readStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function Wishlist() {
  const rootRef = useRef<HTMLElement>(null);
  const { pushToast } = useExperience();
  const [custom, setCustom] = useState<Item[]>([]);
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [draft, setDraft] = useState("");
  const [celebrated, setCelebrated] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const loadedChecked = readStorage<Record<string, boolean>>(CHECKED_KEY, {});
    const loadedCustom = readStorage<Item[]>(CUSTOM_KEY, []);
    // migrate from old keys if present
    if (!localStorage.getItem(CHECKED_KEY)) {
      const old = readStorage<Record<string, boolean>>("motzy-wishlist-checked", {});
      Object.assign(loadedChecked, old);
    }
    if (!localStorage.getItem(CUSTOM_KEY)) {
      const old = readStorage<Item[]>("motzy-wishlist-custom", []);
      loadedCustom.push(...old);
    }
    setChecked(loadedChecked);
    setCustom(loadedCustom);
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
      if (!ready) return;
      gsap.from(".wish-row", {
        opacity: 0,
        y: 22,
        stagger: 0.06,
        duration: 0.65,
        ease: "power3.out",
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top 72%",
        },
      });
    },
    { scope: rootRef, dependencies: [ready, items.length] },
  );

  useEffect(() => {
    if (allDone && !celebrated && items.length > 0 && ready) {
      setCelebrated(true);
      confetti({
        particleCount: 140,
        spread: 76,
        origin: { y: 0.65 },
        colors: ["#c86b78", "#9d6b45", "#fff7f5", "#2a1c22"],
      });
      pushToast("Lista completa", "Todo lo que queríamos… y aún falta más");
    }
  }, [allDone, celebrated, items.length, pushToast, ready]);

  const toggle = (id: string) => {
    setChecked((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      if (!prev[id]) pushToast("Hecho", "Guardado aquí");
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
    pushToast("Añadido y guardado", label);
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
    <section
      ref={rootRef}
      id="cosas-por-hacer"
      className="section-soft relative px-5 py-20 sm:px-8 sm:py-24"
    >
      <SectionPolaroid
        src="/foto12.jpeg"
        className="right-[3%] top-16 hidden w-16 sm:block sm:w-20"
        rotate="-8deg"
      />
      <SectionPolaroid
        src="/foto7.jpeg"
        className="bottom-10 left-[3%] hidden w-14 md:block"
        rotate="7deg"
      />
      <div className="relative z-10 mx-auto max-w-2xl">
        <SectionReveal className="mb-10 text-center">
          <p
            data-reveal
            className="mb-3 text-xs uppercase tracking-[0.35em] text-[var(--gold)]"
          >
            Cosas por hacer
          </p>
          <h2
            data-reveal
            className="font-display text-4xl text-[var(--ink)] sm:text-5xl"
          >
            Lo que todavía nos falta
          </h2>
          <p data-reveal className="muted mx-auto mt-4 max-w-md">
            Márcalo cuando lo vivamos. Lo que añadas o marques se guarda en este
            dispositivo y sigue ahí la próxima vez.
          </p>
          <p
            data-reveal
            className="mt-5 font-display text-lg italic text-[var(--accent)]"
          >
            {ready ? `${doneCount} de ${items.length}` : "…"}
          </p>
        </SectionReveal>

        <form
          onSubmit={addItem}
          className="wish-row mb-8 flex flex-col gap-3 border-b border-[var(--line)] pb-8 sm:flex-row sm:items-end"
        >
          <label className="flex-1">
            <span className="mb-2 block text-[10px] uppercase tracking-[0.28em] text-[var(--ink)]/40">
              Añadir algo
            </span>
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Ej. Ver el atardecer en…"
              maxLength={80}
              className="h-12 w-full border-0 border-b border-[var(--ink)]/20 bg-transparent px-0 text-[var(--ink)] outline-none placeholder:text-[var(--ink)]/30 focus:border-[var(--accent)]"
            />
          </label>
          <button
            type="submit"
            data-cursor="hover"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[var(--ink)] px-5 text-sm text-[var(--cream)] transition hover:bg-[var(--accent)]"
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
                    "group flex min-h-[56px] flex-1 items-center gap-4 px-1 py-3.5 text-left",
                    on && "opacity-50",
                  )}
                >
                  <span
                    className={cn(
                      "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 transition-all",
                      on
                        ? "border-[var(--accent)] bg-[var(--accent)] text-white"
                        : "border-[var(--ink)]/25 text-transparent group-hover:border-[var(--accent)]",
                    )}
                  >
                    <Check size={13} strokeWidth={3} />
                  </span>
                  <span className="flex min-w-0 flex-1 items-baseline gap-3">
                    <span className="hidden text-[10px] tabular-nums text-[var(--ink)]/30 sm:inline">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={cn(
                        "font-display text-xl leading-snug text-[var(--ink)] sm:text-2xl",
                        on && "line-through decoration-[var(--ink)]/30",
                      )}
                    >
                      {item.label}
                    </span>
                  </span>
                  {item.custom && (
                    <span className="shrink-0 font-display text-sm italic text-[var(--gold)]">
                      Motzy
                    </span>
                  )}
                </button>
                {item.custom && (
                  <button
                    type="button"
                    aria-label="Eliminar"
                    onClick={() => removeCustom(item.id)}
                    className="flex w-10 items-center justify-center text-[var(--ink)]/30 transition hover:text-[var(--accent)]"
                  >
                    <Trash2 size={15} />
                  </button>
                )}
              </li>
            );
          })}
        </ul>

        {allDone && (
          <p className="mt-10 text-center font-display text-xl italic text-[var(--accent)]">
            Lo vivimos todo… y aún quiero inventar más contigo.
          </p>
        )}
      </div>
    </section>
  );
}
