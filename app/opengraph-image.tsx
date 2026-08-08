import { ImageResponse } from "next/og";

export const alt = "Nuestro pequeño universo — Motzy";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(160deg, #f8eef0 0%, #f3e8ea 45%, #f7efe8 100%)",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 80,
            left: 100,
            width: 220,
            height: 220,
            borderRadius: 999,
            background: "rgba(232,170,176,0.35)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 60,
            right: 120,
            width: 280,
            height: 280,
            borderRadius: 999,
            background: "rgba(255,214,188,0.4)",
            display: "flex",
          }}
        />

        {/* Frog */}
        <svg width="220" height="220" viewBox="0 0 64 64" fill="none">
          <ellipse cx="32" cy="38" rx="18" ry="14" fill="#7a9e6a" />
          <circle cx="20" cy="24" r="8" fill="#7a9e6a" />
          <circle cx="44" cy="24" r="8" fill="#7a9e6a" />
          <circle cx="20" cy="24" r="3.5" fill="#fff" />
          <circle cx="44" cy="24" r="3.5" fill="#fff" />
          <circle cx="21" cy="24" r="1.6" fill="#2a1c22" />
          <circle cx="45" cy="24" r="1.6" fill="#2a1c22" />
          <path
            d="M24 42c4 3 12 3 16 0"
            stroke="#2a1c22"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
          />
        </svg>

        <div
          style={{
            marginTop: 28,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div
            style={{
              fontSize: 64,
              color: "#2a1c22",
              fontWeight: 400,
              letterSpacing: "-0.03em",
            }}
          >
            Nuestro pequeño universo
          </div>
          <div
            style={{
              marginTop: 12,
              fontSize: 28,
              color: "rgba(42,28,34,0.55)",
            }}
          >
            Solo nosotros · Motzy ♥
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
