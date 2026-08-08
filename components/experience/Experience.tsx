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
import {
  StickyNotes,
  StickyNotesLayer,
  StickyNotesProvider,
} from "./StickyNotes";
import { Invitation } from "./Invitation";
import { Footer } from "./Footer";
import { AmbientEffects, HeartButton } from "./AmbientEffects";
import { FloatingHearts } from "./FloatingHearts";
import { CatSquad } from "./CatSquad";
import { SecretFrog } from "./SecretFrog";
import { SiteWarmth } from "./SiteWarmth";
import { ScrollRevealBand } from "./ScrollRevealBand";

function ExperienceInner() {
  const { phase, setPhase, setVisitorRole } = useExperience();
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
          <SecretFrog active={main} />

          {phase === "gate" && (
            <Gate
              onUnlock={(role) => {
                setVisitorRole(role);
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
              <StickyNotesProvider>
                <div className="experience-root relative min-h-screen overflow-x-hidden">
                  <SiteWarmth />

                  <header className="fixed left-0 right-0 top-0 z-40 flex items-center justify-between px-5 py-5">
                    <div className="font-display text-lg tracking-wide text-[var(--ink)]/80">
                      Motzy
                    </div>
                    <HeartButton className="text-base" />
                  </header>

                  <main className="relative z-[3]">
                    <Hero />
                    <StackedMemories />
                    <Gallery />
                    <ScrollRevealBand />
                    <PlacesMap />
                    <Reasons />
                    <Wishlist />
                    <StickyNotes />
                    <Countdown />
                    <Footer />
                  </main>

                  <StickyNotesLayer />
                  <Invitation active />
                </div>
              </StickyNotesProvider>
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
