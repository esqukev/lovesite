"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import confetti from "canvas-confetti";
import { Check, Plus, Trash2 } from "lucide-react";
import { WISHLIST } from "@/lib/data";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useExperience } from "./ExperienceProvider";

type Item = { id: string; label: string; custom?: boolean };

const CHECKED_KEY = "motzy-wishlist-checked";
const CUSTOM_KEY = "motzy-wishlist-custom";

export function Wishlist() {
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

  useEffect(() => {
    if (allDone && !celebrated && items.length > 0) {
      setCelebrated(true);
      confetti({
        particleCount: 140,
        spread: 76,
        origin: { y: 0.65 },
        colors: ["#e8b4b8", "#c4a574", "#f3ebe3", "#ffffff"],
      });
      pushToast("Quest completada", "Todas las aventuras marcadas");
    }
  }, [allDone, celebrated, items.length, pushToast]);

  const toggle = (id: string) => {
    setChecked((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      if (!prev[id]) pushToast("Quest marcada", "+ amor compartido");
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
    pushToast("Nueva quest", label);
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
    <section id="quests" className="relative px-6 py-28">
      <div className="mx-auto max-w-3xl">
        <div className="mb-10 text-center">
          <p className="mb-3 text-xs uppercase tracking-[0.35em] text-[var(--gold)]">
            Quest log
          </p>
          <h2
            data-cinema="title"
            className="font-display text-4xl text-[var(--cream)] sm:text-5xl"
          >
            Cosas que quiero vivir contigo
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-white/55">
            Márcalas cuando las vivamos. Motzy también puede añadir las suyas —
            quedan guardadas en este dispositivo.
          </p>
          <p className="mt-3 text-xs uppercase tracking-[0.22em] text-white/35">
            {doneCount}/{items.length} completadas
          </p>
        </div>

        <div className="game-panel mb-5 p-3 sm:p-4">
          <form
            onSubmit={addItem}
            className="flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Motzy, escribe algo que quieras hacer..."
              maxLength={80}
              className="h-12 flex-1 rounded-2xl border border-white/12 bg-black/30 px-4 text-sm text-[var(--cream)] outline-none placeholder:text-white/30 focus:border-[var(--accent)]/50"
            />
            <Button type="submit" className="h-12 shrink-0">
              <Plus size={16} />
              Añadir
            </Button>
          </form>
        </div>

        <ul className="space-y-3">
          {items.map((item) => {
            const on = !!checked[item.id];
            return (
              <li key={item.id} className="flex items-stretch gap-2">
                <button
                  type="button"
                  data-cursor="hover"
                  onClick={() => toggle(item.id)}
                  className={cn(
                    "game-panel flex min-h-[56px] flex-1 items-center gap-4 px-4 py-3.5 text-left transition-all duration-300 active:scale-[0.99]",
                    on && "border-[var(--accent)]/45 bg-[var(--accent)]/10",
                  )}
                >
                  <span
                    className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-all",
                      on
                        ? "border-[var(--accent)] bg-[var(--accent)] text-[var(--ink)]"
                        : "border-white/20 text-transparent",
                    )}
                  >
                    <Check size={14} />
                  </span>
                  <span
                    className={cn(
                      "font-display text-lg sm:text-xl",
                      on && "line-through opacity-65",
                    )}
                  >
                    {item.label}
                  </span>
                  {item.custom && (
                    <span className="ml-auto text-[10px] uppercase tracking-[0.2em] text-[var(--gold)]">
                      Motzy
                    </span>
                  )}
                </button>
                {item.custom && (
                  <button
                    type="button"
                    aria-label="Eliminar"
                    onClick={() => removeCustom(item.id)}
                    className="game-panel flex w-12 items-center justify-center text-white/45 transition hover:text-[var(--accent)]"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </li>
            );
          })}
        </ul>

        {allDone && (
          <p className="mt-8 text-center font-display text-xl text-[var(--accent)]">
            Lo vivimos todo… y aún así quiero seguir creando más contigo.
          </p>
        )}
      </div>
    </section>
  );
}
