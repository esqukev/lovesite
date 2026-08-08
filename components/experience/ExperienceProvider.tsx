"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { EasterEggId, VisitorRole } from "@/lib/data";
import {
  EASTER_EGG_IDS,
  INVITE_ACCEPTED_KEY,
  OWNER_INVITE_SEEN_KEY,
  VISITOR_ROLE_KEY,
} from "@/lib/data";

type Phase = "gate" | "welcome" | "main";

export type Toast = {
  id: number;
  title: string;
  detail?: string;
};

type ExperienceContextValue = {
  phase: Phase;
  setPhase: (phase: Phase) => void;
  visitorRole: VisitorRole | null;
  setVisitorRole: (role: VisitorRole) => void;
  eggsFound: Set<EasterEggId>;
  discoverEgg: (
    id: EasterEggId,
    toast?: { title: string; detail?: string },
  ) => void;
  allEggsFound: boolean;
  score: number;
  collectibles: number;
  addCollectible: () => void;
  toasts: Toast[];
  pushToast: (title: string, detail?: string) => void;
  inviteAccepted: boolean;
  ownerInviteSeen: boolean;
  acceptInvite: () => void;
  markOwnerInviteSeen: () => void;
  inviteOpen: boolean;
  setInviteOpen: (v: boolean) => void;
  lightboxOpen: boolean;
  setLightboxOpen: (v: boolean) => void;
};

const ExperienceContext = createContext<ExperienceContextValue | null>(null);

export function ExperienceProvider({ children }: { children: ReactNode }) {
  const [phase, setPhase] = useState<Phase>("gate");
  const [visitorRole, setVisitorRoleState] = useState<VisitorRole | null>(null);
  const [eggsFound, setEggsFound] = useState<Set<EasterEggId>>(new Set());
  const [score, setScore] = useState(0);
  const [collectibles, setCollectibles] = useState(0);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [inviteAccepted, setInviteAccepted] = useState(false);
  const [ownerInviteSeen, setOwnerInviteSeen] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const toastSeq = useRef(0);

  useEffect(() => {
    try {
      if (localStorage.getItem(INVITE_ACCEPTED_KEY) === "1") {
        setInviteAccepted(true);
      }
      if (localStorage.getItem(OWNER_INVITE_SEEN_KEY) === "1") {
        setOwnerInviteSeen(true);
      }
      const saved = sessionStorage.getItem(VISITOR_ROLE_KEY);
      if (saved === "guest" || saved === "owner") {
        setVisitorRoleState(saved);
      }
    } catch {
      /* private mode */
    }
  }, []);

  const setVisitorRole = useCallback((role: VisitorRole) => {
    setVisitorRoleState(role);
    try {
      sessionStorage.setItem(VISITOR_ROLE_KEY, role);
    } catch {
      /* private mode */
    }
  }, []);

  const markOwnerInviteSeen = useCallback(() => {
    setOwnerInviteSeen(true);
    setInviteOpen(false);
    try {
      localStorage.setItem(OWNER_INVITE_SEEN_KEY, "1");
    } catch {
      /* private mode */
    }
  }, []);

  const acceptInvite = useCallback(() => {
    setInviteAccepted(true);
    setInviteOpen(false);
    try {
      localStorage.setItem(INVITE_ACCEPTED_KEY, "1");
      // Si Kevin acepta en prueba, también cuenta como "ya la vio"
      localStorage.setItem(OWNER_INVITE_SEEN_KEY, "1");
      setOwnerInviteSeen(true);
    } catch {
      /* private mode */
    }
  }, []);

  const pushToast = useCallback((title: string, detail?: string) => {
    toastSeq.current += 1;
    const id = toastSeq.current;
    setToasts((prev) => [...prev.slice(-3), { id, title, detail }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3400);
  }, []);

  const discoverEgg = useCallback(
    (id: EasterEggId, toast?: { title: string; detail?: string }) => {
      setEggsFound((prev) => {
        if (prev.has(id)) return prev;
        const next = new Set(prev);
        next.add(id);
        const size = next.size;
        queueMicrotask(() => {
          setScore((s) => s + 25);
          pushToast(
            toast?.title ?? "Secreto encontrado",
            toast?.detail ?? `+25 XP · ${size}/${EASTER_EGG_IDS.length}`,
          );
        });
        return next;
      });
    },
    [pushToast],
  );

  const addCollectible = useCallback(() => {
    setCollectibles((c) => c + 1);
    setScore((s) => s + 5);
    pushToast("Coleccionable", "+5 XP");
  }, [pushToast]);

  const value = useMemo<ExperienceContextValue>(
    () => ({
      phase,
      setPhase,
      visitorRole,
      setVisitorRole,
      eggsFound,
      discoverEgg,
      allEggsFound: EASTER_EGG_IDS.every((id) => eggsFound.has(id)),
      score,
      collectibles,
      addCollectible,
      toasts,
      pushToast,
      inviteAccepted,
      ownerInviteSeen,
      acceptInvite,
      markOwnerInviteSeen,
      inviteOpen,
      setInviteOpen,
      lightboxOpen,
      setLightboxOpen,
    }),
    [
      phase,
      visitorRole,
      setVisitorRole,
      eggsFound,
      discoverEgg,
      score,
      collectibles,
      addCollectible,
      toasts,
      pushToast,
      inviteAccepted,
      ownerInviteSeen,
      acceptInvite,
      markOwnerInviteSeen,
      inviteOpen,
      lightboxOpen,
    ],
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
