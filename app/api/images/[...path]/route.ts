import { NextRequest, NextResponse } from "next/server";
import { get } from "@vercel/blob";
import { IMAGES_PREFIX } from "@/lib/store";

/**
 * GET /api/images/[...path]
 * Serves an uploaded image from the private Vercel Blob store
 * Uploaded pathnames have a random suffix, so responses never change
 * and can be cached forever by the CDN
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path } = await params;
    const result = await get(IMAGES_PREFIX + path.join("/"), {
      access: "private",
    });

    if (!result || result.statusCode !== 200) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }

    return new Response(result.stream, {
      headers: {
        "Content-Type": result.blob.contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("Error fetching image:", error);
    return NextResponse.json(
      { error: "Failed to fetch image" },
      { status: 500 }
    );
  }
}
