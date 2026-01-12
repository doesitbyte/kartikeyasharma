import { Redis } from "@upstash/redis";
import { config } from "dotenv";
import { resolve } from "path";
import { existsSync } from "fs";

// Load environment variables if not already set (for scripts outside Next.js)
if (
  !process.env.UPSTASH_REDIS_REST_URL ||
  !process.env.UPSTASH_REDIS_REST_TOKEN
) {
  const envLocalPath = resolve(process.cwd(), ".env.local");
  const envPath = resolve(process.cwd(), ".env");

  if (existsSync(envLocalPath)) {
    config({ path: envLocalPath });
  } else if (existsSync(envPath)) {
    config({ path: envPath });
  }
}

if (
  !process.env.UPSTASH_REDIS_REST_URL ||
  !process.env.UPSTASH_REDIS_REST_TOKEN
) {
  throw new Error(
    "Missing Upstash Redis environment variables. Please set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN"
  );
}

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

// Redis key prefixes
export const REDIS_KEYS = {
  personal_info: "portfolio:personal_info",
  skills: "portfolio:skills",
  experiences: "portfolio:experiences",
  education: "portfolio:education",
  achievements: "portfolio:achievements",
  publications: "portfolio:publications",
  extracurricular: "portfolio:extracurricular",
  ui_content: "portfolio:ui_content",
} as const;
