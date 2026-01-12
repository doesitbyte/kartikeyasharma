/**
 * Server-side data fetching utility
 * Use this in Server Components and API routes
 * 
 * Optimizations:
 * - Uses React cache() for request deduplication within the same render
 * - Parallel Redis fetches using Promise.all for optimal performance
 * - All pages are server-side rendered for SEO and performance
 */
import { cache } from "react";
import { redis, REDIS_KEYS } from "./redis";
import type { data as DataType } from "./data";

export const getAllData = cache(async (): Promise<typeof DataType> => {
  const [
    personal_info,
    skills,
    experiences,
    education,
    achievements,
    publications,
    extracurricular,
    ui_content,
  ] = await Promise.all([
    redis.get<typeof DataType.personal_information>(REDIS_KEYS.personal_info),
    redis.get<string[]>(REDIS_KEYS.skills),
    redis.get<typeof DataType.experiences>(REDIS_KEYS.experiences),
    redis.get<typeof DataType.education>(REDIS_KEYS.education),
    redis.get<typeof DataType.achievements>(REDIS_KEYS.achievements),
    redis.get<typeof DataType.publications_and_presentations>(REDIS_KEYS.publications),
    redis.get<typeof DataType.hobbies_interests_and_extracurricular>(REDIS_KEYS.extracurricular),
    redis.get<typeof DataType.ui_content>(REDIS_KEYS.ui_content),
  ]);

  if (
    !personal_info ||
    !skills ||
    !experiences ||
    !education ||
    !achievements ||
    !publications ||
    !extracurricular ||
    !ui_content
  ) {
    throw new Error(
      "Data not initialized. Please run the migration script: npx tsx scripts/migrate-to-redis.ts"
    );
  }

  return {
    personal_information: personal_info,
    skills_and_expertise: skills,
    experiences,
    education,
    achievements,
    publications_and_presentations: publications,
    hobbies_interests_and_extracurricular: extracurricular,
    ui_content,
  };
});
