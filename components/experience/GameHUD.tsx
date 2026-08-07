"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useExperience } from "./ExperienceProvider";
import { EASTER_EGG_IDS } from "@/lib/data";
import { Heart, Sparkles, Star } from "lucide-react";

const ZONES = [
  { id: "recuerdos", label: "Recuerdos", at: 0.12 },
  { id: "galeria", label: "Galería", at: 0.28 },
  { id: "mapa", label: "Mapa", at: 0.48 },
  { id: "razones", label: "Razones", at: 0.62 },
  { id: "quests", label: "Quests", at: 0.74 },
  { id: "countdown", label: "Timer", at: 0.86 },
];

export function GameHUD({ active }: { active: boolean }) {
  const [progress, setProgress] = useState(0);
  const { eggsFound, allEggsFound, score, collectibles, toasts } =
    useExperience();
  const secrets = eggsFound.size;
  const love = Math.round((secrets / EASTER_EGG_IDS.length) * 100);

  const zone =
    [...ZONES].reverse().find((z) => progress >= z.at)?.label ?? "Inicio";

  useEffect(() => {
    if (!active) return;
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [active]);

  if (!active) return null;

  return (
    <>
      <div className="pointer-events-none fixed inset-x-0 top-0 z-[55] px-3 pt-3 sm:px-4">
        <div className="game-panel mx-auto flex max-w-5xl items-center gap-3 px-3 py-2.5 sm:gap-4 sm:px-4">
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <p className="truncate text-[10px] uppercase tracking-[0.28em] text-[var(--gold)]">
                Zona · {zone}
              </p>
              <p className="shrink-0 text-[10px] tabular-nums text-white/50">
                XP {score}
              </p>
            </div>
            <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[var(--accent)] via-[#f0c4c7] to-[var(--gold)] transition-[width] duration-200"
                style={{ width: `${progress * 100}%` }}
              />
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <StatChip icon={<Heart size={12} />} label={`${love}%`} />
            <StatChip icon={<Sparkles size={12} />} label={`${secrets}`} />
            <StatChip icon={<Star size={12} />} label={`${collectibles}`} />
          </div>
        </div>

        {allEggsFound && (
          <p className="mx-auto mt-2 max-w-5xl text-center text-[10px] uppercase tracking-[0.25em] text-[var(--gold)]">
            Insignia secreta desbloqueada
          </p>
        )}
      </div>

      <div className="pointer-events-none fixed bottom-24 right-3 z-[70] flex w-[min(86vw,260px)] flex-col gap-2 sm:bottom-8 sm:right-5">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 40, scale: 0.94 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 30, scale: 0.96 }}
              className="game-panel px-3 py-2.5 shadow-[0_12px_40px_rgba(0,0,0,0.45)]"
            >
              <p className="text-xs font-medium text-[var(--cream)]">
                {toast.title}
              </p>
              {toast.detail && (
                <p className="mt-0.5 text-[11px] text-white/55">{toast.detail}</p>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </>
  );
}

function StatChip({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <div className="flex items-center gap-1 rounded-full border border-white/10 bg-black/35 px-2 py-1 text-[10px] text-white/75">
      <span className="text-[var(--accent)]">{icon}</span>
      <span className="tabular-nums">{label}</span>
    </div>
  );
}
