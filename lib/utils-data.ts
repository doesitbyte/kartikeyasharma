import type { data as DataType } from "./data";

// Helper to get data - can be imported static data or dynamic data
let staticData: typeof DataType | null = null;

async function getStaticData() {
  if (!staticData) {
    const { data } = await import("./data");
    staticData = data;
  }
  return staticData;
}

/**
 * Generate a URL-friendly slug from a string
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/[\s_-]+/g, "-") // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, "") // Remove leading/trailing hyphens
    || "item"; // Fallback if empty
}

/**
 * Generate slug for an experience based on position and organization
 */
export function getExperienceSlug(experience: typeof DataType.experiences[number], index: number): string {
  // Clean organization name - remove parentheses and their contents
  const cleanOrg = experience.organization.replace(/\([^)]*\)/g, "").trim();
  const slug = slugify(`${experience.position}-${cleanOrg}`);
  return slug || `experience-${index}`;
}

/**
 * Generate slug for a publication/presentation
 */
export function getPublicationSlug(item: typeof DataType.publications_and_presentations[number], index: number): string {
  const slug = slugify(item.title);
  return slug || `${item.type}-${index}`;
}

/**
 * Generate slug for an achievement
 */
export function getAchievementSlug(achievement: typeof DataType.achievements[number], index: number): string {
  const slug = slugify(achievement.title);
  return slug || `achievement-${index}`;
}

/**
 * Find experience by slug
 */
export function findExperienceBySlug(slug: string, data: typeof DataType): { experience: typeof DataType.experiences[number]; index: number } | null {
  // Try exact match first
  for (let i = 0; i < data.experiences.length; i++) {
    const generatedSlug = getExperienceSlug(data.experiences[i], i);
    if (generatedSlug === slug) {
      return { experience: data.experiences[i], index: i };
    }
  }
  // Try fallback format (experience-{index})
  const fallbackMatch = slug.match(/^experience-(\d+)$/);
  if (fallbackMatch) {
    const index = parseInt(fallbackMatch[1], 10);
    if (index >= 0 && index < data.experiences.length) {
      return { experience: data.experiences[index], index };
    }
  }
  return null;
}

/**
 * Find publication/presentation by slug
 */
export function findPublicationBySlug(slug: string, data: typeof DataType): { item: typeof DataType.publications_and_presentations[number]; index: number } | null {
  for (let i = 0; i < data.publications_and_presentations.length; i++) {
    if (getPublicationSlug(data.publications_and_presentations[i], i) === slug) {
      return { item: data.publications_and_presentations[i], index: i };
    }
  }
  return null;
}

/**
 * Find achievement by slug
 */
export function findAchievementBySlug(slug: string, data: typeof DataType): { achievement: typeof DataType.achievements[number]; index: number } | null {
  for (let i = 0; i < data.achievements.length; i++) {
    if (getAchievementSlug(data.achievements[i], i) === slug) {
      return { achievement: data.achievements[i], index: i };
    }
  }
  return null;
}

/**
 * Get related experiences (other experiences from the same organization or similar)
 */
export function getRelatedExperiences(currentIndex: number, data: typeof DataType, limit: number = 3): Array<typeof DataType.experiences[number]> {
  return data.experiences
    .filter((_, index) => index !== currentIndex)
    .slice(0, limit);
}

/**
 * Get related publications (same year or same publisher/organization)
 */
export function getRelatedPublications(currentIndex: number, data: typeof DataType, limit: number = 3): Array<typeof DataType.publications_and_presentations[number]> {
  const current = data.publications_and_presentations[currentIndex];
  return data.publications_and_presentations
    .filter((item, index) => {
      if (index === currentIndex) return false;
      // Match by year
      if (item.year === current.year) return true;
      // Match by publisher/organization based on type
      if (current.type === "publication" && item.type === "publication") {
        return item.publisher === current.publisher;
      }
      if (current.type === "invited_talk" && item.type === "invited_talk") {
        return item.organization === current.organization;
      }
      return false;
    })
    .slice(0, limit);
}

/**
 * Get related achievements (same year or similar type)
 */
export function getRelatedAchievements(currentIndex: number, data: typeof DataType, limit: number = 3): Array<typeof DataType.achievements[number]> {
  const current = data.achievements[currentIndex];
  const currentYear = current.date.match(/\d{4}/)?.[0];
  return data.achievements
    .filter((achievement, index) => {
      if (index === currentIndex) return false;
      const year = achievement.date.match(/\d{4}/)?.[0];
      return year === currentYear;
    })
    .slice(0, limit);
}
