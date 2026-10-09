/**
 * Seed script to populate the Vercel Blob store with data from lib/data.ts
 * 
 * Usage: pnpm seed:store
 */

// store.ts will automatically load .env.local or .env if env vars are not set
import { store, STORE_KEYS } from "../lib/store";
import { data } from "../lib/data";

async function migrate() {
  console.log("Seeding Vercel Blob store...");

  try {
    // Migrate each section
    console.log("Migrating personal_information...");
    await store.set(STORE_KEYS.personal_info, data.personal_information);

    console.log("Migrating skills_and_expertise...");
    await store.set(STORE_KEYS.skills, data.skills_and_expertise);

    console.log("Migrating experiences...");
    await store.set(STORE_KEYS.experiences, data.experiences);

    console.log("Migrating education...");
    await store.set(STORE_KEYS.education, data.education);

    console.log("Migrating achievements...");
    await store.set(STORE_KEYS.achievements, data.achievements);

    console.log("Migrating publications_and_presentations...");
    await store.set(STORE_KEYS.publications, data.publications_and_presentations);

    console.log("Migrating hobbies_interests_and_extracurricular...");
    await store.set(STORE_KEYS.extracurricular, data.hobbies_interests_and_extracurricular);

    console.log("Migrating ui_content...");
    await store.set(STORE_KEYS.ui_content, data.ui_content);

    console.log("\n✅ Migration completed successfully!");
    console.log("\nVerifying data...");

    // Verify all data was saved
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
      store.get(STORE_KEYS.personal_info),
      store.get(STORE_KEYS.skills),
      store.get(STORE_KEYS.experiences),
      store.get(STORE_KEYS.education),
      store.get(STORE_KEYS.achievements),
      store.get(STORE_KEYS.publications),
      store.get(STORE_KEYS.extracurricular),
      store.get(STORE_KEYS.ui_content),
    ]);

    const allPresent =
      personal_info &&
      skills &&
      experiences &&
      education &&
      achievements &&
      publications &&
      extracurricular &&
      ui_content;

    if (allPresent) {
      console.log("✅ All data verified successfully!");
    } else {
      console.error("❌ Some data is missing!");
    }
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
}

migrate();
