import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.join(__dirname),
  },
  async headers() {
    return [
      {
        source: "/cita.ics",
        headers: [
          {
            key: "Content-Type",
            value: "text/calendar; charset=utf-8",
          },
          {
            key: "Content-Disposition",
            value: 'inline; filename="cita.ics"',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
