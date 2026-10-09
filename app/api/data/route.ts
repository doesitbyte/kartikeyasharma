import { NextResponse } from "next/server";
import { store, STORE_KEYS } from "@/lib/store";
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
      store.get<typeof DataType.personal_information>(STORE_KEYS.personal_info),
      store.get<string[]>(STORE_KEYS.skills),
      store.get<typeof DataType.experiences>(STORE_KEYS.experiences),
      store.get<typeof DataType.education>(STORE_KEYS.education),
      store.get<typeof DataType.achievements>(STORE_KEYS.achievements),
      store.get<typeof DataType.publications_and_presentations>(
        STORE_KEYS.publications
      ),
      store.get<typeof DataType.hobbies_interests_and_extracurricular>(
        STORE_KEYS.extracurricular
      ),
      store.get<typeof DataType.ui_content>(STORE_KEYS.ui_content),
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
        { error: "Data not initialized. Please run the seed script: pnpm seed:store" },
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
