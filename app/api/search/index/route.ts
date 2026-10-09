import { NextResponse } from "next/server";
import { store, STORE_KEYS } from "@/lib/store";
import type { SearchIndexEntry } from "@/lib/search-index";

/**
 * GET /api/search/index
 * Fetches the search index from Vercel Blob
 * No authentication required - index is safe to expose
 */
export async function GET() {
  try {
    const index = await store.get<SearchIndexEntry[]>(STORE_KEYS.search_index);

    if (!index) {
      return NextResponse.json(
        { error: "Search index not found. Please rebuild it first." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      index,
      count: index.length,
    });
  } catch (error) {
    console.error("Error fetching search index:", error);
    return NextResponse.json(
      { error: "Failed to fetch search index" },
      { status: 500 }
    );
  }
}
