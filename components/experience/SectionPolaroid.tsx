"use client";

import Image from "next/image";

/** Small polaroid tucked in a section corner — never over body copy */
export function SectionPolaroid({
  src,
  className,
  rotate = "6deg",
}: {
  src: string;
  className: string;
  rotate?: string;
}) {
  return (
    <div
      className={`pointer-events-none absolute z-[1] ${className}`}
      aria-hidden
      style={{ rotate }}
    >
      <div className="overflow-hidden rounded-md bg-white p-1 shadow-[0_12px_28px_rgba(42,28,34,0.14)] ring-1 ring-black/5">
        <div className="relative aspect-square w-full overflow-hidden rounded-sm">
          <Image src={src} alt="" fill className="object-cover" sizes="96px" />
        </div>
      </div>
    </div>
  );
}
