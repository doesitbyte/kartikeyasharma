/**
 * One-time migration script to populate Upstash Redis with data from lib/data.ts
 * 
 * Usage: npx tsx scripts/migrate-to-redis.ts
 */

// redis.ts will automatically load .env.local or .env if env vars are not set
import { redis, REDIS_KEYS } from "../lib/redis";
import { data } from "../lib/data";

async function migrate() {
  console.log("Starting migration to Redis...");

  try {
    // Migrate each section
    console.log("Migrating personal_information...");
    await redis.set(REDIS_KEYS.personal_info, data.personal_information);

    console.log("Migrating skills_and_expertise...");
    await redis.set(REDIS_KEYS.skills, data.skills_and_expertise);

    console.log("Migrating experiences...");
    await redis.set(REDIS_KEYS.experiences, data.experiences);

    console.log("Migrating education...");
    await redis.set(REDIS_KEYS.education, data.education);

    console.log("Migrating achievements...");
    await redis.set(REDIS_KEYS.achievements, data.achievements);

    console.log("Migrating publications_and_presentations...");
    await redis.set(REDIS_KEYS.publications, data.publications_and_presentations);

    console.log("Migrating hobbies_interests_and_extracurricular...");
    await redis.set(REDIS_KEYS.extracurricular, data.hobbies_interests_and_extracurricular);

    console.log("Migrating ui_content...");
    await redis.set(REDIS_KEYS.ui_content, data.ui_content);

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
      redis.get(REDIS_KEYS.personal_info),
      redis.get(REDIS_KEYS.skills),
      redis.get(REDIS_KEYS.experiences),
      redis.get(REDIS_KEYS.education),
      redis.get(REDIS_KEYS.achievements),
      redis.get(REDIS_KEYS.publications),
      redis.get(REDIS_KEYS.extracurricular),
      redis.get(REDIS_KEYS.ui_content),
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
