import { NextRequest, NextResponse } from "next/server";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { IMAGES_PREFIX } from "@/lib/store";

/**
 * POST /api/upload
 * Issues a short-lived token so the admin page can upload an image
 * straight from the browser to Vercel Blob
 * Requires admin password authentication (sent as the client payload)
 */
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as HandleUploadBody;

    const result = await handleUpload({
      request,
      body,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        // Verify password
        if (!clientPayload || clientPayload !== process.env.ADMIN_PASSWORD) {
          throw new Error("Unauthorized");
        }

        if (!pathname.startsWith(IMAGES_PREFIX)) {
          throw new Error("Invalid upload path");
        }

        return {
          allowedContentTypes: ["image/*"],
          maximumSizeInBytes: 10 * 1024 * 1024,
          addRandomSuffix: true,
        };
      },
    });

    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload failed";
    return NextResponse.json(
      { error: message },
      { status: message === "Unauthorized" ? 401 : 400 }
    );
  }
}
