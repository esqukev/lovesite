import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { isValidGateKey } from "@/lib/gallery";

export const runtime = "nodejs";

export async function POST(request: Request): Promise<NextResponse> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      {
        error:
          "Falta configurar Vercel Blob (BLOB_READ_WRITE_TOKEN). Actívalo en el proyecto de Vercel.",
      },
      { status: 503 },
    );
  }

  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (_pathname, clientPayload) => {
        let password = "";
        try {
          password = clientPayload
            ? (JSON.parse(clientPayload) as { password?: string }).password ??
              ""
            : "";
        } catch {
          password = "";
        }

        if (!isValidGateKey(password)) {
          throw new Error("No autorizado para subir fotos");
        }

        return {
          allowedContentTypes: [
            "image/jpeg",
            "image/png",
            "image/webp",
            "image/gif",
            "image/heic",
            "image/heif",
          ],
          maximumSizeInBytes: 12 * 1024 * 1024,
          addRandomSuffix: true,
          tokenPayload: JSON.stringify({
            by: password.trim().toLowerCase(),
          }),
        };
      },
      onUploadCompleted: async () => {
        /* listed via /api/gallery */
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || "Error al subir" },
      { status: 400 },
    );
  }
}
