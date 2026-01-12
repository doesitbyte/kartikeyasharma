import { NextRequest, NextResponse } from "next/server";
import { redis, REDIS_KEYS } from "@/lib/redis";
import { getAllData } from "@/lib/get-data";
import { buildSearchIndex } from "@/lib/search-index";

/**
 * POST /api/search/build-index
 * Builds the search index from all data and saves it to Upstash
 * Requires admin password authentication
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password } = body;

    // Verify password
    if (!password || password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch all data
    const data = await getAllData();

    // Build search index
    const searchIndex = buildSearchIndex(data);

    // Save to Upstash
    await redis.set(REDIS_KEYS.search_index, searchIndex);

    return NextResponse.json({
      success: true,
      count: searchIndex.length,
      message: `Search index built successfully with ${searchIndex.length} entries`,
    });
  } catch (error) {
    console.error("Error building search index:", error);
    return NextResponse.json(
      { error: "Failed to build search index" },
      { status: 500 }
    );
  }
}
