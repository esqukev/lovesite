"use client";

import { useState } from "react";
import { ExperienceProvider, useExperience } from "./ExperienceProvider";
import { SmoothScroll } from "./SmoothScroll";
import { CustomCursor } from "./CustomCursor";
import { Gate } from "./Gate";
import { WelcomeLetter } from "./WelcomeLetter";
import { Hero } from "./Hero";
import { Memories } from "./Memories";
import { Gallery } from "./Gallery";
import { PlacesMap } from "./PlacesMap";
import { Reasons } from "./Reasons";
import { Wishlist } from "./Wishlist";
import { Countdown } from "./Countdown";
import { Invitation } from "./Invitation";
import { Footer } from "./Footer";
import { StarField } from "./StarField";
import { AmbientEffects, HeartButton, ReactiveWord } from "./AmbientEffects";
import { HiddenPhrases } from "./HiddenPhrases";
import { SoundToggle } from "./SoundToggle";
import { VideoMoment } from "./VideoMoment";

function ExperienceInner() {
  const { phase } = useExperience();
  const [unlocked, setUnlocked] = useState(false);
  const [started, setStarted] = useState(false);

  const main = phase === "main" && started;

  return (
    <>
      <CustomCursor active={main} />
      <AmbientEffects active={main} />
      {phase === "gate" && <Gate onUnlock={() => setUnlocked(true)} />}
      {phase === "welcome" && unlocked && (
        <WelcomeLetter onStart={() => setStarted(true)} />
      )}

      {main && (
        <SmoothScroll enabled>
          <div className="experience-root relative min-h-screen overflow-x-hidden bg-[var(--void)] text-[var(--cream)]">
            <StarField />
            <HiddenPhrases />

            <header className="fixed left-0 right-0 top-0 z-40 flex items-center justify-between px-5 py-5">
              <div className="font-display text-lg tracking-wide text-[var(--cream)]/90">
                Motzy <HeartButton className="ml-1 inline-block align-middle" />
              </div>
              <p className="hidden text-[10px] uppercase tracking-[0.3em] text-white/35 sm:block">
                Nuestro universo
              </p>
            </header>

            <main>
              <Hero />

              <section className="px-6 py-10 text-center">
                <p className="mx-auto max-w-2xl text-lg text-white/50">
                  <ReactiveWord>Eres mi lugar favorito.</ReactiveWord> Aquí
                  empieza el recorrido — sin prisa, como nos gusta.
                </p>
              </section>

              <Memories />
              <Gallery />
              <VideoMoment />
              <PlacesMap />
              <Reasons />
              <Wishlist />
              <Countdown />
              <Footer />
            </main>

            <SoundToggle />
            <Invitation active />
          </div>
        </SmoothScroll>
      )}
    </>
  );
}

export function Experience() {
  return (
    <ExperienceProvider>
      <ExperienceInner />
    </ExperienceProvider>
  );
}
