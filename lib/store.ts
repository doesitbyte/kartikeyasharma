import { get, put } from "@vercel/blob";
import { config } from "dotenv";
import { resolve } from "path";
import { existsSync } from "fs";

// Load environment variables if not already set (for scripts outside Next.js)
if (!process.env.BLOB_READ_WRITE_TOKEN) {
  const envLocalPath = resolve(process.cwd(), ".env.local");
  const envPath = resolve(process.cwd(), ".env");

  if (existsSync(envLocalPath)) {
    config({ path: envLocalPath });
  } else if (existsSync(envPath)) {
    config({ path: envPath });
  }
}

if (!process.env.BLOB_READ_WRITE_TOKEN) {
  throw new Error(
    "Missing Vercel Blob environment variable. Please set BLOB_READ_WRITE_TOKEN"
  );
}

// Each key is stored as a JSON file in a private Vercel Blob store
export const store = {
  async get<T>(key: string): Promise<T | null> {
    // Bypass the CDN cache so edits are visible immediately
    const result = await get(key, { access: "private", useCache: false });
    if (!result || result.statusCode !== 200) return null;
    return (await new Response(result.stream).json()) as T;
  },

  async set(key: string, value: unknown): Promise<void> {
    await put(key, JSON.stringify(value), {
      access: "private",
      allowOverwrite: true,
      contentType: "application/json",
    });
  },
};

// Blob pathnames
export const STORE_KEYS = {
  personal_info: "portfolio/personal_info.json",
  skills: "portfolio/skills.json",
  experiences: "portfolio/experiences.json",
  education: "portfolio/education.json",
  achievements: "portfolio/achievements.json",
  publications: "portfolio/publications.json",
  extracurricular: "portfolio/extracurricular.json",
  ui_content: "portfolio/ui_content.json",
  search_index: "portfolio/search_index.json",
} as const;

// Uploaded images live under this prefix and are served via /api/images
export const IMAGES_PREFIX = "images/";
