import { get, put } from "@vercel/blob";
import { NextResponse } from "next/server";
import {
  NOTES_BLOB_PATH,
  defaultNotesPayload,
  isValidGateKey,
  type NotesPayload,
} from "@/lib/sync";

export const runtime = "nodejs";

async function readNotes(): Promise<NotesPayload | null> {
  try {
    const result = await get(NOTES_BLOB_PATH, {
      access: "public",
      useCache: false,
    });
    if (!result?.stream) return null;
    const text = await new Response(result.stream).text();
    const parsed = JSON.parse(text) as NotesPayload;
    if (parsed?.version === 4 && Array.isArray(parsed.notes)) return parsed;
    return null;
  } catch {
    return null;
  }
}

export async function GET() {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json({ configured: false, ...defaultNotesPayload() });
  }

  const data = (await readNotes()) ?? defaultNotesPayload();
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
      notes?: NotesPayload["notes"];
    };

    if (!isValidGateKey(body.password)) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    if (!Array.isArray(body.notes)) {
      return NextResponse.json({ error: "Notas inválidas" }, { status: 400 });
    }

    const payload: NotesPayload = {
      version: 4,
      updatedAt: new Date().toISOString(),
      notes: body.notes,
    };

    await put(NOTES_BLOB_PATH, JSON.stringify(payload), {
      access: "public",
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: "application/json",
      cacheControlMaxAge: 60,
    });

    return NextResponse.json({ configured: true, ...payload });
  } catch (error) {
    console.error("notes sync failed", error);
    return NextResponse.json(
      { error: (error as Error).message || "Error al guardar" },
      { status: 500 },
    );
  }
}
