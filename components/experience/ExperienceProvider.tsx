"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { EasterEggId } from "@/lib/data";
import { EASTER_EGG_IDS } from "@/lib/data";

type Phase = "gate" | "welcome" | "main";

type ExperienceContextValue = {
  phase: Phase;
  setPhase: (phase: Phase) => void;
  eggsFound: Set<EasterEggId>;
  discoverEgg: (id: EasterEggId) => void;
  allEggsFound: boolean;
  inviteAccepted: boolean;
  setInviteAccepted: (v: boolean) => void;
  inviteOpen: boolean;
  setInviteOpen: (v: boolean) => void;
};

const ExperienceContext = createContext<ExperienceContextValue | null>(null);

export function ExperienceProvider({ children }: { children: ReactNode }) {
  const [phase, setPhase] = useState<Phase>("gate");
  const [eggsFound, setEggsFound] = useState<Set<EasterEggId>>(new Set());
  const [inviteAccepted, setInviteAccepted] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);

  const discoverEgg = useCallback((id: EasterEggId) => {
    setEggsFound((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }, []);

  const value = useMemo<ExperienceContextValue>(
    () => ({
      phase,
      setPhase,
      eggsFound,
      discoverEgg,
      allEggsFound: EASTER_EGG_IDS.every((id) => eggsFound.has(id)),
      inviteAccepted,
      setInviteAccepted,
      inviteOpen,
      setInviteOpen,
    }),
    [phase, eggsFound, discoverEgg, inviteAccepted, inviteOpen],
  );

  return (
    <ExperienceContext.Provider value={value}>
      {children}
    </ExperienceContext.Provider>
  );
}

export function useExperience() {
  const ctx = useContext(ExperienceContext);
  if (!ctx) throw new Error("useExperience must be used within provider");
  return ctx;
}
