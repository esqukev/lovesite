"use client";

import { FormEvent, useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { GATE_KEY_STORAGE, GATE_PASSWORDS, type VisitorRole } from "@/lib/data";

gsap.registerPlugin(useGSAP);

export function Gate({
  onUnlock,
}: {
  onUnlock: (role: VisitorRole) => void;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);
  const [role, setRole] = useState<VisitorRole | null>(null);
  const [status, setStatus] = useState<"idle" | "ok" | "welcome">("idle");

  useGSAP(
    () => {
      gsap.set(".gate-line, .gate-form", { opacity: 0, y: 18 });
      const tl = gsap.timeline({ delay: 0.35 });
      tl.to(".gate-line", {
        opacity: 1,
        y: 0,
        duration: 1.4,
        ease: "power3.out",
      }).to(
        ".gate-form",
        { opacity: 1, y: 0, duration: 1, ease: "power3.out" },
        "-=0.6",
      );
    },
    { scope: rootRef },
  );

  const shake = () => {
    if (!inputRef.current) return;
    gsap.fromTo(
      inputRef.current,
      { x: 0 },
      {
        x: 10,
        duration: 0.05,
        repeat: 7,
        yoyo: true,
        ease: "power1.inOut",
        onComplete: () => gsap.set(inputRef.current, { x: 0 }),
      },
    );
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const key = value.trim().toLowerCase();
    const nextRole = GATE_PASSWORDS[key];
    if (!nextRole) {
      setError(true);
      shake();
      return;
    }

    setError(false);
    setRole(nextRole);
    setStatus("ok");

    try {
      sessionStorage.setItem(GATE_KEY_STORAGE, key);
    } catch {
      /* private mode */
    }

    const tl = gsap.timeline({
      onComplete: () => {
        onUnlock(nextRole);
      },
    });

    tl.to(".gate-line", {
      opacity: 0,
      filter: "blur(10px)",
      scale: 1.04,
      duration: 0.7,
      ease: "power2.inOut",
    })
      .to(".gate-form", { opacity: 0, y: -12, duration: 0.45 }, "<")
      .call(() => setStatus("welcome"))
      .fromTo(
        ".gate-confirm",
        { opacity: 0, y: 16, filter: "blur(8px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.9,
          ease: "power3.out",
        },
      )
      .to({}, { duration: 1.1 })
      .to(rootRef.current, {
        opacity: 0,
        scale: 1.08,
        filter: "blur(16px)",
        duration: 1.2,
        ease: "power2.inOut",
      });
  };

  const welcomeLine =
    role === "owner"
      ? "Bienvenido a nuestro pequeño universo."
      : "Bienvenida a nuestro pequeño universo.";

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#f3e8ea] px-6"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(232,170,176,0.4),transparent_55%),radial-gradient(ellipse_at_bottom,rgba(255,214,188,0.35),transparent_50%)]" />
      <div className="relative mx-auto max-w-xl text-center">
        {status === "idle" || status === "ok" ? (
          <>
            <p className="gate-line font-display text-2xl leading-relaxed text-[var(--ink)] sm:text-3xl md:text-4xl">
              Existe un pequeño lugar al que solamente dos personas tienen
              acceso.
            </p>
            <form
              onSubmit={handleSubmit}
              className="gate-form mt-12 flex flex-col items-center gap-4"
            >
              <input
                ref={inputRef}
                type="password"
                autoComplete="off"
                value={value}
                onChange={(e) => {
                  setValue(e.target.value);
                  setError(false);
                }}
                placeholder="Ingresa tu identidad"
                className="w-full max-w-sm rounded-2xl border border-[var(--ink)]/15 bg-white/60 px-5 py-4 text-center text-[var(--ink)] outline-none backdrop-blur-sm placeholder:text-[var(--ink)]/35 focus:border-[var(--accent)] focus:bg-white/80 transition-colors"
              />
              {error && (
                <p className="text-sm text-[var(--accent)]">
                  Creo que te equivocaste de universo ❤️
                </p>
              )}
            </form>
          </>
        ) : null}

        {status !== "idle" && (
          <div className="gate-confirm space-y-4 opacity-0">
            <p className="font-display text-2xl text-[var(--ink)] sm:text-3xl">
              Identidad confirmada...
            </p>
            <p className="text-lg text-[var(--ink)]/65">{welcomeLine}</p>
          </div>
        )}
      </div>
    </div>
  );
}
