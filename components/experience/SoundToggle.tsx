"use client";

import { Volume2, VolumeX } from "lucide-react";
import { useExperience } from "./ExperienceProvider";
import { softClick } from "@/lib/sounds";

export function SoundToggle() {
  const { soundEnabled, setSoundEnabled } = useExperience();

  return (
    <button
      type="button"
      data-cursor="hover"
      onClick={() => {
        const next = !soundEnabled;
        setSoundEnabled(next);
        if (next) softClick();
      }}
      className="fixed bottom-5 right-5 z-[75] flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-black/50 text-white/80 backdrop-blur-md transition hover:bg-black/70"
      aria-label={soundEnabled ? "Silenciar" : "Activar sonidos"}
      title="Sonidos sutiles (apagados por defecto)"
    >
      {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
    </button>
  );
}
