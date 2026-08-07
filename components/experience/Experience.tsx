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
import { AmbientEffects, HeartButton } from "./AmbientEffects";
import { FloatingHearts } from "./FloatingHearts";
import { CatSquad } from "./CatSquad";
import { ThreadPath } from "./ThreadPath";
import { SiteWarmth } from "./SiteWarmth";
import { ScrollRevealBand } from "./ScrollRevealBand";

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
          <CatSquad active={main} />

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
              <div className="experience-root relative min-h-screen overflow-x-hidden">
                <ThreadPath />
                <SiteWarmth />

                <header className="fixed left-0 right-0 top-0 z-40 flex items-center justify-between px-5 py-5">
                  <div className="font-display text-lg tracking-wide text-[var(--ink)]/80">
                    Motzy{" "}
                    <HeartButton className="ml-1 inline-block align-middle" />
                  </div>
                </header>

                <main className="relative z-[3]">
                  <Hero />
                  <StackedMemories />
                  <Gallery />
                  <ScrollRevealBand />
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
