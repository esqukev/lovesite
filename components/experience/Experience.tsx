"use client";

import { useState } from "react";
import { ExperienceProvider, useExperience } from "./ExperienceProvider";
import { SmoothScroll } from "./SmoothScroll";
import { CustomCursor } from "./CustomCursor";
import { Loader } from "./Loader";
import { Gate } from "./Gate";
import { PaperLetter } from "./PaperLetter";
import { Hero } from "./Hero";
import { StackedMemories } from "./StackedMemories";
import { Gallery } from "./Gallery";
import { PlacesMap } from "./PlacesMap";
import { Reasons } from "./Reasons";
import { Wishlist } from "./Wishlist";
import { Countdown } from "./Countdown";
import { Invitation } from "./Invitation";
import { Footer } from "./Footer";
import { StarField } from "./StarField";
import { AmbientEffects, HeartButton, ReactiveWord } from "./AmbientEffects";
import { VideoMoment } from "./VideoMoment";
import { FloatingHearts } from "./FloatingHearts";
import { CatSquad } from "./CatSquad";
import { PhraseHotspots } from "./PhraseHotspots";
import { GameHUD } from "./GameHUD";
import { CinemaScroll } from "./CinemaScroll";
import { Collectibles } from "./Collectibles";
import { ThreadPath } from "./ThreadPath";

function ExperienceInner() {
  const { phase, setPhase } = useExperience();
  const [booted, setBooted] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [started, setStarted] = useState(false);

  const main = phase === "main" && started;

  return (
    <>
      {!booted && <Loader onDone={() => setBooted(true)} />}

      {booted && (
        <>
          <CustomCursor active={main} />
          <AmbientEffects active={main} />
          <FloatingHearts active={main} />
          <Collectibles active={main} />
          <CatSquad active={main} />
          <GameHUD active={main} />

          {phase === "gate" && (
            <Gate
              onUnlock={() => {
                setUnlocked(true);
                setPhase("welcome");
              }}
            />
          )}

          {phase === "welcome" && unlocked && (
            <PaperLetter
              onStart={() => {
                setStarted(true);
                setPhase("main");
              }}
            />
          )}

          {main && (
            <SmoothScroll enabled>
              <div className="experience-root game-world relative min-h-screen overflow-x-hidden bg-[var(--void)] text-[var(--cream)]">
                <div className="game-vignette" aria-hidden />
                <CinemaScroll enabled />
                <StarField />
                <PhraseHotspots />
                <ThreadPath />

                <header className="fixed left-0 right-0 top-[3.6rem] z-40 flex items-center justify-between px-4 sm:top-[4.2rem] sm:px-5">
                  <div className="font-display text-base tracking-wide text-[var(--cream)]/90 sm:text-lg">
                    Motzy{" "}
                    <HeartButton className="ml-1 inline-block align-middle" />
                  </div>
                  <p className="rounded-full border border-white/10 bg-black/35 px-2.5 py-1 text-[9px] uppercase tracking-[0.28em] text-white/45 backdrop-blur-md sm:text-[10px]">
                    Sigue el hilo
                  </p>
                </header>

                <main className="relative z-[3] pb-10">
                  <Hero />

                  <section
                    className="px-6 py-10 text-center"
                    data-cinema="fade-up"
                  >
                    <div className="game-panel mx-auto max-w-2xl px-5 py-5">
                      <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--gold)]">
                        Cómo jugar
                      </p>
                      <p className="mt-3 text-base leading-relaxed text-white/65 sm:text-lg">
                        <ReactiveWord>Eres mi lugar favorito.</ReactiveWord>{" "}
                        Toca gatitos, corazones y orbes. Desliza para seguir el
                        hilo rosa — como en los sitios que te enamoran.
                      </p>
                    </div>
                  </section>

                  <StackedMemories />
                  <Gallery />
                  <VideoMoment />
                  <PlacesMap />
                  <Reasons />
                  <Wishlist />
                  <Countdown />
                  <Footer />
                </main>

                <Invitation active />
              </div>
            </SmoothScroll>
          )}
        </>
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
