import type { data as DataType } from "./data";

const API_BASE = "/api/data";

export type Section =
  | "personal_information"
  | "skills_and_expertise"
  | "experiences"
  | "education"
  | "achievements"
  | "publications_and_presentations"
  | "hobbies_interests_and_extracurricular"
  | "ui_content";

/**
 * Fetch all data from the API
 */
export async function fetchAllData(): Promise<typeof DataType> {
  const response = await fetch(API_BASE, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch data: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Fetch a specific section from the API
 */
export async function fetchSection<T extends Section>(
  section: T
): Promise<typeof DataType[T]> {
  const response = await fetch(`${API_BASE}/${section}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch ${section}: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Update a section via API (requires authentication)
 */
export async function updateSection<T extends Section>(
  section: T,
  data: typeof DataType[T],
  password: string
): Promise<void> {
  const response = await fetch(`${API_BASE}/${section}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ data, password }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: response.statusText }));
    throw new Error(error.error || `Failed to update ${section}`);
  }
}

/**
 * Rebuild the search index (requires authentication)
 */
export async function rebuildSearchIndex(password: string): Promise<{ count: number; message: string }> {
  const response = await fetch("/api/search/build-index", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ password }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: response.statusText }));
    throw new Error(error.error || "Failed to rebuild search index");
  }

  return response.json();
}
