import { list } from "@vercel/blob";
import { NextResponse } from "next/server";
import { GALLERY_PREFIX } from "@/lib/gallery";

export const runtime = "nodejs";

export async function GET() {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json({ photos: [], configured: false });
  }

  try {
    const { blobs } = await list({ prefix: GALLERY_PREFIX });
    const photos = blobs
      .filter((b) => !b.pathname.endsWith("/"))
      .sort(
        (a, b) =>
          new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime(),
      )
      .map((b) => ({
        src: b.url,
        alt: "Nuestro recuerdo",
        uploadedAt: b.uploadedAt,
        remote: true,
      }));

    return NextResponse.json({ photos, configured: true });
  } catch (error) {
    console.error("gallery list failed", error);
    return NextResponse.json(
      { photos: [], configured: false, error: "No se pudieron cargar las fotos" },
      { status: 500 },
    );
  }
}
