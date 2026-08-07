"use client";

import Image from "next/image";

/** Hero accents — keep clear of the title block on the left */
const HERO = [
  {
    src: "/foto10.jpeg",
    pos: "right-[4%] top-[18%] w-[4.5rem] sm:right-[8%] sm:top-[20%] sm:w-28",
    rotate: "8deg",
    delay: "0s",
  },
  {
    src: "/foto2.jpeg",
    pos: "right-[10%] bottom-[22%] w-20 sm:right-[14%] sm:bottom-[24%] sm:w-[7rem]",
    rotate: "-6deg",
    delay: "0.35s",
  },
  {
    src: "/foto13.jpeg",
    pos: "right-[2%] top-[48%] hidden w-[4.25rem] sm:block sm:w-24",
    rotate: "4deg",
    delay: "0.7s",
  },
] as const;

export function AccentPolaroids() {
  return (
    <div className="pointer-events-none absolute inset-0 z-[1] overflow-hidden" aria-hidden>
      {HERO.map((p) => (
        <div key={p.src + p.pos} className={`accent-polaroid absolute ${p.pos}`}>
          <div
            className="accent-polaroid-float"
            style={{ animationDelay: p.delay, rotate: p.rotate }}
          >
            <div className="overflow-hidden rounded-md bg-white p-1.5 shadow-[0_14px_36px_rgba(42,28,34,0.18)] ring-1 ring-black/5">
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-sm">
                <Image src={p.src} alt="" fill className="object-cover" sizes="120px" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
