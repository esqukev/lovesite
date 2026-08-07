"use client";

import Image from "next/image";

const ACCENTS = [
  {
    src: "/foto2.jpeg",
    pos: "left-[4%] top-[12%] w-20 sm:w-28",
    rotate: "-8deg",
    delay: "0s",
  },
  {
    src: "/foto10.jpeg",
    pos: "right-[5%] top-[28%] w-[4.5rem] sm:w-24",
    rotate: "7deg",
    delay: "0.4s",
  },
  {
    src: "/foto6.jpeg",
    pos: "left-[8%] bottom-[18%] w-[4.75rem] sm:w-[6.5rem]",
    rotate: "5deg",
    delay: "0.8s",
  },
] as const;

export function AccentPolaroids() {
  return (
    <div className="pointer-events-none absolute inset-0 z-[1] overflow-hidden" aria-hidden>
      {ACCENTS.map((p) => (
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
