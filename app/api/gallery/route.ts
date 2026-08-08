import { del, get, list, put } from "@vercel/blob";
import { NextResponse } from "next/server";
import {
  GALLERY_HIDDEN_PATH,
  GALLERY_PREFIX,
  isValidGateKey,
  type GalleryHiddenPayload,
} from "@/lib/gallery";

export const runtime = "nodejs";

async function readHidden(): Promise<string[]> {
  try {
    const result = await get(GALLERY_HIDDEN_PATH, {
      access: "public",
      useCache: false,
    });
    if (!result?.stream) return [];
    const text = await new Response(result.stream).text();
    const parsed = JSON.parse(text) as GalleryHiddenPayload;
    return Array.isArray(parsed.hidden) ? parsed.hidden : [];
  } catch {
    return [];
  }
}

async function writeHidden(hidden: string[]) {
  const payload: GalleryHiddenPayload = {
    version: 1,
    updatedAt: new Date().toISOString(),
    hidden: [...new Set(hidden)],
  };
  await put(GALLERY_HIDDEN_PATH, JSON.stringify(payload), {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
    cacheControlMaxAge: 60,
  });
  return payload.hidden;
}

export async function GET() {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json({
      photos: [],
      hidden: [],
      configured: false,
    });
  }

  try {
    const [{ blobs }, hidden] = await Promise.all([
      list({ prefix: GALLERY_PREFIX }),
      readHidden(),
    ]);

    const photos = blobs
      .filter((b) => !b.pathname.endsWith("/"))
      .sort(
        (a, b) =>
          new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime(),
      )
      .map((b) => ({
        src: b.url,
        pathname: b.pathname,
        alt: "Nuestro recuerdo",
        uploadedAt: b.uploadedAt,
        remote: true,
      }));

    return NextResponse.json({ photos, hidden, configured: true });
  } catch (error) {
    console.error("gallery list failed", error);
    return NextResponse.json(
      {
        photos: [],
        hidden: [],
        configured: false,
        error: "No se pudieron cargar las fotos",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      { error: "Falta configurar Vercel Blob" },
      { status: 503 },
    );
  }

  try {
    const body = (await request.json()) as {
      password?: string;
      src?: string;
      url?: string;
      pathname?: string;
      remote?: boolean;
    };

    if (!isValidGateKey(body.password)) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const src = body.src || body.url;
    if (!src) {
      return NextResponse.json({ error: "Foto inválida" }, { status: 400 });
    }

    if (body.remote) {
      await del(body.pathname || src);
      return NextResponse.json({ ok: true, removed: src });
    }

    // Built-in photo: hide for both devices
    const hidden = await readHidden();
    if (!hidden.includes(src)) hidden.push(src);
    await writeHidden(hidden);
    return NextResponse.json({ ok: true, removed: src, hidden });
  } catch (error) {
    console.error("gallery delete failed", error);
    return NextResponse.json(
      { error: (error as Error).message || "No se pudo eliminar" },
      { status: 500 },
    );
  }
}
