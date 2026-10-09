/**
 * Server-side data fetching utility
 * Use this in Server Components and API routes
 * 
 * Optimizations:
 * - Uses React cache() for request deduplication within the same render
 * - Parallel Blob fetches using Promise.all for optimal performance
 * - All pages are server-side rendered for SEO and performance
 */
import { cache } from "react";
import { store, STORE_KEYS } from "./store";
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
    store.get<typeof DataType.personal_information>(STORE_KEYS.personal_info),
    store.get<string[]>(STORE_KEYS.skills),
    store.get<typeof DataType.experiences>(STORE_KEYS.experiences),
    store.get<typeof DataType.education>(STORE_KEYS.education),
    store.get<typeof DataType.achievements>(STORE_KEYS.achievements),
    store.get<typeof DataType.publications_and_presentations>(STORE_KEYS.publications),
    store.get<typeof DataType.hobbies_interests_and_extracurricular>(STORE_KEYS.extracurricular),
    store.get<typeof DataType.ui_content>(STORE_KEYS.ui_content),
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
      "Data not initialized. Please run the migration script: pnpm seed:store"
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
  } as unknown as typeof DataType;
});
