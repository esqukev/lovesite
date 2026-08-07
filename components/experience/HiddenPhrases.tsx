"use client";

import { HIDDEN_PHRASES } from "@/lib/data";

const POSITIONS = [
  "left-[8%] top-[12%]",
  "right-[10%] top-[22%]",
  "left-[6%] top-[48%]",
  "right-[8%] top-[55%]",
  "left-[12%] top-[72%]",
  "right-[14%] top-[78%]",
  "left-[40%] top-[90%]",
];

export function HiddenPhrases() {
  return (
    <div className="pointer-events-none absolute inset-0 z-[1] overflow-hidden" aria-hidden>
      {HIDDEN_PHRASES.map((phrase, i) => (
        <p
          key={phrase}
          className={`absolute max-w-[180px] text-[11px] leading-relaxed text-white/0 transition-colors duration-700 hover:text-white/45 ${POSITIONS[i] ?? "left-1/2 top-1/2"} pointer-events-auto`}
          style={{ writingMode: i % 2 ? "vertical-rl" : "horizontal-tb" }}
        >
          {phrase}
        </p>
      ))}
    </div>
  );
}
