import { NextRequest, NextResponse } from "next/server";
import { redis, REDIS_KEYS } from "@/lib/redis";
import type { data as DataType } from "@/lib/data";

type Section =
  | "personal_information"
  | "skills_and_expertise"
  | "experiences"
  | "education"
  | "achievements"
  | "publications_and_presentations"
  | "hobbies_interests_and_extracurricular"
  | "ui_content";

const SECTION_TO_KEY: Record<Section, keyof typeof REDIS_KEYS> = {
  personal_information: "personal_info",
  skills_and_expertise: "skills",
  experiences: "experiences",
  education: "education",
  achievements: "achievements",
  publications_and_presentations: "publications",
  hobbies_interests_and_extracurricular: "extracurricular",
  ui_content: "ui_content",
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ section: string }> }
) {
  try {
    const { section } = await params;

    if (!isValidSection(section)) {
      return NextResponse.json(
        { error: "Invalid section" },
        { status: 400 }
      );
    }

    const redisKey = REDIS_KEYS[SECTION_TO_KEY[section]];
    const data = await redis.get(redisKey);

    if (!data) {
      return NextResponse.json(
        { error: "Section not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching section:", error);
    return NextResponse.json(
      { error: "Failed to fetch section" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ section: string }> }
) {
  try {
    const { section } = await params;

    if (!isValidSection(section)) {
      return NextResponse.json(
        { error: "Invalid section" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { data, password } = body;

    // Verify password
    if (!password || password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: "Data is required" },
        { status: 400 }
      );
    }

    const redisKey = REDIS_KEYS[SECTION_TO_KEY[section]];
    await redis.set(redisKey, data);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating section:", error);
    return NextResponse.json(
      { error: "Failed to update section" },
      { status: 500 }
    );
  }
}

function isValidSection(section: string): section is Section {
  return [
    "personal_information",
    "skills_and_expertise",
    "experiences",
    "education",
    "achievements",
    "publications_and_presentations",
    "hobbies_interests_and_extracurricular",
    "ui_content",
  ].includes(section);
}
