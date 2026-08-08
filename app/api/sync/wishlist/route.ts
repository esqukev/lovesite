import { get, put } from "@vercel/blob";
import { NextResponse } from "next/server";
import {
  WISHLIST_BLOB_PATH,
  defaultWishlistPayload,
  isValidGateKey,
  type WishlistPayload,
} from "@/lib/sync";

export const runtime = "nodejs";

async function readWishlist(): Promise<WishlistPayload | null> {
  try {
    const result = await get(WISHLIST_BLOB_PATH, {
      access: "public",
      useCache: false,
    });
    if (!result?.stream) return null;
    const text = await new Response(result.stream).text();
    const parsed = JSON.parse(text) as WishlistPayload;
    if (parsed?.version === 2 && parsed.checked && Array.isArray(parsed.custom)) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

export async function GET() {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json({
      configured: false,
      ...defaultWishlistPayload(),
    });
  }

  const data = (await readWishlist()) ?? defaultWishlistPayload();
  return NextResponse.json({ configured: true, ...data });
}

export async function PUT(request: Request) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      { error: "Falta configurar Vercel Blob" },
      { status: 503 },
    );
  }

  try {
    const body = (await request.json()) as {
      password?: string;
      checked?: WishlistPayload["checked"];
      custom?: WishlistPayload["custom"];
    };

    if (!isValidGateKey(body.password)) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    if (!body.checked || typeof body.checked !== "object") {
      return NextResponse.json({ error: "Lista inválida" }, { status: 400 });
    }

    const payload: WishlistPayload = {
      version: 2,
      updatedAt: new Date().toISOString(),
      checked: body.checked,
      custom: Array.isArray(body.custom) ? body.custom : [],
    };

    await put(WISHLIST_BLOB_PATH, JSON.stringify(payload), {
      access: "public",
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: "application/json",
      cacheControlMaxAge: 60,
    });

    return NextResponse.json({ configured: true, ...payload });
  } catch (error) {
    console.error("wishlist sync failed", error);
    return NextResponse.json(
      { error: (error as Error).message || "Error al guardar" },
      { status: 500 },
    );
  }
}
