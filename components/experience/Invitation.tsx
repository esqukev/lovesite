"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import confetti from "canvas-confetti";
import { Button } from "@/components/ui/button";
import { getDateCalendarUrl, getDateWhatsAppUrl } from "@/lib/data";
import { useExperience } from "./ExperienceProvider";
import { FrostHeart } from "./FrostHeart";

export function Invitation({ active }: { active: boolean }) {
  const {
    visitorRole,
    inviteOpen,
    setInviteOpen,
    inviteAccepted,
    acceptInvite,
  } = useExperience();
  const [noAttempts, setNoAttempts] = useState(0);
  const [noPos, setNoPos] = useState({ x: 0, y: 0 });
  const [showFrost, setShowFrost] = useState(false);
  const noRef = useRef<HTMLButtonElement>(null);
  const triggered = useRef(false);

  const canInvite = visitorRole === "guest" && !inviteAccepted;

  useEffect(() => {
    if (!active || !canInvite || triggered.current) return;

    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? window.scrollY / max : 0;
      if (progress >= 0.7) {
        triggered.current = true;
        setInviteOpen(true);
      }
    };

    const timer = window.setTimeout(() => {
      if (!triggered.current && canInvite) {
        triggered.current = true;
        setInviteOpen(true);
      }
    }, 60_000);

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
    };
  }, [active, canInvite, setInviteOpen]);

  const accept = () => {
    acceptInvite();
    setShowFrost(true);
    confetti({
      particleCount: 90,
      spread: 70,
      origin: { y: 0.5 },
      colors: ["#e8b4b8", "#f3ebe3", "#ffffff", "#c4a574"],
      scalar: 0.85,
    });
  };

  const afterFrost = () => {
    setShowFrost(false);
    // 1) Calendar so she can mark the day
    window.open(getDateCalendarUrl(), "_blank", "noopener,noreferrer");
    // 2) WhatsApp with the same calendar link (she can send it / keep it)
    window.setTimeout(() => {
      window.open(getDateWhatsAppUrl(), "_blank", "noopener,noreferrer");
    }, 350);
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

  if (!canInvite && !showFrost && !inviteOpen) return null;

  return (
    <>
      <AnimatePresence>
        {inviteOpen && canInvite && (
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

      {showFrost && (
        <FrostHeart
          message="El tiempo contigo nunca es perdido."
          submessage="Siempre será recordado y guardado en el alma."
          onDone={afterFrost}
        />
      )}
    </>
  );
}
