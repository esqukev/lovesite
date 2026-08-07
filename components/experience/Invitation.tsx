"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import confetti from "canvas-confetti";
import { Button } from "@/components/ui/button";
import { useExperience } from "./ExperienceProvider";

export function Invitation({ active }: { active: boolean }) {
  const {
    inviteOpen,
    setInviteOpen,
    inviteAccepted,
    setInviteAccepted,
  } = useExperience();
  const [noAttempts, setNoAttempts] = useState(0);
  const [noPos, setNoPos] = useState({ x: 0, y: 0 });
  const [showThanks, setShowThanks] = useState(false);
  const noRef = useRef<HTMLButtonElement>(null);
  const triggered = useRef(false);

  useEffect(() => {
    if (!active || inviteAccepted || triggered.current) return;

    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? window.scrollY / max : 0;
      if (progress >= 0.7) {
        triggered.current = true;
        setInviteOpen(true);
      }
    };

    const timer = window.setTimeout(() => {
      if (!triggered.current && !inviteAccepted) {
        triggered.current = true;
        setInviteOpen(true);
      }
    }, 60_000);

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
    };
  }, [active, inviteAccepted, setInviteOpen]);

  const accept = () => {
    setInviteAccepted(true);
    setInviteOpen(false);
    setShowThanks(true);
    confetti({
      particleCount: 160,
      spread: 80,
      origin: { y: 0.55 },
      colors: ["#e8b4b8", "#c4a574", "#f3ebe3"],
    });
    window.setTimeout(() => setShowThanks(false), 6000);
  };

  const dodge = () => {
    const next = noAttempts + 1;
    setNoAttempts(next);
    if (next < 4) {
      setNoPos({
        x: (Math.random() - 0.5) * 180,
        y: (Math.random() - 0.5) * 100,
      });
    }
  };

  return (
    <>
      <AnimatePresence>
        {inviteOpen && (
          <motion.div
            className="fixed inset-0 z-[90] flex items-center justify-center bg-black/75 p-4 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md rounded-[2rem] border border-white/15 bg-[#141110]/95 p-8 text-center shadow-2xl"
            >
              <h3 className="font-display text-4xl text-[var(--cream)]">
                ALTO ❤️
              </h3>
              <p className="mt-4 text-white/65">
                Esto no es un popup cualquiera.
                <br />
                Es una invitación oficial para salir conmigo.
              </p>
              <div className="mt-6 space-y-2 text-sm text-white/80">
                <p>
                  <span className="text-white/40">Cuando:</span> Domingo 16
                </p>
                <p>
                  <span className="text-white/40">Lugar:</span> Por decidir.
                </p>
                <p>
                  <span className="text-white/40">Dress Code:</span> Casual /
                  Formal
                </p>
              </div>

              <div className="relative mt-8 flex min-h-14 items-center justify-center gap-3">
                <Button size="lg" onClick={accept}>
                  Acepto
                </Button>
                <Button
                  ref={noRef}
                  variant="outline"
                  size="lg"
                  style={{
                    transform: `translate(${noPos.x}px, ${noPos.y}px)`,
                  }}
                  onClick={() => {
                    if (noAttempts >= 4) {
                      setInviteOpen(false);
                    } else {
                      dodge();
                    }
                  }}
                >
                  No puedo
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showThanks && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            className="fixed bottom-6 left-1/2 z-[70] w-[min(92vw,420px)] -translate-x-1/2 rounded-2xl border border-white/15 bg-black/70 px-5 py-4 text-center backdrop-blur-xl"
          >
            <p className="font-display text-lg text-[var(--cream)]">
              El tiempo contigo nunca es perdido.
            </p>
            <p className="mt-1 text-sm text-white/60">
              Siempre será recordado y guardado en el alma.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
