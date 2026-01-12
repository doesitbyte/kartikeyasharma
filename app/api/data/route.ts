import { NextResponse } from "next/server";
import { redis, REDIS_KEYS } from "@/lib/redis";
import type { data as DataType } from "@/lib/data";

export async function GET() {
  try {
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
      redis.get<typeof DataType.publications_and_presentations>(
        REDIS_KEYS.publications
      ),
      redis.get<typeof DataType.hobbies_interests_and_extracurricular>(
        REDIS_KEYS.extracurricular
      ),
      redis.get<typeof DataType.ui_content>(REDIS_KEYS.ui_content),
    ]);

    // Check if data exists
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
      return NextResponse.json(
        { error: "Data not initialized. Please run the migration script." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      personal_information: personal_info,
      skills_and_expertise: skills,
      experiences,
      education,
      achievements,
      publications_and_presentations: publications,
      hobbies_interests_and_extracurricular: extracurricular,
      ui_content,
    } as unknown as typeof DataType);
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}
